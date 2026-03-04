# Button Component

The button component is an interactive component that supports multiple styles and sizes, and it supports adding icons as prefix icons. This document introduces the JSON structure and related properties of the button component.

## Notes

- In the [Card JSON 1.0 Structure](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-structure), if a button component is placed directly under the card's root node rather than nested within other components, you need to configure its JSON data in the [Interactive Module](https://open.feishu.cn/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements) (with `"tag": "action"`) under the `actions` field.

- The [Card JSON 2.0 Structure](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure) no longer supports attributes related to the [Interactive Module](https://open.feishu.cn/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements) (with `"tag": "action"`). You can directly place buttons in the `elements` field and configure appropriate [component spacing (vertical_spacing and horizontal_spacing)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-breaking-changes-release-notes#a967672) as needed.

## Nesting Rules

The button component supports being nested in columns, form containers, collapsible panels, and loop containers.

## Component Properties

### JSON Structure

Here is an example of button card JSON data:

```json
{
  "tag": "button", // The tag of the component. The fixed value for the button component is button.
  "type": "primary", // The type of the button. Default is default.
  "size": "small", // The size of the button. Default is medium.
  "width": "default", // The width of the button. Default is default.
  "text": {
    // The text on the button.
    "tag": "plain_text",
    "content": "Confirm"
  },
  "icon": {
    // Prefix icon.
    "tag": "standard_icon", // The icon type.
    "token": "chat-forbidden_outlined", // The token of the icon. Only effective when the tag is standard_icon.
    "color": "orange", // The color of the icon. Only effective when the tag is standard_icon.
    "img_key": "img_v2_38811724" // The key of the image. Only effective when the tag is custom_icon.
  },
  "hover_tips": {}, // Text prompt when the user hovers over the button on the PC side. Default is empty.
  "disabled": false, // Whether to disable the button. Default is false.
  "disabled_tips": {}, // Text prompt when the button is disabled and the user hovers over it on the PC side. When this field is effective, hover_tips will not be effective.
  "confirm": {
    // Configuration of the confirmation popup
    "title": {
      "tag": "plain_text",
      "content": "Title"
    },
    "text": {
      "tag": "plain_text",
      "content": "Content"
    }
  },
  "behaviors": [
    {
      "type": "open_url", // Declare the interaction type as a jump interaction to open the link
      "default_url": "https://www.baidu.com", // Default jump address
      "android_url": "https://developer.android.com/", // Android jump address
      "ios_url": "lark://msgcard/unsupported_action", // iOS jump address.
      "pc_url": "https://www.windows.com" // Desktop jump address
    },
    {
      "type": "callback", // Declare the interaction type as a callback interaction to pass data back to the server.
      "value": {
        // Callback interaction data. Supports string or object data types.
        "key": "value"
      }
    },
    {
      "type": "form_action", // Declare the interaction type as a form event.
      "behavior": "submit" // Declare the form event type. Default is submit.
    }
  ],
  // Historical attributes
  "url": "https://open.feishu.cn",
  "multi_url": {
    "android_url": "https://open.feishu.cn",
    "ios_url": "https://open.feishu.cn",
    "pc_url": "https://open.feishu.cn"
  },
  "value": {
    "key_1": "value_1"
  }
}
```

## Field Descriptions
The descriptions of each field of the button component are shown in the table below:

Field Name | Required | Type | Default Value | Description
---|---|---|---|---
tag | Yes | String | / | The tag of the component. The fixed value for the button component is button.
type | No | String | default | The type of the button. Options include:<br>- default: black font button with border<br>- primary: blue font button with border<br>- danger: red font button with border<br>- text: black font button without border<br>- primary_text: blue font button without border<br>- danger_text: red font button without border<br>- primary_filled: blue background white font button<br>- danger_filled: red background white font button<br>- laser: laser button
size | No | String | medium | The size of the button. Options include:<br>- tiny: ultra-small size, 24 px for PC and 28 px for mobile<br>- small: small size, 28 px for PC and 28 px for mobile<br>- medium: medium size, 32 px for PC and 36 px for mobile<br>- large: large size, 40 px for PC and 48 px for mobile
width | No | String | default | The width of the button. Supports the following enumerated values:<br>- default: default width<br>- fill: maximum supported width of the card<br>- [100,∞)px: custom width, such as 120px. When exceeding the width of the card, it will be displayed according to the maximum supported width
text | No | Struct | / | The text on the button. Supports plain text and custom text.
icon | No | Struct | / | Prefix icon. Supports standard icons and custom icons.
hover_tips | No | Struct | / | Text reminder when the user hovers over the button on the PC side. Default is empty.
disabled | No | Boolean | false | Whether to disable the button. Default is false.
disabled_tips | No | Struct | / | Text reminder when the button is disabled and the user hovers over the button on the PC side. When this field is effective, hover_tips is no longer effective.
confirm | No | Struct | / | Double confirmation dialog box configuration.<br>**Note**:<br>To configure the confirm popup, the `title` field is required. Otherwise, the historical version of the Feishu client may have the problem of unresponsive button clicks.
behaviors | No | Array | / | Interaction behavior. Supports multiple interaction types, including open_url, callback, and form_action.

The following is historical attributes supporting interaction.

Field Name | Required | Type | Default Value | Description
---|---|---|---|---
url | No | String | / | The redirection link after clicking the button. This field cannot be set simultaneously with the `multi_url` field.
multi_url | No | Struct | / | Configure multi-endpoint redirection links based on the url element. For details, refer to the [url element](https://open.feishu.cn/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements#09a320b3) in the old version documentation. This field cannot be set simultaneously with the `url` field.
value | No | JSON | / | This field is used to configure interactive callbacks. When users click on the interactive component, the value of `value` will be returned to the server that receives callback data. Subsequently, you can process business logic based on the received `value` from the server.<br>The value of this field only supports key-value JSON structures, and the key is of type String. Example value:<br>```json<br>"value":{<br>"key-1":Object-1,<br>"key-2":Object-2,<br>"key-3":Object-3,<br>······<br>}<br>```
complex_interaction | No | Boolean | false | Whether to enable both the redirection link interaction and the callback interaction configured by the historical fields above. By default, only the redirection link interaction takes effect.
Buttons embedded in form containers have added name, required, and action_type attributes. Detailed explanations are shown in the table below.<br>Attribute Name | Required | Type | Default Value | Description
name | Yes | String | Empty | The unique identifier for components within the form container. Used to identify which component the submitted data belongs to by the user.<br>**Note**: This field is required and must be unique within the card globally.
required | No | Boolean | false | Whether the content of the component is required. When the component is embedded in a form container, this attribute takes effect. Possible values are:<br>**true**: Required. When the user clicks "submit" in the form container, if this component is not filled, the frontend will prompt "required items not filled" without sending a callback request to the developer's server.<br>**false**: Optional. When the user clicks "submit" in the form container, if this component is not filled, the form container data will still be submitted.
action_type | Yes | String | Empty | The interaction type of the button embedded in the form container. Enumeration values include:<br><code>link</code>: The current button only supports link redirection</li><br><li><code>request</code>: The current button only supports callback interaction</li><br><li><code>multi</code>: The current button supports both link redirection and callback interaction simultaneously</li><br><li><code>form_submit</code>: Binds the current button with the submit event. When the user clicks, it triggers the submission event of the form container and asynchronously submits all filled form items' contents</li><br><li><code>form_reset</code>: Binds the current button with the cancel submission event. When the user clicks, it triggers the cancellation submission event of the form container and resets the input values of all form components to their initial values</li>

## Callback Structure

After successfully configuring interaction for the button component, when users interact with the button component, the callback data will be sent to the request address configured in the developer console.

- If you have added the callback for the new version card action trigger (`card.action.trigger`), you can refer to [Card Callback Interaction](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-callback-communication) for the callback structure.
- If you have added the callback for the old version card action trigger (`card.action.trigger_v1`), you can refer to [Message Card Callback Interaction (Old)](https://open.feishu.cn/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/configuring-card-callbacks/card-callback-structure) for the callback structure.

## Sample Code

The following JSON sample code can achieve the button effect as shown in the figure.

![](//sf3-cn.feishucdn.com/obj/open-platform-opendoc/fae9d121af371a94a077fbc09943b35c_A9IfJJ2S1b.png?height=324&lazyload=true&maxWidth=500&width=999)

```json
{
  "header": {
    "template": "blue",
    "title": {
      "content": "Buttons",
      "tag": "plain_text"
    }
  },
  "elements": [
    {
      "tag": "column_set",
      "flex_mode": "flow",
      "background_style": "default",
      "columns": [
        {
          "tag": "column",
          "width": "auto",
          "weight": 1,
          "vertical_align": "top",
          "elements": [
            {
              "tag": "button",
              "text": {
                "tag": "plain_text",
                "content": "镭射按钮"
              },
              "behaviors": [
                {
                  "type": "open_url",
                  "default_url": "https://open.feishu.cn/document",
                  "android_url": "https://developer.android.com/",
                  "ios_url": "lark://msgcard/unsupported_action",
                  "pc_url": "https://www.windows.com"
                }
              ],
              "type": "laser",
              "hover_tips": {
                "tag": "plain_text",
                "content": "hover提示"
              },
              "value": {
                "key": "value"
              }
            }
          ]
        },
        {
          "tag": "column",
          "width": "auto",
          "weight": 1,
          "vertical_align": "top",
          "elements": [
            {
              "tag": "button",
              "type": "laser",
              "text": {
                "tag": "plain_text",
                "content": "镭射禁用按钮"
              },
              "disabled": true,
              "disabled_tips": {
                "tag": "plain_text",
                "content": "禁用 hover 提示"
              },
              "behaviors": [
                {
                  "type": "open_url",
                  "default_url": "https://open.feishu.cn/document",
                  "android_url": "https://developer.android.com/",
                  "ios_url": "lark://msgcard/unsupported_action",
                  "pc_url": "https://www.windows.com"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "column_set",
      "flex_mode": "flow",
      "background_style": "default",
      "columns": [
        {
          "tag": "column",
          "width": "auto",
          "weight": 1,
          "vertical_align": "top",
          "elements": [
            {
              "tag": "button",
              "text": {
                "tag": "plain_text",
                "content": "primary"
              },
              "url": "https://open.feishu.cn/document",
              "type": "primary",
              "hover_tips": {
                "tag": "plain_text",
                "content": "我是 primary button"
              },
              "value": {
                "key": "value"
              }
            }
          ]
        },
        {
          "tag": "column",
          "width": "auto",
          "weight": 1,
          "vertical_align": "top",
          "elements": [
            {
              "tag": "button",
              "type": "default",
              "text": {
                "tag": "plain_text",
                "content": "default"
              },
              "hover_tips": {
                "tag": "plain_text",
                "content": "我是 default 按钮"
              },
              "behaviors": [
                {
                  "type": "open_url",
                  "default_url": "https://open.feishu.cn/document",
                  "android_url": "https://developer.android.com/",
                  "ios_url": "lark://msgcard/unsupported_action",
                  "pc_url": "https://www.windows.com"
                }
              ]
            }
          ]
        },
        {
          "tag": "column",
          "width": "auto",
          "weight": 1,
          "vertical_align": "top",
          "elements": [
            {
              "tag": "button",
              "type": "danger",
              "text": {
                "tag": "plain_text",
                "content": "我是 danger 按钮"
              },
              "hover_tips": {
                "tag": "plain_text",
                "content": "我是 danger 按钮"
              },
              "behaviors": [
                {
                  "type": "open_url",
                  "default_url": "https://open.feishu.cn/document",
                  "android_url": "https://developer.android.com/",
                  "ios_url": "lark://msgcard/unsupported_action",
                  "pc_url": "https://www.windows.com"
                }
              ]
            }
          ]
        },
        {
          "tag": "column",
          "width": "auto",
          "weight": 1,
          "vertical_align": "top",
          "elements": [
            {
              "tag": "button",
              "type": "danger",
              "text": {
                "tag": "plain_text",
                "content": "我是 disabled 按钮"
              },
              "disabled": true,
              "disabled_tips": {
                "tag": "plain_text",
                "content": "我是 disabled 按钮，我被禁用了"
              },
              "behaviors": [
                {
                  "type": "open_url",
                  "default_url": "https://open.feishu.cn/document",
                  "android_url": "https://developer.android.com/",
                  "ios_url": "lark://msgcard/unsupported_action",
                  "pc_url": "https://www.windows.com"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```