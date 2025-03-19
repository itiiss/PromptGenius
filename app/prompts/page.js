'use client';
import { useEffect, useState, useCallback, createPortal } from 'react';
import { useUser } from '@clerk/nextjs';
import Select from 'react-select';
import Loading from '../_components/loading';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { promptsApi } from '../api/prompts';
import { tagsApi } from '../api/tags';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import dynamic from 'next/dynamic';

// 动态导入MenuPortal，禁用SSR
const MenuPortal = dynamic(
  () => import('../_components/MenuPortal'),
  { ssr: false }
);

// 修改卡片中的Menu部分
const PromptCard = ({ prompt, onShare, onDelete, onAskQuestion }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef(null);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.right - 192,
      });
    }
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl
                    shadow-lg border border-gray-200 dark:border-gray-700
                    hover:shadow-xl transition-all duration-200 flex flex-col h-full">
      <Link
        href={`/prompts/${prompt.id}/edit`}
        className="group cursor-pointer"
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1 
                       group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {prompt.title}
        </h2>
      </Link>
      
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

      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onAskQuestion(prompt)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
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
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <span className="text-xs ml-1">去提问</span>
        </button>

        <button
          ref={menuButtonRef}
          onClick={handleMenuClick}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>

        <MenuPortal
          isOpen={menuOpen}
          position={menuPosition}
          onClose={() => setMenuOpen(false)}
          items={
            <div className="py-1">
              <button
                onClick={() => {
                  onShare(prompt);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享
              </button>

              <Link
                href={`/prompts/${prompt.id}/versions`}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                历史版本
              </Link>

              <button
                onClick={() => {
                  onDelete(prompt);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

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

  // 使用useCallback包装loadPrompts函数
  const loadPrompts = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        setPrompts([]);
        return;
      }
      const data = await promptsApi.fetchPrompts(user.id, searchTerm, selectedTags);
      setPrompts(data);
    } catch (error) {
      console.error('加载提示词失败:', error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [user, searchTerm, selectedTags]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // 监听搜索条件和标签变化
  useEffect(() => {
    loadPrompts(searchTerm, selectedTags);
  }, [user, searchTerm, selectedTags, loadPrompts]);

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
      loadPrompts(); // 重新加载列表
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

  // 添加handleAskQuestion函数
  const handleAskQuestion = async (prompt) => {
    try {
      // 1. 尝试复制提示词到剪贴板
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(prompt.content);
      } else {
        // 后备方案：创建一个临时文本区域来复制文本
        const textArea = document.createElement('textarea');
        textArea.value = prompt.content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (err) {
          console.error('复制失败:', err);
          textArea.remove();
          toast.error('复制失败，请手动复制');
          return;
        }
      }

      // 2. 尝试打开ChatGPT应用
      const chatgptIosUrl = `chatgpt://`;
      const chatgptAndroidUrl = `com.openai.chatgpt://`;
      const webFallback = `https://chat.openai.com/`;
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let appUrl = webFallback;
      if (isIOS) {
        appUrl = chatgptIosUrl;
      } else if (isAndroid) {
        appUrl = chatgptAndroidUrl;
      }
      
      // 显示成功提示
      toast.success('提示词已复制，正在打开ChatGPT...', {
        duration: 2000,
        position: 'top-center',
        icon: '🤖',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      // 尝试打开应用
      window.location.href = appUrl;
      
      // 如果2秒后还在当前页面，跳转到网页版
      setTimeout(() => {
        if (document.hidden || document.webkitHidden) {
          return;
        }
        window.location.href = webFallback;
      }, 2000);

    } catch (err) {
      console.error('操作失败:', err);
      toast.error('操作失败，请重试', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 overflow-visible">
      <Toaster />
      <div className="max-w-7xl mx-auto overflow-visible">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 overflow-visible">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onShare={handleShare}
                  onDelete={handleDeleteClick}
                  onAskQuestion={handleAskQuestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 