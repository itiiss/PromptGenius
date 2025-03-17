'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

export default function CreatePrompt() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    version: '1.0',
    coverImage: null
  });

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
    try {
    

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];

      const { data, error } = await supabase
        .from('prompts')
        .insert([{
          title: formData.title,
          content: formData.content,
          tags: tagsArray,
          description: formData.description,
          version: formData.version,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('提示词创建成功:', data);
      // TODO: 添加成功提示并跳转到提示词列表页
      
    } catch (error) {
      console.error('创建提示词出错:', error);
      // TODO: 显示错误提示
    }
  };

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
              placeholder="输入版本号"
            />
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