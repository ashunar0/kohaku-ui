<script setup lang="ts">
/**
 * label / ドロップ領域 / 選んだファイルの一覧 / 却下されたファイルの一覧を組み立てて隠す。
 * 却下されたファイルは何も出さないと黙って消えたように見えるので、理由と並べて出す。
 *
 * Ark の dropzone は既定で role="button" になり、中の「ファイルを選択」ボタンと入れ子になる
 * （読み上げで中のボタンに届かない）。dropzone はドロップを受けるだけの group にして、
 * 選ぶ操作はボタンに一本化する。
 */
import { FileUpload, type FileUploadFileError, type FileUploadRootProps } from "@ark-ui/vue"
import { defaultFormatError, fileKey, formatSize, translations as ja } from "./file-upload-text"

withDefaults(defineProps<{
  label?: string
  /** ドロップ領域の文言 */
  dropzoneText?: string
  /** 選択ボタンの文言 */
  triggerText?: string
  /** 却下されたファイルの理由を文言にする。既定は日本語の固定文 */
  formatError?: (error: FileUploadFileError, file: File) => string
  translations?: FileUploadRootProps["translations"]
}>(), {
  dropzoneText: "ここにファイルをドロップ",
  triggerText: "ファイルを選択",
  formatError: defaultFormatError,
})
</script>

<template>
  <FileUpload.Root :translations="{ ...ja, ...translations }">
    <FileUpload.Label v-if="label || $slots.label"><slot name="label">{{ label }}</slot></FileUpload.Label>
    <FileUpload.Dropzone disable-click role="group">
      <span>{{ dropzoneText }}</span>
      <FileUpload.Trigger>{{ triggerText }}</FileUpload.Trigger>
    </FileUpload.Dropzone>
    <FileUpload.HiddenInput />
    <FileUpload.Context v-slot="api">
      <FileUpload.ItemGroup>
        <FileUpload.Item v-for="file in api.acceptedFiles" :key="fileKey(file)" :file="file">
          <FileUpload.ItemPreview type="image/*"><FileUpload.ItemPreviewImage /></FileUpload.ItemPreview>
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText>{{ formatSize(file.size) }}</FileUpload.ItemSizeText>
          <FileUpload.ItemDeleteTrigger />
        </FileUpload.Item>
      </FileUpload.ItemGroup>
      <FileUpload.ItemGroup type="rejected">
        <FileUpload.Item v-for="r in api.rejectedFiles" :key="fileKey(r.file)" :file="r.file">
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText>{{ r.errors.map((e) => formatError(e, r.file)).join("、") }}</FileUpload.ItemSizeText>
          <FileUpload.ItemDeleteTrigger />
        </FileUpload.Item>
      </FileUpload.ItemGroup>
    </FileUpload.Context>
    <slot />
  </FileUpload.Root>
</template>
