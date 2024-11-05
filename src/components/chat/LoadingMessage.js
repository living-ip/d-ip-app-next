// components/chat/LoadingMessage.js

import {Bot} from "lucide-react";

export default function LoadingMessage() {
  return (
    <div className="flex items-start gap-2 mb-4 w-full">
      <Bot className="h-8 w-8 text-primary flex-shrink-0" />
      <div className="flex flex-col w-full">
        <div className="p-2 rounded-md bg-primary/10 w-full">
          <div className="flex space-x-2">
            {[0, 0.2, 0.4].map((delay, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${delay}s` }}
              ></div>
            ))}
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1">assistant</span>
      </div>
    </div>
  );
}