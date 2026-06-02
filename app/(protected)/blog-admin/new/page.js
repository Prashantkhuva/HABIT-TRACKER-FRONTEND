"use client";
import AdminGuard from "@/components/AdminGuard";
import AdminBlogEditor from "@/views/blog/AdminBlogEditor";
export default function NewBlogPost() {
  return <AdminGuard><AdminBlogEditor /></AdminGuard>;
}
