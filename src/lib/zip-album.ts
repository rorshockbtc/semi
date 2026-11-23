'use client';

/**
 * Zero-dependency ZIP (STORE / method 0) builder + ID3v2.3 total-track normalizer
 * for client-side album downloads that import cleanly into Apple Music / iTunes & Android MediaStore.
 */

export interface ZipEntryInput {
  name: string;
  data: Uint8Array;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Updates ID3v2.3 `TRCK` frame denominator `/12` -> `/15` in-place (same byte length,
 * so frame and header synchsafe sizes remain 100% valid) when building the 15-track Deluxe ZIP.
 */
export function patchMp3TrackTotalTo15(mp3Bytes: Uint8Array): Uint8Array {
  if (
    mp3Bytes.length < 14 ||
    mp3Bytes[0] !== 0x49 || // 'I'
    mp3Bytes[1] !== 0x44 || // 'D'
    mp3Bytes[2] !== 0x33 // '3'
  ) {
    return mp3Bytes;
  }

  const tagSize =
    ((mp3Bytes[6] & 0x7f) << 21) |
    ((mp3Bytes[7] & 0x7f) << 14) |
    ((mp3Bytes[8] & 0x7f) << 7) |
    (mp3Bytes[9] & 0x7f);
  const limit = Math.min(mp3Bytes.length, 10 + tagSize);
  const copy = new Uint8Array(mp3Bytes);

  let pos = 10;
  while (pos + 10 < limit) {
    if (copy[pos] === 0) break;
    const id = String.fromCharCode(copy[pos], copy[pos + 1], copy[pos + 2], copy[pos + 3]);
    const frameSize =
      (copy[pos + 4] << 24) |
      (copy[pos + 5] << 16) |
      (copy[pos + 6] << 8) |
      copy[pos + 7];
    if (frameSize <= 0 || pos + 10 + frameSize > limit) break;

    if (id === 'TRCK') {
      const start = pos + 10;
      const end = start + frameSize;
      // Match ASCII '/12' (0x2f 0x31 0x32) or UTF-16LE '/12' (0x2f 0x00 0x31 0x00 0x32 0x00) or UTF-16BE
      for (let i = start; i < end - 2; i++) {
        if (copy[i] === 0x2f && copy[i + 1] === 0x31 && copy[i + 2] === 0x32) {
          copy[i + 2] = 0x35; // '5'
          break;
        }
        if (
          i + 5 < end &&
          copy[i] === 0x2f &&
          copy[i + 1] === 0x00 &&
          copy[i + 2] === 0x31 &&
          copy[i + 3] === 0x00 &&
          copy[i + 4] === 0x32 &&
          copy[i + 5] === 0x00
        ) {
          copy[i + 4] = 0x35; // '5'
          break;
        }
        if (
          i + 5 < end &&
          copy[i] === 0x00 &&
          copy[i + 1] === 0x2f &&
          copy[i + 2] === 0x00 &&
          copy[i + 3] === 0x31 &&
          copy[i + 4] === 0x00 &&
          copy[i + 5] === 0x32
        ) {
          copy[i + 5] = 0x35; // '5'
          break;
        }
      }
      break;
    }

    pos += 10 + frameSize;
  }

  return copy;
}

export function buildM3uPlaylist(
  tracks: Array<{ filename: string; title: string; durationSeconds?: number }>
): Uint8Array {
  const lines = ['#EXTM3U', '#PLAYLIST:Semi (; - ]) - I/O'];
  for (const t of tracks) {
    const secs = t.durationSeconds && t.durationSeconds > 0 ? Math.round(t.durationSeconds) : -1;
    lines.push(`#EXTINF:${secs},Semi (; - ]) - ${t.title}`);
    lines.push(t.filename);
  }
  return new TextEncoder().encode(lines.join('\n') + '\n');
}

export function buildStoreZip(entries: ZipEntryInput[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const data = entry.data;
    const crc = crc32(data);
    const size = data.byteLength;

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
    lv.setUint16(8, 0, true); // STORE
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0x5421, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, data);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x5421, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.byteLength + size;
  }

  const centralDirSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralDirSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob(
    [...(localParts as BlobPart[]), ...(centralParts as BlobPart[]), eocd as BlobPart],
    { type: 'application/zip' }
  );
}
