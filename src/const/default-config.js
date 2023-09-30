defaultConfig = {
  pages: [
    {
      title: "👩‍🏫解释",
      url: "https://chat.openai.com/",
      hotkey: "alt+z",
      prompt: "请用简单的语言解释给我:\n",
      copySelection: true,
      appendClipboard: true,
      autoSend: true,
    },
    {
      title: "🔠翻译",
      url: "https://chat.openai.com/",
      hotkey: "alt+x",
      prompt: "作为一名专业的翻译，请准确地将文本在这英语和汉语之间翻译:\n",
      copySelection: true,
      appendClipboard: true,
      autoSend: true,
    },
    {
      title: "🛠️软件开发",
      url: "https://chat.openai.com/",
      hotkey: "alt+c",
      prompt: "你是一名优秀的软件工程师, 请按步骤给出答案.",
      copySelection: false,
      appendClipboard: false,
      autoSend: false,
    },
  ],
};

module.exports = defaultConfig;