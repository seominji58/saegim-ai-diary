# 감성 AI 다이어리 '새김' - Flow Chart Documentation

---

## 1. 문서 개요

### 문서 목적

본 문서는 '새김' 서비스의 주요 사용자 플로우와 시스템 플로우를 시각적으로 표현하여, 개발팀과 이해관계자들이 서비스 흐름을 명확히 이해할 수 있도록 돕는 플로우차트 문서입니다.

### 문서 정보

- **작성일**: 2025년 8월 11일
- **버전**: 1.0
- **작성자**: 새김꾼들
- **관련 문서**: PRD.md, TRD.md, PERSONA.md

### 다이어그램 범례

- 🟢 시작점
- 🔴 종료점
- 🔷 프로세스
- 🔶 결정 포인트
- 📊 데이터
- 👤 사용자 액션
- 🤖 시스템 처리
- ⚡ 외부 서비스

---

## 2. 전체 서비스 User Journey

### 2.1 사용자 여정 맵

```mermaid
journey
    title 새김 서비스 사용자 여정
    section 인지 단계
      SNS 광고 발견: 3: 잠재고객
      친구 추천: 5: 잠재고객
      앱스토어 검색: 4: 잠재고객
    section 가입 단계
      회원가입 진행: 4: 신규사용자
      온보딩 튜토리얼: 5: 신규사용자
      첫 일기 작성 시도: 3: 신규사용자
    section 경험 단계
      AI 글귀 생성 체험: 5: 활성사용자
      사진 업로드 및 합성: 5: 활성사용자
      감정 기록: 4: 활성사용자
    section 습관화 단계
      매일 기록: 5: 충성사용자
      월간 리포트 확인: 5: 충성사용자
      프리미엄 전환 고려: 4: 충성사용자
```

### 2.2 전체 서비스 플로우

```mermaid
flowchart TD
    Start([🟢 서비스 접속]) --> Auth{인증 상태}
    Auth -->|미인증| Login[로그인/회원가입]
    Auth -->|인증됨| Main[메인 대시보드]

    Login --> Main

    Main --> Choice{작업 선택}

    Choice -->|새 다이어리| Write[다이어리 작성]
    Choice -->|보관함| Archive[작품 보관함]
    Choice -->|리포트| Report[감정 리포트]
    Choice -->|알림| Notification[알림 관리]
    Choice -->|설정| Settings[개인 설정]

    Write --> Photo{사진 추가?}
    Photo -->|예| Upload[사진 업로드]
    Photo -->|아니오| Text[텍스트 작성]
    Upload --> Text

    Text --> Emotion[감정 선택]
    Emotion --> AI{AI 글귀 생성?}
    AI -->|예| Generate[AI 생성]
    AI -->|아니오| Save[저장]

    Generate --> Review[결과 검토]
    Review --> Download[다운로드/저장]
    Review -->|불만족| Generate

    Download --> Save

    Save --> End([🔴 완료])

    Archive --> View[다이어리 조회]
    Report --> Analysis[감정 분석 확인]
    Notification --> NotifManage[알림 관리]
    Settings --> Config[설정 변경]

    View --> End
    Analysis --> End
    NotifManage --> End
    Config --> End
```

---

## 3. 핵심 기능별 상세 플로우

### 3.1 AI 글귀 생성 플로우

```mermaid
flowchart LR
    Start([🟢 AI 생성 시작]) --> Input[사용자 입력]

    Input --> InputType{입력 유형}
    InputType -->|문장| Sentence[문장 처리]
    InputType -->|감정+키워드| Combined[복합 처리]

    Sentence --> Style
    Combined --> Style

    Style --> API[GPT API 호출]
    API --> Process["🤖 AI 처리<br/>컨텍스트 분석<br/>감성 변환"]

    Process --> Generate[글귀 생성]
    Generate --> Cache[Redis 캐싱]

    Cache --> Result[결과 표시]
    Result --> Satisfy{만족도}

    Satisfy -->|만족| Complete[✅ 완료]
    Satisfy -->|재생성| Regen[♻️ 재생성]
    Satisfy -->|수정| Edit[✏️ 직접 편집]

    Regen --> API
    Edit --> Complete

    Complete --> End([🔴 종료])
```

---

## Appendix

### A. 플로우차트 기호 설명

| 기호               | 의미          | 설명                        |
| ------------------ | ------------- | --------------------------- |
| `([시작])`         | 시작/종료     | 플로우의 시작점 또는 종료점 |
| `[프로세스]`       | 처리          | 일반적인 처리 단계          |
| `{결정}`           | 분기          | 조건에 따른 분기점          |
| `[(데이터베이스)]` | 저장소        | 데이터 저장소               |
| `[[서브루틴]]`     | 서브 프로세스 | 별도 정의된 프로세스        |

### B. 성능 목표

- 페이지 로드: < 3초
- API 응답: < 200ms
- AI 생성: < 5초
- 이미지 합성: < 3초

### C. 주요 통합 포인트

1. **OpenAI GPT API**: AI 텍스트 생성
2. **MinIO**: 이미지 저장소
3. **PostgreSQL**: 주 데이터베이스
4. **Redis**: 캐싱 및 세션
5. **Next.js**: 프론트엔드
6. **FastAPI**: 백엔드 API
7. **브라우저 Push API**: 웹 푸시 알림
8. **Node.js Cron**: 스케줄링 시스템

---

_본 문서는 '새김' 프로젝트의 플로우차트 문서로, 시스템과 사용자 플로우를 시각적으로 표현합니다._
