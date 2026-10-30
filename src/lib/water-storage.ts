import Storage from 'expo-sqlite/kv-store';

export const STORAGE_KEY = 'water-log';

type WaterLog = Record<string, number>;

async function readLog(): Promise<WaterLog> {
  try {
    const raw = await Storage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as WaterLog;
  } catch {
    return {};
  }
}

async function writeLog(log: WaterLog): Promise<void> {
  await Storage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export async function getCount(dateKey: string): Promise<number> {
  const log = await readLog();
  return log[dateKey] ?? 0;
}

export async function addGlass(dateKey: string): Promise<number> {
  const log = await readLog();
  const next = (log[dateKey] ?? 0) + 1;
  log[dateKey] = next;
  await writeLog(log);
  return next;
}

export async function undoGlass(dateKey: string): Promise<number> {
  const log = await readLog();
  const current = log[dateKey] ?? 0;
  if (current === 0) return 0;
  const next = current - 1;
  log[dateKey] = next;
  await writeLog(log);
  return next;
}