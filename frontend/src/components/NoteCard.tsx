"use client";

import { useState } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X, Clock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    content: string;
    user: string;
    createdAt: string;
  };
  isAdmin?: boolean;
}

export default function NoteCard({ note, isAdmin }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const { updateNote, deleteNote } = useNoteStore();

  const handleUpdate = async () => {
    if (title.trim().length < 3) return toast.error("Title is too short (min 3)");
    if (title.length > 50) return toast.error("Title is too long (max 50)");
    if (content.trim().length < 5) return toast.error("Content is too short (min 5)");

    try {
      await updateNote(note._id, title, content);
      setIsEditing(false);
      toast.success("Note updated successfully");
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note._id);
      toast.success("Note deleted from stream");
      setIsDeleting(false);
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/50">
        <CardHeader className="pb-2">
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/20 bg-white/5 text-lg font-bold"
              placeholder="Title (3-50 chars)"
              maxLength={50}
            />
          ) : (
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-sky-400">
                {note.title}
              </CardTitle>
              {isAdmin && (
                <div className="flex items-center space-x-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase text-amber-500">
                  <UserIcon className="h-2 w-2" />
                  <span>Global</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-4">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-24 w-full resize-none rounded-md border border-white/20 bg-white/5 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500/50 text-white"
              placeholder="Content (min 5 chars)"
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {note.content}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0">
          <div className="text-muted-foreground flex items-center space-x-2 text-[10px]">
            <Clock className="h-3 w-3" />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleUpdate}
                  className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                  className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-sky-400 opacity-0 transition-opacity hover:bg-sky-500/10 group-hover:opacity-100"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsDeleting(true)}
                  className="h-8 w-8 text-rose-400 opacity-0 transition-opacity hover:bg-rose-500/10 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Card>

      <AlertDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Thought?"
        description="This action is irreversible. This thought will be permanently deleted from your vault."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
