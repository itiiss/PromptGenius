export const PLATFORMS = {
  GPT: {
    key: 'GPT',
    name: 'ChatGPT',
    url: {
      web: 'https://chat.openai.com/',
      ios: 'chatgpt://',
      android: 'com.openai.chatgpt://'
    }
  },
  GEMINI: {
    key: 'GEMINI',
    name: 'Gemini',
    url: {
      web: 'https://gemini.google.com/app',
      ios: 'gemini://',
      android: 'com.google.gemini://'
    }
  },
  GROK: {
    key: 'GROK',
    name: 'Grok',
    url: {
      web: 'https://grok.x.ai',
      ios: 'grok://',
      android: 'com.x.grok://'
    }
  },
  CLAUDE: {
    key: 'CLAUDE',
    name: 'Claude',
    url: {
      web: 'https://claude.ai',
      ios: 'claude://',
      android: 'com.anthropic.claude://'
    }
  },
  DEEPSEEK: {
    key: 'DEEPSEEK',
    name: 'Deepseek',
    url: {
      web: 'https://chat.deepseek.com',
      ios: 'deepseek://',
      android: 'com.deepseek.chat://'
    }
  },
  DOUBAO: {
    key: 'DOUBAO',
    name: '豆包',
    url: {
      web: 'https://www.doubao.com',
      ios: 'doubao://',
      android: 'com.doubao.chat://'
    }
  },
  KIMI: {
    key: 'KIMI',
    name: 'Kimi',
    url: {
      web: 'https://kimi.moonshot.cn',
      ios: 'kimi://',
      android: 'cn.moonshot.kimi://'
    }
  },
  WENXIN: {
    key: 'WENXIN',
    name: '文心一言',
    url: {
      web: 'https://yiyan.baidu.com',
      ios: 'baiduyiyan://',
      android: 'com.baidu.yiyan://'
    }
  },
  QIANWEN: {
    key: 'QIANWEN',
    name: '通义千问',
    url: {
      web: 'https://qianwen.aliyun.com',
      ios: 'qianwen://',
      android: 'com.alibaba.qianwen://'
    }
  }
};

export const PLATFORM_OPTIONS = Object.values(PLATFORMS).map(platform => ({
  value: platform.key,
  label: platform.name
})); 