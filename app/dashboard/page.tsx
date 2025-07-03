import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    const session = await requireSession();

    const stacks = await prisma.stack.findMany({
        where: { ownerId: session.userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="h-full w-full px-6 py-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <Button asChild className="bg-purple-600 hover:bg-purple-500 text-white">
                    <Link href="/dashboard/new">+ New Stack</Link>
                </Button>
            </div>

            {stacks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400">
                    <p className="text-lg">You don't have any stacks yet.</p>
                    <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-500 text-white">
                        <Link href="/dashboard/new">Create your first stack</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stacks.map((stack) => (
                        <Link key={stack.id} href={`/stack/${stack.id}`}>
                            <Card className="bg-zinc-900 border border-zinc-800 hover:border-purple-500 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">{stack.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-zinc-400">
                                        {stack.description || "No description"}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
