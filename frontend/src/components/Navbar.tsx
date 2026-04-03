"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  ShieldCheck,
  PenSquare,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-background/60 sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600">
            <PenSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">NoteStream</span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>

          {user.role === "admin" && (
            <Link href="/admin">
              <Button
                variant={pathname === "/admin" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "relative gap-2 font-bold transition-all",
                  pathname === "/admin"
                    ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                    : "text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-500"
                )}
              >
                <div className="absolute -inset-0.5 -z-10 animate-pulse rounded-lg bg-amber-500/20 blur" />
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden md:inline">Admin Hub</span>
              </Button>
            </Link>
          )}

          <Link href="/settings">
            <Button
              variant={pathname === "/settings" ? "secondary" : "ghost"}
              size="sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>

          <div className="flex items-center space-x-2 border-l border-white/5 pl-2 md:pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/30 bg-sky-900/40">
              <User className="h-4 w-4 text-sky-400" />
            </div>
            <div className="hidden flex-col lg:flex">
              <span className="text-xs font-semibold leading-none">
                {user.fullName}
              </span>
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
