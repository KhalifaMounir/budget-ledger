import type { ExportPayload } from "./types";
import { supabase } from "./supabase";

/** Full-vault sync keeps the local database authoritative while providing a simple multi-device bridge. */
export interface SyncAdapter {
  push(syncKey: string, payload: ExportPayload): Promise<void>;
  pull(syncKey: string): Promise<ExportPayload | null>;
}

export const supabaseSyncAdapter: SyncAdapter = {
  async push(syncKey, payload) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from("ledger_vaults").upsert({ sync_key: syncKey, payload, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
  async pull(syncKey) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("ledger_vaults").select("payload").eq("sync_key", syncKey).maybeSingle();
    if (error) throw error;
    return (data?.payload as ExportPayload | undefined) ?? null;
  },
};
