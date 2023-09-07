import { redirectToSignIn } from '@clerk/nextjs';
import { ChatHeader } from '@components/chat/chat-header';
import { currentProfile } from '@lib/current-profile';
import { db } from '@lib/db';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: Props) => {
  const { serverId, channelId } = params;
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) redirect('/');

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader serverId={serverId} name={channel.name} type={'channel'} />
    </div>
  );
};

export default ChannelIdPage;
