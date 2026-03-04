# Input Box Component

In scenarios where you use cards for content collection, you might need to gather subjective content from users, such as reasons, evaluations, remarks, etc. In such cases, you can use the input box component to facilitate simple text content collection. This document describes the JSON structure and related properties of the input box component.
**Notice**：To use the input box component in conjunction with the [button](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/interactive-components/button) component, you need to embed both the input box and the button within a [form container](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/containers/form-container).

## Precautions

- The input box is only supported on Feishu clients version V6.8 and above. On clients below this version, the content of the input box will default to a placeholder image stating "Please upgrade to the latest version of the client to view content." You can also customize the component's fallback display method via the card's `fallback` field.
- In the card JSON code, if the input box component is directly at the root node of the card, rather than nested within other components, you must configure its JSON data in the [Interaction Module](https://open.feishu.cn/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/component-list/common-components-and-elements) (`"tag": "action"`) under the `actions` field and delete the `required` field, otherwise an error will occur.

## Nesting Rules

The input box component can be nested within columns, form containers, accordion panels, and loop containers. Within a form container, the data of the input box component is submitted asynchronously, meaning that after the user completes all form items and clicks the button bound to the submit event in the form container, all data including the input box component data is sent back to the developer's server at once.

## Component Properties

### JSON Structure

Below is the card JSON data for an input box:
```json
{
  "tag": "input", // Label of the input box.
  "name": "input1", // Unique identifier for the input box. This attribute is effective when the input box is embedded in a form container, used to identify which input box the user-submitted text belongs to.
  "required": false, // Whether the content of the input box is required. This attribute is available when the input box is embedded in a form container. In other cases, it will result in an error or will not be effective.
  "disabled": false, // Whether to disable the input box component. Default is false.
  "placeholder": {
    // Placeholder text in the input box.
    "tag": "plain_text",
    "content": "Please enter"
  },
  "default_value": "demo", // Default pre-filled content for the user in the input box.
  "width": "default", // Width of the input box.
  "max_length": 5, // Maximum text length that the input box can accommodate. Default value is 1000.
  "input_type": "multiline_text", // Specifies the input type of the input box. The default is text, which means text type.
  "rows": 1, // When the input type is multiline text, the default number of display rows of the input box.
  "auto_resize": true, // When the input type is multiline text, whether the height of the input box is automatically adjusted to the height of the text. Only effective on PC.
  "max_rows": 5, The maximum number of display rows of the input box. Only effective when `auto_resize` is true.
  "show_icon": false, // Whether to display the prefix icon when the input type is password type.

"label": {
    // Text label, i.e., the description of the input box, used to prompt the user about the content to fill in.
    "tag": "plain_text",
    "content": "Please enter text:"
  },
  "label_position": "left", // Position of the text label. Default value is top.
  "value": {
    // Data to be passed back, supports string or object data types.
    "k": "v"
  },
  "confirm": {
    // Configuration for the confirmation popup.
    "title": {
      "tag": "plain_text",
      "content": "title"
    },
    "text": {
      "tag": "plain_text",
      "content": "content"
    }
  },
  "fallback": {
    // Set the fallback text for the input box component.
    "tag": "fallback_text", // Label for the fallback text.
    "text": {
      "content": "Custom statement", // Specific content of the custom fallback text.
      "tag": "plain_text" // Label for the content of the fallback text.
    }
  }
}
```

## Field Explanation
The input box component fields are explained in the following table:

Field Name | Required | Type | Default Value | Description
---|---|---|---|---
tag | Yes | String | Empty | Label of the input box. The fixed value is `input`.
name | No | String | Empty | Unique identifier of the input box. Effective when embedded in a form container, it identifies which input box the user-submitted text belongs to.<br>**Note**: When the input box component is nested within a form container, this field is required and must be unique globally within the card.
required | No | Boolean | false | Indicates whether the input box content is required. Available when embedded in a form container. In other cases, it will error out or be ineffective. Possible values:<br>- true: Input box is required. If not filled when the user clicks "submit" in the form container, the frontend will prompt "Required item not filled," and no request will be made to the developer's server.<br>- false: Input box is optional. Data is still submitted even if the input box is unfilled when the user clicks "submit" in the form container.
disabled | No | Boolean | false | Whether the input box is disabled. This attribute only supports Feishu V7.4 and above. Possible values:<br>- true: Input box is disabled<br>- false: Input box remains enabled
placeholder | No | text structure | / | Placeholder text within the input box.
└ tag | No | String | plain_text | Label for the placeholder text. The fixed value is plain_text.
└ content | No | String | Please enter | The content of the placeholder text, supporting up to 100 characters. For example, "Please enter content."
default_value | No | String | This property is not activated by default. | Pre-filled content for the user in the input box. It displays as the style of text entered by the user and is pending submission.
width | No | String | default | Width of the input box. Supports the following values:<br>- default: Default width<br>- fill: Maximum width supported by the card<br>- Custom width [100,∞)px: If it exceeds the card width, it will be displayed at the maximum supported width
max_length | No | Number | 1,000 | Maximum text length the input box can accommodate, within the range of 1 to 1,000. If the user's text exceeds this length, the component will display an error prompt.
input_type | No | String | text | Specifies the input type of the input box. The default is text, which means text type. Supports the following enumeration values:<br>- text: ordinary text<br>- multiline_text: multiline text, which allows entering multiline text content containing line breaks. Line breaks are returned as `\n` in the callback.<br>- password: password. The text entered by the user will be displayed as "•".
show_icon | No | Boolean | true | Whether to display the prefix icon shown below when the input type is password. Only effective when `input_type` is password.<br>![image.png](//sf3-cn.feishucdn.com/obj/open-platform-opendoc/3cb2d826d9e86ce6e260b0e78c23c830_wWBdvVSdSu.png?height=74&lazyload=true&width=450)
rows | No | Number | 5 | When the input type is multiline text, the default number of display rows of the input box. Only effective when `input_type` is multiline_text.
auto_resize | No | Boolean | false | When the input type is multiline text, whether the height of the input box is automatically adjusted to the height of the text. Only effective on PC. Only effective when `input_type` is multiline_text. Optional values:<br>- `true`: The height of the input box adapts to the height of the text in the input box.<br>- `false`: The height of the input box is fixed to the height specified by the `rows` attribute and does not change with the content in the input box.
max_rows | No | Number | None | The maximum number of display rows of the input box. Only effective when `auto_resize` is true.<br>Note:<br>- The value should be an integer greater than or equal to 1. If it is less than 1, it will automatically be set to 1. If it is not an integer, it will be rounded.<br>- If the value is empty, there is no limit to the maximum display height of the input box (default value), but the maximum height that the input box can display during front-end rendering does not exceed x rows.
label | No | text structure | This property is not activated by default. | Text label, i.e., the description of the input box, used to prompt the user on what content to fill in. Mostly used in input box components embedded within form containers.
└ tag | No | String | plain_text | Label for the input box description. The fixed value is plain_text.
└ content | No | String | / | Description content.
label_position | No | String | top | Position of the text label. Possible values:<br>- top: Text label is above the input box<br>- left: Text label is to the left of the input box<br>**Note**:<br>In mobile and other narrow screen scenarios, the text label will automatically adjust to be fixed above the input box.
value | No | String or Object | Empty | You can customize the data to be passed back during interaction events, supports string or object data types.
confirm | No | Struct | This property is not activated by default. | Configuration for the confirmation popup. Refers to a popup that appears upon submission; content is submitted only after the user clicks confirm. This field provides confirm and cancel buttons by default, you only need to configure the popup's title and content.<br>**Note**: The confirm field is only triggered when the user clicks a button containing the submit property.
└ title | Yes | Struct | / | Title of the confirmation popup.
└ └ tag | Yes | String | plain_text | Label for the confirmation popup's title text. The fixed value is plain_text.
└ └ content | Yes | String | / | Content of the confirmation popup's title.
└ text | Yes | Struct | / | Content of the confirmation popup's text.
└ └ tag | Yes | String | plain_text | Label for the confirmation popup text. The fixed value is plain_text.
└ └ content | Yes | String | / | Specific content of the confirmation popup text.
fallback | No | Fallback Object | / | Set the fallback text for the input box component. As the input box is only supported on Feishu V6.8 and above versions of the client, you need to choose the component's fallback display method on clients below this version:<br>- Do not fill this field, use the system default fallback text: "Please upgrade to the latest version of the client to view content."<br>- `"drop"`: Fill in `"drop"` to discard the input box component on older client versions.<br>- Use a text object to customize the fallback text.
└ tag | No | String | fallback_text | Label for the fallback text, fixed value is `fallback_text`.
└ text | No | Struct | / | Content of the fallback text.
└ └ tag | No | String | plain_text | Label for the content of the fallback text, fixed value is `plain_text`.
└ └ content | No | String | Empty | Specific content of the custom fallback text.

## Callback Structure
To use the input box component, you need to enable interactivity for your card. For more details, refer to [Configuring Card Interactions](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/configuring-card-interactions). After configuration, when a user clicks the submit button in the input box, the interaction event will be passed back as shown below. If the input box is embedded in a form container, you can refer to the callback structure of the [Form Container](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/containers/form-container) to understand the callback of the input box. You can also refer to [Card Callback Communication](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-callback-communication) for more explanations of the parameters.

```json
{
    "schema": "2.0", // Version of the callback
    "header": { // Basic information of the callback
        "event_id": "f7984f25108f8137722bb63c*****", // Unique identifier of the callback
        "token": "066zT6pS4QCbgj5Do145GfDbbag*****", // Application's Verification Token
        "create_time": "1603977298000000", // Time when the callback was sent, close to the time when the event occurred
        "event_type": "card.action.trigger", // Type of the callback, fixed for card interaction scenarios as "card.action.trigger"
        "tenant_key": "2df73991750*****", // Tenant key to which the application belongs, i.e., the unique identifier of the tenant
        "app_id": "cli_a5fb0ae6a4******" // App ID of the application
    },
    "event": { // Detailed information of the callback
        "operator": { // Information of the callback initiator
            "tenant_key": "2df73991750*****", // Tenant key of the callback initiator, i.e., the unique identifier of the tenant
            "user_id": "867*****", // User ID of the callback initiator. This parameter returns when the application enables the "Obtain User ID" permission
            "open_id": "ou_3c14f3a59eaf2825dbe25359f15*****" // Open ID of the callback initiator
        },
        "token": "c-295ee57216a5dc9de90fefd0aadb4b1d7d******", // Token for updating the card, valid for 30 minutes, can be updated up to 2 times
        "action": { // Data passed back by the user operating the interaction component
            "value": { // Custom data passed back in the interaction event, corresponding to the value attribute in the component
                "key": "value"
            },
            "tag": "input", // Label of the input box component
            "input_value": "Zhang Min"  // Data submitted by the user in the input box
            "name": "Input_lf4fmxwfrd9" // Name of the input box component, i.e., the component ID in the building tool, customizable
        },
        "host": "im_message", // Scenario where the card is displayed
        "context": { // Information related to the card display scenario
            "open_message_id": "om_574d639e4a44e4dd646eaf628e2*****", // Message ID where the card is located
            "open_chat_id": "oc_e4d2605ca917e695f54f11aaf56*****" // Chat ID where the card is located
        }
    }
}
```

## Sample Code
The following JSON sample code can achieve the card effect as shown in the image below. The card consists of a form container with three embedded input box components:

![image.png](//sf3-cn.feishucdn.com/obj/open-platform-opendoc/5678dab3ae875312a7b55b18067790ca_dVmySAYLmB.png?height=565&lazyload=true&maxWidth=400&width=696)

```json
{
    "config": {
        "width_mode": "compact"
    },
    "card_link": {
        "url": "",
        "pc_url": "",
        "ios_url": "",
        "android_url": ""
    },
    "i18n_elements": {
        "zh_cn": [
            {
                "tag": "form",
                "elements": [
                    {
                        "tag": "input",
                        "placeholder": {
                            "tag": "plain_text",
                            "content": "请输入"
                        },
                        "default_value": "",
                        "width": "default",
                        "label": {
                            "tag": "plain_text",
                            "content": "用户名："
                        },
                        "name": "Input_31q6mtuvdx9",
                        "fallback": {
                            "tag": "fallback_text",
                            "text": {
                                "tag": "plain_text",
                                "content": "仅支持在 V6.8 及以上版本使用"
                            }
                        }
                    },
                    {
                        "tag": "input",
                        "input_type": "password",
                        "placeholder": {
                            "tag": "plain_text",
                            "content": "请输入"
                        },
                        "default_value": "",
                        "width": "default",
                        "label": {
                            "tag": "plain_text",
                            "content": "密码："
                        },
                        "label_position": "top",
                        "name": "Input_5hez3q41fck",
                        "fallback": {
                            "tag": "fallback_text",
                            "text": {
                                "tag": "plain_text",
                                "content": "仅支持在 V6.8 及以上版本使用"
                            }
                        }
                    },
                    {
                        "tag": "input",
                        "input_type": "multiline_text",
                        "rows": 4,
                        "auto_resize": true,
                        "placeholder": {
                            "tag": "plain_text",
                            "content": "请输入"
                        },
                        "default_value": "",
                        "width": "default",
                        "label": {
                            "tag": "plain_text",
                            "content": "收货地址："
                        },
                        "name": "Input_u2k3lbrokvd",
                        "fallback": {
                            "tag": "fallback_text",
                            "text": {
                                "tag": "plain_text",
                                "content": "仅支持在 V6.8 及以上版本使用"
                            }
                        }
                    },
                    {
                        "tag": "column_set",
                        "flex_mode": "none",
                        "background_style": "default",
                        "horizontal_spacing": "default",
                        "columns": [
                            {
                                "tag": "column",
                                "width": "auto",
                                "vertical_align": "top",
                                "elements": [
                                    {
                                        "tag": "button",
                                        "text": {
                                            "tag": "plain_text",
                                            "content": "提交"
                                        },
                                        "type": "primary",
                                        "complex_interaction": true,
                                        "action_type": "form_submit",
                                        "name": "Button_lrocopxs"
                                    }
                                ]
                            },
                            {
                                "tag": "column",
                                "width": "auto",
                                "vertical_align": "top",
                                "elements": [
                                    {
                                        "tag": "button",
                                        "text": {
                                            "tag": "plain_text",
                                            "content": "取消"
                                        },
                                        "type": "default",
                                        "complex_interaction": true,
                                        "action_type": "form_reset",
                                        "name": "Button_lrocopxt"
                                    }
                                ]
                            }
                        ],
                        "margin": "0px"
                    }
                ],
                "name": "Form_lrocopxr",
                "fallback": {
                    "tag": "fallback_text",
                    "text": {
                        "tag": "plain_text",
                        "content": "仅支持在 V6.6 及以上版本使用"
                    }
                }
            }
        ]
    },
    "i18n_header": {}
}
```