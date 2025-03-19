export default {
  home: {
    title: 'Prompt Manager',
    description: 'Create, manage and organize your AI prompts efficiently',
    buttons: {
      createNew: 'Create New Prompt',
      viewAll: 'View All Prompts'
    },
    features: {
      organize: {
        title: 'Organize',
        description: 'Keep your prompts organized and easily accessible'
      },
      edit: {
        title: 'Edit',
        description: 'Easily edit and refine your prompts'
      },
      share: {
        title: 'Share',
        description: 'Share your prompts with others'
      }
    }
  },
  createPrompt: {
    title: 'Create New Prompt',
    form: {
      title: {
        label: 'Title',
        placeholder: 'Enter prompt title'
      },
      description: {
        label: 'Description',
        placeholder: 'Briefly describe the purpose of this prompt'
      },
      content: {
        label: 'Prompt Content',
        placeholder: 'Enter prompt content'
      },
      platform: {
        label: 'Platform',
        placeholder: 'Select platform...'
      },
      tags: {
        label: 'Tags',
        placeholder: 'Select or create tags...',
        noOptions: 'No matching tags found',
        createLabel: 'Create tag "{value}"',
        loading: 'Loading...'
      },
      coverImage: {
        label: 'Cover Image'
      },
      submit: 'Save Prompt'
    }
  },
  promptsList: {
    title: 'Prompts List',
    newButton: 'New',
    search: {
      placeholder: 'Search prompts by title or content...'
    },
    filters: {
      platform: 'Filter by platform...',
      tags: 'Filter by tags...'
    },
    empty: 'No prompts yet, create a new one',
    card: {
      askQuestion: 'Ask',
      menu: {
        share: 'Share',
        versions: 'History',
        delete: 'Delete'
      },
      deleteConfirm: 'Are you sure you want to delete prompt "{title}"? This action cannot be undone.'
    },
    toast: {
      copySuccess: 'Share link copied to clipboard',
      copyError: 'Failed to copy link, please try again',
      deleteError: 'Delete failed, please try again',
      promptCopied: 'Prompt copied, opening {platform}...',
      promptCopyError: 'Unable to copy prompt automatically, please copy manually'
    }
  },
  editPrompt: {
    title: 'Edit Prompt',
    form: {
      title: {
        label: 'Title',
        placeholder: 'Enter prompt title'
      },
      description: {
        label: 'Description',
        placeholder: 'Briefly describe the purpose of this prompt'
      },
      content: {
        label: 'Prompt Content',
        placeholder: 'Enter prompt content'
      },
      platform: {
        label: 'Platform',
        placeholder: 'Select platform...'
      },
      tags: {
        label: 'Tags',
        placeholder: 'Select or create tags...',
        noOptions: 'No matching tags found',
        createLabel: 'Create tag "{value}"',
        loading: 'Loading...'
      }
    },
    buttons: {
      cancel: 'Cancel',
      saving: 'Saving...',
      save: 'Save Changes'
    },
    alerts: {
      loadError: 'Failed to load',
      updateError: 'Update failed, please try again'
    }
  },
  versions: {
    title: {
      latest: 'Latest Version',
      current: 'Current Version',
      history: 'Version History'
    },
    select: {
      placeholder: 'Select a version',
      version: 'Version {number} ({date})'
    },
    loading: 'Loading...',
    comparePrompt: 'Please select a version to compare',
    error: 'Failed to load data'
  },
  sharedPrompt: {
    notFound: 'Prompt does not exist or has been deleted',
    sections: {
      description: 'Description',
      content: 'Prompt Content',
      tags: 'Tags'
    },
    meta: {
      updatedAt: 'Updated on ',
      version: 'Version {number}'
    },
    copy: {
      button: 'Copy Prompt',
      success: 'Prompt copied to clipboard'
    }
  }
} 