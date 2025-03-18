'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
import { useUser } from '@clerk/nextjs';
import Select from 'react-select';
import Loading from '../_components/loading';
import toast, { Toaster } from 'react-hot-toast';

export default function PromptsList() {
  const { user } = useUser();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  // 创建 supabase 客户端
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 获取所有标签
  useEffect(() => {
    async function fetchTags() {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*');
          
        if (error) throw error;
        
        setTags(data.map(tag => ({
          value: tag.name,
          label: tag.name
        })));
      } catch (error) {
        console.error('获取标签失败:', error);
      }
    }
    fetchTags();
  }, []);

  // 获取提示词列表
  async function fetchPrompts(search = '', filterTags = []) {
    if (!user) return;
    
    try {
      let query = supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id);

      // 如果有搜索关键词，添加搜索条件
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      // 如果选择了标签，添加标签过滤
      if (filterTags.length > 0) {
        const tagNames = filterTags.map(tag => tag.value);
        query = query.contains('tags', tagNames);
      }

      const { data: promptsData, error: promptsError } = await query;

      if (promptsError) throw promptsError;
      setPrompts(promptsData);
    } catch (error) {
      console.error('获取提示词列表失败:', error);
    } finally {
      setLoading(false); // 无论成功失败都设置 loading 为 false
    }
  }

  // 监听搜索条件和标签变化
  useEffect(() => {
    fetchPrompts(searchTerm, selectedTags);
  }, [user, searchTerm, selectedTags]);

  // 处理搜索输入
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagChange = (newValue) => {
    setSelectedTags(newValue || []);
  };

  // 删除提示词
  async function handleDelete(id) {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchPrompts(); // 重新加载列表
    } catch (err) {
      console.error('删除提示词失败:', err);
      alert('删除失败');
    }
  }

  // 添加删除确认函数
  const handleDeleteClick = (prompt) => {
    if (window.confirm(`确定要删除提示词 "${prompt.title}" 吗？此操作不可恢复。`)) {
      handleDelete(prompt.id);
    }
  };

  // 添加分享处理函数
  const handleShare = async (prompt) => {
    const shareUrl = `${window.location.origin}/prompts/share/${prompt.id}`;
    
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
                      <button
                        onClick={() => handleShare(prompt)}
                        className="inline-flex items-center px-2 py-1 rounded-lg text-xs
                                text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30
                                transition-all duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        分享
                      </button>
                      <a
                        href={`/prompts/share/${prompt.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 rounded-lg text-xs
                                text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30
                                text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        编辑
                      </a>
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