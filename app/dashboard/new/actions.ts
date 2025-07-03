"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createStack(formData: FormData) {
  const session = await requireSession();

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.stack.create({
    data: {
      title,
      description: description || null,
      ownerId: session.userId,
    },
  });

  redirect("/dashboard");
}
