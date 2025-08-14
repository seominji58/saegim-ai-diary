'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/use-theme';
import Header from '@/components/layout/Header';
import { NextPage } from 'next';

const LandingPage: NextPage = () => {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: 'var(--page-background)'
      }}
    >
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-6">
            AI와 함께 쓰는 감성 다이어리
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            당신의 하루를 AI가 아름다운 글귀로 표현해드립니다
          </p>
          <button
            onClick={() => router.push('/login')}
            className="saegim-button saegim-button-large"
          >
            시작하기
          </button>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          {/* AI 감성 글귀 생성 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 font-serif">
              AI 감성 글귀 생성
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              키워드만 입력하면 AI가 당신의 감정을 담은 아름다운 시와 산문을 만들어드려요
            </p>
          </div>

          {/* 감정 분석 & 리포트 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 font-serif">
              감정 분석 & 리포트
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              AI가 당신의 감정을 분석하고 월간 감정 패턴을 시각적으로 보여드려요
            </p>
          </div>

          {/* 감정 캘린더 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 font-serif">
              감정 캘린더
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              매일의 감정을 캘린더에서 한눈에 확인하고 감정의 변화를 주저해보세요
            </p>
          </div>

          {/* 완전한 프라이버시 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 font-serif">
              완전한 프라이버시
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              모든 기록은 암호화되어 안전하게 보관되며, 오직 당신만 볼 수 있어요
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;