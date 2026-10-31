import { FileUpload as Ark, type FileUploadFileError } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type FileUploadProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  label?: ReactNode
  /** ドロップ領域の文言。既定は「ここにファイルをドロップ」 */
  dropzoneText?: ReactNode
  /** 選択ボタンの文言。既定は「ファイルを選択」 */
  triggerText?: ReactNode
  /** 却下されたファイルの理由を文言にする。既定は日本語の固定文 */
  formatError?: (error: FileUploadFileError, file: File) => ReactNode
}

/** Ark の既定は英語なので日本語にする */
const translations: NonNullable<FileUploadProps["translations"]> = {
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
const defaultFormatError = (error: FileUploadFileError) => errorText[error] ?? error

/**
 * Ark の既定は Intl の単位で "70 byte" / "2.05 kB" になる（ja-JP でも byte）。
 * Windows のエクスプローラーと同じ 1024 区切り・KB / MB にする
 */
function formatSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"]
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
  return `${i === 0 ? n : n.toLocaleString("ja-JP", { maximumFractionDigits: 1 })} ${units[i]}`
}

/**
 * label / ドロップ領域 / 選んだファイルの一覧 / 却下されたファイルの一覧を組み立てて隠す。
 * 却下されたファイルは何も出さないと黙って消えたように見えるので、理由と並べて出す。
 *
 * Ark の dropzone は既定で role="button" になり、中の「ファイルを選択」ボタンと入れ子になる
 * （読み上げで中のボタンに届かない）。dropzone はドロップを受けるだけの group にして、
 * 選ぶ操作はボタンに一本化する。
 */
export function FileUpload({
  label, dropzoneText = "ここにファイルをドロップ", triggerText = "ファイルを選択",
  formatError = defaultFormatError, translations: t, children, ...props
}: FileUploadProps) {
  return (
    <Ark.Root translations={{ ...translations, ...t }} {...props}>
      {label != null ? <Ark.Label>{label}</Ark.Label> : null}
      <Ark.Dropzone disableClick role="group">
        <span>{dropzoneText}</span>
        <Ark.Trigger>{triggerText}</Ark.Trigger>
      </Ark.Dropzone>
      <Ark.HiddenInput />
      <Ark.Context>
        {(api) => (
          <>
            <Ark.ItemGroup>
              {api.acceptedFiles.map((file) => (
                <Ark.Item key={`${file.name}-${file.size}-${file.lastModified}`} file={file}>
                  <Ark.ItemPreview type="image/*"><Ark.ItemPreviewImage /></Ark.ItemPreview>
                  <Ark.ItemName />
                  <Ark.ItemSizeText>{formatSize(file.size)}</Ark.ItemSizeText>
                  <Ark.ItemDeleteTrigger />
                </Ark.Item>
              ))}
            </Ark.ItemGroup>
            <Ark.ItemGroup type="rejected">
              {api.rejectedFiles.map(({ file, errors }) => (
                <Ark.Item key={`${file.name}-${file.size}-${file.lastModified}`} file={file}>
                  <Ark.ItemName />
                  <Ark.ItemSizeText>{errors.map((e) => formatError(e, file)).join("、")}</Ark.ItemSizeText>
                  <Ark.ItemDeleteTrigger />
                </Ark.Item>
              ))}
            </Ark.ItemGroup>
          </>
        )}
      </Ark.Context>
      {children}
    </Ark.Root>
  )
}

/** 素の構造で組みたいとき用 */
FileUpload.Root = Ark.Root
FileUpload.Label = Ark.Label
FileUpload.Dropzone = Ark.Dropzone
FileUpload.Trigger = Ark.Trigger
FileUpload.HiddenInput = Ark.HiddenInput
FileUpload.ItemGroup = Ark.ItemGroup
FileUpload.Item = Ark.Item
FileUpload.ItemPreview = Ark.ItemPreview
FileUpload.ItemPreviewImage = Ark.ItemPreviewImage
FileUpload.ItemName = Ark.ItemName
FileUpload.ItemSizeText = Ark.ItemSizeText
FileUpload.ItemDeleteTrigger = Ark.ItemDeleteTrigger
FileUpload.ClearTrigger = Ark.ClearTrigger
FileUpload.Context = Ark.Context
