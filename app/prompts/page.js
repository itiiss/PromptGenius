'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Select from 'react-select';
import Loading from '../_components/loading';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { promptsApi } from '../api/prompts';
import { tagsApi } from '../api/tags';

export default function PromptsList() {
  const { user } = useUser();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  

  // 获取所有标签
  useEffect(() => {
    async function loadTags() {
      try {
        const tagsData = await tagsApi.fetchTags();
        setTags(tagsData);
      } catch (error) {
        console.error('获取标签失败:', error);
      }
    }
    loadTags();
  }, []);

  // 获取提示词列表
  async function loadPrompts(search = '', filterTags = []) {
    if (!user) return;
    
    try {
      const promptsData = await promptsApi.fetchPrompts(user.id, search, filterTags);
      setPrompts(promptsData);
    } catch (error) {
      console.error('获取提示词列表失败:', error);
    } finally {
      setLoading(false);
    }
  }

  // 监听搜索条件和标签变化
  useEffect(() => {
    loadPrompts(searchTerm, selectedTags);
  }, [user, searchTerm, selectedTags]);

  // 处理搜索输入
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagChange = (newValue) => {
    setSelectedTags(newValue || []);
  };

  // 删除提示词
  const handleDelete = async (id) => {
    try {
      await promptsApi.deletePrompt(id, user.id);
      loadPrompts(searchTerm, selectedTags); // 重新加载列表
    } catch (err) {
      console.error('删除提示词失败:', err);
      toast.error('删除失败，请重试');
    }
  };

  // 删除确认
  const handleDeleteClick = (prompt) => {
    if (window.confirm(`确定要删除提示词 "${prompt.title}" 吗？此操作不可恢复。`)) {
      handleDelete(prompt.id);
    }
  };

  // 分享处理
  const handleShare = async (prompt) => {
    const shareUrl = promptsApi.getShareUrl(prompt.id);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('分享链接已复制到剪贴板', {
        duration: 2000,
        position: 'top-center',
        icon: '🔗',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (err) {
      console.error('复制链接失败:', err);
      toast.error('复制链接失败，请重试', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            提示词列表
          </h1>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="搜索提示词的标题或内容..."
                className="w-full h-[42px] px-4 py-2 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                         shadow-sm hover:shadow-md transition-all duration-200"
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
            
            <div className="w-72">
              <Select
                isMulti
                value={selectedTags}
                onChange={handleTagChange}
                options={tags}
                placeholder="按标签筛选..."
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    backgroundColor: 'rgb(249 250 251)',
                    borderColor: '#d1d5db',
                    borderRadius: '0.75rem',
                    '&:hover': {
                      borderColor: '#3b82f6',
                    },
                    boxShadow: 'none',
                    height: 'auto',
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
                  input: (base) => ({
                    ...base,
                    color: 'rgb(55 65 81)',
                    '@media (prefers-color-scheme: dark)': {
                      color: 'rgb(229 231 235)',
                    },
                  }),
                  placeholder: (base) => ({
                    ...base,
                    '@media (prefers-color-scheme: dark)': {
                      color: 'rgb(156 163 175)',
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
          </div>
        </div>

        <div className="mb-6">
          {prompts.length === 0 ? (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg">
              <p className="text-gray-600 dark:text-gray-400">暂无提示词，请创建新的提示词</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl
                          shadow-lg border border-gray-200 dark:border-gray-700
                          hover:shadow-xl transition-all duration-200 flex flex-col h-full"
                >
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">
                    {prompt.title}
                  </h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow overflow-hidden line-clamp-3">
                    {prompt.content}
                  </p>
                  
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prompt.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 
                                  rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                          +{prompt.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-end gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleShare(prompt)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                              />
                            </svg>
                            <span className="text-xs ml-1">分享</span>
                          </div>
                        </button>

                        <Link
                          href={`/prompts/${prompt.id}/versions`}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <span className="text-xs ml-1">历史</span>
                          </div>
                        </Link>

                        <Link
                          href={`/prompts/${prompt.id}/edit`}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                            <span className="text-xs ml-1">编辑</span>
                          </div>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(prompt)}
                        className="inline-flex items-center px-2 py-1 rounded-lg text-xs
                                text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 