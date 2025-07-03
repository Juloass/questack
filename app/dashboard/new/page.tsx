import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { createStack } from "./actions";

export default async function NewStackPage() {
    await requireSession();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
            <Card className="max-w-xl w-full bg-zinc-900 border border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Create a New Stack</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createStack} className="flex flex-col space-y-4">
                        <Input
                            name="title"
                            placeholder="Stack title"
                            required
                            className="bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
                        />
                        <Textarea
                            name="description"
                            placeholder="Optional description"
                            className="bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
                        />
                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-500 text-white"
                        >
                            Create Stack
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
