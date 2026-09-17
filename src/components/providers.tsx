"use client";

import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { useBudgetStore } from "@/lib/store";
import { authenticateBiometric } from "@/lib/biometric";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useBudgetStore((state) => state.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem><ThemePreferenceSync /><BiometricGate>{children}</BiometricGate></ThemeProvider>;
}

function BiometricGate({ children }: { children: React.ReactNode }) {
  const { ready, settings } = useBudgetStore();
  const [unlockedCredential, setUnlockedCredential] = useState("");
  const [error, setError] = useState("");
  const enabled = settings.find((setting) => setting.key === "biometricEnabled")?.value === "true";
  const credentialId = settings.find((setting) => setting.key === "biometricCredential")?.value;

  async function unlock() {
    if (!credentialId) return;
    setError("");
    try { await authenticateBiometric(credentialId); setUnlockedCredential(credentialId); } catch (unlockError) { setError(unlockError instanceof Error ? unlockError.message : "Face ID unlock failed"); }
  }

  useEffect(() => {
    if (!ready || !enabled || !credentialId) return;
    void authenticateBiometric(credentialId).then(() => setUnlockedCredential(credentialId)).catch((unlockError: unknown) => setError(unlockError instanceof Error ? unlockError.message : "Face ID unlock failed"));
  }, [credentialId, enabled, ready]);

  const locked = ready && enabled && Boolean(credentialId) && unlockedCredential !== credentialId;
  if (!locked) return <>{children}</>;
  return <div className="grid min-h-screen place-items-center bg-[#f5f5f7] px-6 text-center dark:bg-black"><div className="max-w-xs"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-[#007aff] text-3xl font-bold text-white">p</div><h1 className="mt-5 text-2xl font-bold">Pocket Ledger is locked</h1><p className="mt-2 text-sm text-[#8e8e93]">Use Face ID to continue.</p><button className="mt-6 rounded-xl bg-[#007aff] px-5 py-3 text-sm font-semibold text-white" onClick={() => void unlock()}>Unlock with Face ID</button>{error && <p className="mt-3 text-xs text-red-500">{error}</p>}</div></div>;
}

function ThemePreferenceSync() {
  const { settings, ready, setSetting } = useBudgetStore();
  const storedTheme = settings.find((setting) => setting.key === "theme")?.value;
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!ready || (storedTheme !== "light" && storedTheme !== "dark") || theme === storedTheme) return;
    setTheme(storedTheme);
  }, [ready, setTheme, storedTheme, theme]);

  useEffect(() => {
    if (!ready || (theme !== "light" && theme !== "dark")) return;
    if (storedTheme !== theme) void setSetting("theme", theme);
  }, [ready, setSetting, storedTheme, theme]);

  return null;
}
