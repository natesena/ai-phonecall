"use client";
import { supabase } from "@/utils/supabase";
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

    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", userId)
      .single();


    if (error) {
      setIsLoaded(true);
      return;
    }

    setUser(data);
    setIsLoaded(true);
  }, [sessionData]);

  useEffect(() => {
    if (!user && sessionData) {
      setIsLoaded(false);
      handleFetchUser();
    }
  }, [handleFetchUser, user, sessionData]);

  return { user, getUser: handleFetchUser, isLoaded };
};
