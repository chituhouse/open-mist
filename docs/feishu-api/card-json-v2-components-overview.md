# Overview of card JSON 2.0 version components

Components in Feishu cards can be categorized into container, display, and interactive components. Except for the recycling container, all components can be constructed using card JSON code. Except for collapsible panels, multi-image selection, and checkers, all components can be used with the card building tool. In the JSON structure, components declare their type by defining the `tag` field:

```json
{
  "tag": "" // Declare the component's tag here. Different components have different tags.
}
```

This document summarizes and introduces components built based on the [card JSON 2.0 structure](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure).

## Client version requirements
The card JSON 2.0 structure supports Feishu clients version 7.20 and above. When a card using the JSON 2.0 structure is sent to clients below version 7.20, the card title will be displayed normally, but the content will show a fallback upgrade prompt.

## Container components

Container components are used for layout content or configuring interactive logic. Both display and interactive components can be added within container components.

Component | Support in Building Tools | Description
---|---|---
[Column Set (column_set)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/column-set) | ✓ | Column sets support horizontal arrangement of multiple columns, freely combining image and text content within columns to build data tables, product or article lists, travel information, etc., creating visually rich and interactive cards.
[Loop Container](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/containers/recycling-container) | ✓ | The loop container supports embedding all display, interactive, and column components. Using loop containers, you can efficiently organize a series of similarly formatted content with different data.
[Form Container (form)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/form-container) | ✓ | The form container allows users to locally enter a batch of form items and, by clicking a submit button, send these locally cached form contents in one callback to the developer's server, achieving the effect of asynchronously submitting multiple form item data.
[Interactive Container (interactive_container)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/interactive-container) | × | The interactive container allows you to embed components based on business needs within the container and flexibly combine multiple interactive containers, unifying the style and interactive capabilities of multiple containers, to achieve various combination effects and rich card interactions.
[Collapsible Panel (collapsible_panel)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/collapsible-panel) | × | The collapsible panel allows you to fold secondary information, such as notes and longer texts, in the card to highlight the main information.

## Display components

Display components form the main content of the card and do not have interactive capabilities.

Component | Support in Building Tools | Client Version Requirement | Description
---|---|---|---
[Title (header)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/title) | ✓ | The title component is used to build the title style and content of the Feishu card, supporting the addition of main titles, subtitles, suffix tags, and title icons.
[Plain Text (div)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/plain-text) | ✓ | The plain text component supports adding plain text and prefix icons, and setting text size, color, alignment, and other display styles.
[Rich Text (markdown)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/rich-text) | ✓ | The rich text (Markdown) component supports rendering text, images, dividers, and other elements.
[Image (img)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/image) | ✓ | The image component supports adding images by calling the [Upload Image](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/image/create) interface or uploading images in the new version of the Feishu card building tool.
[Multi-Image Layout (img_combination)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/multi-image-laylout) | ✓ | The multi-image layout component supports adding multiple images by calling the [Upload Image](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/image/create) interface or uploading images in the new version of the Feishu card building tool.
[Person (person)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/user-profile) | ✓ | The person component supports displaying usernames and avatars. You can use this component by passing in the person's open_id, user_id, or union_id.
[Person List (person_list)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/user-list) | ✓ | The person list component supports displaying multiple usernames and avatars. You can use this component by passing in the open_id, user_id, or union_id of the individuals.
[Chart (chart)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/chart) | × | The chart component is based on the [VChart](https://www.visactor.io/) chart definitions, supporting line charts, area charts, bar charts, pie charts, word clouds, and other data presentation methods, helping you visualize various types of information, improving communication efficiency.
[Table (table)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/table) | × | The table component supports adding plain text, option tags, person lists, and numeric content within the table.
[Divider (hr)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/divider) | ✓ | The divider component is a long horizontal line used to divide the content of the card, making the presentation clearer.

## Interactive components

Interactive components provide interactive capabilities for cards. When users receive cards that include interactive components, they can directly access links or handle business within the card.

Component | Support in Building Tools | Client Version Requirement | Description
---|---|---|---
[Input Box (input)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/input) | ✓ | The input box component supports collecting unfixed text content, such as reasons, evaluations, remarks, etc.
[Button (button)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/button) | ✓ | The button component provides configured button callback interactions or link redirection capabilities, and supports multiple styles and sizes.
[Overflow Button Set (overflow)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/overflow) | ✓ | The overflow button set component supports adding multiple buttons within the overflow set. By default, the button set is in a collapsed state, clicking the set will display all buttons inside.
[Single-Select Dropdown (select_static)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/single-select-dropdown-menu) | ✓ | The single-select dropdown component supports customizing the option text, icons, and callback parameters of the single-select menu.
[Multi-Select Dropdown (multi_select_static)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/multi-select-dropdown-menu) | × | The multi-select dropdown component supports customizing the option text, icons, and callback parameters of the multi-select menu.
[Single-Select Person Picker (select_person)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/single-select-user-picker) | ✓ | The single-select person picker component supports adding specific individuals as single-select options.
[Multi-Select Person Picker (multi_select_person)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/multi-select-user-picker) | × | The multi-select person picker component supports adding specific individuals as multi-select options.
[Date Picker (date_picker)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/date-picker) | ✓ | The date picker component supports providing date options.
[Time Selector (picker_time)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/time-selector) | ✓ | The time selector component supports providing time options.
[Date-Time Picker (picker_datetime)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/date-time-picker) | × | The date-time picker component supports providing time and date options.
[Image Picker (select_img)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/image-picker) | × | The image picker component supports providing image options, supporting single or multiple image selections.
[Checker (checker)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/checker) | × | The checker supports configuring callback responses, mainly used for task checking scenarios.
