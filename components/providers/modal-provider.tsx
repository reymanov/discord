'use client';

import { InviteModal } from '@components/modals/invite-modal';
import { MembersModal } from '@components/modals/members-modal';
import { EditServerModal } from '@components/modals/edit-server-modal';
import { CreateServerModal } from '@components/modals/create-server-modal';

import React, { useEffect, useState } from 'react';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <InviteModal />
      <MembersModal />
    </>
  );
};
