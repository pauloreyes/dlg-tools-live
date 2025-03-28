'use client';

import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';

const CustomUserButton = () => {
  const { user } = useUser();
  const { state } = useSidebar(); // Get the sidebar state

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <UserButton />
      {user && state === 'expanded' && ( // Conditionally render the name
        <span style={{ marginLeft: '8px' }}>
          Hi, {user.firstName}!
        </span>
      )}
    </div>
  );
};

const CustomUser = () => {
  return (
    <SignedIn>
      <CustomUserButton />
    </SignedIn>
  );
};

export default CustomUser;