'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../_components/loading';
import { promptsApi } from '../../api/prompts';
import { tagsApi } from '../../api/tags';
import { PLATFORM_OPTIONS } from '../../constants/platforms';
import DynamicSelect from '../../_components/DynamicSelect';

export default function CreatePrompt() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    platform: 'GPT',
    tags: '',
    coverImage: null
  });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      try {
        const tagsData = await tagsApi.fetchTags();
        setTags(tagsData);
      } catch (error) {
        console.error('获取标签失败:', error);
      }
    }
    fetchTags();
  }, []);

  const handleCreateTag = async (inputValue) => {
    try {
      const newOption = await tagsApi.createTag(inputValue);
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
    setFormData(prev => ({
      ...prev,
      tags: newValue ? newValue.map(tag => tag.label) : []
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      coverImage: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await promptsApi.createPrompt(user.id, formData, selectedTags);
      router.push('/prompts');
    } catch (error) {
      console.error('创建提示词出错:', error);
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          创建新提示词
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
            <label htmlFor="platform" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              平台
            </label>
            <DynamicSelect
              id="platform"
              value={PLATFORM_OPTIONS.find(option => option.value === formData.platform)}
              onChange={(option) => setFormData({...formData, platform: option.value})}
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
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                      ? '#3b82f6' 
                      : state.isFocused 
                        ? '#dbeafe' 
                        : 'transparent',
                    color: state.isSelected ? 'white' : '#374151',
                    '&:active': {
                      backgroundColor: '#2563eb',
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#dbeafe',
                    borderRadius: '9999px',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#2563eb',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#bfdbfe',
                      color: '#1e40af',
                    },
                    borderRadius: '0 9999px 9999px 0',
                  }),
                }}
              />
            </Suspense>
          </div>

          <div className="mb-6">
            <label htmlFor="coverImage" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              封面图片
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100
                       transition-all duration-200"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     text-white py-3 px-6 rounded-xl font-medium
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-lg hover:shadow-xl
                     flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            保存提示词
          </button>
        </form>
      </div>
    </div>
  );
}