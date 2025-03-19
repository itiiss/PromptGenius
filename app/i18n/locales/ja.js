export default {
  home: {
    title: 'プロンプトマネージャー',
    description: 'AIプロンプトを効率的に作成、管理、整理します',
    buttons: {
      createNew: '新しいプロンプトを作成',
      viewAll: 'すべてのプロンプトを表示'
    },
    features: {
      organize: {
        title: '整理',
        description: 'プロンプトを整理して簡単にアクセスできるようにします'
      },
      edit: {
        title: '編集',
        description: 'プロンプトを簡単に編集および洗練します'
      },
      share: {
        title: '共有',
        description: '他の人とプロンプトを共有します'
      }
    }
  },
  createPrompt: {
    title: '新しいプロンプトを作成',
    form: {
      title: {
        label: 'タイトル',
        placeholder: 'プロンプトのタイトルを入力'
      },
      description: {
        label: '説明',
        placeholder: 'このプロンプトの目的を簡単に説明'
      },
      content: {
        label: 'プロンプト内容',
        placeholder: 'プロンプトの内容を入力'
      },
      platform: {
        label: 'プラットフォーム',
        placeholder: 'プラットフォームを選択...'
      },
      tags: {
        label: 'タグ',
        placeholder: 'タグを選択または作成...',
        noOptions: '一致するタグが見つかりません',
        createLabel: 'タグ "{value}" を作成',
        loading: '読み込み中...'
      },
      coverImage: {
        label: 'カバー画像'
      },
      submit: 'プロンプトを保存'
    }
  },
  promptsList: {
    title: 'プロンプト一覧',
    newButton: '新規',
    search: {
      placeholder: 'タイトルまたは内容でプロンプトを検索...'
    },
    filters: {
      platform: 'プラットフォーム',
      tags: 'タグでフィルタ...'
    },
    empty: 'まだプロンプトがありません。新しいプロンプトを作成してください。',
    card: {
      askQuestion: '質問する',
      menu: {
        share: '共有',
        versions: '履歴',
        delete: '削除'
      },
      deleteConfirm: '本当にプロンプト "{title}" を削除しますか？この操作は元に戻せません。'
    },
    toast: {
      copySuccess: '共有リンクがクリップボードにコピーされました',
      copyError: 'リンクのコピーに失敗しました。再試行してください',
      deleteError: '削除に失敗しました。再試行してください',
      promptCopied: 'プロンプトがコピーされました。{platform}を開いています...',
      promptCopyError: 'プロンプトを自動的にコピーできませんでした。手動でコピーしてください'
    }
  },
  editPrompt: {
    title: 'プロンプトを編集',
    form: {
      title: {
        label: 'タイトル',
        placeholder: 'プロンプトのタイトルを入力'
      },
      description: {
        label: '説明',
        placeholder: 'このプロンプトの目的を簡単に説明'
      },
      content: {
        label: 'プロンプト内容',
        placeholder: 'プロンプトの内容を入力'
      },
      platform: {
        label: 'プラットフォーム',
        placeholder: 'プラットフォームを選択...'
      },
      tags: {
        label: 'タグ',
        placeholder: 'タグを選択または作成...',
        noOptions: '一致するタグが見つかりません',
        createLabel: 'タグ "{value}" を作成',
        loading: '読み込み中...'
      }
    },
    buttons: {
      cancel: 'キャンセル',
      saving: '保存中...',
      save: '変更を保存'
    },
    alerts: {
      loadError: '読み込みに失敗しました',
      updateError: '更新に失敗しました。再試行してください'
    }
  },
  versions: {
    title: {
      latest: '最新バージョン',
      current: '現在のバージョン',
      history: 'バージョン履歴'
    },
    select: {
      placeholder: 'バージョンを選択',
      version: 'バージョン {number} ({date})'
    },
    loading: '読み込み中...',
    comparePrompt: '比較するバージョンを選択してください',
    error: 'データの読み込みに失敗しました'
  },
  sharedPrompt: {
    notFound: 'プロンプトは存在しないか、削除されました',
    sections: {
      description: '説明',
      content: 'プロンプト内容',
      tags: 'タグ'
    },
    meta: {
      updatedAt: '更新日 ',
      version: 'バージョン {number}'
    },
    copy: {
      button: 'プロンプトをコピー',
      success: 'プロンプトがクリップボードにコピーされました'
    }
  }
}; 