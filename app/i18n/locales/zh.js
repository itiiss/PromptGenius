export default {
  home: {
    title: 'Prompt 管理器',
    description: '高效创建、管理和组织您的 AI 提示词',
    buttons: {
      createNew: '创建新提示词',
      viewAll: '查看所有提示词'
    },
    features: {
      organize: {
        title: '组织',
        description: '保持提示词井井有条，便于访问'
      },
      edit: {
        title: '编辑',
        description: '轻松编辑和优化您的提示词'
      },
      share: {
        title: '分享',
        description: '与他人分享您的提示词'
      }
    }
  },
  createPrompt: {
    title: '创建新提示词',
    form: {
      title: {
        label: '标题',
        placeholder: '输入提示词标题'
      },
      description: {
        label: '描述',
        placeholder: '简短描述这个提示词的用途'
      },
      content: {
        label: '提示词内容',
        placeholder: '输入提示词内容'
      },
      platform: {
        label: '平台',
        placeholder: '选择平台...'
      },
      tags: {
        label: '标签',
        placeholder: '选择或创建标签...',
        noOptions: '没有找到匹配的标签',
        createLabel: '创建标签 "{value}"',
        loading: '加载中...'
      },
      coverImage: {
        label: '封面图片'
      },
      submit: '保存提示词'
    }
  },
  promptsList: {
    title: '提示词列表',
    newButton: '新建',
    search: {
      placeholder: '搜索提示词的标题或内容...'
    },
    filters: {
      platform: '按平台筛选...',
      tags: '按标签筛选...'
    },
    empty: '暂无提示词，请创建新的提示词',
    card: {
      askQuestion: '去提问',
      menu: {
        share: '分享',
        versions: '历史版本',
        delete: '删除'
      },
      deleteConfirm: '确定要删除提示词 "{title}" 吗？此操作不可恢复。'
    },
    toast: {
      copySuccess: '分享链接已复制到剪贴板',
      copyError: '复制链接失败，请重试',
      deleteError: '删除失败，请重试',
      promptCopied: '提示词已复制，正在打开{platform}...',
      promptCopyError: '无法自动复制提示词，请手动复制后使用'
    }
  },
  editPrompt: {
    title: '编辑提示词',
    form: {
      title: {
        label: '标题',
        placeholder: '输入提示词标题'
      },
      description: {
        label: '描述',
        placeholder: '简短描述这个提示词的用途'
      },
      content: {
        label: '提示词内容',
        placeholder: '输入提示词内容'
      },
      platform: {
        label: '平台',
        placeholder: '选择平台...'
      },
      tags: {
        label: '标签',
        placeholder: '选择或创建标签...',
        noOptions: '没有找到匹配的标签',
        createLabel: '创建标签 "{value}"',
        loading: '加载中...'
      }
    },
    buttons: {
      cancel: '取消',
      saving: '保存中...',
      save: '保存修改'
    },
    alerts: {
      loadError: '加载失败',
      updateError: '更新失败，请重试'
    }
  },
  versions: {
    title: {
      latest: '最新版本',
      current: '当前版本',
      history: '历史版本'
    },
    select: {
      placeholder: '选择历史版本',
      version: '版本 {number} ({date})'
    },
    loading: '加载中...',
    comparePrompt: '请选择一个历史版本进行对比',
    error: '获取数据失败'
  },
  sharedPrompt: {
    notFound: '提示词不存在或已被删除',
    sections: {
      description: '描述',
      content: '提示词内容',
      tags: '标签'
    },
    meta: {
      updatedAt: '更新于 ',
      version: '版本 {number}'
    },
    copy: {
      button: '复制提示词',
      success: '提示词已复制到剪贴板'
    }
  }
} 