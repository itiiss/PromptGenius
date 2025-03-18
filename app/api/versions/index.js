import { createSupabaseClient } from '../../lib/supabase';

export const versionsApi = {
  // 获取提示词的所有版本
  async getPromptVersions(promptId) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('prompt_versions')
      .select('*')
      .eq('prompt_id', promptId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data;
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