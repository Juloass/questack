import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    addQuestion,
    deleteQuestion,
    updateQuestion,
    updateStack,
} from "./actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Plus } from "lucide-react";
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

import { QuestionForm } from "@/components/QuestionForm";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export default async function StackPage({ params }: { params: { id: string } }) {
    const session = await requireSession();

    const stack = await prisma.stack.findUnique({
        where: { id: params.id, ownerId: session.userId },
        include: { questions: { orderBy: { createdAt: "asc" } } },
    });

    if (!stack) return notFound();

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-white">
            {/* Header */}
            <div className="shrink-0 border-b border-zinc-800 px-4 py-4 flex items-center justify-between gap-3">
                <Link
                    href="/dashboard"
                    className="text-sm text-purple-400 hover:underline"
                >
                    ← Back to Dashboard
                </Link>

                <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{stack.title}</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-zinc-400 hover:text-white"
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-white">Edit Stack</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Update the title and description of your stack.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                action={updateStack.bind(null, stack.id)}
                                className="space-y-4"
                            >
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
                                    <Button
                                        type="submit"
                                        className="bg-purple-600 hover:bg-purple-500 text-white"
                                    >
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Question
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border border-zinc-800 max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add New Question</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Fill in the details for your new question.
                            </DialogDescription>
                        </DialogHeader>
                        <QuestionForm updateAction={addQuestion.bind(null, stack.id)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Scrollable Questions area */}
            <ScrollArea className="flex-1">
                <div className="p-4 flex flex-wrap gap-4 justify-center">
                    {stack.questions.map((q) => (
                        <Card
                            key={q.id}
                            className="flex-1 min-w-[250px] max-w-sm grow basis-[300px] bg-zinc-900 border border-zinc-800 flex flex-col">
                            <CardContent className="p-4 flex flex-col gap-2">
                                <p className="font-medium break-words">{q.content}</p>
                                <p className="text-xs text-zinc-400">{q.type}</p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="cursor-pointer"
                                        >
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-900 border border-zinc-800 max-w-lg">
                                        <QuestionForm
                                            updateAction={updateQuestion.bind(null, q.id)}
                                            deleteAction={deleteQuestion.bind(null, q.id)}
                                            defaultValues={{
                                                content: q.content,
                                                type: q.type,
                                                choices: q.choices,
                                                minValue: q.minValue ?? undefined,
                                                maxValue: q.maxValue ?? undefined,
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
