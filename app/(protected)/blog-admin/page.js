"use client";
import AdminGuard from "@/components/AdminGuard";
import AdminBlogList from "@/views/blog/AdminBlogList";
export default function BlogAdmin() {
  return <AdminGuard><AdminBlogList /></AdminGuard>;
}
