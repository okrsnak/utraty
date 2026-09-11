// Files in and out. On iPhone the share sheet saves a file to Files or sends
// it anywhere; where sharing files is not supported, the file downloads.

import { todayIso } from '../dates.js';
import { backupFileName, parseBackup, serializeBackup } from '../storage.js';

const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

function download(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Must be called straight from a tap: the share sheet needs the user gesture.
async function shareOrDownload(file, title) {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return { ok: true, method: 'share' };
    } catch (error) {
      if (error.name === 'AbortError') return { ok: false, cancelled: true };
    }
  }
  download(file);
  return { ok: true, method: 'download' };
}

const jsonFile = (text, name) => new File([text], name, { type: 'application/json' });

export function exportBackup(state, now = new Date()) {
  const file = jsonFile(serializeBackup(state, now.toISOString()), backupFileName(todayIso(now)));
  return shareOrDownload(file, 'Záloha Útrat');
}

// Raw copies of data the app could not read, saved so nothing is lost.
export function exportSetAside(entries, now = new Date()) {
  const text = JSON.stringify({ app: 'utraty-odlozena-data', exportedAt: now.toISOString(), entries }, null, 2);
  return shareOrDownload(jsonFile(text, `utraty-odlozena-data-${todayIso(now)}.json`), 'Odložená data Útrat');
}

export async function readBackupFile(file) {
  if (file.size > MAX_BACKUP_BYTES) return { ok: false, error: 'Tenhle soubor je na zálohu moc velký.' };
  return parseBackup(await file.text());
}
