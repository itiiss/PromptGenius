import { createSupabaseClient } from '../../lib/supabase';

export const tagsApi = {
  // 获取用户的标签
  async fetchTags(userId) {
    if (!userId) {
      console.log('未提供用户ID');
      return [];
    }

    const supabase = createSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name') // 确保选择 id
        .eq('user_id', userId);
      
      if (error) throw error;

      return data?.map(tag => ({
        value: tag.id,    // 使用 id 作为 value
        label: tag.name
      })) || [];
    } catch (err) {
      console.error('获取标签时发生错误:', err);
      throw err;
    }
  },

  // 创建新标签
  async createTag(name, userId) {
    if (!userId) {
      throw new Error('未提供用户ID');
    }

    const supabase = createSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ 
          name,
          user_id: userId
        }])
        .select('id, name')  // 确保返回 id
        .single();
        
      if (error) throw error;

      return { 
        value: data.id,    // 使用 id 作为 value
        label: data.name 
      };
    } catch (err) {
      console.error('创建标签时发生错误:', err);
      throw err;
    }
  },


}; 