import type { FileUploadFileError, FileUploadRootProps } from "@ark-ui/vue"

/** Ark の既定は英語なので日本語にする */
export const translations: NonNullable<FileUploadRootProps["translations"]> = {
  dropzone: "ファイルのドロップ領域",
  itemPreview: (file) => `${file.name} のプレビュー`,
  deleteFile: (file) => `${file.name} を削除`,
}

const errorText: Record<string, string> = {
  TOO_MANY_FILES: "ファイルの数が上限を超えています",
  FILE_INVALID_TYPE: "この形式のファイルは選べません",
  FILE_TOO_LARGE: "ファイルが大きすぎます",
  FILE_TOO_SMALL: "ファイルが小さすぎます",
  FILE_INVALID: "このファイルは選べません",
  FILE_EXISTS: "同じファイルがすでに選ばれています",
}
export const defaultFormatError = (error: FileUploadFileError) => errorText[error] ?? error

/**
 * Ark の既定は Intl の単位で "70 byte" / "2.05 kB" になる（ja-JP でも byte）。
 * Windows のエクスプローラーと同じ 1024 区切り・KB / MB にする
 */
export function formatSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"]
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
  return `${i === 0 ? n : n.toLocaleString("ja-JP", { maximumFractionDigits: 1 })} ${units[i]}`
}

export const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`
