'use client'
import { useI18n } from '../i18n/i18nContext'

export default function LanguageSwitcher() {
  const { locale, changeLocale, isClient } = useI18n()
  
  if (!isClient) return null

  const handleChange = (event) => {
    changeLocale(event.target.value)
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100"
    >
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  )
} 