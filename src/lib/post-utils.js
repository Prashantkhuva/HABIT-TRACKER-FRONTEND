function cleanText(text = "") {
  if (!text) return "";
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html = "") {
  if (!html) {
    return "";
  }

  const textWithoutTags = html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  return cleanText(textWithoutTags);
}

function toPlainData(value) {
  if (value == null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
}

function getPostExcerpt(content, maxLength = 160) {
  const plainText = stripHtml(content);

  if (!plainText) {
    return "A closer look inside this story.";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

function getReadingTime(content) {
  const wordCount = stripHtml(content)
    .split(" ")
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function formatPostDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getAuthorName(post, fallback = "MegaBlog Editorial") {
  if (!post) {
    return fallback;
  }

  return (
    post.authorName ||
    post.author ||
    post.userName ||
    post.username ||
    fallback
  );
}

export {
  cleanText,
  formatPostDate,
  getAuthorName,
  getPostExcerpt,
  getReadingTime,
  stripHtml,
  toPlainData,
};
