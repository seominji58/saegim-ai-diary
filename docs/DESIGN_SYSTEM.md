# 감성 AI 다이어리 '새김' - Design System Document

---

## 1. 문서 개요

### 문서 목적

본 문서는 '새김' 서비스의 통일된 UI/UX 디자인 시스템을 정의하고, 일관된 사용자 경험 제공을 위한 디자인 가이드라인을 제공합니다.

### 문서 정보

- **작성일**: 2025년 8월 10일
- **버전**: 1.0
- **작성자**: 새김꾼들
- **관련 문서**: PRD.md, API_SPECS.md, ERD.md

---

## 2. 디자인 원칙

### 2.1 브랜드 철학

'새김'은 **'자연에서 얻는 치유와 성장'** 을 핵심 철학으로 하여, 사용자가 일상의 감정을 기록하며 내면의 평화와 안정을 찾을 수 있는 디지털 공간을 제공합니다.

- **자연적 치유**: 자연의 색상과 형태에서 영감을 받은 차분하고 안정적인 시각적 언어
- **감정적 성장**: 기록을 통한 자기 성찰과 감정적 성숙을 지원하는 따뜻한 디자인
- **심리적 안정**: 눈의 피로를 최소화하고 장시간 사용해도 편안한 힐링 컬러 시스템
- **개인적 공간**: 프라이빗하고 안전한 나만의 기록 공간임을 시각적으로 강조

### 2.2 브랜드 가치

- **Natural (자연적)**: 자연에서 영감을 받은 유기적이고 조화로운 색상과 형태
- **Healing (치유적)**: 심리적 안정감을 주는 차분하고 부드러운 시각적 톤앤매너
- **Growth (성장지향)**: 기록을 통한 개인적 성장과 발전을 상징하는 디자인 언어
- **Trustworthy (신뢰적)**: 미니멀하고 정돈된 인상으로 서비스 신뢰도를 높이는 디자인

### 2.3 UI/UX 핵심 원칙

1. **Nature-Inspired Design**: 자연의 색상과 패턴에서 영감을 받은 직관적 인터페이스
2. **Emotional Wellness**: 감정 기록과 회고를 통한 심리적 웰빙을 지원하는 디자인
3. **Universal Accessibility**: 성별과 연령에 구애받지 않는 포용적이고 접근 가능한 디자인
4. **Content-Centric**: 사용자의 소중한 기록이 중심이 되는 미니멀한 인터페이스
5. **Privacy by Design**: 개인적이고 안전한 공간임을 시각적으로 강조하는 디자인

---

## 3. 감정 타입 UI/UX 시스템

### 3.1 감정 타입 매핑 테이블

| API 키워드 | 이모지 | 한글명 | UI 표시 | 색상 코드 (권장) | 보조 색상 | 배경 색상 |
| ---------- | ------ | ------ | ------- | ---------------- | --------- | --------- |
| `happy`    | 😊     | 행복   | 행복    | #E6C55A (Soft Gold)   | #F5F0DB   | #FAF7E8   |
| `sad`      | 😢     | 슬픔   | 슬픔    | #6B8AC7 (Calm Blue)   | #E8EEF7   | #F2F6FB   |
| `angry`    | 😡     | 화남   | 화남    | #D67D5C (Warm Orange) | #F3E5E0   | #F8F0EC   |
| `peaceful` | 😌     | 평온   | 평온    | #7DB87D (Natural Green) | #E8F0E8   | #F0F7F0   |
| `worried`  | 🫨     | 불안   | 불안    | #E6B366 (Gentle Orange) | #F5EBDC   | #FAF4E8   |

### 3.2 감정별 시각적 표현 가이드

#### 행복 (Happy)

- **주요 색상**: Soft Gold (#E6C55A)
- **시각적 특성**: 따뜻하고 부드러운 황금빛, 자연스러운 온기
- **아이콘 스타일**: 둥글고 부드러운 형태, 햇살이나 꽃 모티브
- **사용 예시**: 캘린더 아이콘, 감정 선택 버튼, 통계 그래프, 성취 표시

#### 슬픔 (Sad)

- **주요 색상**: Calm Blue (#6B8AC7)
- **시각적 특성**: 차분하고 위로가 되는 블루, 깊이 있으면서도 따뜻함
- **아이콘 스타일**: 부드럽고 곡선적인 형태, 물방울이나 구름 모티브
- **사용 예시**: 감정 표시, 월간 리포트 차트, 회고 섹션

#### 화남 (Angry)

- **주요 색상**: Warm Orange (#D67D5C)
- **시각적 특성**: 따뜻한 오렌지 톤으로 강렬함보다는 정열적 표현
- **아이콘 스타일**: 부드러운 각도를 가진 형태, 불꽃이나 삼각형 모티브
- **사용 예시**: 감정 강조, 중요한 알림, 주의 메시지

#### 평온 (Peaceful)

- **주요 색상**: Natural Green (#7DB87D)
- **시각적 특성**: 자연의 녹색과 조화로운 안정적인 톤
- **아이콘 스타일**: 유기적이고 자연스러운 형태, 잎사귀나 물결 모티브
- **사용 예시**: 성공 상태, 완료 표시, 명상이나 휴식 관련 UI

#### 불안 (Worried)

- **주요 색상**: Gentle Orange (#E6B366)
- **시각적 특성**: 부드러운 오렌지로 따뜻하면서도 신중한 느낌
- **아이콘 스타일**: 부드러운 곡선의 물음표나 구름 형태
- **사용 예시**: 진행 중 상태, 검토 필요 표시, 사고 과정 표현

### 3.3 감정 표현 컴포넌트

#### 감정 선택 버튼

```css
.emotion-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: var(--emotion-bg-color);
  transition: all 0.3s ease;
}

.emotion-button:hover {
  border-color: var(--emotion-main-color);
  box-shadow: 0 4px 12px var(--emotion-main-color) 33;
}

.emotion-button.selected {
  border-color: var(--emotion-main-color);
  background: var(--emotion-main-color) 22;
}
```

#### 캘린더 감정 아이콘

```css
.calendar-emotion {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--emotion-main-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
```

---

## 4. 브랜드 컬러 시스템

### 4.1 브랜드 컬러 철학

'새김'의 브랜드 컬러로 **Sage Green** 컨셉을 선택하여, 자연에서 얻는 치유와 안정감을 시각적으로 표현합니다.

#### 컨셉 선택 배경

**세이지 그린 (Sage Green)** 은 차분한 녹색 계열로 다음과 같은 특성을 가집니다:

- **심리적 치유 효과**: 눈의 피로를 덜어주고 정신적 안정감을 제공
- **성장과 발전 상징**: '기록을 통한 성장'이라는 서비스 가치와 직접적 연관
- **보편적 매력**: 성별, 연령에 구애받지 않는 안정적인 선호도
- **눈의 편안함**: 장시간 사용해도 눈이 편안한 힐링 컬러

### 4.2 브랜드 컬러 팔레트

#### 세이지 그린 10단계 그라데이션

| 레벨 | HEX 코드 | RGB | 사용 예시 |
|------|----------|-----|----------|
| **Sage-10** | #F7F9F8 | rgb(247, 249, 248) | 배경, 카드 배경 |
| **Sage-20** | #EDF2EE | rgb(237, 242, 238) | 보조 배경, hover 상태 |
| **Sage-30** | #DFE8E1 | rgb(223, 232, 225) | 분리선, 경계 |
| **Sage-40** | #C9D6CB | rgb(201, 214, 203) | disabled 상태 |
| **Sage-50** | #B2C5B8 | rgb(178, 197, 184) | **Primary Brand Color** |
| **Sage-60** | #9BB5A2 | rgb(155, 181, 162) | hover 상태 |
| **Sage-70** | #84A68C | rgb(132, 166, 140) | active 상태 |
| **Sage-80** | #6D9676 | rgb(109, 150, 118) | 강조 요소 |
| **Sage-90** | #568660 | rgb(86, 134, 96) | 진한 강조 |
| **Sage-100** | #3F764A | rgb(63, 118, 74) | 최고 강조, 텍스트 |

#### 보조 컬러 팔레트

| 역할 | 컬러명 | HEX 코드 | 사용 예시 |
|------|----------|----------|---------|
| **Base** | Off-White | #FDFDFD | 기본 배경 |
| **Text** | Medium Gray | #6D7275 | 기본 텍스트 |
| **Accent** | Pale Lavender | #D2D4E1 | 보조 액센트 |
| **Warm Beige** | Ivory Cream | #F9F5EF | 따뜻한 배경 |
| **Dusty Rose** | Soft Rose | #E8C4C0 | 감성적 액센트 |

### 4.3 의미론적 토큰 시스템

#### Interactive 토큰

```css
:root {
  /* Primary Interactive */
  --interactive-primary: #B2C5B8;           /* Sage-50 */
  --interactive-primary-hover: #9BB5A2;      /* Sage-60 */
  --interactive-primary-active: #84A68C;     /* Sage-70 */
  --interactive-primary-disabled: #C9D6CB;   /* Sage-40 */

  /* Secondary Interactive */
  --interactive-secondary: #EDF2EE;          /* Sage-20 */
  --interactive-secondary-hover: #DFE8E1;    /* Sage-30 */
  --interactive-secondary-active: #C9D6CB;   /* Sage-40 */

  /* Tertiary Interactive */
  --interactive-tertiary: #F7F9F8;           /* Sage-10 */
  --interactive-tertiary-hover: #EDF2EE;     /* Sage-20 */
}
```

#### Background 토큰

```css
:root {
  --background-primary: #FDFDFD;             /* Off-White */
  --background-secondary: #F7F9F8;           /* Sage-10 */
  --background-tertiary: #EDF2EE;            /* Sage-20 */
  --background-hover: #DFE8E1;               /* Sage-30 */
  --background-selected: #C9D6CB;            /* Sage-40 */
  --background-brand: #B2C5B8;               /* Sage-50 */
}
```

#### Text 토큰

```css
:root {
  --text-primary: #6D7275;                   /* Medium Gray */
  --text-secondary: #9CA3AF;                 /* Light Gray */
  --text-placeholder: #D1D5DB;               /* Placeholder */
  --text-on-color: #FFFFFF;                  /* White */
  --text-on-brand: #3F764A;                  /* Sage-100 */
  --text-inverse: #111827;                   /* Dark */
}
```

#### Border 토큰

```css
:root {
  --border-subtle: #EDF2EE;                  /* Sage-20 */
  --border-strong: #C9D6CB;                  /* Sage-40 */
  --border-interactive: #B2C5B8;             /* Sage-50 */
  --border-focus: #84A68C;                   /* Sage-70 */
  --border-inverse: #3F764A;                 /* Sage-100 */
}
```

### 4.4 브랜드 컬러 사용 가이드

#### 기본 사용 법

1. **Primary Action**: Sage-50을 기본으로 사용
2. **Secondary Action**: Sage-20 또는 Sage-30 사용
3. **Background**: Sage-10과 Off-White를 조합
4. **Text**: Medium Gray를 기본으로, Sage-100을 강조용

#### 접근성 고려사항

- **대비율 준수**: WCAG 2.1 AA 기준 4.5:1 이상
- **색맹 지원**: 색상 외에 아이콘이나 패턴으로 정보 전달
- **다크 모드**: 밝기 조정된 별도 팔레트 사용

---

## 5. 색상 시스템

### 5.1 기본 색상 팔레트

#### 브랜드 컬러

- **Primary**: #B2C5B8 (Sage Green - 새김 브랜드 컬러)
- **Secondary**: #EDF2EE (Light Sage - 보조 브랜드 컬러)
- **Accent**: #E8C4C0 (Soft Rose - 감성적 강조 컬러)

#### 시스템 컬러

- **Success**: #10B981 (성공, 완료)
- **Warning**: #F59E0B (주의, 경고)
- **Error**: #EF4444 (오류, 실패)
- **Info**: #3B82F6 (정보, 안내)

#### 그레이 스케일

- **Gray-50**: #F9FAFB
- **Gray-100**: #F3F4F6
- **Gray-200**: #E5E7EB
- **Gray-300**: #D1D5DB
- **Gray-400**: #9CA3AF
- **Gray-500**: #6B7280
- **Gray-600**: #4B5563
- **Gray-700**: #374151
- **Gray-800**: #1F2937
- **Gray-900**: #111827

### 4.2 색상 사용 가이드

#### 배경 색상

- **기본 배경**: #FFFFFF
- **보조 배경**: #F9FAFB
- **카드 배경**: #FFFFFF (그림자 포함)
- **입력 필드**: #F3F4F6

#### 텍스트 색상

- **주요 텍스트**: #111827
- **보조 텍스트**: #6B7280
- **비활성 텍스트**: #9CA3AF
- **링크 텍스트**: #6366F1

---

## 5. 타이포그래피

### 5.1 폰트 시스템

#### 기본 폰트 스택

```css
--font-family-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-family-serif: 'Noto Serif KR', Georgia, serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### AI 생성 글귀용 폰트

```css
--font-family-poetic: 'Nanum Myeongjo', 'Noto Serif KR', serif;
--font-family-handwriting: 'Nanum Pen Script', cursive;
```

### 5.2 타이포그래피 스케일

| 레벨           | 크기 | 행간 | 용도           |
| -------------- | ---- | ---- | -------------- |
| **H1**         | 32px | 40px | 페이지 제목    |
| **H2**         | 24px | 32px | 섹션 제목      |
| **H3**         | 20px | 28px | 하위 섹션 제목 |
| **H4**         | 18px | 24px | 카드 제목      |
| **Body Large** | 16px | 24px | 본문 텍스트    |
| **Body**       | 14px | 20px | 기본 텍스트    |
| **Body Small** | 12px | 16px | 보조 정보      |
| **Caption**    | 10px | 14px | 캡션, 라벨     |

### 5.3 AI 글귀 표시 스타일

#### 시 형태

```css
.ai-poem {
  font-family: var(--font-family-poetic);
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #374151;
}
```

#### 산문 형태

```css
.ai-prose {
  font-family: var(--font-family-serif);
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: justify;
  color: #4b5563;
}
```

---

## 6. 컴포넌트 라이브러리

### 6.1 기본 컴포넌트

#### 버튼

```css
/* 기본 버튼 */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

/* Primary 버튼 */
.btn-primary {
  background: var(--interactive-primary);
  color: var(--text-on-color);
}

.btn-primary:hover {
  background: var(--interactive-primary-hover);
  box-shadow: 0 4px 12px var(--interactive-primary)33;
}

/* 감정 선택 버튼 */
.btn-emotion {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
```

#### 입력 필드

```css
.input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--interactive-primary)22;
}
```

#### 카드

```css
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 6.2 특화 컴포넌트

#### 다이어리 카드

```css
.diary-card {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.diary-card-header {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.diary-card-emotion {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 월간 리포트 차트

```css
.emotion-chart {
  width: 100%;
  height: 300px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
}

.emotion-bar {
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}

.emotion-bar:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}
```

---

## 7. 이미지 및 미디어 가이드

### 7.1 이미지 업로드 UI

#### 드래그앤드롭 영역

```css
.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.image-upload-area:hover,
.image-upload-area.drag-over {
  border-color: #6366f1;
  background: #f0f0ff;
}
```

#### 이미지 미리보기

```css
.image-preview {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 7.2 AI 생성 콘텐츠와 이미지 합성

#### 템플릿 스타일

- **미니멀**: 여백 중심, 깔끔한 타이포그래피
- **감성**: 그라데이션, 부드러운 곡선
- **모던**: 기하학적 패턴, 대비 강조
- **자연**: 유기적 형태, 자연 색상

---

## 8. 반응형 디자인

### 8.1 브레이크포인트

```css
/* 모바일 */
@media (max-width: 767px) {
  .container {
    padding: 16px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 태블릿 */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 24px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 8.2 모바일 우선 설계

- 터치 친화적 인터페이스 (최소 44px 터치 영역)
- 한 손 사용 가능한 네비게이션
- 스와이프 제스처 지원
- 빠른 로딩을 위한 최적화

---

## 9. 접근성 (Accessibility)

### 9.1 색상 접근성

- **색상 대비**: WCAG 2.1 AA 기준 4.5:1 이상
- **색맹 고려**: 색상만으로 정보 전달 금지
- **고대비 모드**: 시스템 설정 연동

### 9.2 키보드 접근성

- **Tab 순서**: 논리적인 포커스 순서
- **Skip Links**: 메인 콘텐츠로 바로가기
- **키보드 단축키**: 주요 기능 접근

### 9.3 스크린 리더 지원

```html
<!-- 감정 선택 버튼 -->
<button class="btn-emotion happy" aria-label="행복한 감정 선택" role="button">
  <span aria-hidden="true">😊</span>
  <span>행복</span>
</button>
```

---

## 10. 애니메이션 및 모션

### 10.1 모션 원칙

- **의미 있는 모션**: 사용자 이해를 돕는 애니메이션
- **부드러운 전환**: easing function 활용
- **성능 고려**: 60fps 유지
- **사용자 설정 존중**: prefers-reduced-motion 지원

### 10.2 주요 애니메이션

#### 페이지 전환

```css
.page-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 감정 선택 피드백

```css
.emotion-selected {
  animation: emotionPulse 0.6s ease-out;
}

@keyframes emotionPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
```

---

## 11. 다크 모드 지원

### 11.1 다크 모드 디자인 철학

다크 모드에서도 '새김'의 치유적이고 자연스러운 브랜드 특성을 유지하면서, 눈의 피로를 최소화하고 야간 사용 환경에 최적화된 경험을 제공합니다.

#### 다크 모드 원칙

- **자연스러운 전환**: 브랜드 아이덴티티를 유지하면서 어둠에 적응
- **눈의 편안함**: 저조도 환경에서의 시각적 편안함 최우선
- **감정 보존**: 감정별 색상의 의미와 차별성 유지
- **접근성 준수**: WCAG 다크 모드 접근성 기준 준수

### 11.2 다크 모드 색상 시스템

#### 브랜드 컬러 다크 모드 변형

```css
:root {
  /* 라이트 모드 (기본) */
  --bg-primary: #FDFDFD;
  --text-primary: #6D7275;
  --interactive-primary: #B2C5B8;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* 배경 색상 */
    --bg-primary: #1A1E1C;
    --bg-secondary: #232822;
    --bg-tertiary: #2C322B;

    /* 텍스트 색상 */
    --text-primary: #E5E7E6;
    --text-secondary: #B8BAB9;
    --text-placeholder: #8A8C8B;

    /* 브랜드 컬러 (다크 모드 조정) */
    --interactive-primary: #8FB59C;           /* 더 밝은 Sage */
    --interactive-primary-hover: #A3C4B0;     /* Hover 상태 */
    --interactive-primary-active: #7AA287;    /* Active 상태 */

    /* 배경 토큰 */
    --background-primary: #1A1E1C;
    --background-secondary: #232822;
    --background-tertiary: #2C322B;
    --background-hover: #343A33;
    --background-selected: #3C443B;

    /* 보더 토큰 */
    --border-subtle: #2C322B;
    --border-strong: #3C443B;
    --border-focus: #8FB59C;
  }
}
```

### 11.3 감정 색상 다크 모드 조정

감정별 색상을 다크 모드에서도 명확히 구분할 수 있도록 조정하되, 과도한 채도는 피하여 눈의 편안함을 유지합니다.

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* 감정별 다크 모드 색상 */
    --emotion-happy: #E6C55A;      /* 유지 (충분히 밝음) */
    --emotion-happy-bg: #2B2820;

    --emotion-sad: #7A9BD1;        /* 약간 더 밝게 */
    --emotion-sad-bg: #1F242B;

    --emotion-angry: #E08A6B;      /* 약간 더 밝게 */
    --emotion-angry-bg: #2B221F;

    --emotion-peaceful: #8FC28F;   /* 약간 더 밝게 */
    --emotion-peaceful-bg: #1F2B1F;

    --emotion-worried: #EBC170;    /* 약간 더 밝게 */
    --emotion-worried-bg: #2B2620;
  }
}
```

### 11.4 다크 모드 사용성 고려사항

#### 자동 전환 지원

```css
/* 시스템 설정 자동 감지 */
@media (prefers-color-scheme: dark) {
  /* 다크 모드 스타일 */
}

/* 사용자 토글 지원 */
[data-theme="dark"] {
  /* 수동 다크 모드 스타일 */
}
```

#### 콘텐츠 가독성

- **텍스트 대비율**: 최소 7:1 (AAA 수준)
- **이미지 오버레이**: 다크 배경에서 이미지 가독성 확보
- **그림자 조정**: 다크 모드에서 적절한 그림자와 하이라이트

#### 애니메이션 및 전환

```css
/* 부드러운 모드 전환 */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* 모션 민감성 고려 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
  }
}
```

---

## 12. 사용 예시

### 12.1 캘린더 뷰에서 감정 표시

```html
<div class="calendar-day">
  <div class="calendar-date">15</div>
  <div class="calendar-emotion happy" title="행복한 하루">😊</div>
</div>
```

### 12.2 감정 리포트에서 통계 표시

```html
<div class="emotion-stats">
  <div class="emotion-stat-item">
    <div class="emotion-icon happy">😊</div>
    <div class="emotion-label">행복</div>
    <div class="emotion-count">12일</div>
  </div>
</div>
```

### 12.3 다이어리 작성 시 감정 선택

```html
<div class="emotion-selector">
  <h3>오늘의 감정은 어떠셨나요?</h3>
  <div class="emotion-buttons">
    <button class="btn-emotion" data-emotion="happy">
      <span class="emotion-icon">😊</span>
      <span class="emotion-text">행복</span>
    </button>
    <!-- 다른 감정 버튼들... -->
  </div>
</div>
```

---

## Appendix

### A. CSS 변수 정의

```css
:root {
  /* ==========  브랜드 컬러 시스템  ========== */

  /* Sage Green 10단계 그라데이션 */
  --sage-10: #F7F9F8;
  --sage-20: #EDF2EE;
  --sage-30: #DFE8E1;
  --sage-40: #C9D6CB;
  --sage-50: #B2C5B8;    /* Primary Brand */
  --sage-60: #9BB5A2;
  --sage-70: #84A68C;
  --sage-80: #6D9676;
  --sage-90: #568660;
  --sage-100: #3F764A;

  /* 보조 컬러 팔레트 */
  --off-white: #FDFDFD;
  --medium-gray: #6D7275;
  --pale-lavender: #D2D4E1;
  --ivory-cream: #F9F5EF;
  --soft-rose: #E8C4C0;

  /* ==========  의미론적 토큰  ========== */

  /* Interactive 토큰 */
  --interactive-primary: var(--sage-50);
  --interactive-primary-hover: var(--sage-60);
  --interactive-primary-active: var(--sage-70);
  --interactive-primary-disabled: var(--sage-40);
  --interactive-secondary: var(--sage-20);
  --interactive-tertiary: var(--sage-10);

  /* Background 토큰 */
  --background-primary: var(--off-white);
  --background-secondary: var(--sage-10);
  --background-tertiary: var(--sage-20);
  --background-hover: var(--sage-30);
  --background-selected: var(--sage-40);
  --background-brand: var(--sage-50);

  /* Text 토큰 */
  --text-primary: var(--medium-gray);
  --text-secondary: #9CA3AF;
  --text-placeholder: #D1D5DB;
  --text-on-color: #FFFFFF;
  --text-on-brand: var(--sage-100);
  --text-inverse: #111827;

  /* Border 토큰 */
  --border-subtle: var(--sage-20);
  --border-strong: var(--sage-40);
  --border-interactive: var(--sage-50);
  --border-focus: var(--sage-70);
  --border-inverse: var(--sage-100);

  /* ==========  감정별 색상 시스템  ========== */

  /* 감정 주요 색상 (브랜드 톤 조화) */
  --emotion-happy: #E6C55A;      /* Soft Gold */
  --emotion-sad: #6B8AC7;        /* Calm Blue */
  --emotion-angry: #D67D5C;      /* Warm Orange */
  --emotion-peaceful: #7DB87D;   /* Natural Green */
  --emotion-worried: #E6B366;    /* Gentle Orange */

  /* 감정별 보조 색상 */
  --emotion-happy-secondary: #F5F0DB;
  --emotion-sad-secondary: #E8EEF7;
  --emotion-angry-secondary: #F3E5E0;
  --emotion-peaceful-secondary: #E8F0E8;
  --emotion-worried-secondary: #F5EBDC;

  /* 감정별 배경 색상 */
  --emotion-happy-bg: #FAF7E8;
  --emotion-sad-bg: #F2F6FB;
  --emotion-angry-bg: #F8F0EC;
  --emotion-peaceful-bg: #F0F7F0;
  --emotion-worried-bg: #FAF4E8;

  /* ==========  시스템 색상  ========== */

  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}

/* ==========  다크 모드 변형  ========== */

@media (prefers-color-scheme: dark) {
  :root {
    /* 배경 시스템 */
    --background-primary: #1A1E1C;
    --background-secondary: #232822;
    --background-tertiary: #2C322B;
    --background-hover: #343A33;
    --background-selected: #3C443B;

    /* 텍스트 시스템 */
    --text-primary: #E5E7E6;
    --text-secondary: #B8BAB9;
    --text-placeholder: #8A8C8B;
    --text-inverse: #111827;

    /* 브랜드 컬러 다크 모드 조정 */
    --interactive-primary: #8FB59C;
    --interactive-primary-hover: #A3C4B0;
    --interactive-primary-active: #7AA287;

    /* 보더 시스템 */
    --border-subtle: #2C322B;
    --border-strong: #3C443B;
    --border-focus: #8FB59C;

    /* 감정별 다크 모드 색상 */
    --emotion-happy: #E6C55A;        /* 유지 */
    --emotion-happy-bg: #2B2820;
    --emotion-sad: #7A9BD1;          /* 더 밝게 */
    --emotion-sad-bg: #1F242B;
    --emotion-angry: #E08A6B;        /* 더 밝게 */
    --emotion-angry-bg: #2B221F;
    --emotion-peaceful: #8FC28F;     /* 더 밝게 */
    --emotion-peaceful-bg: #1F2B1F;
    --emotion-worried: #EBC170;      /* 더 밝게 */
    --emotion-worried-bg: #2B2620;
  }
}
```

### B. 브라우저 지원 가이드

- **최신 브라우저**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **점진적 향상**: 구버전에서는 기본 스타일 제공
- **Polyfill**: 필요시 CSS Grid, Flexbox polyfill 적용

### C. 디자인 토큰 관리

디자인 시스템의 일관성을 위해 Figma, Storybook 등의 도구와 연동하여 디자인 토큰을 관리합니다.

---

_본 문서는 '새김' 프로젝트의 공식 디자인 시스템 문서로, UI/UX의 일관성과 사용성을 보장하기 위한 가이드라인을 제공합니다._
