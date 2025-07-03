import StackEditClient from "@/components/StackEditClient";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteStack, updateStack } from "./actions";
import { Pencil } from "lucide-react";

export default async function StackPage({ params }: { params: { id: string } }) {
  const session = await requireSession();

  const stack = await prisma.stack.findUnique({
    where: { id: params.id, ownerId: session.userId },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  });

  if (!stack) return notFound();

  return (
    <div className="flex h-full bg-zinc-950 text-white overflow-hidden">
      <aside className="w-72 shrink-0 border-r border-zinc-800 p-6 flex flex-col gap-6 bg-zinc-900">
        <Link href="/dashboard" className="text-sm text-purple-400 hover:underline">
          ← Back to Dashboard
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold break-words">{stack.title}</h1>
          {stack.description && (
            <p className="text-sm text-zinc-400 break-words">{stack.description}</p>
          )}
        </div>
        <div className="text-sm text-zinc-400 space-y-1">
          <p>{stack.questions.length} questions</p>
          <p>Created {stack.createdAt.toLocaleDateString()}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full flex items-center gap-2">
              <Pencil className="w-4 h-4" /> Edit Stack
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Stack</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Update the title and description of your stack.
              </DialogDescription>
            </DialogHeader>
            <form action={updateStack.bind(null, stack.id)} className="space-y-4">
              <Input
                name="title"
                defaultValue={stack.title}
                required
                className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
              />
              <Textarea
                name="description"
                defaultValue={stack.description ?? ""}
                placeholder="Optional description"
                className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
              />
              <DialogFooter className="flex justify-end">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <form action={deleteStack.bind(null, stack.id)} className="mt-auto">
          <Button variant="destructive" className="w-full">
            Delete Stack
          </Button>
        </form>
      </aside>
      <div className="flex-1 flex flex-col">
        <StackEditClient stackId={stack.id} questions={stack.questions} />
      </div>
    </div>
  );
}
