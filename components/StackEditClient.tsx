"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionForm } from "@/components/QuestionForm";
import {
  addQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/app/dashboard/stack/[id]/actions";
import { Grid, List as ListIcon, Pencil, Plus } from "lucide-react";

interface Question {
  id: string;
  content: string;
  type: string;
  choices: string[];
  minValue: number | null;
  maxValue: number | null;
}

export default function StackEditClient({
  stackId,
  questions,
}: {
  stackId: string;
  questions: Question[];
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("");

  const filtered = useMemo(
    () =>
      questions.filter((q) =>
        q.content.toLowerCase().includes(filter.toLowerCase())
      ),
    [questions, filter]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b border-zinc-800 p-4 flex items-center gap-2">
        <Input
          placeholder="Search questions..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="icon"
            variant={view === "grid" ? "secondary" : "ghost"}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "list" ? "secondary" : "ghost"}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <ListIcon className="w-4 h-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border border-zinc-800 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Question</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Provide details for the question.
                </DialogDescription>
              </DialogHeader>
              <QuestionForm updateAction={addQuestion.bind(null, stackId)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div
          className={
            view === "grid"
              ? "p-4 grid auto-rows-max grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4"
              : "p-4 flex flex-col gap-4"
          }
        >
          {filtered.map((q) => (
            <Card key={q.id} className="bg-zinc-900 border border-zinc-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium break-words">{q.content}</p>
                  <span className="text-xs text-zinc-400">{q.type}</span>
                </div>
                <div className="flex gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary">
                        <Pencil className="w-4 h-4 mr-1" /> Edit
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
