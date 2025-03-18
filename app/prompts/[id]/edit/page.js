'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import { use } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicSelect = dynamic(() => import('react-select/creatable'), {
  ssr: false,
});

export default function EditPrompt({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    version: '1.0'
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*');
          
        if (error) throw error;
        
        setTags(data.map(tag => ({
          value: tag.id,
          label: tag.name
        })));
      } catch (error) {
        console.error('获取标签失败:', error);
      }
    }
    fetchTags();
  }, []);

  useEffect(() => {
    async function loadPrompt() {
      try {
        // 先获取提示词基本信息
        const { data: promptData, error: promptError } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (promptError) throw promptError;

        // 获取该提示词关联的标签
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

        setFormData({
          title: promptData.title,
          description: promptData.description || '',
          content: promptData.content,
          version: promptData.version || '1.0'
        });

        // 设置已选择的标签
        const promptTags = tagData.map(item => ({
          value: item.tags.id,
          label: item.tags.name
        }));
        setSelectedTags(promptTags);

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

  const handleCreateTag = async (inputValue) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name: inputValue }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newOption = { value: data.id, label: data.name };
      setTags(prev => [...prev, newOption]);
      setSelectedTags(prev => [...prev, newOption]);
      
      return newOption;
    } catch (error) {
      console.error('创建标签失败:', error);
      return null;
    }
  };

  const handleTagChange = (newValue) => {
    setSelectedTags(newValue || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagIds = selectedTags.map(tag => tag.value);
      const tagNames = selectedTags.map(tag => tag.label);

      // 1. 更新提示词基本信息，包括标签名称数组
      const { error: updateError } = await supabase
        .from('prompts')
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          version: formData.version,
          tags: tagNames  // 更新标签名称数组
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // 2. 删除旧的标签关联
      const { error: deleteError } = await supabase
        .from('prompt_tags')
        .delete()
        .eq('prompt_id', id);

      if (deleteError) throw deleteError;

      // 3. 插入新的标签关联
      if (tagIds.length > 0) {
        const { error: insertError } = await supabase
          .from('prompt_tags')
          .insert(
            tagIds.map(tagId => ({
              prompt_id: id,
              tag_id: tagId
            }))
          );

        if (insertError) throw insertError;
      }

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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                title: e.target.value
              }))}
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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: e.target.value
              }))}
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
            <Suspense fallback={
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 
                            dark:border-gray-600 rounded-xl">
                加载中...
              </div>
            }>
              <DynamicSelect
                isMulti
                isClearable
                options={tags}
                value={selectedTags}
                onChange={handleTagChange}
                onCreateOption={handleCreateTag}
                placeholder="选择或创建标签..."
                noOptionsMessage={() => "没有找到匹配的标签"}
                formatCreateLabel={(inputValue) => `创建标签 "${inputValue}"`}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#3b82f6',
                    primary75: '#60a5fa',
                    primary50: '#93c5fd',
                    primary25: '#dbeafe',
                  },
                })}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: 'rgb(249 250 251)',
                    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                    '&:hover': {
                      borderColor: '#3b82f6',
                    },
                    borderRadius: '0.75rem',
                    padding: '0.25rem',
                  }),
                }}
              />
            </Suspense>
          </div>

          <div className="mb-6">
            <label htmlFor="version" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              版本
            </label>
            <input
              type="text"
              id="version"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                version: e.target.value
              }))}
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