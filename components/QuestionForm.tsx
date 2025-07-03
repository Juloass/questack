"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const QUESTION_TYPES = [
    "BOOLEAN",
    "TEXT",
    "CHOICE",
    "NUMBER",
    "PERCENTAGE",
    "RANGE",
] as const;

export function QuestionForm({
    defaultValues,
    updateAction,
    deleteAction,
}: {
    defaultValues?: {
        content?: string;
        type?: string;
        choices?: string[];
        minValue?: number;
        maxValue?: number;
    };
    updateAction: (formData: FormData) => void;
    deleteAction?: () => void;
}) {
    const [content, setContent] = useState(defaultValues?.content ?? "");
    const [selectedType, setSelectedType] = useState(defaultValues?.type ?? "TEXT");
    const [choices, setChoices] = useState(defaultValues?.choices ?? [""]);
    const [minValue, setMinValue] = useState(defaultValues?.minValue?.toString() ?? "");
    const [maxValue, setMaxValue] = useState(defaultValues?.maxValue?.toString() ?? "");

    const [hasChanged, setHasChanged] = useState(false);

    const [initialValues] = useState({
        content: defaultValues?.content ?? "",
        type: defaultValues?.type ?? "TEXT",
        choices: defaultValues?.choices ?? [""],
        minValue: defaultValues?.minValue?.toString() ?? "",
        maxValue: defaultValues?.maxValue?.toString() ?? "",
    });

    useEffect(() => {
        if (
            content !== initialValues.content ||
            selectedType !== initialValues.type ||
            JSON.stringify(choices) !== JSON.stringify(initialValues.choices) ||
            minValue !== initialValues.minValue ||
            maxValue !== initialValues.maxValue
        ) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    }, [content, selectedType, choices, minValue, maxValue, initialValues]);

    function addChoiceField() {
        setChoices([...choices, ""]);
    }

    function updateChoice(index: number, value: string) {
        setChoices(choices.map((c, i) => (i === index ? value : c)));
    }

    // Disable save if blank content
    const isValid = content.trim().length > 0;

    return (
        <form action={updateAction} className="space-y-4 w-full">
            {/* TOP ROW: Question text + Type select */}
            <div className="flex flex-col md:flex-row gap-3 w-full">
                <Input
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Question text"
                    className="flex-1 bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 cursor-pointer"
                    required
                />
                <Select
                    name="type"
                    value={selectedType}
                    onValueChange={(v) => setSelectedType(v)}
                >
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white md:w-52 cursor-pointer">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 text-white">
                        {QUESTION_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedType === "CHOICE" && (
                <div className="space-y-2">
                    <label className="text-zinc-400">Choices:</label>
                    {choices.map((c, i) => (
                        <Input
                            key={i}
                            name="choices[]"
                            value={c}
                            onChange={(e) => updateChoice(i, e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 cursor-pointer"
                            placeholder={`Choice ${i + 1}`}
                            required
                        />
                    ))}
                    <Button
                        type="button"
                        onClick={addChoiceField}
                        variant="secondary"
                        className="cursor-pointer"
                    >
                        + Add Choice
                    </Button>
                </div>
            )}

            {["NUMBER", "PERCENTAGE", "RANGE"].includes(selectedType) && (
                <div className="flex gap-2">
                    <Input
                        name="minValue"
                        type="number"
                        step="any"
                        placeholder="Min Value"
                        value={minValue}
                        onChange={(e) => setMinValue(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 cursor-pointer"
                    />
                    <Input
                        name="maxValue"
                        type="number"
                        step="any"
                        placeholder="Max Value"
                        value={maxValue}
                        onChange={(e) => setMaxValue(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 cursor-pointer"
                    />
                </div>
            )}

            {/* INLINE SAVE / DELETE BUTTONS */}
            <div className="flex flex-col md:flex-row gap-2">
                <Button
                    type="submit"
                    disabled={!hasChanged || !isValid}
                    className="cursor-pointer flex-1 bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                >
                    Save
                </Button>

                {deleteAction && (
                    <Button
                        formAction={deleteAction}
                        type="submit"
                        variant="destructive"
                        className="cursor-pointer flex-1"
                    >
                        Delete
                    </Button>
                )}
            </div>
        </form>
    );
}
