"use client";
import { useParams } from "next/navigation";
import AdminBlogEditor from "@/views/blog/AdminBlogEditor";
export default function EditBlogPost() {
  const { id } = useParams();
  return <AdminBlogEditor postId={id} />;
}
