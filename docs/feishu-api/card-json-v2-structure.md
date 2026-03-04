# Card JSON 2.0 Structure

This document introduces the overall structure and attribute descriptions of Card JSON 2.0. There are many incompatible differences and new attributes between the structure of JSON 2.0 and JSON 1.0. For more details, refer to [Card JSON 2.0 Incompatible Changes & Updates](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-breaking-changes-release-notes).

## Concept description

- Card JSON 2.0 refers to the version in which the `schema` attribute is declared as `"2.0"` in the card JSON data. Compared to version 1.0, version 2.0 has many incompatible differences and new attributes. For details, refer to [Card JSON 2.0 version update notes](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-breaking-changes-release-notes).

- In the visual building tool, you can obtain the source code of the card JSON version 2.0 by building the [new version of the card](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/cardkit-upgraded-version-card-release-notes).
## Restrictions

- The Card JSON 2.0 structure does not support building and generating through the [Feishu Card Builder Tool](https://open.feishu.cn/cardkit?from=json_v2_structure). It only supports implementation through Card JSON code.
 - The Card JSON 2.0 structure supports up to 200 elements (e.g., text elements where `tag` is `plain_text`) or components for a card.

- Card Schema 2.0 structure is supported from Feishu client version 7.20 onwards. When a card using Schema v2.0 structure is sent to clients with versions lower than 7.20, the card title will display correctly, but the content will show fallback upgrade prompts.

## JSON structure

The following is the overall structure of Card JSON 2.0.
```JSON
{
    "schema": "2.0", // The version of the card JSON structure. The default is 1.0. To use the JSON 2.0 structure, you must explicitly declare 2.0.
    "config": {
        "streaming_mode": true, // Whether the card is in streaming update mode, the default value is false.
        "streaming_config": {}, // Streaming update configuration. For details, refer to the following.
        "summary": {  // Card summary information. This parameter can be used to customize the display text in the client chat bar message preview.
            "content": "Custom content", // Custom summary information. If the streaming update mode is enabled, this parameter will default to "Generating." You can also customize it.
            "i18n_content": { // Multi-language configuration of summary information. Learn about all supported languages. Refer to the multi-language configuration document for cards.
                "zh_cn": "",
                "en_us": "",
                "ja_jp": ""
            }
        },
        "locales": [ // New attribute in JSON 2.0. Used to specify effective languages. If locales are configured, only the languages in locales will be effective.
            "en_us",
            "ja_jp"
        ],
        "enable_forward": true, // Whether to support forwarding the card. The default value is true.
        "update_multi": true, // Whether it is a shared card. The default value is true. JSON 2.0 currently only supports setting it to true, which means that updating the card's content is visible to all recipients of the card.
        "width_mode": "fill", // Card width mode. Supports "compact" (compact width 400px) mode or "fill" (fills the width of the chat window) mode. The default width is 600px if not filled.
        "use_custom_translation": false, // Whether to use custom translation data. The default value is false. When true, after the user clicks on message translation, the corresponding target language of i18n is used as the translation result. If i18n is not available, the current content request translation is used, not custom translation data.
        "enable_forward_interaction": false, // Whether the forwarded card still supports interaction. The default value is false.
        "style": { // Add custom font size and color. Can be applied to component JSON data to set font size and color attributes.
            "text_size": { // Add custom font size for both mobile and desktop, and a fallback font size. Used to set font size attributes in component JSON. Supports adding multiple custom font size objects.
                "cus-0": {
                    "default": "medium", // The font size attribute that takes effect on older Feishu clients that cannot differentiate font size configurations. Optional.
                    "pc": "medium", // Font size for desktop.
                    "mobile": "large" // Font size for mobile.
                }
            },
            "color": { // Add RGBA syntax for both light and dark themes of the Feishu client. Used to set color attributes in component JSON. Supports adding multiple custom color objects.
                "cus-0": {
                    "light_mode": "rgba(5,157,178,0.52)", // Custom color syntax for light theme
                    "dark_mode": "rgba(78,23,108,0.49)" // Custom color syntax for dark theme
                }
            }
        }
    },
    "card_link": {
        // Specify the overall jump link of the card.
        "url": "https://www.baidu.com", // Default link address. This configuration takes effect when the specified endpoint address is not configured.
        "android_url": "https://developer.android.com/",
        "ios_url": "https://developer.apple.com/",
        "pc_url": "https://www.windows.com"
    },
    "header": {
        "title": {
            // Main title of the card. Required. To configure the title in multiple languages, refer to the multi-language configuration document for cards.
            "tag": "plain_text", // Text type tag. Optional values: plain_text and lark_md.
            "content": "Example title" // Title content.
        },
        "subtitle": {
            // Subtitle of the card. Optional.
            "tag": "plain_text", // Text type tag. Optional values: plain_text and lark_md.
            "content": "Example text" // Title content.
        },
        "text_tag_list": [
            // Suffix tags for the title, up to 3 tags can be set, more than that will not be displayed. Optional.
            {
                "tag": "text_tag",
                "element_id": "custom_id", // Unique identifier of the operation element. Used to specify the element when calling component-related interfaces. Customizable by the developer.
                "text": {
                    // Tag content
                    "tag": "plain_text",
                    "content": "Tag 1"
                },
                "color": "neutral" // Tag color
            }
        ],
        "i18n_text_tag_list": {
            //  Multi-language suffix tags for the title. Up to 3 tags can be set for each language environment, more than that will not be displayed. Optional. If both the original field and the internationalization field are configured, the multi-language configuration takes precedence.
            "zh_cn": [],
            "en_us": [],
            "ja_jp": [],
            "zh_hk": [],
            "zh_tw": []
        },
        "template": "blue", // Title theme style color. Supports "blue"|"wathet"|"turquoise"|"green"|"yellow"|"orange"|"red"|"carmine"|"violet"|"purple"|"indigo"|"grey"|"default". The default value is default.
        "icon": { // Prefix icon.
            "tag": "standard_icon", // Icon type.
            "token": "chat-forbidden_outlined", // Token of the icon. Only effective when the tag is standard_icon.
            "color": "orange", // Icon color. Only effective when the tag is standard_icon.
            "img_key": "img_v2_38811724" // Key of the image. Only effective when the tag is custom_icon.
        },
        "padding": "12px 8px 12px 8px" // Padding of the title component. New attribute in JSON 2.0. The default value is "12px", supports the range [0,99]px.
    },
    "body": { // Card body.
        // New layout attribute in JSON 2.0, used to control the arrangement of child elements:
        "direction": "vertical", // Arrangement direction of components within the body or container. Optional values: "vertical" (vertical arrangement), "horizontal" (horizontal arrangement). The default is "vertical".
        "padding": "12px 8px 12px 8px", // Padding of the body or container components, supports the range [0,99]px.
        "horizontal_spacing": "3px", // Horizontal spacing of components within the body or container, optional values: "small"(4px), "medium"(8px), "large"(12px), "extra_large"(16px) or [0,99]px.
        "horizontal_align": "left", // Horizontal alignment of components within the body or container, optional values: "left", "center", "right". The default value is "left".
        "vertical_spacing": "4px", // Vertical spacing of components within the body or container, optional values: "small"(4px), "medium"(8px), "large"(12px), "extra_large"(16px) or [0,99]px.
        "vertical_align": "center", // Vertical alignment of components within the body or container, optional values: "top", "center", "bottom". The default value is "top".
        "elements": [ // JSON data of each component is passed here, and the components are arranged vertically in a streaming manner according to the array order.
            {
                "tag": "xxx", // Tag of the component.
                "margin": "4px", // Margin of the component, the default value is "0", supports the range [-99,99]px. New attribute in JSON 2.0.
                "element_id": "custom_id" // Unique identifier of the operation component. New attribute in JSON 2.0. Used to specify the component when calling streaming update-related interfaces. Globally unique within the same card. Only letters, numbers, and underscores are allowed, must start with a letter, and must not exceed 20 characters.
            }
        ]
    }
}
```

## Field descriptions

This section provides detailed descriptions of each field in the card structure.

## Global properties

Global properties of the card include the following fields.

```json
{
    "schema": "2.0",
    "config": {},
    "card_link": {},
    "header": {},
    "body": {
        "elements": []
    }
}
```

The description is as follows.

If none of these fields are provided, the card JSON will be "{}". The Feishu Open Platform supports sending a blank card with the card JSON as "{}".

Field | Required | Description
---|---|---
schema | No | Version declaration of the card structure. The default is version 1.0. Optional values:<br>- 1.0: Card v1.0 structure. For details, refer to [Card JSON 1.0 Structure](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-structure).<br>- 2.0: Card v2.0 structure. Supports more fields and capabilities, such as card streaming update capabilities, more syntax for rich text components (markdown), etc. For details, refer to [Card JSON 2.0 Incompatible Changes & Updates](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-breaking-changes-release-notes).
config | No | Config is used to configure the global behavior of the card, including streaming update mode, whether forwarding is allowed, whether it is a shared card, etc.
card_link | No | The card_link field is used to specify the overall jump link of the card. You can configure a default link, or you can configure different jump links for the PC, Android, and iOS ends respectively.
header | No | Title component-related configuration. For details, refer to the [Title](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/title) component.
body | No | The card body, containing an array named elements, is used to place various components.

### Card global behavior settings `config`

The `config` field is used to configure the global behaviors of the card, including whether the card can be forwarded and whether it is a shared card.

```json
{
    "config": {
        "streaming_mode": true, // Whether the card is in streaming update mode, default is false.
        "summary": {  // Card summary information. This parameter can be used to customize the display text in the client chat bar message preview.
            "content": "Custom content", // Custom summary information. If the streaming update mode is enabled, this parameter will default to "Generating." You can also customize it.
            "i18n_content": { // Multilingual configuration of summary information. Learn about all supported languages. Refer to local internationalization.
                "zh_cn": "",
                "en_us": "",
                "ja_jp": ""
            }
        },
        "enable_forward": true, // Whether to support forwarding the card. The default value is true.
        "update_multi": true, // Whether it is a shared card. When true, the updated card content is visible to everyone who received this card. The default value is true.
        "width_mode": "fill", // Card width mode. Supports "compact" (compact width 400px) mode or "fill" (fills the chat window width) mode. The default width is 600px if not filled.
        "use_custom_translation": false, // Whether to use custom translation data. The default value is false. When true, after the user clicks on message translation, the i18n corresponding target language is used as the translation result. If i18n is not available, the current content request translation is used instead of custom translation data.
        "enable_forward_interaction": false, // Whether the forwarded card still supports return interaction. The default value is false.
        "style": { // Add custom font sizes and colors. Can be applied in component JSON data to set font size and color attributes.
            "text_size": { // Add custom font sizes for mobile and desktop separately, while adding fallback font sizes. Used to set font size attributes in component JSON. Supports adding multiple custom font size objects.
                "cus-0": {
                    "default": "medium", // Font size attribute effective on older Feishu clients that cannot differentiate font size. Optional.
                    "pc": "medium", // Font size on desktop.
                    "mobile": "large" // Font size on mobile.
                }
            },
            "color": { // Add RGBA syntax for light and dark themes of the Feishu client separately. Used to set color attributes in component JSON. Supports adding multiple custom color objects.
                "cus-0": {
                    "light_mode": "rgba(5,157,178,0.52)", // Custom color syntax in light theme.
                    "dark_mode": "rgba(78,23,108,0.49)" // Custom color syntax in dark theme.
                }
            }
        }
    }
}
```
The fields under config are described in the following table.

Field Name | Required | Type | Default Value | Description
---|---|---|---|---
streaming_mode | No | Boolean | false | Whether the card is in streaming update mode. Refer to [Streaming updates overview](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/streaming-updates-openapi-overview) for details.
summary | No | Object | / | Card summary information. This parameter can be used to customize the display text in the client chat bar message preview.
content | No | String | Generating | Summary text. When `streaming_mode` is true, this field defaults to "Generating".
i18n_content | No | Object | / | Multi-language configuration for summary text. Refer to partial internationalization configuration of cards for details.
enable_forward | No | Boolean | true | Whether to allow card forwarding. Values:<br>- true: Allow<br>- false: Do not allow
update_multi | No | Boolean | true | Whether it's a shared card. Values:<br>- true: Shared card, updates to the card are visible to all recipients of this card.<br>- false: Non-shared card, only the operating user can see updates to the card content.
width_mode | No | String | default | Card width mode. Values:<br>- default: Default width. The maximum width on PC and iPad is 600px.<br>- compact: Compact width 400px<br>- fill: Adaptive screen width<br>**Note**: The `width_mode` property is currently not supported in the Card Construction Tool.
use_custom_translation | No | Boolean | false | Whether to use custom translation data. Values:<br>- true: After the user clicks on message translation, use the target language corresponding to i18n as the translation result. If i18n is not available, use machine translation from Feishu.<br>- false: Do not use custom translation data, directly request machine translation from Feishu.
enable_forward_interaction | No | Boolean | false | Whether forwarded cards still support interactive feedback.
style | No | Object | Empty | Add custom font size and color. Can be applied to JSON data of components to set font size and color properties.
text_size | No | Object | Empty | Add custom font sizes for mobile and desktop separately, and add fallback font size. Used to set font size properties in JSON of plain text components and rich text (Markdown) components. Supports adding multiple custom font size objects. Refer to [Plain Text](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/plain-text) component and [Rich Text (Markdown)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/rich-text) component for details.
color | No | Object | Empty | Add RGBA syntax for light and dark themes of Feishu client. Used to set color properties in JSON of components. Supports adding multiple custom color objects. Refer to [Color Enumeration Values](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/enumerations-for-fields-related-to-color) for details.

### Card Global Jump Link card_link
The card_link field is used to specify the overall click-through link for the card. You can configure a default link or separate links for PC, Android, and iOS platforms.

```json
"card_link": {
    // Specifies the link for the card as a whole.
    "url": "https://www.baidu.com", // Default link address. This configuration takes effect when the specified end address is not configured.
    "android_url": "https://developer.android.com/",
    "ios_url": "https://developer.apple.com/",
    "pc_url": "https://www.windows.com"
  }
```
The descriptions of the fields under card_link are shown in the table below.
**Notice**：**Note**
-   Either `url` or platform-specific links (`android_url`, `ios_url`, `pc_url`) must be filled. If `url` is not filled, then `android_url`, `ios_url`, `pc_url` must be completely filled. If both `url` and platform-specific links (`android_url`, `ios_url`, `pc_url`) are filled, `url` takes effect.
- If you need to disable redirection for a specific platform, you can configure the corresponding parameter value as `lark://msgcard/unsupported_action`.

Field Name | Required | Type | Description
---|---|---|---
url | No | String | Default link address.
pc_url | No | String | Link address for PC platform.
ios_url | No | String | Link address for iOS platform.
android_url | No | String | Link address for Android platform.

### Card Title header
The header field is used to configure the title of the card. For details on the header field, refer to [Title](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/title)
```json
  "header": {}
```

### Card Body `body`

In the `body` field of the card, you need to add card components as the content of the card, and the components will be vertically arranged in a streaming manner according to the array order. For details on card components, refer to [component JSON v2.0 overview](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/component-json-v2-overview).

In the card JSON 2.0 structure, all components have a new `element_id` attribute, which serves as a unique identifier for interacting with components.
```json
{
    "body": { // Card body.
        "elements": [ // Pass JSON data for each component here, components will be vertically streamed in array order.
            {
                "tag": "xxx", // Tag of the component.
                "element_id": "custom_id" // Unique identifier for interacting with components. Must be globally unique within the same card. Only letters, numbers, and underscores are allowed. Must start with a letter and not exceed 20 characters.
            }
        ]
    }
}
```
