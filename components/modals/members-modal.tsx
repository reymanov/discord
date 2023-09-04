'use client';

import { useState } from 'react';
import qs from 'query-string';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { ScrollArea } from '@components/ui/scroll-area';
import { UserAvatar } from '@components/user-avatar';

import { useModal } from '@hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@types';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldIcon,
  ShieldQuestion,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const MembersModal = () => {
  const { isOpen, type, data, onOpen, onClose } = useModal();
  const [loadingID, setLoadingID] = useState<string>('');
  const router = useRouter();

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingID(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingID('');
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingID(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.delete(url);

      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingID('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px]">
          {server?.members?.map(member => (
            <div key={member.id} className="mb-6 flex items-center gap-x-3">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>

              {server.profileId !== member.profileId && loadingID !== member.id && (
                <div className="ml-auto mr-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="mr-2 h-4 w-4" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, MemberRole.GUEST)}>
                              <Shield className="mr-2 h-4 w-4" /> Guest
                              {member.role === MemberRole.GUEST && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, MemberRole.MODERATOR)}>
                              <ShieldCheck className="mr-2 h-4 w-4" /> Moderator
                              {member.role === MemberRole.MODERATOR && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)} className="text-rose-500">
                        <Gavel className="mr-2 h-4 w-4" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingID === member.id && (
                <Loader2 className="ml-auto mr-2 h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
