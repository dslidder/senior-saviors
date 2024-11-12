"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import analyze from "@/lib/analyze";
import insertDocument from "@/lib/insert";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [text, setText] = React.useState("");
  const [analysis, setAnalysis] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  return (
    <main className='min-h-screen grid place-items-center py-20'>
      <div className='w-1/2 flex flex-col gap-2'>
        <h1 className='text-3xl font-semibold'>Analyze Conversation</h1>
        <Textarea
          className='resize-none text-xl h-40'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          className='self-end'
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setAnalysis((await analyze(text)) || "");
            insertDocument(JSON.parse(text));
            setLoading(false);
          }}>
          Analyze
        </Button>
        <Dialog>
          <DialogTrigger>See more</DialogTrigger>
          <DialogContent>
            <DialogTitle className='aria-hidden'>Scam Alert</DialogTitle>
            <DialogHeader className='font-semibold text-3xl'>
              Scam Alert
            </DialogHeader>
            <h2 className='text-xl'>
              You might be at risk of a romance scam.{" "}
              <span className='text-blue-500'>See more.</span>
            </h2>
          </DialogContent>
        </Dialog>
        <ReactMarkdown className='text-xl' remarkPlugins={[remarkGfm]}>
          {analysis}
        </ReactMarkdown>
      </div>
    </main>
  );
}
