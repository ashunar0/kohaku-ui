import { defineComponent, h } from "vue"

/** data-part を付けるだけの箱。Card / Alert の part に使う */
export const part = (name: string, tag = "div") =>
  defineComponent({
    name: `Kh${name[0]!.toUpperCase()}${name.slice(1)}`,
    setup: (_, { slots }) => () => h(tag, { "data-part": name }, slots.default?.()),
  })
