'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import 'react-diff-view/style/index.css';
import { versionsApi } from '../../../api/versions';

export default function PromptVersions({ params }) {
  const { id } = use(params);
  const [versions, setVersions] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { currentPrompt, versions } = await versionsApi.getPromptWithVersions(id);
        setCurrentPrompt(currentPrompt);
        setVersions(versions);
      } catch (error) {
        console.error('获取数据失败:', error);
        // 可以添加错误提示
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <div>加载中...</div>;

  // 高亮显示文本差异
  const highlightDifferences = (oldText, newText) => {
    if (!oldText || !newText) return { oldHtml: '', newHtml: '' };

    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    let oldHtml = '';
    let newHtml = '';

    let i = 0;
    let j = 0;

    while (i < oldWords.length || j < newWords.length) {
      if (i >= oldWords.length) {
        // 新版本多出的内容
        newHtml += `<span class="bg-green-200 dark:bg-green-900 dark:text-green-200">${newWords[j]}</span>`;
        j++;
      } else if (j >= newWords.length) {
        // 旧版本被删除的内容
        oldHtml += `<span class="bg-red-200 dark:bg-red-900 dark:text-red-200">${oldWords[i]}</span>`;
        i++;
      } else if (oldWords[i] === newWords[j]) {
        // 相同的内容
        oldHtml += oldWords[i];
        newHtml += newWords[j];
        i++;
        j++;
      } else {
        // 不同的内容
        oldHtml += `<span class="bg-red-200 dark:bg-red-900 dark:text-red-200">${oldWords[i]}</span>`;
        newHtml += `<span class="bg-green-200 dark:bg-green-900 dark:text-green-200">${newWords[j]}</span>`;
        i++;
        j++;
      }
    }

    return { oldHtml, newHtml };
  };

  const { oldHtml, newHtml } = highlightDifferences(
    selectedVersion?.content,
    currentPrompt?.content
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* 最新版本 */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold dark:text-white">最新版本</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              当前版本
            </div>
          </div>
          <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 flex-grow">
            <div 
              className="whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: newHtml || currentPrompt?.content || '' }}
            />
          </div>
        </div>

        {/* 历史版本 */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold dark:text-white">历史版本</h2>
            <select
              className="w-[200px] p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 text-sm"
              onChange={(e) => {
                const selected = versions.find(v => v.id === e.target.value);
                setSelectedVersion(selected);
              }}
              value={selectedVersion?.id || ''}
            >
              <option value="">选择历史版本</option>
              {versions.map(version => (
                <option key={version.id} value={version.id}>
                  版本 {version.version} ({new Date(version.created_at).toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 flex-grow">
            {selectedVersion ? (
              <div 
                className="whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: oldHtml || selectedVersion.content || '' }}
              />
            ) : (
              <div className="text-gray-400 dark:text-gray-500">请选择一个历史版本进行对比</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 