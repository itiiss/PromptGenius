'use client'
import { useI18n } from './i18n/i18nContext'

export default function Home() {
  const { t } = useI18n()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <main className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">{t('home.title')}</h1>
        <p className="text-xl text-gray-600 mb-12">{t('home.description')}</p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="/prompts/new"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {t('home.buttons.createNew')}
          </a>

          <a
            href="/prompts"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 ease-in-out"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
            {t('home.buttons.viewAll')}
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {['organize', 'edit', 'share'].map((feature) => (
            <div key={feature} className="p-6 bg-white rounded-lg shadow-md">
              <svg className="w-12 h-12 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">{t(`home.features.${feature}.title`)}</h3>
              <p className="text-gray-600">{t(`home.features.${feature}.description`)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
