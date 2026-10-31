import AlertVue from "./Alert.vue"
import AlertRoot from "./AlertRoot.vue"
import { part } from "./part"

export type { AlertVariant } from "./alert-types"

export const Alert = Object.assign(AlertVue, {
  Root: AlertRoot,
  Icon: part("icon", "span"),
  Title: part("title", "p"),
  Description: part("description", "p"),
  Actions: part("actions"),
})
