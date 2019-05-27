### [checkbox-confirm]

| 参数                   | 说明                                      | 类型                       | 默认值   |
|------------------------|-----------------------------------------|----------------------------|----------|
| `[isCancelShowTootip]` | 取消时是否提示                            | `boolean`                  | `false`  |
| `[hlCancelText]`       | 取消按钮文字。设为 null 表示不显示取消按钮 | `string`                   | `'取消'` |
| `[hlOkText]`           | 确认按钮文字                              | `string`                   | `'确定'` |
| `[hlOkTitle]`          | 勾选时框内描述                            | `string｜TemplateRef<void>` | -        |
| `[hlCancelTitle]`      | 反勾选时框内描述                          | `string｜TemplateRef<void>` | -        |
| `[hlIcon]`             | 自定义弹出框的 icon                       | `TemplateRef<void>`        | -        |
| `(hlOnCancel)`         | 点击取消的回调                            | `EventEmitter<void>`       | -        |
| `(hlOnConfirm)`        | 点击确认的回调                            | `EventEmitter<Event>`      | -        |
| `[hlWidth]`            | 描述框宽度                                | `number`                   | `300`    |
| `(OverlayClose)`       | 覆盖层关闭回调                            | `EventEmitter<void>`       | -        |
