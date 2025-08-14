'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/hooks/use-theme';

import { NextPage } from 'next';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [profileData, setProfileData] = useState({
    nickname: '새김사용자',
    email: 'user@saegim.com',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = () => {
    // TODO: 프로필 업데이트 로직 구현
    console.log('프로필 업데이트:', profileData);
  };

  const handlePasswordChange = () => {
    router.push('/account/change-password');
  };

  const handleAccountDelete = () => {
    // TODO: 계정 탈퇴 로직 구현
    console.log('계정 탈퇴');
  };

  const handleCustomerService = () => {
    // TODO: 고객센터 문의 로직 구현
    console.log('고객센터 문의');
  };

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
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* 프로필 정보 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">프로필 정보</h2>
                
                <div className="flex space-x-6">
                  {/* 프로필 이미지 */}
                  <div className="flex flex-col items-center min-w-[240px]">
                    <div className="w-48 h-48 bg-gray-200 dark:bg-gray-600 rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                      <span className="text-6xl">📷</span>
                    </div>
                  </div>

                  {/* 프로필 정보 입력 */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        닉네임 입력
                      </label>
                      <p className="text-xs text-gray-900 dark:text-gray-100 mb-2">
                        다른 사용자에게 표시되는 이름입니다.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="nickname"
                          value={profileData.nickname}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-50 dark:focus:ring-sage-50 focus:border-sage-50 dark:focus:border-sage-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="닉네임을 입력하세요"
                        />
                        <button
                          onClick={() => console.log('닉네임 중복 확인')}
                          className="saegim-button saegim-button-small"
                        >
                          중복확인
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        이메일 정보
                      </label>
                      <p className="text-xs text-gray-900 dark:text-gray-100 mb-2">
                        로그인 및 알림에 사용되는 이메일입니다.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-50 dark:focus:ring-sage-50 focus:border-sage-50 dark:focus:border-sage-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="이메일을 입력하세요"
                        />
                        <button
                          onClick={() => console.log('이메일 중복 확인')}
                          className="saegim-button saegim-button-small"
                        >
                          중복확인
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 프로필 업데이트 버튼 */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                  <button
                    onClick={handleProfileUpdate}
                    className="saegim-button saegim-button-medium"
                  >
                    프로필 업데이트
                  </button>
                </div>
              </div>

              {/* 보안 설정 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">보안 설정</h2>
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-4">
                  계정 보안을 위한 설정을 관리합니다.
                </p>
                <button
                  onClick={handlePasswordChange}
                  className="saegim-button saegim-button-medium"
                >
                  비밀번호 변경
                </button>
              </div>

              {/* 계정 설정 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">계정 설정</h2>
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-4">
                  계정을 탈퇴하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAccountDelete}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    계정 탈퇴
                  </button>
                  <button
                    onClick={handleCustomerService}
                    className="px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    고객센터 문의
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;