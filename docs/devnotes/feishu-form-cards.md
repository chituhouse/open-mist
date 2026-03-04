# 飞书卡片表单交互方案

> 调研日期：2026-02-21
> 用途：实现带输入框的指令面板，用户选择指令+填写内容后一次性提交

---

## 核心组件

### 1. form 表单容器

用 `form` 包裹所有输入组件，**只在点击提交按钮时才触发回调**（不会每次输入都回调）。

```json
{
  "tag": "form",
  "name": "form_name",
  "elements": [
    // input, select_static, button 等
  ]
}
```

### 2. input 输入框

```json
{
  "tag": "input",
  "name": "field_name",
  "required": true,
  "placeholder": { "tag": "plain_text", "content": "请输入内容..." },
  "label": { "tag": "plain_text", "content": "标签文字" },
  "label_position": "left",
  "max_length": 2000
}
```

**限制**：
- 单行文本，不支持多行/富文本
- 需要飞书客户端 6.8+
- 复杂表单建议跳转 H5 页面

### 3. select_static 单选下拉菜单

```json
{
  "tag": "select_static",
  "name": "command",
  "required": true,
  "placeholder": { "tag": "plain_text", "content": "请选择" },
  "label": { "tag": "plain_text", "content": "指令类型" },
  "options": [
    {
      "text": { "tag": "plain_text", "content": "选项A" },
      "value": "value_a"
    }
  ]
}
```

### 4. 提交按钮

```json
{
  "tag": "button",
  "text": { "tag": "plain_text", "content": "执行" },
  "type": "primary",
  "action_type": "form_submit",
  "name": "submit",
  "confirm": {
    "title": { "tag": "plain_text", "content": "确认执行" },
    "text": { "tag": "plain_text", "content": "确认提交吗？" }
  }
}
```

---

## 完整卡片 JSON 示例（指令面板）

```json
{
  "config": { "wide_screen_mode": true },
  "header": {
    "title": { "tag": "plain_text", "content": "指令面板" },
    "template": "blue"
  },
  "elements": [
    {
      "tag": "form",
      "name": "command_form",
      "elements": [
        {
          "tag": "select_static",
          "name": "command",
          "required": true,
          "placeholder": { "tag": "plain_text", "content": "选择指令" },
          "label": { "tag": "plain_text", "content": "指令类型" },
          "options": [
            { "text": { "tag": "plain_text", "content": "/build - 构建部署" }, "value": "/build" },
            { "text": { "tag": "plain_text", "content": "/write - 写作" }, "value": "/write" },
            { "text": { "tag": "plain_text", "content": "/analyze - 分析" }, "value": "/analyze" }
          ]
        },
        {
          "tag": "input",
          "name": "content",
          "required": true,
          "placeholder": { "tag": "plain_text", "content": "输入指令内容..." },
          "label": { "tag": "plain_text", "content": "内容" },
          "max_length": 2000
        },
        {
          "tag": "button",
          "text": { "tag": "plain_text", "content": "执行" },
          "type": "primary",
          "action_type": "form_submit",
          "name": "submit"
        }
      ]
    }
  ]
}
```

---

## 回调数据结构

用户填写并点击提交后，`card.action.trigger` 回调中：

```javascript
// action 字段
{
  tag: "button",
  name: "submit",
  action_type: "form_submit",
  form_value: {
    command: "/build",        // select_static 选择的值
    content: "用户输入的内容"  // input 填写的值
  }
}
```

### 服务端处理逻辑

```javascript
if (action.name === 'submit' && action.form_value) {
  const cmd = action.form_value.command;     // "/build"
  const content = action.form_value.content;  // 用户输入
  const fullCommand = `${cmd} ${content}`;    // "/build 用户输入"
  // 送入消息处理流程
}
```

### 响应格式（同卡片回调标准格式）

```javascript
return {
  toast: { type: 'success', content: '指令已提交' },
  card: { type: 'raw', data: updatedCard }
};
```

---

## 交互方案

### 方案 A：统一指令面板（推荐）

菜单加一个"指令面板"入口 → 弹出含下拉选择+输入框的卡片 → 用户选指令、填内容、点执行。

**优势**：一张卡片覆盖所有带参指令，灵活可扩展。

### 方案 B：每个指令独立卡片

菜单的 /build 直接弹出只有输入框的卡片（指令已确定）。

**优势**：更简洁直接，少一步操作。

### 建议

两种方案并存：常用指令用方案 B（一步到位），全量指令用方案 A（指令面板）。

---

## 参考链接

- [飞书消息卡片输入框实现业务交互](https://open.feishu.cn/community/articles/7271149634339454978)
- [Input 输入框组件文档](https://open.feishu.cn/document/feishu-cards/card-components/interactive-components/input)
- [Form 表单容器文档](https://open.feishu.cn/document/feishu-cards/feishu-card-cardkit/components/form)
- [单选下拉菜单文档](https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/single-select-dropdown-menu)
- [卡片回调通信](https://open.feishu.cn/document/feishu-cards/card-callback-communication)
- [卡片交互配置](https://open.feishu.cn/document/feishu-cards/configuring-card-interactions)
- [消息卡片搭建工具](https://open.feishu.cn/tool/cardbuilder)
