import { promptsApi } from './prompts';
import { versionsApi } from './versions';
import { tagsApi } from './tags';

export const compositeApi = {
  // 加载提示词完整信息（包括标签）
  async loadPromptWithTags(id, userId) {
    const [promptData, promptTags] = await Promise.all([
      promptsApi.getPrompt(id, userId),
      tagsApi.getPromptTags(id)
    ]);
    
    return { promptData, promptTags };
  },

  // 更新提示词（包括内容、版本和标签）
  async updatePromptFull(id, userId, formData, selectedTags) {
    
    // 获取当前提示词内容
    const currentPrompt = await promptsApi.getPrompt(id, userId);

    // 如果内容有变化，创建新版本
    if (currentPrompt.content !== formData.content) {
      await versionsApi.createVersion(id, currentPrompt.content);
    }

    // 更新提示词基本信息
    await promptsApi.updatePrompt(id, userId, formData, selectedTags.map(tag => tag.label));

    // 更新标签关联
    await tagsApi.updatePromptTags(id, selectedTags.map(tag => tag.value));
  }
};