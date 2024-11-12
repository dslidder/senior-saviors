"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import analyze from "@/lib/analyze";
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
            setLoading(false);
          }}>
          Analyze
        </Button>
        <ReactMarkdown className='text-xl' remarkPlugins={[remarkGfm]}>
          {analysis}
        </ReactMarkdown>
      </div>
    </main>
  );
}
