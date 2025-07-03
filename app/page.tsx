import ErrorScreen from "@/components/ErrorScreen";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth";
import { tryWithError } from "@/lib/try-with-error";
import Link from "next/link";

export default async function Home() {
  const [user, userError] = await tryWithError(() => getCurrentUser());

  if (userError) {
    return <ErrorScreen title="Base de données injoignable" />;
  }

  console.log(user);

  return (
    <div className="flex items-center justify-center h-full w-full px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Créez et partagez des questionnaires simplement
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Questack vous permet de créer des questionnaires faciles à remplir,
          d'ajouter des questions à tout moment, et de suivre qui y a répondu —
          tout en garantissant l'anonymat des réponses. L'authentification via
          <span className="text-zinc-300"> Twitch</span> ou{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline cursor-help text-zinc-300">
                  autres réseaux
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>D'autres méthodes à venir prochainement</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>{" "}
          sécurise et simplifie l'accès pour vous comme pour vos répondants.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-purple-600 hover:bg-purple-500 transition text-white mt-4"
        >
          <Link href={user ? "/dashboard" : "/login"}>
            {user ? "Accéder au tableau de bord" : "Se Connecter"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
