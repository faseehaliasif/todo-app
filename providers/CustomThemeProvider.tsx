"use client";  // Forces this file to be a Client Component

import { ThemeProvider } from "next-themes";

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
