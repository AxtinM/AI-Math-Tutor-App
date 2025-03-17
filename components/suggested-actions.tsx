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
      title: 'مسائل الجمع والطرح',
      label: 'كيف أحسب 24 + 18؟',
      action: 'كيف أحسب 24 + 18؟',
    },
    {
      title: 'مسائل الضرب',
      label: 'اشرح لي جدول الضرب من 1 إلى 10',
      action: 'اشرح لي جدول الضرب من 1 إلى 10',
    },
    {
      title: 'الكسور',
      label: 'كيف أجمع الكسور المختلفة؟',
      action: 'كيف أجمع الكسور المختلفة؟',
    },
    {
      title: 'الأشكال الهندسية',
      label: 'ما هي أنواع المثلثات؟',
      action: 'ما هي أنواع المثلثات؟',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-3 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
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
            className="text-right border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-2xl px-4 py-4 text-md flex-1 gap-2 sm:flex-col w-full h-auto justify-start items-start font-dubai shadow-sm"
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
