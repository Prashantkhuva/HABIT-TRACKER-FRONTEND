import { handler, json, ApiResponse, ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { readBody, query, parse } from "@/lib/validate";
import { Blog } from "@/src/server/models/blog.model";
import { BlogSchemas } from "@/src/server/schemas/blog";

/* Ported from backend src/controllers/blog.controller.js + src/routes/blog.route.js */

const createBlogPost = handler(async (req) => {
  const reqUser = await auth(req);
  const body = parse(BlogSchemas.create, await readBody(req));
  const {
    title,
    slug,
    description,
    content,
    categories,
    readingTime,
    published,
    image,
    steps,
  } = body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const finalSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const existing = await Blog.findOne({ slug: finalSlug });
  if (existing) {
    throw new ApiError(409, "A post with this slug already exists");
  }

  const post = await Blog.create({
    title: title.trim(),
    slug: finalSlug,
    description: description?.trim() || "",
    content,
    categories: categories || [],
    readingTime: readingTime?.trim() || "",
    published: published?.trim() || new Date().toISOString().slice(0, 10),
    lastmod: new Date().toISOString().slice(0, 10),
    image: image?.trim() || "/og-image.png",
    steps: steps || [],
    user: reqUser._id,
  });

  return json(
    201,
    new ApiResponse(201, post, "Blog post created successfully"),
  );
});

const getAllBlogPosts = handler(async (req) => {
  const params = query(req);
  const page = parseInt(params.page) || 1;
  const limit = Math.min(parseInt(params.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    Blog.find()
      .sort({ published: -1, createdAt: -1 })
      .select("-content")
      .skip(skip)
      .limit(limit),

    Blog.countDocuments(),
  ]);

  return json(
    200,
    new ApiResponse(
      200,
      {
        posts,
        pagination: {
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: page,
          limit,
        },
      },
      "Blog posts fetched successfully",
    ),
  );
});

const getBlogPostBySlug = handler(async (req, ctx) => {
  const { slug } = await ctx.params;
  const post = await Blog.findOne({ slug });

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return json(
    200,
    new ApiResponse(200, post, "Blog post fetched successfully"),
  );
});

const getBlogPostById = handler(async (req, ctx) => {
  await auth(req);

  const { id } = await ctx.params;
  const post = await Blog.findById(id);

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return json(
    200,
    new ApiResponse(200, post, "Blog post fetched successfully"),
  );
});

const updateBlogPost = handler(async (req, ctx) => {
  const reqUser = await auth(req);
  const body = parse(BlogSchemas.update, await readBody(req));
  const { id } = await ctx.params;
  const {
    title,
    slug,
    description,
    content,
    categories,
    readingTime,
    published,
    image,
    steps,
  } = body;

  const updateFields = {};

  if (title !== undefined) updateFields.title = title.trim();
  if (slug !== undefined) {
    const existing = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, "A post with this slug already exists");
    }
    updateFields.slug = slug;
  }
  if (description !== undefined) updateFields.description = description.trim();
  if (content !== undefined) updateFields.content = content;
  if (categories !== undefined) updateFields.categories = categories;
  if (readingTime !== undefined) updateFields.readingTime = readingTime.trim();
  if (published !== undefined) updateFields.published = published.trim();
  if (image !== undefined) updateFields.image = image.trim();
  if (steps !== undefined) updateFields.steps = steps;
  updateFields.lastmod = new Date().toISOString().slice(0, 10);

  const post = await Blog.findOneAndUpdate(
    { _id: id, user: reqUser._id },
    { $set: updateFields },
    { returnDocument: "after" },
  );

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return json(
    200,
    new ApiResponse(200, post, "Blog post updated successfully"),
  );
});

const deleteBlogPost = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { id } = await ctx.params;

  const post = await Blog.findOneAndDelete({ _id: id, user: reqUser._id });

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return json(200, new ApiResponse(200, {}, "Blog post deleted successfully"));
});

const routes = {
  posts: { GET: getAllBlogPosts, POST: createBlogPost },
  "posts/:slug": { GET: getBlogPostBySlug },
  post: {
    GET: getBlogPostById,
    PATCH: updateBlogPost,
    DELETE: deleteBlogPost,
  },
};

export async function GET(req, ctx) {
  return dispatch(req, ctx, "GET");
}
export async function POST(req, ctx) {
  return dispatch(req, ctx, "POST");
}
export async function PATCH(req, ctx) {
  return dispatch(req, ctx, "PATCH");
}
export async function DELETE(req, ctx) {
  return dispatch(req, ctx, "DELETE");
}

async function dispatch(req, ctx, method) {
  const { slug } = await ctx.params;
  const [first, second, ...rest] = slug;
  let key = first;
  if (rest.length > 0) {
    key = "__no_match__";
  } else if (first === "posts" && second !== undefined) {
    key = "posts/:slug";
  } else if (first === "post" && second === undefined) {
    key = "__no_match__";
  }
  const fn = routes[key]?.[method];
  if (!fn) {
    return json(404, {
      success: false,
      message: "Route not found",
      errors: [],
    });
  }
  ctx.params = Promise.resolve({ id: second, slug: second });
  return fn(req, ctx);
}
