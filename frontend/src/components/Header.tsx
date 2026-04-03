"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Get Breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = segments.length > 0 
    ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
    : "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/5 bg-background/20 px-6 backdrop-blur-md transition-all duration-300">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center space-x-8">
        <Link href="/dashboard" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 font-black text-white shadow-lg shadow-sky-500/20">
            N
          </div>
          <span className="text-sm font-black tracking-tight text-foreground uppercase">NoteStream</span>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          {[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Settings", href: "/settings" },
            ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "relative text-xs font-bold uppercase tracking-widest transition-colors hover:text-foreground",
                pathname === item.href ? "text-sky-500" : "text-muted-foreground"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <div className="absolute -bottom-[22px] left-0 h-[2px] w-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Theme Toggle & Profile */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-muted/30 rounded-full p-1 border border-border/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-full text-foreground/60 hover:text-foreground hover:bg-background/50 transition-all"
          >
            <Sun className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all",
              theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"
            )} />
            <Moon className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
            )} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        
        <div className="h-6 w-[1px] bg-border/50" />
        
        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <div className="group relative cursor-pointer flex items-center space-x-3 bg-muted/30 hover:bg-muted/50 transition-all rounded-full pl-1 pr-3 py-1 border border-border/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-sky-400 text-[10px] font-black text-white shadow-lg ring-2 ring-background transition-all group-hover:ring-sky-500/50">
              {user?.fullName?.split(" ").map(n => n[0]).join("")}
            </div>
            <span className="text-xs font-bold text-foreground/80 group-hover:text-foreground hidden sm:block">
              {user?.fullName?.split(" ")[0]}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
