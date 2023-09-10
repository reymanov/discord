'use client';

import { Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';

interface Props {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none">
        <Picker
          theme={resolvedTheme}
          data={data}
          autoFocus={true}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
