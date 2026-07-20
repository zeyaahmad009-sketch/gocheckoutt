import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, DietPlan, UserAssessment } from "../types";
import { MessageSquare, Send, Sparkles, User, HelpCircle, ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface NutritionChatProps {
  userAssessment: UserAssessment | null;
  activePlan: DietPlan | null;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
  onClearChat: () => void;
}

const PRESET_PROMPTS = [
  { text: "Smart food substitutions", prompt: "I want to swap some ingredients in my meal plan. What are good healthy substitutions for chicken, dairy, or rice that keep the same macronutrients?" },
  { text: "Budget-friendly options", prompt: "How can I adapt this diet plan to be even more budget-friendly? Tell me the cheapest source of clean proteins and carbohydrates." },
  { text: "Regional cuisine tweaks", prompt: "How can I cook these meals using traditional Indian or Asian spices and ingredients while maintaining my targets?" },
  { text: "Seasonal suggestions", prompt: "What are the best seasonal vegetables and fruits I should incorporate right now for optimal nutrition?" },
  { text: "Hit protein goal", prompt: "I am struggling to reach my daily protein goal. What are the best quick snacks or techniques to hit it without excess fats?" }
];

export default function NutritionChat({
  userAssessment,
  activePlan,
  chatMessages,
  onSendMessage,
  isSending,
  onClearChat
}: NutritionChatProps) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isSending) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handlePresetClick = (promptText: string) => {
    if (!isSending) {
      onSendMessage(promptText);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
      
      {/* Preset Prompts Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3 text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Quick Nutrition Queries
          </div>
          <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
            Click any prompt below to instantly ask the AI dietitian about custom meal adaptions.
          </p>

          <div className="space-y-2">
            {PRESET_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                id={`preset-prompt-${idx}`}
                onClick={() => handlePresetClick(item.prompt)}
                disabled={isSending}
                className="w-full text-left p-3 rounded-xl border border-gray-50 hover:border-emerald-500/30 dark:border-gray-800 bg-gray-50/50 hover:bg-emerald-50/20 dark:bg-gray-850/30 dark:hover:bg-emerald-950/10 text-xs text-gray-700 dark:text-gray-300 font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-between group"
              >
                <span>{item.text}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition shrink-0" />
              </button>
            ))}
          </div>

          {chatMessages.length > 0 && (
            <button
              onClick={onClearChat}
              className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-red-500 hover:text-red-600 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Conversation
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col h-[550px] shadow-sm overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-850/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">AI Nutritionist</h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Online • Ask anything about food or substitutions</span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="p-4 rounded-full bg-emerald-100/40 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Your AI Nutrition Coach</h4>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Ask questions about calorie substitution, grocery budgets, allergy exclusions, or get professional dietitian advice matching your custom active profile.
                </p>
              </div>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar Icon */}
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isUser
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[80%] font-medium ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100/30 dark:border-gray-800/80"
                  }`}>
                    {/* Render message formatting properly */}
                    <div className="whitespace-pre-line prose dark:prose-invert prose-xs">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Loading Indicator */}
          {isSending && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100/30 dark:border-gray-800/80 rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form Footer */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            placeholder="Type your nutrition question here (e.g. swap milk for almonds)..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl cursor-pointer transition shadow-lg shadow-emerald-500/10 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
