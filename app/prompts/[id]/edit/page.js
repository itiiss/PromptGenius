'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { use } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../../_components/loading';
import { promptsApi } from '../../../api/prompts';
import { tagsApi } from '../../../api/tags';
import { PLATFORM_OPTIONS } from '../../../constants/platforms';
import DynamicSelect from '../../../_components/DynamicSelect';
import { createSupabaseClient } from '../../../lib/supabase';

export default function EditPrompt({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [prompt, setPrompt] = useState({
    title: '',
    content: '',
    platform: 'GPT',
    tags: []
  });

  const loadData = useCallback(async () => {
    try {
      const data = await promptsApi.fetchPrompt(id, user.id);
      setPrompt(data);
    } catch (error) {
      console.error('加载提示词失败:', error);
      router.push('/prompts');
    }
  }, [id, router, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadPromptTags = async (promptId) => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('prompt_tags')
        .select(`
          tag_id,
          tags:tag_id(id, name)
        `)
        .eq('prompt_id', promptId);

      if (error) throw error;

      const existingTags = data.map(item => ({
        value: item.tags.id,
        label: item.tags.name
      }));

      setSelectedTags(existingTags);
    } catch (error) {
      console.error('加载提示词标签失败:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const tagsData = await tagsApi.fetchTags(user?.id);
        setTags(tagsData);

        if (id) {
          await loadPromptTags(id);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    }

    if (user?.id) {
      fetchData();
    }
  }, [user?.id, id]);

  useEffect(() => {
    async function loadPrompt() {
      try {
        const { promptData, promptTags } = await promptsApi.loadPrompt(id, user.id);
        
        setPrompt({
          title: promptData.title,
          content: promptData.content,
          platform: promptData.platform || 'GPT',
          tags: promptTags
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

  const handleCreateTag = async (inputValue) => {
    try {
      const newOption = await tagsApi.createTag(inputValue, user?.id);
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
      await promptsApi.updatePrompt(
        id,
        user?.id,
        {
          title: prompt.title,
          content: prompt.content,
          description: prompt.description,
          platform: prompt.platform || 'GPT',
        },
        selectedTags
      );

      router.push('/prompts');
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

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
              value={prompt.title}
              onChange={(e) => setPrompt(prev => ({
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
              value={prompt.description}
              onChange={(e) => setPrompt(prev => ({
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
              value={prompt.content}
              onChange={(e) => setPrompt(prev => ({
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
            <label htmlFor="platform" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              平台
            </label>
            <DynamicSelect
              id="platform"
              value={PLATFORM_OPTIONS.find(option => option.value === prompt.platform)}
              onChange={(option) => setPrompt({...prompt, platform: option.value})}
              options={PLATFORM_OPTIONS}
              placeholder="选择平台..."
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'rgb(249 250 251)',
                  borderColor: '#d1d5db',
                  borderRadius: '0.75rem',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                  boxShadow: 'none',
                  '@media (prefers-color-scheme: dark)': {
                    backgroundColor: 'rgb(31 41 55)',
                    borderColor: 'rgb(55 65 81)',
                  },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'rgb(249 250 251)',
                  '@media (prefers-color-scheme: dark)': {
                    backgroundColor: 'rgb(31 41 55)',
                  },
                }),
                option: (base) => ({
                  ...base,
                  '@media (prefers-color-scheme: dark)': {
                    '&:hover': {
                      backgroundColor: 'rgb(55 65 81)',
                    },
                    backgroundColor: 'rgb(31 41 55)',
                    color: 'rgb(229 231 235)',
                  },
                }),
                singleValue: (base) => ({
                  ...base,
                  '@media (prefers-color-scheme: dark)': {
                    color: 'rgb(229 231 235)',
                  },
                }),
              }}
            />
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