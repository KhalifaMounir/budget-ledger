import type { ExportPayload } from "./types";

/** Future sync boundary: local mutations can be queued here without coupling UI to Supabase. */
export interface SyncAdapter {
  push(payload: ExportPayload): Promise<void>;
  pull(): Promise<ExportPayload | null>;
}

export const offlineSyncAdapter: SyncAdapter = {
  async push() {},
  async pull() { return null; },
};
