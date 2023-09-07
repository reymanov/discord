import { db } from '@lib/db';

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  const conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    const newConversation = await createNewConversation(memberOneId, memberTwoId);
    return newConversation;
  }

  return conversation;
};

export const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },

      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (e) {
    return null;
  }
};

export const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const newConversation = await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return newConversation;
  } catch (e) {
    return null;
  }
};
