'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import 'react-diff-view/style/index.css';
import { versionsApi } from '../../../api/versions';
import { useI18n } from '../../../i18n/i18nContext';

export default function PromptVersions({ params }) {
  const { id } = use(params);
  const [versions, setVersions] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

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

  if (loading) return <div>{t('versions.loading')}</div>;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* 最新版本 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {t('versions.title.latest')}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {t('versions.title.current')}
              </span>
            </h2>
          </div>
          <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 
                        border-gray-200 dark:border-gray-700 shadow-sm">
            <div 
              className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 
                         min-h-[200px] max-h-[400px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: newHtml || currentPrompt?.content || '' }}
            />
          </div>
        </div>

        {/* 历史版本 */}
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-1">
            <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {t('versions.title.history')}
            </h2>
            <select
              className="w-full sm:w-[200px] px-3 py-2 text-sm border rounded-lg
                         bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
                         text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              onChange={(e) => {
                const selected = versions.find(v => v.id === e.target.value);
                setSelectedVersion(selected);
              }}
              value={selectedVersion?.id || ''}
            >
              <option value="">{t('versions.select.placeholder')}</option>
              {versions.map(version => (
                <option key={version.id} value={version.id}>
                  {t('versions.select.version', {
                    number: version.version,
                    date: new Date(version.created_at).toLocaleString()
                  })}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 
                        border-gray-200 dark:border-gray-700 shadow-sm">
            {selectedVersion ? (
              <div 
                className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200
                           min-h-[200px] max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: oldHtml || selectedVersion.content || '' }}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px] 
                             text-sm text-gray-400 dark:text-gray-500">
                {t('versions.comparePrompt')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 