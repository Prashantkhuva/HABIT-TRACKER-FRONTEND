import api from "./axios";

// Public — no auth required
export const getBlogPosts = () => api.get("/blog/posts");
export const getBlogPost = (slug) => api.get(`/blog/posts/${slug}`);

// Protected — auth required (admin only)
export const getBlogPostById = (id) => api.get(`/blog/post/${id}`);
export const createBlogPost = (data) => api.post("/blog/posts", data);
export const updateBlogPost = (id, data) => api.patch(`/blog/post/${id}`, data);
export const deleteBlogPost = (id) => api.delete(`/blog/post/${id}`);
