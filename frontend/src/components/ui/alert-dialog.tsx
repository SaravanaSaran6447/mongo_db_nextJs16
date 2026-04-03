"use client";

import * as React from "react";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="p-8">
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-6"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={cn(
              "rounded-xl px-6 font-bold shadow-lg transition-all",
              variant === "destructive" 
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20" 
                : "bg-sky-600 hover:bg-sky-500 shadow-sky-900/20"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
