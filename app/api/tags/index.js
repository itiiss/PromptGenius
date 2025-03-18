import { createSupabaseClient } from '../../lib/supabase';

export const tagsApi = {
  // 获取所有标签
  async fetchTags() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('tags').select('*');
    
    if (error) throw error;
    return data.map(tag => ({
      value: tag.name, // 注意这里使用name作为value
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



}; 