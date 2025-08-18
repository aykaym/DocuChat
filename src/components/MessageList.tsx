import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2, Bot, User } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-indigo-200 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-4 text-sm text-gray-500">Loading conversation...</p>
      </div>
    );
  }
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h3>
        <p className="text-sm text-gray-500">Ask me anything about your PDF document!</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        const isLast = index === messages.length - 1;
        
        return (
          <div
            key={message.id}
            className={cn("flex items-start gap-3 group", {
              "flex-row-reverse": isUser,
            })}
          >
            {/* Avatar */}
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm",
              {
                "bg-gradient-to-br from-indigo-500 to-indigo-600": isUser,
                "bg-gradient-to-br from-gray-600 to-gray-700": !isUser,
              }
            )}>
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            {/* Message bubble */}
            <div className={cn("max-w-[75%] flex flex-col", {
              "items-end": isUser,
              "items-start": !isUser,
            })}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 group-hover:shadow-md",
                  {
                    "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md": isUser,
                    "bg-white border border-gray-200 text-gray-800 rounded-bl-md": !isUser,
                  }
                )}
              >
                <p className={cn("text-sm leading-relaxed whitespace-pre-wrap", {
                  "text-white": isUser,
                  "text-gray-800": !isUser,
                })}>
                  {message.content}
                </p>
              </div>
              
              {/* Timestamp */}
              <span className="text-xs text-gray-400 mt-1 px-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {/* Typing indicator for last AI message */}
            {!isUser && isLast && (
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;