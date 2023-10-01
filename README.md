# HotkeyGPT
A ChatGPT client automatically copies text and switches between conversations and prompts with hotkeys.   
No Api Key required.

![demo](https://github.com/likaci/HotkeyGPT/assets/3407980/b4dfef47-e599-44da-989b-ba167ee1ae20)

## Install
### macOS
#### Can’t open
Right-click on the app, hold down option, and click Open.   
<img width="295" alt="image" src="https://github.com/likaci/HotkeyGPT/assets/3407980/c67c7e4b-4b7c-4795-9de8-48d7d1f33cc3">

#### Can't copy selection text
open `Settings` -> `Privacy & Security` -> `Accessibility` enable HotkeyGPT   
<img width="715" alt="image" src="https://github.com/likaci/HotkeyGPT/assets/3407980/68dd2f7b-8c42-4f95-844b-920b9c5ef044">

## Other details
### Core code
```js
textarea.value = (data.prompt ? data.prompt : "") + data.text;
button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
```
### How to copy text?   
on macOS trigger `CMD-C` by AppleScript   
on Windows trigger `Ctrl-C` by [NirCmd](https://www.nirsoft.net/utils/nircmd.html)   
### Electron multi tabs
Thanks to @thanhlmm 's [post](https://dev.to/thanhlm/electron-multiple-tabs-without-dealing-with-performance-2cma) 

## Default Config
<details>
<summary>EN</summary>
  
```json
{
  "pages": [
    {
      "title": "👩‍🏫Explain",
      "url": "https://chat.openai.com/",
      "hotkey": "alt+z",
      "prompt": "Please explain it to me in simple terms.:\n",
      "copySelection": true,
      "appendClipboard": true,
      "autoSend": true
    },
    {
      "title": "🔠Translate",
      "url": "https://chat.openai.com/",
      "hotkey": "alt+x",
      "prompt": "As a professional translator, please translate the text accurately between English and Chinese.:\n",
      "copySelection": true,
      "appendClipboard": true,
      "autoSend": true
    },
    {
      "title": "🛠️Dev",
      "url": "https://chat.openai.com/",
      "hotkey": "alt+c",
      "prompt": "You are an excellent software engineer, please provide the answer step by step.",
      "copySelection": false,
      "appendClipboard": false,
      "autoSend": false
    }
  ]
}
```
</details>

<details>
<summary>CN</summary>

```json
{
    "pages": [
      {
        "title": "👩‍🏫解释",
        "url": "https://chat.openai.com/",
        "hotkey": "alt+z",
        "prompt": "请用简单的语言解释给我:\n",
        "copySelection": true,
        "appendClipboard": true,
        "autoSend": true
      },
      {
        "title": "🔠翻译",
        "url": "https://chat.openai.com/",
        "hotkey": "alt+x",
        "prompt": "作为一名专业的翻译，请准确地将文本在这英语和汉语之间翻译:\n",
        "copySelection": true,
        "appendClipboard": true,
        "autoSend": true
      },
      {
        "title": "🛠️软件开发",
        "url": "https://chat.openai.com/",
        "hotkey": "alt+c",
        "prompt": "你是一名优秀的软件工程师, 请按步骤给出答案.",
        "copySelection": false,
        "appendClipboard": false,
        "autoSend": false
      }
    ]
  }
```
</details>
