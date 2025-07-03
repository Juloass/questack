"use server";

import { requireSession } from "@/lib/auth";
import { QuestionType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ALLOWED_QUESTION_TYPES = new Set<QuestionType>([
  "BOOLEAN",
  "TEXT",
  "CHOICE",
  "NUMBER",
  "PERCENTAGE",
  "RANGE",
]);

function validateQuestionType(value: string | undefined): QuestionType {
  if (!value) throw new Error("Missing question type.");
  if (!ALLOWED_QUESTION_TYPES.has(value as QuestionType)) {
    throw new Error(`Invalid question type: ${value}`);
  }
  return value as QuestionType;
}

function validateContent(value: string | undefined): string {
  if (!value) throw new Error("Missing content.");
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Content cannot be empty.");
  return trimmed;
}

function getSafeString(value: FormDataEntryValue | null | undefined): string {
  if (value == null) return "";
  return value.toString();
}

/** ADD A QUESTION **/
export async function addQuestion(stackId: string, formData: FormData) {
  const session = await requireSession();

  const content = validateContent(formData.get("content")?.toString());
  const type = validateQuestionType(formData.get("type")?.toString());

  // NEW FIELDS
  const choicesRaw = formData
    .getAll("choices[]")
    .map((c) => c.toString().trim())
    .filter(Boolean);

  const minRaw = getSafeString(formData.get("minValue"));
  const minValue = minRaw ? parseFloat(minRaw) : null;

  const maxRaw = getSafeString(formData.get("maxValue"));
  const maxValue = maxRaw ? parseFloat(maxRaw) : null;

  await prisma.question.create({
    data: {
      content,
      type,
      stackId,
      choices: choicesRaw.length ? choicesRaw : [],
      minValue,
      maxValue,
    },
  });

  revalidatePath(`/dashboard/stack/${stackId}`);
}

/** UPDATE A QUESTION **/
export async function updateQuestion(questionId: string, formData: FormData) {
  const session = await requireSession();
  if (!questionId) throw new Error("Invalid question ID.");

  const content = validateContent(formData.get("content")?.toString());
  const type = validateQuestionType(formData.get("type")?.toString());

  // Ownership check
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { stack: { select: { ownerId: true } } },
  });

  if (!question || question.stack.ownerId !== session.userId) {
    throw new Error("Unauthorized or question not found.");
  }

  const choicesRaw = formData
    .getAll("choices[]")
    .map((c) => c.toString().trim())
    .filter(Boolean);

  const minRaw = getSafeString(formData.get("minValue"));
  const minValue = minRaw ? parseFloat(minRaw) : null;

  const maxRaw = getSafeString(formData.get("maxValue"));
  const maxValue = maxRaw ? parseFloat(maxRaw) : null;

  await prisma.question.update({
    where: { id: questionId },
    data: {
      content,
      type,
      choices: choicesRaw.length ? choicesRaw : [],
      minValue,
      maxValue,
    },
  });

  revalidatePath(`/dashboard/stack/${question.stackId}`);
}

/** DELETE A QUESTION **/
export async function deleteQuestion(questionId: string) {
  const session = await requireSession();
  if (!questionId) throw new Error("Invalid question ID.");

  // Check question ownership
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { stack: { select: { ownerId: true } } },
  });

  if (!question || question.stack.ownerId !== session.userId) {
    throw new Error("Unauthorized or question not found.");
  }

  await prisma.question.delete({
    where: { id: questionId },
  });

  revalidatePath(`/dashboard/stack/${question.stackId}`);
}

export async function updateStack(stackId: string, formData: FormData) {
  const session = await requireSession();

  if (!stackId) throw new Error("Invalid stack ID.");

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title) throw new Error("Title is required.");

  // Check ownership
  const stack = await prisma.stack.findUnique({
    where: { id: stackId },
    select: { ownerId: true },
  });

  if (!stack || stack.ownerId !== session.userId) {
    throw new Error("Unauthorized or stack not found.");
  }

  await prisma.stack.update({
    where: { id: stackId },
    data: {
      title,
      description: description || null,
    },
  });

  revalidatePath(`/dashboard/stack/${stackId}`);
}

export async function deleteStack(stackId: string) {
  const session = await requireSession();

  if (!stackId) throw new Error("Invalid stack ID.");

  const stack = await prisma.stack.findUnique({
    where: { id: stackId },
    select: { ownerId: true },
  });

  if (!stack || stack.ownerId !== session.userId) {
    throw new Error("Unauthorized or stack not found.");
  }

  await prisma.stack.delete({ where: { id: stackId } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
