"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      text: "Помоги мне составить КП",
      value:
        "Сделай 2 КП от СДК и Емонаева с увеличением цен на 5 и 7 % ориентируясь на вложенное КП",
    },
    {
      text: "Сколько стоит заправка картриджа в Сургуте",
      value: "Сколько стоит заправка картриджа в Сургуте",
    },
    { text: "Что ты умеешь делать?", value: "Что ты умеешь делать?" },
    {
      text: "Какая погода в Сургуте?",
      value: "Какая погода в Сургуте?",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={suggestedAction.text}
        >
          <Suggestion
            suggestion={suggestedAction.text}
            onClick={() => {
              window.history.replaceState({}, "", `/chat/${chatId}`);
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.value }],
              });
            }}
            className="text-left w-full h-auto whitespace-normal p-3"
          >
            {suggestedAction.text}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  },
);
