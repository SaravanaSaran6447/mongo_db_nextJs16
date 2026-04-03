"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  onNewNote?: () => void;
}

export default function AppLayout({ children, onNewNote }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col mt-4">
        <div className="container mx-auto px-4 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
