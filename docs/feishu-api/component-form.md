# Form container

When using cards to collect content, there may be scenarios where users need to submit multiple form items. The form container allows users to locally enter a batch of form items at the frontend, and by clicking the **Submit** button once, all locally cached form content is asynchronously called back to the developer's server, achieving the effect of asynchronously submitting multiple form item data.

This document introduces the JSON 2.0 structure of the form container. To view the historical JSON 1.0 structure, refer to [Form Container](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/containers/form-container).
## Precautions

Container type components support up to five levels of nesting. It is recommended to avoid multiple layers of nesting within the form container. Excessive nesting compresses the display space and affects the presentation of the card. If you wish to handle more complex form content, it is recommended to implement form capabilities via card links to H5 or mini-programs.

## Nesting rules

In the [Card JSON 2.0 Structure](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure):

- Form containers do not support embedding table (`table`) and form container components.
-   Form container components cannot be embedded within other components and can only be placed under the root node of the card.
## Component properties

This section introduces the properties of the form container.

### JSON structure

The following is the JSON 2.0 structure of the form container card. In this structure, a form container embeds an input field component and a submit button bound to a submit event:

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "form", // Form container tag.
        "element_id": "custom_id", // Unique identifier for the operation component. Used to specify the component when calling component-related interfaces. Must be customized by the developer.
        "direction": "horizontal", // Arrangement direction of components within the container. Optional values: "vertical" (vertical arrangement), "horizontal" (horizontal arrangement). Default is "vertical".
        "horizontal_spacing": "8px", // Spacing between components within the container. Optional values: "small" (4px), "medium" (8px), "large" (12px), "extra_large" (16px) or [0,99]px.
        "vertical_spacing": "8px", // Vertical spacing of components within the container. Optional values: "small" (4px), "medium" (8px), "large" (12px), "extra_large" (16px) or [0,99]px.
        "horizontal_align": "left", // Horizontal alignment of components within the container. Default value is left.
        "vertical_align": "top", // Vertical alignment of components within the container. Optional values: "top", "center", "bottom". Default value is "top".
        "padding": "4px 0px 4px 0px", // Padding of the container. Default value is 0px. Supported range is [0,99]px.
        "margin": "0px 0px 0px 0px", // Margin of the container. Default value is "0". Supported range is [-99,99]px.
        "name": "form_1", // Unique identifier of the form container. Used to identify which form container's data is being submitted after user interaction.
        "elements": [
          {
            "tag": "input", // Add an input box component within the form container.
            "name": "reason", // Unique identifier of the input box component. Used to identify which form item data is being submitted after user interaction. This field is required for all interactive components within the form container, otherwise the data will fail to send.
            "required": true // Whether it is required. If true, a required validation will be performed after clicking the button.
          },
          {
            "tag": "column_set", // Nested column component within the form container. Used to place "Submit" and "Cancel" buttons.
            "columns": [
              { // Column within the column container.
                "tag": "column", // First column within the column component.
                "width": "auto", // Column width setting. Auto is adaptive.
                "elements": [ // Components nested within the column container.
                  {
                    "tag": "button", // Add a button component for submitting data. There must be at least one button with the submit attribute in the form container.
                    "type": "primary", // Button style type.
                    "text": { // Text on the button.
                      "tag": "plain_text",
                      "content": "Submit"
                    },
                    "behaviors": [ // Add open link interaction event or request callback interaction for the button.
                      {
                        "type": "open_url", // Declare that the interaction type of the button is an open link jump interaction.
                        "default_url": "https://www.baidu.com", // Fallback jump address.
                        "android_url": "https://developer.android.com/", // Android jump address.
                        "ios_url": "lark://msgcard/unsupported_action", // iOS jump address.
                        "pc_url": "https://www.windows.com" // Desktop jump address.
                      },
                      {
                        "type": "callback", // Declare that the interaction type is a request callback interaction that returns data to the server.
                        "value": {
                          // Return interaction data
                          "key": "value"
                        }
                      }
                    ],
                    "form_action_type": "submit", // Bind the current button to the submit event. When the user clicks, it will trigger the submit event of the form container and asynchronously submit all filled form item content. There must be at least one button with the submit attribute in the form container.
                    "name": "Button_m8pn9lbf" // Unique identifier of the button component. Used to identify which button was clicked after user interaction. This field is required for all interactive components within the form container, otherwise the data will fail to send.
                  }
                ]
              },
              {
                "tag": "column", // Second column within the column component.
                "width": "auto", // Column width setting. Auto is adaptive.
                "elements": [ // Components nested within the column container.
                  {
                    "tag": "button", // Add a button component to clear the filled content.
                    "type": "default", // The style type of the button. default is the secondary button style.
                    "text": { // Text on the button.
                      "tag": "plain_text",
                      "content": "Cancel"
                    },
                    "behaviors": [
                      {
                        "type": "open_url", // Declare the interaction type as a link opening interaction.
                        "default_url": "https://www.baidu.com", // Fallback URL.
                        "android_url": "https://developer.android.com/", // Android URL.
                        "ios_url": "lark://msgcard/unsupported_action", // iOS URL.
                        "pc_url": "https://www.windows.com" // Desktop URL.
                      },
                      {
                        "type": "callback", // Declare the interaction type as a data callback to the server.
                        "value": {
                          // Callback interaction data
                          "key": "value"
                        }
                      }
                    ],
                    "form_action_type": "reset", // Set the current button to reset. When clicked, all filled form items will be reset.
                    "name": "Button_m8pn9lbg" // The unique identifier of the button component, used to identify which button the user clicked after interaction. This field is mandatory in all interactive components within the form container, otherwise data will fail to send.
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Field description

The field descriptions for the form container are shown in the table below:

Name | Required | Type | Default value | Description
---|---|---|---|---
tag | Yes | String | / | Tag of the form container. Fixed value is `form`.
element_id | No | String | Empty | Unique identifier of the operation component. Newly added attribute in JSON 2.0. Used to specify the component when calling [related component interfaces](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/create). The value of this field must be globally unique within the same card. Only letters, numbers, and underscores are allowed, must start with a letter, and must not exceed 20 characters.
direction | No | String | vertical | Arrangement direction of components within the container. Optional values:<br>- vertical: vertical arrangement<br>- horizontal: horizontal arrangement
margin | No | String | 0px | Outer margin of the container. The value range is [-99,99]px. Optional values:<br>- Single value, such as "10px", indicates that all four outer margins of the container are 10 px.<br>- Double value, such as "4px 0", indicates that the top and bottom outer margins of the container are 4 px, and the left and right outer margins are 0 px. Separated by spaces (units can be omitted when the margin is 0).<br>- Multiple values, such as "4px 0 4px 0", indicates that the top, right, bottom, and left outer margins of the container are 4px, 12px, 4px, and 12px, respectively. Separated by spaces.
padding | No | String | 0px | Inner padding of the container. The value range is [-99,99]px. Optional values:<br>- Single value, such as "10px", indicates that all four inner margins of the container are 10 px.<br>- Double value, such as "4px 0", indicates that the top and bottom inner margins of the container are 4 px, and the left and right inner margins are 0 px. Separated by spaces (units can be omitted when the margin is 0).<br>- Multiple values, such as "4px 0 4px 0", indicates that the top, right, bottom, and left inner margins of the container are 4px, 12px, 4px, and 12px, respectively. Separated by spaces.
horizontal_spacing | No | String | 8px | Horizontal spacing between components within the container. Optional values:<br>- small: small spacing, 4px<br>- medium: medium spacing, 8px<br>- large: large spacing, 12px<br>- extra_large: extra-large spacing, 16px<br>- Specific value, such as 20px. The value range is [0,99]px
horizontal_align | No | String | left | Horizontal alignment of components within the container. Optional values:<br>- left: left alignment<br>- center: center alignment<br>- right: right alignment
vertical_align | No | String | top | Vertical alignment of components within the container. Optional values:<br>- top: top alignment<br>- center: center alignment<br>- bottom: bottom alignment
vertical_spacing | No | String | 12px | Vertical spacing between components within the container. Optional values:<br>- small: small spacing, 4px<br>- medium: medium spacing, 8px<br>- large: large spacing, 12px<br>- extra_large: extra-large spacing, 16px<br>- Specific value, such as 20px. The value range is [0,99]px
name | Yes | String | None | Unique identifier of the form container. Used to identify which form container the user-submitted data belongs to. The value of this field must be globally unique within the same card.
elements | Yes | Array&lt;element&gt; | [] | Child nodes of the form container. Other container components and display, interactive components can be nested, but table, chart, and form container components cannot be nested.
└ tag | Yes | String | None | The labels of components embedded in the form container support all components except tables and form containers.<br>**Note**: The form container must contain a [button](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/button) component for submitting the form.
└ name | Yes | String | None | Unique identifier of the component within the form container. Used to identify which component the user-submitted data belongs to.<br>**Note**:<br>This field is required for all interactive components in the form container and must be globally unique within the card; otherwise, the data submission will fail.
└ required | No | Boolean | false | Whether the content of the component is required. This attribute is effective when the component is embedded in the form container. Optional values:<br>- **true**: Required. When the user clicks "Submit" on the form container, if this component is not filled out, the frontend will prompt "There are required fields not filled out" and will not initiate a callback request to the developer's server.<br>- **false**: Optional. When the user clicks "Submit" on the form container, if this component is not filled out, the data in the form container will still be submitted.
└ form_action_type | Yes | String | None | The interaction type of the button embedded in the form container. Enumerated values include:<br>- <code>submit</code>: Binds the current button to the submit event. When the user clicks it, the submit event of the form container will be triggered, asynchronously submitting all filled form items<br>- <code>reset</code>: Binds the current button to the cancel submit event. When the user clicks it, the cancel submit event of the form container will be triggered, resetting all form component input values to their initial values
└ action_type (deprecated) | No | String | None | The interaction type of the button embedded in the form container. Enumerated values include:<br>- <code>link</code>: The current button only supports link jumps<br>- <code>request</code>: The current button only supports callback interactions<br>- <code>multi</code>: The current button supports both link jumps and callback interactions<br>- <code>form_submit</code>: Binds the current button to the submit event. When the user clicks it, the submit event of the form container will be triggered, asynchronously submitting all filled form items<br>- <code>form_reset</code>: Binds the current button to the cancel submit event. When the user clicks it, the cancel submit event of the form container will be triggered, resetting all form component input values to their initial values<br>**Note**: The form container must include a button component for submitting the form. At this time, `action_type` is fixed to `form_submit`, indicating form submission.
## Callback structure<br>When a user clicks the submit button of the form container, your configured backend URL will receive the following callback data. If you added the new version card interaction callback (`card.action.trigger`), the structure of the callback data is as follows. For detailed parameter descriptions, refer to [Card Interaction Callback](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-callback-communication).<br>```json<br>{<br>"schema": "2.0", // Version of the callback<br>"header": { // Basic information of the callback<br>"event_id": "f7984f25108f8137722bb63c*****", // Unique identifier of the callback<br>"token": "066zT6pS4QCbgj5Do145GfDbbag*****", // Application's Verification Token<br>"create_time": "1603977298000000", // Time the callback was sent, close to the time the event occurred<br>"event_type": "card.action.trigger", // Type of callback, fixed for card interaction scenarios as "card.action.trigger"<br>"tenant_key": "2df73991750*****", // Tenant key the application belongs to, i.e., unique tenant identifier<br>"app_id": "cli_a5fb0ae6a4******" // App ID of the application<br>},<br>"event": { // Detailed information of the callback<br>"operator": { // Information about the trigger of the callback<br>"tenant_key": "2df73991750*****", // Tenant key of the callback trigger, i.e., unique tenant identifier<br>"user_id": "867*****", // User ID of the callback trigger, returned when the application has "Obtain User ID" permission enabled<br>"open_id": "ou_3c14f3a59eaf2825dbe25359f15*****" // Open ID of the callback trigger<br>},<br>"token": "c-295ee57216a5dc9de90fefd0aadb4b1d7d******", // Token for updating the card, valid for 30 minutes, can be updated up to 2 times<br>"action": { // Data returned by the user interaction component<br>"value": { // Developer-defined data bound to the button component in the form<br>"key": "value"<br>},<br>"tag": "button", // Label of the button component in the form<br>"timezone": "Asia/Shanghai", // Timezone of the user's current region. Returned when the user operates a date picker, time picker, or datetime picker<br>"form_value": { // Data submitted by the user within the form container. The following are example data:<br>"DatePicker_bpqdq5puvn4": "2024-04-01 +0800", // Name and value of the date picker component within the form container. Name is the component ID in the construction tool, which can be customized<br>"DateTimePicker_ihz2d7a74i": "2024-04-29 07:07 +0800", // Custom name and value of the datetime picker component within the form container<br>"Input_lf4fmxwfrd9": "1234", // Name and value of the input box component within the form container<br>"PersonSelect_2ejys7ype7m": "ou_3c14f3a59eaf2825dbe25359f1595b00", // Name and value of the person selection - single select component within the form container<br>"Select_a2d5b7l3zd": "1", // Name and value of the dropdown select - single select component within the form container<br>"TimePicker_7ecsf6xkqsq": "00:00 +0800" // Name and value of the time picker component within the form container<br>},<br>"name": "Button_lvkepfu3" // Name of the button component within the form<br>},<br>"host": "im_message", // Card display scenario<br>"context": { // Related information about the card display scenario<br>"open_message_id": "om_574d639e4a44e4dd646eaf628e2*****", // Message ID where the card is located<br>"open_chat_id": "oc_e4d2605ca917e695f54f11aaf56*****" // Chat ID where the card is located<br>}<br>}<br>}<br>```<br>## Demo example<br>The following sample code in JSON 2.0 structure can achieve the card effect as shown below:<br>![](//sf3-cn.feishucdn.com/obj/open-platform-opendoc/3431ef3f14bc707acaf00093f55df9b1_736bnZnIuR.png?height=491&lazyload=true&maxWidth=400&width=794)<br>```json<br>{<br>"schema": "2.0",<br>"body": {<br>"elements": [<br>{<br>"tag": "markdown",<br>"content": "**项目名称**：业务做大做强",<br>"text_align": "left",<br>"text_size": "normal",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "add-app_outlined",<br>"color": "grey"<br>}<br>},<br>{<br>"tag": "form",<br>"elements": [<br>{<br>"tag": "column_set",<br>"horizontal_spacing": "8px",<br>"horizontal_align": "left",<br>"columns": [<br>{<br>"tag": "column",<br>"width": "weighted",<br>"elements": [<br>{<br>"tag": "markdown",<br>"content": "**经办人***",<br>"text_align": "left",<br>"text_size": "normal",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "member_outlined",<br>"color": "light_grey"<br>}<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px",<br>"weight": 1<br>},<br>{<br>"tag": "column",<br>"width": "weighted",<br>"elements": [<br>{<br>"tag": "select_person",<br>"placeholder": {<br>"tag": "plain_text",<br>"content": "请选择"<br>},<br>"options": [],<br>"width": "fill",<br>"type": "default",<br>"required": true,<br>"name": "PersonSelect_rg0ml5mh"<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px",<br>"weight": 4<br>}<br>],<br>"margin": "16px 0px 16px 0px"<br>},<br>{<br>"tag": "column_set",<br>"horizontal_spacing": "8px",<br>"horizontal_align": "left",<br>"columns": [<br>{<br>"tag": "column",<br>"width": "weighted",<br>"elements": [<br>{<br>"tag": "markdown",<br>"content": "**优先级***",<br>"text_align": "left",<br>"text_size": "normal",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "msgcard-rectangle_outlined",<br>"color": "grey"<br>}<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px",<br>"weight": 1<br>},<br>{<br>"tag": "column",<br>"width": "weighted",<br>"elements": [<br>{<br>"tag": "select_static",<br>"placeholder": {<br>"tag": "plain_text",<br>"content": "请选择"<br>},<br>"options": [<br>{<br>"text": {<br>"tag": "plain_text",<br>"content": "P0"<br>},<br>"value": "1",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "sheet-iconsets-increase_filled"<br>}<br>},<br>{<br>"text": {<br>"tag": "plain_text",<br>"content": "P1"<br>},<br>"value": "P1",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "sheet-iconsets-stable_filled"<br>}<br>},<br>{<br>"text": {<br>"tag": "plain_text",<br>"content": "P2"<br>},<br>"value": "3",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "expand-down_filled"<br>}<br>}<br>],<br>"type": "default",<br>"width": "fill",<br>"required": true,<br>"name": "Select_01taxkgaqc6c"<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px",<br>"weight": 4<br>}<br>],<br>"margin": "16px 0px 16px 0px"<br>},<br>{<br>"tag": "column_set",<br>"horizontal_spacing": "8px",<br>"horizontal_align": "left",<br>"columns": [<br>{<br>"tag": "column",<br>"width": "weighted",<br>"elements": [<br>{<br>"tag": "markdown",<br>"content": "**项目评论**",<br>"text_align": "left",<br>"text_size": "normal",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "chat_outlined",<br>"color": "grey"<br>}<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px",<br>"weight": 1<br>},<br>{<br>"tag": "column",<br>"width": "weighted",<br>"elements": [<br>{<br>"tag": "input",<br>"placeholder": {<br>"tag": "plain_text",<br>"content": "请输入"<br>},<br>"default_value": "",<br>"width": "fill",<br>"name": "Input_0bqcy75cxklr",<br>"fallback": {<br>"tag": "fallback_text",<br>"text": {<br>"tag": "plain_text",<br>"content": "仅支持在 V6.8 及以上版本使用"<br>}<br>}<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px",<br>"weight": 4<br>}<br>],<br>"margin": "16px 0px 16px 0px"<br>},<br>{<br>"tag": "column_set",<br>"flex_mode": "bisect",<br>"horizontal_spacing": "8px",<br>"horizontal_align": "right",<br>"columns": [<br>{<br>"tag": "column",<br>"width": "auto",<br>"elements": [<br>{<br>"tag": "button",<br>"text": {<br>"tag": "plain_text",<br>"content": "提交"<br>},<br>"type": "primary_filled",<br>"width": "default",<br>"icon": {<br>"tag": "standard_icon",<br>"token": "thumbsup_outlined"<br>},<br>"form_action_type": "submit",<br>"name": "Button_lq544v6r"<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px"<br>},<br>{<br>"tag": "column",<br>"width": "auto",<br>"elements": [<br>{<br>"tag": "button",<br>"text": {<br>"tag": "plain_text",<br>"content": "取消"<br>},<br>"type": "default",<br>"width": "default",<br>"form_action_type": "reset",<br>"name": "Button_lq544v6s"<br>}<br>],<br>"padding": "0px 0px 0px 0px",<br>"vertical_spacing": "8px"<br>}<br>],<br>"margin": "0px 0px 0px 0px"<br>}<br>],<br>"name": "Form_lq544v6q",<br>"fallback": {<br>"tag": "fallback_text",<br>"text": {<br>"tag": "plain_text",<br>"content": "仅支持在 V6.6 及以上版本使用"<br>}<br>}<br>}<br>]<br>}<br>}<br>```
