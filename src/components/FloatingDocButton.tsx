"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FloatingDocButton = () => {
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      const response = await fetch("/sql_injection_protection.md"); // Change to your markdown file
      const text = await response.text();
      setMarkdown(text);
    };

    if (open) fetchMarkdown();
  }, [open]);

  return (
    <>
      {/* Floating Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-10 right-10 bg-blue-600 text-white shadow-lg hover:bg-blue-700 rounded-full p-4"
            size="icon"
          >
            <FileText className="h-10 w-10" />
          </Button>
        </DialogTrigger>

        {/* Modal Content */}
        <DialogContent className="max-w-5xl">
          <div className="p-4 max-h-[90vh] overflow-auto">
            <ReactMarkdown
              className="prose prose-lg prose-blue dark:prose-invert prose-pre:bg-gray-900 prose-pre:text-white"
              remarkPlugins={[remarkGfm]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingDocButton;
