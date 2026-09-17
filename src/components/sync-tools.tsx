"use client";

import { useState } from "react";
import { Cloud, DownloadCloud, KeyRound, LockKeyhole, RefreshCw, UploadCloud } from "lucide-react";
import { useBudgetStore } from "@/lib/store";
import { hasSupabaseConfig } from "@/lib/supabase";
import { registerBiometric } from "@/lib/biometric";
import { Button, Input } from "./ui";

export function SyncTools() {
  const { settings, setSetting, refreshFromCloud, pushToCloud, syncing, syncError } = useBudgetStore();
  const [open, setOpen] = useState(false);
  const [syncKey, setSyncKey] = useState(settings.find((item) => item.key === "syncKey")?.value ?? "");
  const [message, setMessage] = useState("");
  const biometric = settings.find((item) => item.key === "biometricEnabled")?.value === "true";

  async function connectAndPull() {
    const normalized = syncKey.trim();
    if (!normalized) return;
    setMessage("");
    await setSetting("syncKey", normalized);
    await refreshFromCloud();
    setMessage("Connected. Your shared data was refreshed.");
  }

  async function pushChanges() {
    setMessage("");
    await pushToCloud();
    setMessage("Your local data was pushed to the shared vault.");
  }

  return <div className="relative">
    <button title="Sync and security" aria-label="Sync and security" onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-[#f7f5f0]/90 text-[#6c6a63] shadow-sm backdrop-blur hover:text-[#e07a5f] dark:border-white/10 dark:bg-[#1e1e1c]/90 dark:text-[#bdbab1]"><Cloud className="h-4 w-4" /></button>
    {open && <div className="absolute right-0 top-12 w-80 rounded-2xl border border-black/10 bg-[#f7f5f0] p-4 text-[#282725] shadow-xl dark:border-white/10 dark:bg-[#252522] dark:text-[#f7f5f0]"><div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#e07a5f]" /><h2 className="font-display font-bold">Sync across devices</h2></div><p className="mt-2 text-xs text-[#858178]">Use the same private key on your phone and web. No account is required.</p><Input className="mt-3" value={syncKey} onChange={(event) => setSyncKey(event.target.value)} placeholder="Paste your phone sync key" type="password" /><Button className="mt-3 w-full" onClick={() => void connectAndPull()} disabled={!hasSupabaseConfig || !syncKey.trim() || syncing}><DownloadCloud className="h-4 w-4" />Connect & pull phone data</Button><div className="mt-2 grid grid-cols-2 gap-2"><Button variant="ghost" onClick={() => void refreshFromCloud()} disabled={!hasSupabaseConfig || !syncKey.trim() || syncing}><RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />Refresh</Button><Button variant="ghost" onClick={() => void pushChanges()} disabled={!hasSupabaseConfig || !syncKey.trim() || syncing}><UploadCloud className="h-4 w-4" />Push local</Button></div>{message && <p className="mt-3 text-xs text-[#5b8e7d]">{message}</p>}{!hasSupabaseConfig && <p className="mt-3 text-xs text-[#b86b57]">Add Supabase environment variables to enable cloud sync.</p>}{syncError && <p className="mt-3 text-xs text-red-600">{syncError}</p>}<div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10"><Button variant="ghost" className="w-full justify-start px-0" onClick={() => void registerBiometric().catch((error) => alert(error instanceof Error ? error.message : "Biometric setup failed"))}><LockKeyhole className="h-4 w-4" />{biometric ? "Register another Face ID" : "Enable Face ID / biometrics"}</Button><p className="mt-1 text-xs text-[#858178]">Uses your device’s WebAuthn prompt when supported.</p></div></div>}
  </div>;
}
