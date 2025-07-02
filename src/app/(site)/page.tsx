"use client";

import { useState, useEffect } from "react";
import { getContent } from "@/app/actions/client/get-content";
import { Content } from "@/types/content";
import { Input } from "@/types/input";
import { TypingSession, Performance } from "@/types/performance";
import { TypeArea } from "@/app/components/type-area";

const HomePage = () => {
  const [content, setContent] = useState<Content | null>(null);
  const [input, setInput] = useState<Input>({
    currentText: "",
    typedCount: 0,
    wordCount: 0,
  });
  const [session, setSession] = useState<TypingSession>({
    startTime: null,
    isCompleted: false,
    roundCount: 0,
  });
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewContent = async () => {
    try {
      setIsLoading(true);
      const newContent = await getContent();
      setContent(newContent);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewContent();
  }, []);

  const handleTypingStart = () => {
    if (!session.startTime) {
      setSession(prev => ({
        ...prev,
        startTime: Date.now(),
      }));
    }
  };

  const handleCompletion = (finalPerformance: Performance) => {
    setPerformance(finalPerformance);
    setSession(prev => ({
      ...prev,
      isCompleted: true,
      roundCount: prev.roundCount + 1,
    }));
  };

  const handleRestart = () => {
    setInput({
      currentText: "",
      typedCount: 0,
      wordCount: 0,
    });
    setSession({
      startTime: null,
      isCompleted: false,
      roundCount: session.roundCount,
    });
    setPerformance(null);
    fetchNewContent();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>No content found</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <TypeArea 
        content={content} 
        input={input} 
        setInput={setInput}
        session={session}
        performance={performance}
        onTypingStart={handleTypingStart}
        onCompletion={handleCompletion}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default HomePage;