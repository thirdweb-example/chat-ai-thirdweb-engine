"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import clsx from "clsx";
import { GithubIcon, LoadingCircle, SendIcon } from "./icons";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";
import { useAddress } from "@thirdweb-dev/react";

const examples = [
  "To start, what is your name?",
];

const Chat: React.FC = () =>  {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const address = useAddress();

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    body: {
      walletAddress: { address }
    }, 
    
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        va.track("Rate limited");
        return;
      } else {
        va.track("Chat initiated");
      }
    },
    onError: (error) => {
      va.track("Chat errored", {
        input,
        error: error.message,
      });
    },
  });

  const disabled = isLoading || input.length === 0;

  return (
    <main className="flex flex-col items-center">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
        <a
          href="https://github.com/thirdweb-example/chat-ai-thirdweb-engine"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <GithubIcon />
        </a>
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black",
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Bot width={20} />
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed text-black"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full overflow-y-scroll">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <h1 className="text-lg font-semiboldt">
              An AI Based Game using Thirdweb Engine
            </h1>
            <p className="text-gray-500">
              This demo of an AI Agent uses{" "}
              <a
                href="https://portal.thirdweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
              >
                thirdweb{"'"}s Dev Tools
              </a>{" "}
              and{" "}
              <a
                href="https://platform.openai.com/docs/guides/function-calling"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
              >
                OpenAI Functions
              </a>{" "}
              to airdrop NFTs using {" "}
              <a
                href="https://portal.thirdweb.com/engine"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
              >
                thirdwebEngine
              </a>{" "}
  
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 sm:p-10">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                onClick={() => {
                  setInput(example);
                  inputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-0 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4 text-black text-small"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none text-black text-small"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">
          Built with{" "}
          <a
            href="https://portal.thirdweb.com/embedded-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            thirdweb{"'"}s Embedded Wallets
          </a>{" "}
          and{" "}
          <a
            href="https://portal.thirdweb.com/engine"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            thirdweb Engine
          </a>{" "}
          and{" "}
          <a
            href="https://platform.openai.com/docs/guides/gpt/function-calling"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            OpenAI Functions.
          </a>{" "}
          <a
            href="https://github.com/thirdweb-example/chat-ai-thirdweb-engine"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            View the repo
          </a>
          .
        </p>
      </div>
    </main>
  );
}

export default Chat;
