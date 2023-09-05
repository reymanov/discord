'use client';

import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';

import { useModal } from '@hooks/use-modal-store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LeaveServerModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'leaveServer';
  const { server } = data;

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Leave Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo-500">{server?.name}</span>? <br /> You will
            not be able to rejoin unless you are reinvited.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onConfirm} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
