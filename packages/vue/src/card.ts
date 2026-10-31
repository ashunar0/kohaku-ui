import CardRoot from "./CardRoot.vue"
import { part } from "./part"

export const Card = {
  Root: CardRoot,
  Header: part("header"),
  Body: part("body"),
  Footer: part("footer"),
  Title: part("title", "h3"),
  Description: part("description", "p"),
}
