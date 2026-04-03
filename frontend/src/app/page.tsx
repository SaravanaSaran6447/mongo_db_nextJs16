import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenSquare, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,163,255,0.1),_transparent)]" />

      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom-2 mb-4 inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 duration-1000">
          <Zap className="h-3 w-3" />
          <span>Next Generation Notes</span>
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-4 text-6xl font-black tracking-tighter text-white duration-700 md:text-8xl">
          Note<span className="text-sky-500">Stream</span>
        </h1>

        <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-6 text-xl font-medium duration-1000">
          Flow with your thoughts. A premium, role-based sanctuary for your
          stream of consciousness.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-8 flex flex-col items-center justify-center gap-4 pt-8 duration-700 sm:flex-row">
          <Link href="/login">
            <Button
              size="lg"
              className="group h-14 rounded-full border-none bg-sky-600 px-8 text-lg text-white shadow-xl shadow-sky-900/40 hover:bg-sky-500"
            >
              Get Started{" "}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/10 px-8 text-lg backdrop-blur-sm hover:bg-white/5"
            >
              Create Account
            </Button>
          </Link>
        </div>

        <div className="animate-in fade-in grid grid-cols-1 gap-6 pt-20 duration-1000 md:grid-cols-3">
          <FeatureCard
            icon={<PenSquare className="h-6 w-6 text-sky-400" />}
            title="Fluid Capture"
            description="Write at the speed of thought with our cinematic interface."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-emerald-400" />}
            title="Vault Security"
            description="Your stream is protected with high-level encryption and PINs."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-amber-400" />}
            title="Role-Based"
            description="Sophisticated access control for users and administrators."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/5 bg-white/5 p-6 text-left backdrop-blur-sm transition-colors hover:border-white/10">
      <div className="mb-4 inline-block rounded-2xl bg-white/5 p-3 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
