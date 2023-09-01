import { v4 as uuidv4 } from 'uuid';

import { currentProflie } from '@lib/current-profile';
import { db } from '@lib/db';
import { NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

export const POST = async (req: Request, res: Response) => {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProflie();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return new NextResponse(JSON.stringify(server), { status: 201 });
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
