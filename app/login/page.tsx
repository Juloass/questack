import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Check for existing session (server-side)
  const session = await getSession();

  if (session) {
    // Already logged in -> redirect
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h1 className="text-3xl font-bold">Connexion à Questack</h1>
      <p className="text-zinc-400">
        Authentifiez-vous avec votre compte Twitch pour continuer
      </p>
      <a
        href="/api/auth/login"
        className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-2 rounded"
      >
        Se connecter avec Twitch
      </a>
    </div>
  );
}
