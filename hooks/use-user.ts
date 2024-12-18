"use client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface SessionUser {
  id?: string;
}

export const useUser = () => {
  const { data: sessionData } = useSession();

  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetchUser = useCallback(async () => {
    if (!sessionData?.user) {
      return;
    }

    const userId = (sessionData.user as SessionUser).id;
    if (!userId) {
      setIsLoaded(true);
      return;
    }

    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to fetch user:', error);
        setIsLoaded(true);
        return;
      }

      const { user: userData } = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [sessionData]);

  useEffect(() => {
    if (!user && sessionData) {
      setIsLoaded(false);
      handleFetchUser();
    }
  }, [handleFetchUser, user, sessionData]);

  return { user, isLoaded, getUser: handleFetchUser };
};
