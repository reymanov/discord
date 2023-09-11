import { redirectToSignIn } from '@clerk/nextjs';
import { ChatHeader } from '@components/chat/chat-header';
import { ChatInput } from '@components/chat/chat-input';
import { ChatMessages } from '@components/chat/chat-messages';
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

      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
        paramKey="channelId"
        paramValue={channelId}
      />

      <ChatInput
        name={channel.name}
        type={'channel'}
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
};

export default ChannelIdPage;
