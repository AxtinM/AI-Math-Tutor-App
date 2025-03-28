'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'دورة الماء 💧',
      label: 'اشرح لي دورة الماء في الطبيعة',
      action: 'اشرح لي دورة الماء في الطبيعة',
    },
    {
      title: 'الأهرامات المصرية 🇪🇬',
      label: 'من بنى الأهرامات ولماذا؟',
      action: 'من بنى الأهرامات ولماذا؟',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-3 w-full"
    >
      {suggestedActions.slice(0, 2).map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="block"
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-right border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-2xl p-4 text-md flex-1 gap-2 w-full h-auto justify-start items-start font-dubai shadow-sm rtl-force"
            dir="rtl"
          >
            <span className="font-medium text-lg arabic-decoration">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
