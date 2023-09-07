import { redirectToSignIn } from '@clerk/nextjs';
import { ChatHeader } from '@components/chat/chat-header';
import { getOrCreateConversation } from '@lib/conversation';
import { currentProfile } from '@lib/current-profile';
import { db } from '@lib/db';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIdPage = async ({ params }: Props) => {
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
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="conversation"
        serverId={serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default MemberIdPage;
