import { db } from '@lib/db';
import { redirect } from 'next/navigation';
import { currentProfile } from '@lib/current-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChatHeader } from '@components/chat/chat-header';
import { ChatInput } from '@components/chat/chat-input';
import { ChatMessages } from '@components/chat/chat-messages';
import { getOrCreateConversation } from '@lib/conversation';
import { MediaRoom } from '@components/media-room';

interface Props {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: Props) => {
  const profile = await currentProfile();
  const { serverId, memberId } = params;

  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect('/');

  const conversation = await getOrCreateConversation(currentMember.id, memberId);

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="conversation"
        serverId={serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />

      {searchParams.video ? (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
