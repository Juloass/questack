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
import { Textarea } from "@/components/ui/textarea";

export default async function StackPage({ params }: { params: { id: string } }) {
    const session = await requireSession();

    const stack = await prisma.stack.findUnique({
        where: { id: params.id, ownerId: session.userId },
        include: { questions: { orderBy: { createdAt: "asc" } } },
    });

    if (!stack) return notFound();

    return (
        <div className="h-full flex overflow-hidden text-white bg-zinc-950">
            <aside className="w-64 shrink-0 border-r border-zinc-800 p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-2">About this stack</h2>
                {stack.description ? (
                    <p className="text-zinc-300">{stack.description}</p>
                ) : (
                    <p className="text-zinc-500 italic">No description</p>
                )}
                <p className="text-zinc-400 mt-4">Questions: {stack.questions.length}</p>
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="shrink-0 border-b border-zinc-800 px-4 py-4 flex items-center justify-between gap-3">
                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="text-sm text-purple-400 hover:underline"
                >
                    ← Back to Dashboard
                </Link>

                {/* Stack title + edit */}
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{stack.title}</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
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

                {/* Add Question */}
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
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6 flex flex-wrap gap-4 justify-center">
                        {stack.questions.map((q) => (
                            <div
                                key={q.id}
                                className="flex-1 min-w-[250px] max-w-sm grow sm:basis-[45%] md:basis-[30%] lg:basis-[22%]"
                            >
                                <Card className="bg-zinc-900 border border-zinc-800 h-full">
                                    <CardContent className="p-4">
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
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
