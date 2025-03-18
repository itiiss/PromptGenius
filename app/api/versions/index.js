import { createSupabaseClient } from '../../lib/supabase';

export const versionsApi = {
  // 获取提示词及其所有版本信息
  async getPromptWithVersions(promptId) {
    const supabase = createSupabaseClient();
    
    try {
      // 并行获取提示词和版本信息
      const [promptResult, versionsResult] = await Promise.all([
        // 获取当前提示词内容
        supabase
          .from('prompts')
          .select('*')
          .eq('id', promptId)
          .single(),
          
        // 获取历史版本
        supabase
          .from('prompt_versions')
          .select('*')
          .eq('prompt_id', promptId)
          .order('version', { ascending: false })
      ]);

      // 检查错误
      if (promptResult.error) throw promptResult.error;
      if (versionsResult.error) throw versionsResult.error;

      return {
        currentPrompt: promptResult.data,
        versions: versionsResult.data
      };
    } catch (error) {
      console.error('获取提示词版本数据失败:', error);
      throw error;
    }
  },

  // 创建新版本
  async createVersion(promptId, oldContent) {
    const supabase = createSupabaseClient();
    // 获取最新版本号
    const { data: versions } = await supabase
      .from('prompt_versions')
      .select('version')
      .eq('prompt_id', promptId)
      .order('version', { ascending: false })
      .limit(1);

    const newVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

    const { error } = await supabase
      .from('prompt_versions')
      .insert({
        prompt_id: promptId,
        content: oldContent,
        version: newVersion,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return newVersion;
  }
}; 