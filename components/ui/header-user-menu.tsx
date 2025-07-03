import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HeaderUserMenu() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-9 h-9 border border-zinc-700 hover:border-zinc-500 cursor-pointer transition">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "Profile"} />
          <AvatarFallback className="bg-zinc-800 text-zinc-100">
            {user.name ? user.name[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-zinc-900 text-zinc-100 border-zinc-700"
      >
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/logout">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
