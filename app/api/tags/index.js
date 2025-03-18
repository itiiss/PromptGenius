import { createSupabaseClient } from '../../lib/supabase';

export const tagsApi = {
  // 获取所有标签
  async fetchTags() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('tags').select('*');
    if (error) throw error;
    return data.map(tag => ({
      value: tag.id,
      label: tag.name
    }));
  },

  // 创建新标签
  async createTag(name) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name }])
      .select()
      .single();
      
    if (error) throw error;
    return { value: data.id, label: data.name };
  },

  // 获取提示词的标签
  async getPromptTags(promptId) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('prompt_tags')
      .select(`
        tag_id,
        tags (
          id,
          name
        )
      `)
      .eq('prompt_id', promptId);

    if (error) throw error;
    return data.map(item => ({
      value: item.tags.id,
      label: item.tags.name
    }));
  },

  // 更新提示词的标签关联
  async updatePromptTags(promptId, tagIds) {
    const supabase = createSupabaseClient();
    
    // 删除旧的标签关联
    const { error: deleteError } = await supabase
      .from('prompt_tags')
      .delete()
      .eq('prompt_id', promptId);

    if (deleteError) throw deleteError;

    // 如果有新标签，创建新的关联
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
  }
}; 