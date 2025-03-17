'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
import { useUser } from '@clerk/nextjs';

export default function PromptsList() {
  const { user } = useUser();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 获取提示词列表
  async function fetchPrompts() {
    try {
     

      let query = supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id); // 只获取当前用户的提示词

      // 如果有选中的标签，添加过滤条件
      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (err) {
      setError('获取提示词失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 删除提示词
  async function handleDelete(id) {
    try {
   

      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // 确保只能删除自己的提示词

      if (error) throw error;
      fetchPrompts(); // 重新加载列表
    } catch (err) {
      console.error('删除提示词失败:', err);
      alert('删除失败');
    }
  }

  useEffect(() => {
    if (user) {
      fetchPrompts();
    }

    // 设置实时订阅
    const channel = supabase
      .channel('prompts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'prompts' },
        (payload) => {
          console.log('数据更新:', payload);
          fetchPrompts();
        }
      )
      .subscribe();

    // 清理订阅
    return () => {
      channel.unsubscribe();
    };
  }, [selectedTag, user]); // 当选中的标签改变时重新获取数据



  if (loading) return <div className="text-center">加载中...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            提示词列表
          </h1>
          <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索提示词的标题或内容..."
                className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                         shadow-sm hover:shadow-md transition-all duration-200"
                onChange={(e) => {
                  // 在这里处理搜索逻辑
                  const searchTerm = e.target.value;
                  // TODO: 实现搜索功能
                }}
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        </div>

        <div className="grid gap-6">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl
                       shadow-lg border border-gray-200 dark:border-gray-700
                       hover:shadow-xl transition-all duration-200"
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {prompt.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {prompt.content}
              </p>
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 
                               rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <a
                  href={`/prompts/${prompt.id}/edit`}
                  className="inline-flex items-center px-4 py-2 rounded-lg
                           text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑
                </a>
                <button
                  onClick={() => handleDelete(prompt.id)}
                  className="inline-flex items-center px-4 py-2 rounded-lg
                           text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 