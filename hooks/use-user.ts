"use client";
import { supabase } from "@/utils/supabase";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
export const useUser = () => {
  const session = getSession();
  const { data: sessionData } = useSession();

  const [user, setUser] = useState<any>(null);
  const handleFetchUser = useCallback(async () => {
    if (!sessionData) {
      return;
    }

    const { data, error } = await supabase.from("user").select("*");

    console.log("Error:", data, error);

    if (error) {
      return;
    }

    setUser(data[0]);
  }, []);

  useEffect(() => {
    if (!user && sessionData) {
      handleFetchUser();
    }
  }, []);
  return { user, getUser: handleFetchUser };
};
