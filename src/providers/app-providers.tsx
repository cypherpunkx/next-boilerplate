"use client";

import React, { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { MSWProvider } from "./msw-provider";
import { ErrorBoundary } from "@/components/feedback/error-boundary";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary name="RootProviderBoundary">
      <MSWProvider>
        <QueryProvider>{children}</QueryProvider>
      </MSWProvider>
    </ErrorBoundary>
  );
}
