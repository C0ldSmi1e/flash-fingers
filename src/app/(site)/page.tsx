"use client";

import { useState, useEffect } from "react";
import { getContent } from "@/app/actions/client/get-content";
import { Input } from "@/types/input";
import { Session } from "@/types/session";
import { Performance } from "@/types/performance";
import { TypeArea } from "@/app/components/type-area";

const HomePage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [input, setInput] = useState<Input>({
    currentText: "",
    typedCount: 0,
    wordCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const createNewSession = async () => {
    try {
      setIsLoading(true);
      const content = await getContent();
      const newSession: Session = {
        id: crypto.randomUUID(),
        startTime: new Date(),
        endTime: null,
        isCompleted: false,
        performance: null,
        content,
      };
      setSession(newSession);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createNewSession();
  }, []);

  const handleTypingStart = () => {
    if (session && !session.startTime) {
      setSession(prev => prev ? ({
        ...prev,
        startTime: new Date(),
      }) : null);
    }
  };

  const handleCompletion = (finalPerformance: Performance) => {
    if (session) {
      setSession(prev => prev ? ({
        ...prev,
        endTime: new Date(),
        isCompleted: true,
        performance: finalPerformance,
      }) : null);
    }
  };

  const handleRestart = () => {
    setInput({
      currentText: "",
      typedCount: 0,
      wordCount: 0,
    });
    createNewSession();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>No session found</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <TypeArea 
        session={session}
        input={input} 
        setInput={setInput}
        onTypingStart={handleTypingStart}
        onCompletion={handleCompletion}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default HomePage;