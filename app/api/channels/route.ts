import { currentProfile } from '@lib/current-profile';
import { db } from '@lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });
    if (!serverId) return new NextResponse('Server ID missing', { status: 400 });
    if (['General', 'general'].includes(name))
      return new NextResponse('Invalid channel name', { status: 400 });
    if (!name || !type) return new NextResponse('Invalid channel name or type', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.log('[CHANNELS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
