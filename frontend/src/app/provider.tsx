"use client";

import { useEffect } from "react";

import { PropsWithChildren } from "react";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useGetUser } from "@/hooks";

import { useUserStore } from "@/store";

function makeQueryClient() {
  return new QueryClient({});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}

function UserSync() {
  const { data: user, isError } = useGetUser();

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (isError) {
      setUser(null);
    }
  }, [user, isError, setUser]);

  return null;
}

export default function Provider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <UserSync />
    </QueryClientProvider>
  );
}
