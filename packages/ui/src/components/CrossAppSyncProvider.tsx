"use client";

import { useEffect } from "react";
import { setUser } from "../store/userSlice";
import { useAppDispatch } from "../store/hooks";
import { useHydration } from "../hooks/useHydration";
import { StorageService } from "../services/StorageService";

export const CrossAppSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const isHydrated = useHydration();

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    const storage = new StorageService();
    const userData = storage.getUserData();

    if (userData) {
      dispatch(setUser(userData));
    }
  }, [dispatch, isHydrated]);

  return <>{children}</>;
};
