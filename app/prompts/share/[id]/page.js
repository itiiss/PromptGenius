'use client';
import { useState, useEffect, use } from 'react';
import { promptsApi } from '../../../api/prompts';
import Loading from '../../../_components/loading';

export default function SharedPromptPage({ params }) {
  const { id } = use(params);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSharedPrompt() {
      try {
        const data = await promptsApi.getSharedPrompt(id);
        setPrompt(data);
      } catch (error) {
        console.error('获取提示词详情失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSharedPrompt();
  }, [id]);

  if (loading) return <Loading />;
  if (!prompt) return <div className="text-center py-12">提示词不存在或已被删除</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* 标题 */}
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {prompt.title}
          </h1>

          {/* 描述 */}
          {prompt.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                描述
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {prompt.description}
              </p>
            </div>
          )}

          {/* 提示词内容 */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              提示词内容
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
                {prompt.content}
              </pre>
            </div>
          </div>

          {/* 标签 */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                标签
              </h2>
              <div className="flex flex-wrap gap-2">
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
            </div>
          )}

          {/* 元信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              更新于 {new Date(prompt.updated_at).toLocaleDateString('zh-CN').replace(/\//g, '/')}
            </div>
            <div>
              版本 {prompt.version}
            </div>
          </div>

          {/* 复制按钮 */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(prompt.content);
              alert('提示词已复制到剪贴板');
            }}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     text-white py-3 px-6 rounded-xl font-medium
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-lg hover:shadow-xl
                     flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            复制提示词
          </button>
        </div>
      </div>
    </div>
  );
} 