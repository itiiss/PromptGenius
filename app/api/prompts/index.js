import { createSupabaseClient } from '../../lib/supabase';
import { versionsApi } from '../versions';

export const promptsApi = {

 

  // 获取单个提示词
  fetchPrompt: async (promptId, userId) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // 获取提示词列表
  fetchPrompts: async (userId, searchTerm = '', selectedTags = []) => {
    const supabase = createSupabaseClient();
    let query = supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (selectedTags && selectedTags.length > 0) {
      const tagValues = selectedTags.map(tag => tag.value);
      query = query.contains('tags', tagValues);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },


  // 获取提示词列表（包含搜索和过滤功能）
  async fetchPrompts(userId, search = '', filterTags = [], platform = null) {
    const supabase = createSupabaseClient();
    let query = supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId);

    // 如果有搜索关键词，添加搜索条件
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 如果选择了标签，添加标签过滤
    if (filterTags.length > 0) {
      const tagNames = filterTags.map(tag => tag.label);
      query = query.contains('tags', tagNames);
    }

    // 如果指定了平台，添加平台过滤
    if (platform) {
      query = query.eq('platform', platform);
    }

    // 按创建时间降序排序
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // 删除提示词
  async deletePrompt(id, userId) {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // 获取分享链接
  getShareUrl(promptId) {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/prompts/share/${promptId}`;
  },

  // 加载单个提示词及其标签
  async loadPrompt(id, userId) {
    const supabase = createSupabaseClient();
    // 获取提示词基本信息
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (promptError) throw promptError;

    // 获取提示词关联的标签
    const { data: tagData, error: tagError } = await supabase
      .from('prompt_tags')
      .select(`
        tag_id,
        tags (
          id,
          name
        )
      `)
      .eq('prompt_id', id);

    if (tagError) throw tagError;

    return {
      promptData: {
        ...promptData,
        platform: promptData.platform || 'GPT' // 确保返回platform字段
      },
      promptTags: tagData.map(item => ({
        value: item.tags.id,
        label: item.tags.name
      }))
    };
  },

  // 更新提示词
  async updatePrompt(id, userId, formData, selectedTags) {
    const supabase = createSupabaseClient();
    const tagIds = selectedTags.map(tag => tag.value);
    const tagNames = selectedTags.map(tag => tag.label);

    // 1. 获取当前提示词内容
    const { data: currentPrompt } = await supabase
      .from('prompts')
      .select('content')
      .eq('id', id)
      .single();

    // 2. 如果内容有变化，创建新版本
    if (currentPrompt.content !== formData.content) {
      await versionsApi.createVersion(id, currentPrompt.content);
    }

    // 3. 更新提示词基本信息，添加platform字段
    const { error: updateError } = await supabase
      .from('prompts')
      .update({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        platform: formData.platform || 'GPT', // 添加platform字段
        tags: tagNames,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // 4. 更新标签关联
    await this.updatePromptTags(id, tagIds);
  },

  // 更新提示词标签关联
  async updatePromptTags(promptId, tagIds) {
    const supabase = createSupabaseClient();
    // 删除旧的标签关联
    const { error: deleteError } = await supabase
      .from('prompt_tags')
      .delete()
      .eq('prompt_id', promptId);

    if (deleteError) throw deleteError;

    // 插入新的标签关联
    if (tagIds.length > 0) {
      const { error: insertError } = await supabase
        .from('prompt_tags')
        .insert(
          tagIds.map(tagId => ({
            prompt_id: promptId,
            tag_id: tagId
          }))
        );

      if (insertError) throw insertError;
    }
  },

  // 创建新提示词
  async createPrompt(userId, formData, selectedTags) {
    const supabase = createSupabaseClient();
    const tagIds = selectedTags.map(tag => tag.value);
    const tagNames = selectedTags.map(tag => tag.label);

    // 1. 创建提示词，添加platform字段
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .insert([{
        title: formData.title,
        content: formData.content,
        description: formData.description,
        platform: formData.platform || 'GPT', // 添加platform字段，默认为GPT
        user_id: userId,
        tags: tagNames
      }])
      .select()
      .single();

    if (promptError) throw promptError;

    // 2. 创建标签关联关系
    if (tagIds.length > 0) {
      const { error: tagError } = await supabase
        .from('prompt_tags')
        .insert(
          tagIds.map(tagId => ({
            prompt_id: promptData.id,
            tag_id: tagId
          }))
        );

      if (tagError) throw tagError;
    }

    return promptData;
  },

  // 获取共享的提示词详情
  async getSharedPrompt(promptId) {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single();

    if (error) throw error;
    return {
      ...data,
      platform: data.platform || 'GPT' // 确保返回platform字段
    };
  }
}; 