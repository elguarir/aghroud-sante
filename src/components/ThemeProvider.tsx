"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export interface NextUIThemeProviderProps {
  children: React.ReactNode;
  themeProps?: Omit<ThemeProviderProps, "children">; // Exclude 'children' from ThemeProviderProps
}

export function NextUIThemeProvider({
  children,
  themeProps,
}: NextUIThemeProviderProps) {
  const router = useRouter();

  return (
    <NextUIProvider locale="fr-FR" navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {children}
        <ProgressBar
          height="3px"
          color="#006fee"
          options={{
            showSpinner: false,
            minimum: 0.25,
            easing: "ease",
            speed: 200,
          }}
          shallowRouting
        />
      </NextThemesProvider>
    </NextUIProvider>
  );
}
