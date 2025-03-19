'use client'
import { createContext, useState, useContext, useEffect } from 'react'
import zh from './locales/zh'
import en from './locales/en'
import ja from './locales/ja'
import { defaultLocale } from './settings'

const locales = { zh, en, ja }
const I18nContext = createContext()

export function I18nProvider({ children }) {
  // 初始状态使用默认语言
  const [locale, setLocale] = useState(defaultLocale)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // 在客户端加载完成后，从 localStorage 读取语言设置
    setIsClient(true)
    const savedLocale = localStorage.getItem('language')
    if (savedLocale && locales[savedLocale]) {
      setLocale(savedLocale)
    }
  }, [])

  const t = (key) => {
    return key.split('.').reduce((obj, k) => obj?.[k], locales[locale]) || key
  }

  const changeLocale = (newLocale) => {
    if (locales[newLocale]) {
      localStorage.setItem('language', newLocale)
      setLocale(newLocale)
    }
  }

  return (
    <I18nContext.Provider value={{ t, locale, changeLocale, isClient }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext) 