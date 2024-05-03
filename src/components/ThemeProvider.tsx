"use client"
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface NextUIThemeProviderProps {
  children: React.ReactNode;
  themeProps?: Omit<ThemeProviderProps, 'children'>; // Exclude 'children' from ThemeProviderProps
}

export function NextUIThemeProvider({ children, themeProps }: NextUIThemeProviderProps) {
  const router = useRouter();

  return (
    <NextUIProvider locale="fr-FR" navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}