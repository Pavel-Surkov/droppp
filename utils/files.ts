export function buildFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function formatBytes(bytes: number): string {
  const kb = bytes / 1024;
  const mb = kb / 1024;

  if (bytes < 1024) return `${bytes} B`;

  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  return `${mb.toFixed(1)} MB`;
}
