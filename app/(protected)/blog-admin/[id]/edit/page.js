"use client";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import AdminBlogEditor from "@/views/blog/AdminBlogEditor";
export default function EditBlogPost() {
  const { id } = useParams();
  return <AdminGuard><AdminBlogEditor postId={id} /></AdminGuard>;
}
