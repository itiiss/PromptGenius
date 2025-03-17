'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import { use } from 'react';

export default function EditPrompt({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    version: '1.0'
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function loadPrompt() {
      try {
     
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id) // 确保只能编辑自己的提示词
          .single();

        if (error) throw error;

        setFormData({
          title: data.title,
          description: data.description || '',
          content: data.content,
          tags: data.tags ? data.tags.join(', ') : '',
          version: data.version || '1.0'
        });
      } catch (error) {
        console.error('加载提示词失败:', error);
        alert('加载失败');
        router.push('/prompts');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadPrompt();
    }
  }, [id, user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];

      const { error } = await supabase
        .from('prompts')
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          tags: tagsArray,
          version: formData.version
        })
        .eq('id', id)
        .eq('user_id', user.id); // 确保只能更新自己的提示词

      if (error) throw error;
      router.push('/prompts');
    } catch (error) {
      console.error('更新提示词失败:', error);
      alert('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          编辑提示词
        </h1>
        
        <form onSubmit={handleSubmit} className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              标题
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
              placeholder="输入提示词标题"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              描述
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
              placeholder="简短描述这个提示词的用途"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              提示词内容
            </label>
            <textarea
              id="content"
              rows="8"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
              placeholder="输入提示词内容"
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              标签
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
              placeholder="使用逗号分隔多个标签"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="version" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              版本
            </label>
            <input
              type="text"
              id="version"
              value={formData.version}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
              placeholder="版本号"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/prompts')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading ? '保存中...' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}