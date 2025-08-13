'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/hooks/use-theme';

export default function HomePage() {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="flex flex-col h-screen"
      style={{ 
        backgroundColor: isDark ? '#111827' : '#e5f0ef'
      }}
    >
      {/* 헤더 */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <Sidebar />
        
        {/* 메인 컨텐츠 - 스크롤 가능 */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif mb-6 text-gray-800 dark:text-white">
                AI와 함께하는 감성 다이어리
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                일상을 기록하고 AI가 당신만의 특별한 이야기로 만들어드립니다.
              </p>
              
              {/* 대시보드 카드들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">오늘의 일기</h3>
                  <p className="text-gray-600 dark:text-gray-300">오늘 하루를 기록해보세요</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">감정 분석</h3>
                  <p className="text-gray-600 dark:text-gray-300">AI가 분석한 당신의 감정</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">통계</h3>
                  <p className="text-gray-600 dark:text-gray-300">일기 작성 통계를 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
