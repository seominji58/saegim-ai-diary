# 감성 AI 다이어리 '새김' - API Specification

---

## 1. 문서 개요

### 문서 목적

본 문서는 '새김' 서비스의 RESTful API 명세를 정의합니다. 모든 API 엔드포인트, 요청/응답 형식, 에러 처리, 보안 정책을 포함한 완전한 API 가이드를 제공합니다.

### 문서 정보

- **작성일**: 2025년 8월 9일
- **버전**: 1.0
- **작성자**: 새김꾼들
- **관련 문서**: PRD.md, TRD.md, ERD.md, PERSONA.md, FLOW_CHART.md

### API 버전

- **현재 버전**: v1
- **Base URL**: `https://saegim-api.aicc-project.com`
- **API Path**: `/api`

---

## 2. API 표준

### 2.1 요청 표준

#### HTTP 메서드

| 메서드 | 용도             | 예시               |
| ------ | ---------------- | ------------------ |
| GET    | 리소스 조회      | 다이어리 목록 조회 |
| POST   | 리소스 생성      | 새 다이어리 작성   |
| PUT    | 리소스 전체 수정 | 다이어리 수정      |
| PATCH  | 리소스 부분 수정 | 다이어리 상태 변경 |
| DELETE | 리소스 삭제      | 다이어리 삭제      |

#### 요청 헤더

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
X-Request-ID: {uuid}
Accept-Language: ko-KR
```

#### 요청 본문 인코딩

- **문자 인코딩**: UTF-8
- **날짜 형식**: ISO 8601 (예: `2025-08-09T12:00:00Z`)
- **ID 형식**: UUID v4

### 2.2 응답 표준

#### 표준 응답 구조

```typescript
interface BaseResponse<T = any> {
  success: boolean; // 요청 성공 여부
  data: T | null; // 응답 데이터
  message?: string; // 사용자 메시지 (선택적)
  timestamp: string; // ISO 8601 형식 (예: "2025-08-09T12:00:00Z")
  request_id: string; // 요청 추적 ID (UUID)
}
```

**성공 응답 예시:**

```json
{
  "success": true,
  "data": {
    // 실제 응답 데이터
  },
  "message": null,
  "timestamp": "2025-08-09T12:00:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### 에러 응답 구조

```typescript
interface ErrorDetail {
  code: string; // 에러 코드 (예: "AUTH_TOKEN_EXPIRED")
  field?: string; // 관련 필드명 (폼 검증 오류 시)
  message: string; // 에러 상세 메시지
}

interface ErrorResponse {
  success: false; // 항상 false
  data: null; // 항상 null
  message: string; // 에러 요약 메시지
  errors?: ErrorDetail[]; // 에러 상세 목록 (선택적)
  timestamp: string; // ISO 8601 형식
  request_id: string; // 요청 추적 ID (UUID)
}
```

**에러 응답 예시:**

```json
{
  "success": false,
  "data": null,
  "message": "요청 처리 중 오류가 발생했습니다.",
  "errors": [
    {
      "code": "AUTH_TOKEN_EXPIRED",
      "field": null,
      "message": "액세스 토큰이 만료되었습니다."
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### 페이지네이션 응답 구조

```typescript
interface PaginationInfo {
  page: number; // 현재 페이지 (1부터 시작)
  page_size: number; // 페이지 크기
  total_items: number; // 전체 항목 수
  total_pages: number; // 전체 페이지 수
  has_next: boolean; // 다음 페이지 존재 여부
  has_previous: boolean; // 이전 페이지 존재 여부
}

interface PaginatedResponse<T> {
  success: true; // 항상 true
  data: T[]; // 데이터 배열
  pagination: PaginationInfo; // 페이지네이션 정보
  message?: string; // 사용자 메시지 (선택적)
  timestamp: string; // ISO 8601 형식
  request_id: string; // 요청 추적 ID (UUID)
}
```

**페이지네이션 응답 예시:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 100,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 2.3 HTTP 상태 코드

| 코드 | 의미                  | 사용 케이스            |
| ---- | --------------------- | ---------------------- |
| 200  | OK                    | 성공적인 GET, PUT 요청 |
| 201  | Created               | 성공적인 POST 요청     |
| 204  | No Content            | 성공적인 DELETE 요청   |
| 400  | Bad Request           | 잘못된 요청 형식       |
| 401  | Unauthorized          | 인증 실패              |
| 403  | Forbidden             | 권한 없음              |
| 404  | Not Found             | 리소스 없음            |
| 422  | Unprocessable Entity  | 검증 실패              |
| 429  | Too Many Requests     | Rate Limit 초과        |
| 500  | Internal Server Error | 서버 오류              |
| 503  | Service Unavailable   | 서비스 일시 중단       |

---

## 3. 감정 분석 시스템

### 3.1 감정 처리 로직

'새김' 서비스의 감정 분석은 **AI 자동 분석 + 사용자 선택적 수정** 방식으로 동작합니다.

#### 감정 처리 플로우

1. **AI 자동 분석**: 다이어리 글과 업로드된 사진을 AI가 분석하여 감정 자동 추출
2. **신뢰도 저장**: AI 분석 결과와 함께 신뢰도 (0.0-1.0) 저장
3. **사용자 수정 옵션**: 사용자가 원할 경우 AI 분석 결과를 수동으로 수정 가능

#### 감정 데이터 구조

```json
{
  "ai_emotion": "happy", // AI가 분석한 감정 (자동)
  "ai_emotion_confidence": 0.92, // AI 분석 신뢰도 (자동)
  "user_emotion": null // 사용자 수정 감정 (선택사항)
}
```

#### 감정 타입

- **happy** (😊): 행복, 기쁨, 즐거움
- **sad** (😢): 슬픔, 우울, 아쉬움
- **angry** (😡): 화남, 짜증, 분노
- **peaceful** (😌): 평온, 차분, 안정
- **worried** (🫨): 걱정, 불안, 불안

#### API 동작 방식

- **다이어리 작성**: `user_emotion` 필드는 선택사항. 미입력 시 AI 분석 결과만 저장
- **다이어리 수정**: `user_emotion` 필드로 AI 분석 감정 수정 가능
- **다이어리 조회**: `ai_emotion`과 `user_emotion` 모두 반환하여 클라이언트에서 최종 감정 결정

---

## 4. 에러 코드 체계

### 4.1 에러 코드 분류

| 범위      | 카테고리   | 설명             |
| --------- | ---------- | ---------------- |
| 1000-1999 | AUTH       | 인증/인가 관련   |
| 2000-2999 | DIARY      | 다이어리 관련    |
| 3000-3999 | AI         | AI 서비스 관련   |
| 4000-4999 | IMAGE      | 이미지 처리 관련 |
| 5000-5999 | VALIDATION | 입력 검증 관련   |
| 9000-9999 | SYSTEM     | 시스템 관련      |

### 4.2 주요 에러 코드

#### 인증 에러 (1000-1999)

| 코드                             | 에러 ID | 설명                     |
| -------------------------------- | ------- | ------------------------ |
| AUTH_SOCIAL_PROVIDER_ERROR       | 1001    | 소셜 제공자 오류         |
| AUTH_SOCIAL_TOKEN_INVALID        | 1002    | 유효하지 않은 OAuth 토큰 |
| AUTH_SOCIAL_USER_DENIED          | 1003    | 사용자가 권한 거부       |
| AUTH_SOCIAL_EMAIL_REQUIRED       | 1004    | 이메일 정보 필수         |
| AUTH_SOCIAL_PROVIDER_UNSUPPORTED | 1005    | 지원하지 않는 제공자     |
| AUTH_TOKEN_EXPIRED               | 1006    | 액세스 토큰 만료         |
| AUTH_TOKEN_INVALID               | 1007    | 유효하지 않은 토큰       |
| AUTH_PERMISSION_DENIED           | 1008    | 권한 없음                |
| AUTH_REFRESH_TOKEN_EXPIRED       | 1009    | 리프레시 토큰 만료       |

#### 다이어리 에러 (2000-2999)

| 코드                 | 에러 ID | 설명                         |
| -------------------- | ------- | ---------------------------- |
| DIARY_NOT_FOUND      | 2001    | 다이어리를 찾을 수 없음      |
| DIARY_ACCESS_DENIED  | 2002    | 다이어리 접근 권한 없음      |
| DIARY_UPDATE_DENIED  | 2003    | 다이어리 수정 권한 없음      |
| DIARY_DELETE_DENIED  | 2004    | 다이어리 삭제 권한 없음      |
| DIARY_LIMIT_EXCEEDED | 2005    | 일일 다이어리 작성 한도 초과 |

#### AI 서비스 에러 (3000-3999)

| 코드                    | 에러 ID | 설명                       |
| ----------------------- | ------- | -------------------------- |
| AI_SERVICE_UNAVAILABLE  | 3001    | AI 서비스 일시적 오류      |
| AI_TOKEN_LIMIT_EXCEEDED | 3002    | AI 토큰 한도 초과          |
| AI_INVALID_STYLE        | 3003    | 지원하지 않는 스타일 옵션  |
| AI_GENERATION_FAILED    | 3004    | AI 텍스트 생성 실패        |
| AI_RATE_LIMIT_EXCEEDED  | 3005    | AI API 호출 한도 초과      |
| AI_REGENERATION_FAILED  | 3006    | AI 재생성 실패             |
| AI_GENERATION_NOT_FOUND | 3007    | 재생성 대상을 찾을 수 없음 |

#### 이미지 에러 (4000-4999)

| 코드                  | 에러 ID | 설명                         |
| --------------------- | ------- | ---------------------------- |
| IMG_SIZE_EXCEEDED     | 4001    | 파일 크기 초과 (15MB)        |
| IMG_INVALID_FORMAT    | 4002    | 지원하지 않는 이미지 형식    |
| IMG_UPLOAD_FAILED     | 4003    | 이미지 업로드 실패           |
| IMG_NOT_FOUND         | 4004    | 이미지를 찾을 수 없음        |
| IMG_PROCESSING_FAILED | 4005    | 이미지 처리 실패             |
| IMG_COUNT_EXCEEDED    | 4006    | 이미지 갯수 초과 (최대 10개) |

#### 검증 에러 (5000-5999)

| 코드                      | 에러 ID | 설명                      |
| ------------------------- | ------- | ------------------------- |
| VALIDATION_FAILED         | 5001    | 입력 데이터 검증 실패     |
| VALIDATION_EMAIL_INVALID  | 5002    | 유효하지 않은 이메일 형식 |
| VALIDATION_PASSWORD_WEAK  | 5003    | 비밀번호 복잡도 미달      |
| VALIDATION_REQUIRED_FIELD | 5004    | 필수 필드 누락            |

#### 시스템 에러 (9000-9999)

| 코드                 | 에러 ID | 설명                   |
| -------------------- | ------- | ---------------------- |
| SYSTEM_ERROR         | 9001    | 서버 내부 오류         |
| SYSTEM_DB_ERROR      | 9002    | 데이터베이스 연결 실패 |
| SYSTEM_STORAGE_ERROR | 9003    | 스토리지 서비스 오류   |
| SYSTEM_RATE_LIMIT    | 9004    | API 호출 한도 초과     |
| SYSTEM_MAINTENANCE   | 9005    | 시스템 점검 중         |

### 3.3 에러 응답 형식

모든 에러 응답은 다음과 같은 표준화된 형식을 따릅니다:

```json
{
  "success": false,
  "data": null,
  "message": "오류 요약 메시지",
  "errors": [
    {
      "code": "에러 코드 (예: AUTH_SOCIAL_PROVIDER_ERROR)",
      "error_id": 에러 ID (예: 1001),
      "field": "관련 필드명 (선택적)",
      "message": "상세 에러 메시지"
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_abc123"
}
```

---

## 4. 인증 및 보안

### 4.1 인증 방식

- **인증 타입**: JWT Bearer Token
- **토큰 위치**: Authorization 헤더
- **토큰 형식**: `Bearer {access_token}`

### 4.2 토큰 정책

| 토큰 타입     | 만료 시간 | 용도              |
| ------------- | --------- | ----------------- |
| Access Token  | 1시간     | API 호출 인증     |
| Refresh Token | 7일       | Access Token 갱신 |

### 4.3 캐싱 정책

#### 4.3.1 캐시 전략 개요

**캐싱 계층 구조:**

| 캐시 레벨        | 기술       | 대상 데이터          | TTL    | 목적               |
| ---------------- | ---------- | -------------------- | ------ | ------------------ |
| **브라우저**     | HTTP Cache | 정적 리소스          | 24시간 | CDN 트래픽 감소    |
| **CDN**          | CloudFront | 이미지, 정적 파일    | 24시간 | 글로벌 접근 최적화 |
| **애플리케이션** | Redis      | API 응답, 세션       | 가변   | 응답 시간 단축     |
| **데이터베이스** | 쿼리 캐시  | 자주 조회되는 데이터 | 자동   | DB 부하 감소       |

#### 4.3.2 API 응답별 캐싱 정책

**AI 관련 API:**

- **AI 글귀 생성**: 1시간 TTL, 사용자별 개인화 캐시
- **AI 키워드 추천**: 30분 TTL, 입력 해시 기반 캐시
- **감정 리포트**: 24시간 TTL, 월간 데이터 캐시

**다이어리 API:**

- **다이어리 목록**: 10분 TTL, 사용자별 캐시
- **다이어리 상세**: 30분 TTL, 읽기 전용 캐시
- **통계 데이터**: 1시간 TTL, 집계 결과 캐시

**이미지 API:**

- **이미지 메타데이터**: 24시간 TTL, 변경 빈도 낮음
- **썸네일**: 7일 TTL, 영구 캐시에 가까움
- **합성 이미지**: 1시간 TTL, 임시 결과물

#### 4.3.3 캐시 관련 HTTP 헤더

**클라이언트 캐시 제어:**

```http
Cache-Control: max-age=3600, private    # 1시간 개인 캐시
Cache-Control: max-age=86400, public    # 24시간 공개 캐시
Cache-Control: no-cache, private        # 캐시 사용 안함
ETag: "abc123def456"                    # 리소스 버전 식별
Last-Modified: Wed, 08 Jan 2025 12:00:00 GMT
```

**캐시 상태 정보:**

```http
X-Cache-Status: HIT | MISS | STALE | UPDATING
X-Cache-Key: ai:gen:hash_abc123         # Redis 캐시 키
X-Cache-TTL: 3600                       # 남은 캐시 시간(초)
X-Cache-Age: 120                        # 캐시 생성 후 경과 시간(초)
```

#### 4.3.4 캐시 무효화 정책

**자동 무효화:**

- 사용자 데이터 변경 시 관련 캐시 자동 삭제
- AI 재생성 요청 시 이전 결과 캐시 무효화
- 감정 통계 업데이트 시 월간 캐시 갱신

**수동 무효화 (관리자):**

```http
DELETE /api/cache/invalidate
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "cache_keys": ["ai:gen:*", "stats:emotion:*"],
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4.4 Rate Limiting

| API 타입      | 제한  | 단위            | 설명                              |
| ------------- | ----- | --------------- | --------------------------------- |
| 일반 API      | 1,000 | requests/minute | 일반 읽기/쓰기 작업               |
| AI API        | 30    | requests/minute | AI 텍스트 생성 요청 (전환경 공통) |
| 이미지 업로드 | 60    | uploads/hour    | 이미지 업로드 (최대 15MB/파일)    |
| 버스트 허용   | 2,000 | requests/minute | 순간 최대 허용 (10초간)           |

**Rate Limiting 응답 헤더:**

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641628800
```

**초과 시 응답 (429 Too Many Requests):**

```json
{
  "success": false,
  "data": null,
  "message": "API 호출 한도를 초과했습니다.",
  "errors": [
    {
      "code": "SYSTEM_RATE_LIMIT",
      "error_id": 9004,
      "message": "API rate limit exceeded. Please retry after 60 seconds.",
      "retry_after": 60
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_abc123"
}
```

### 4.4 보안 헤더

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'
```

### 4.5 암호화 정책

#### 4.5.1 데이터 전송 암호화

- **프로토콜**: TLS 1.3 이상 필수
- **암호화 스위트**: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256
- **인증서**: Let's Encrypt 또는 상용 CA 인증서
- **HSTS Preload**: 브라우저 HSTS preload 리스트 등록

#### 4.5.2 데이터 저장 암호화

- **비밀번호**: bcrypt (cost factor: 12)
- **민감 데이터**: AES-256-GCM
- **암호화 대상 필드**:
  - `diaries.content` - 일기 내용
  - `diaries.ai_generated_text` - AI 생성 텍스트
  - `users.email` - 이메일 (검색용 SHA-256 해시 별도 저장)
- **이미지 파일**: MinIO SSE-S3 암호화

#### 4.5.3 키 관리

- **키 저장**:
  - 개발: 환경 변수 (.env 파일)
  - 운영: 서버 환경 변수 또는 Docker secrets
- **키 로테이션**: 90일 주기
- **키 백업**: 암호화된 백업 3개 이상 유지

---

## 5. API 엔드포인트

### 5.1 인증 (Authentication)

#### 소셜 로그인 시작

```http
GET /api/auth/social/{provider}/login
```

**경로 매개변수:**

- `provider`: google | kakao | naver

**성공 응답 (302 Redirect):**

OAuth 인증 서버로 리다이렉트

```
Location: https://accounts.google.com/o/oauth2/v2/auth?client_id=xxx&redirect_uri=xxx&response_type=code&scope=openid%20email%20profile&state=xxx
```

**에러 응답 (400 Bad Request):**

```json
{
  "success": false,
  "data": null,
  "message": "지원하지 않는 소셜 로그인 제공자입니다.",
  "errors": [
    {
      "code": "AUTH_SOCIAL_PROVIDER_UNSUPPORTED",
      "error_id": 1005,
      "field": "provider",
      "message": "google, kakao, naver만 지원됩니다."
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_abc123"
}
```

#### 소셜 로그인 콜백

```http
GET /api/auth/social/{provider}/callback?code={code}&state={state}
```

**경로 매개변수:**

- `provider`: google | kakao | naver

**쿼리 매개변수:**

- `code`: OAuth 인증 코드
- `state`: CSRF 방지용 상태 값

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "encrypted_email",
      "nickname": "새김이",
      "provider": "google"
    }
  },
  "message": "로그인에 성공했습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_def456"
}
```

**에러 응답 (400 Bad Request):**

```json
{
  "success": false,
  "data": null,
  "message": "소셜 로그인에 실패했습니다.",
  "errors": [
    {
      "code": "AUTH_SOCIAL_TOKEN_INVALID",
      "error_id": 1002,
      "field": "code",
      "message": "유효하지 않은 OAuth 인증 코드입니다."
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_def456"
}
```

#### 소셜 계정 연결 해제

```http
DELETE /api/auth/social/{provider}/disconnect
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**경로 매개변수:**

- `provider`: google | kakao | naver

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "provider": "google",
    "disconnected_at": "2025-01-08T12:00:00Z"
  },
  "message": "소셜 계정 연결이 해제되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_ghi789"
}
```

#### 토큰 갱신

```http
POST /api/auth/refresh
```

**요청 헤더:**

```http
Authorization: Bearer {refresh_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_ghi789"
}
```

#### 로그아웃

```http
POST /api/auth/logout
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": null,
  "message": "로그아웃되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_jkl012"
}
```

<!-- MVP 이후 개발 예정 기능
### 5.2 계정 삭제 및 데이터 관리 (Account & Data Management)

#### 계정 삭제 (소셜 로그인 환경)

```http
DELETE /api/account
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 본문:**

```json
{
  "request_recovery": false, // 복구 기간 요청 여부 (기본값: false)
  "verification_code": "123456" // 이메일/SMS 인증 코드
}
```

**성공 응답 - 즉시 삭제 (200 OK):**

```json
{
  "success": true,
  "data": {
    "deletion_type": "immediate",
    "deleted_at": "2025-01-08T12:00:00Z",
    "deleted_data": [
      "user_account",
      "diaries",
      "images",
      "emotions_stats",
      "ai_usage_logs"
    ]
  },
  "message": "계정이 완전히 삭제되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_delete123"
}
```

**성공 응답 - 복구 기간 설정 (200 OK):**

```json
{
  "success": true,
  "data": {
    "deletion_type": "recoverable",
    "deleted_at": "2025-01-08T12:00:00Z",
    "recovery_expires_at": "2025-02-07T12:00:00Z",
    "recovery_days_remaining": 30
  },
  "message": "계정이 30일간 복구 가능한 상태로 삭제되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_delete456"
}
```

**에러 응답 (400 Bad Request):**

```json
{
  "success": false,
  "data": null,
  "message": "계정 삭제에 실패했습니다.",
  "errors": [
    {
      "code": "ACCOUNT_DELETE_DENIED",
      "error_id": 1010,
      "field": "verification_code",
      "message": "인증 코드가 유효하지 않습니다."
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_delete456"
}
```

#### 계정 복구

```http
POST /api/account/recover
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "verification_code": "123456"
}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "recovered_at": "2025-01-08T12:00:00Z",
    "recovery_days_used": 15
  },
  "message": "계정이 복구되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_recover789"
}
```

**에러 응답 (400 Bad Request):**

```json
{
  "success": false,
  "data": null,
  "message": "계정 복구에 실패했습니다.",
  "errors": [
    {
      "code": "ACCOUNT_RECOVERY_EXPIRED",
      "error_id": 1011,
      "field": null,
      "message": "복구 기한이 만료되었습니다. (30일 초과)"
    }
  ],
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_recover789"
}
```

#### 데이터 내보내기 (GDPR 준수)

```http
GET /api/account/export
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| format | string | N | 내보내기 형식 (json, csv) 기본값: json |

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "export_id": "exp_abc123",
    "download_url": "https://cdn.saegim.app/exports/user_data_20250108.zip",
    "expires_at": "2025-01-09T12:00:00Z",
    "file_size": 15728640,
    "included_data": [
      "user_profile",
      "diaries",
      "images",
      "emotion_stats",
      "ai_usage_logs"
    ]
  },
  "message": "데이터 내보내기가 완료되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_export123"
}
```

#### 데이터 삭제 증명서 (GDPR 준수)

```http
GET /api/account/deletion-certificate/{deletion_id}
```

**요청 헤더:**

```http
Authorization: Bearer {admin_token}  // 관리자 전용
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "certificate_id": "cert_def456",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "deletion_completed_at": "2025-01-08T12:00:00Z",
    "deletion_verified_at": "2025-01-08T12:01:00Z",
    "deleted_data_categories": [
      "personal_information",
      "user_generated_content",
      "behavioral_data",
      "technical_logs"
    ],
    "compliance_frameworks": ["GDPR", "CCPA", "개인정보보호법"],
    "certificate_url": "https://cdn.saegim.app/certificates/cert_def456.pdf"
  },
  "message": null,
  "timestamp": "2025-01-08T12:01:00Z",
  "request_id": "req_cert789"
}
```
-->

### 5.3 다이어리 (Diary)

#### 다이어리 작성

```http
POST /api/diary
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 본문:**

```json
{
  "title": "제주도 여행 첫날",
  "content": "오늘은 제주도에 도착한 첫날이다. 날씨가 너무 좋아서...",
  "user_emotion": "happy",
  "images": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ],
  "ai_generated_text": "푸른 바다가 속삭이는 제주의 첫날...",
  "is_public": false
}
```

**검증 규칙:**

- title: 최대 255자 (선택)
- content: 텍스트 (선택)
- user_emotion: enum (happy, sad, angry, peaceful, worried) - 선택사항, AI 분석 감정을 사용자가 수정하고 싶을 때 입력
- images: UUID 배열, 최대 10개

**성공 응답 (201 Created):**

```json
{
  "success": true,
  "data": {
    "diary_id": "550e8400-e29b-41d4-a716-446655440003",
    "title": "제주도 여행 첫날",
    "created_at": "2025-01-08T12:00:00Z"
  },
  "message": "다이어리가 성공적으로 작성되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_mno345"
}
```

#### 다이어리 목록 조회

```http
GET /api/diary?page=1&page_size=20&month=2025-01&emotion=happy
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | integer | N | 페이지 번호 (기본: 1) |
| page_size | integer | N | 페이지 크기 (기본: 20, 최대: 100) |
| month | string | N | 조회 월 (YYYY-MM 형식) |
| user_emotion | string | N | 사용자가 수정한 감정으로 필터링 |
| ai_emotion | string | N | AI가 분석한 감정으로 필터링 |

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "diary_id": "550e8400-e29b-41d4-a716-446655440003",
      "title": "제주도 여행 첫날",
      "user_emotion": "happy",
      "ai_emotion": "happy",
      "ai_emotion_confidence": 0.95,
      "thumbnail": "https://cdn.saegim.app/thumbnails/abc123.jpg",
      "created_at": "2025-01-08T12:00:00Z"
    },
    {
      "diary_id": "550e8400-e29b-41d4-a716-446655440004",
      "title": "카페에서의 오후",
      "user_emotion": "peaceful",
      "ai_emotion": "peaceful",
      "ai_emotion_confidence": 0.88,
      "thumbnail": null,
      "created_at": "2025-01-07T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 42,
    "total_pages": 3,
    "has_next": true,
    "has_previous": false
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_pqr678"
}
```

#### 다이어리 상세 조회

```http
GET /api/diary/{diary_id}
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**경로 파라미터:**

- diary_id: 다이어리 UUID

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "diary_id": "550e8400-e29b-41d4-a716-446655440003",
    "title": "제주도 여행 첫날",
    "content": "오늘은 제주도에 도착한 첫날이다. 날씨가 너무 좋아서...",
    "user_emotion": "happy",
    "ai_emotion": "happy",
    "ai_emotion_confidence": 0.95,
    "images": [
      {
        "image_id": "550e8400-e29b-41d4-a716-446655440001",
        "url": "https://cdn.saegim.app/images/abc123.jpg",
        "thumbnail_url": "https://cdn.saegim.app/thumbnails/abc123.jpg"
      }
    ],
    "ai_generated_text": "푸른 바다가 속삭이는 제주의 첫날...",
    "is_public": false,
    "created_at": "2025-01-08T12:00:00Z",
    "updated_at": "2025-01-08T12:00:00Z"
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_stu901"
}
```

#### 다이어리 수정

```http
PUT /api/diary/{diary_id}
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 본문:**

```json
{
  "title": "제주도 여행 첫날 (수정)",
  "content": "오늘은 제주도에 도착한 첫날이다. 날씨가 정말 화창해서...",
  "user_emotion": "happy",
}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "diary_id": "550e8400-e29b-41d4-a716-446655440003",
    "updated_at": "2025-01-08T13:00:00Z"
  },
  "message": "다이어리가 수정되었습니다.",
  "timestamp": "2025-01-08T13:00:00Z",
  "request_id": "req_vwx234"
}
```

#### 다이어리 삭제

```http
DELETE /api/diary/{diary_id}
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": null,
  "message": "다이어리가 삭제되었습니다.",
  "timestamp": "2025-01-08T13:00:00Z",
  "request_id": "req_yza567"
}
```

<!-- MVP 이후 개발 예정 기능
#### 선택적 콘텐츠 삭제 (P1 기능)

**AI 텍스트만 삭제:**

```http
DELETE /api/diary/{diary_id}/ai_text
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "diary_id": "550e8400-e29b-41d4-a716-446655440003",
    "deletion_log_id": "550e8400-e29b-41d4-a716-446655440010"
  },
  "message": "AI 생성 텍스트가 삭제되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z"
}
```

**특정 이미지 삭제:**

```http
DELETE /api/diary/{diary_id}/images
```

**요청 본문:**

```json
{
  "image_ids": [
    "550e8400-e29b-41d4-a716-446655440004",
    "550e8400-e29b-41d4-a716-446655440005"
  ],
  "reason": "포트폴리오 변경"
}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "diary_id": "550e8400-e29b-41d4-a716-446655440003",
    "deleted_images": 2,
    "deletion_log_id": "550e8400-e29b-41d4-a716-446655440011"
  },
  "message": "선택한 이미지가 삭제되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z"
}
```

#### 삭제 로그 조회 (P1 기능)

```http
GET /api/diary/{diary_id}/deletion-logs
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "deletion_log_id": "550e8400-e29b-41d4-a716-446655440010",
      "diary_id": "550e8400-e29b-41d4-a716-446655440003",
      "deletion_type": "ai_text",
      "deleted_content": {
        "content_type": "ai_generated_text",
        "content_preview": "노을이 물든 바다 위로..."
      },
      "reason": "창작물 관리",
      "created_at": "2025-01-08T12:00:00Z"
    }
  ],
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z"
}
```
-->

### 5.3 AI 서비스 (AI)

#### AI 글귀 생성

```http
POST /api/ai/generate
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 본문:**

```json
{
  "sentence": "오늘 하루가 선물 같았다",
  // 감정은 AI가 글과 사진을 분석하여 자동 추출 (사용자 수정 가능)
  "style": {
    "tone": "romantic",
    "length": "medium",
    "type": "poem"
  }
}
```

**스타일 옵션:**

- tone: romantic, healing, calm, humorous
- length: short (4-8줄), medium (8-16줄), long (16줄 이상)
- type: poem, prose, quote

**성공 응답 (200 OK):**

**응답 헤더:**

```http
Cache-Control: max-age=3600, private
X-Cache-Status: MISS
X-Cache-Key: ai:gen:hash_abc123
X-Cache-TTL: 3600
X-Rate-Limit-Remaining: 29
X-Rate-Limit-Reset: 1641646800
```

**응답 헤더:**

```http
Cache-Control: max-age=3600, private
X-Cache-Status: MISS
X-Cache-Key: ai:gen:hash_abc123
X-Cache-TTL: 3600
X-Rate-Limit-Remaining: 29
X-Rate-Limit-Reset: 1641646800
```

```json
{
  "success": true,
  "data": {
    "generated_text": "노을이 물든 바다 위로\n평화가 내려앉는 저녁\n오늘 하루가 선물처럼\n마음에 고이 담겨진다\n\n파도 소리는 자장가가 되고\n붉은 하늘은 편지가 되어\n내일을 기다리는 설렘으로\n오늘을 부드럽게 마무리한다",
    "style_applied": {
      "tone": "romantic",
      "length": "medium",
      "type": "poem"
    },
    "tokens_used": 150,
    "generation_id": "gen_abc123",
    "cache_info": {
      "cached": false,
      "cache_key": "ai:gen:hash_abc123",
      "ttl_seconds": 3600,
      "expires_at": "2025-01-08T13:00:00Z"
    },
    "cache_info": {
      "cached": false,
      "cache_key": "ai:gen:hash_abc123",
      "ttl_seconds": 3600,
      "expires_at": "2025-01-08T13:00:00Z"
    }
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_bcd890"
}
```

#### AI 글귀 재생성

```http
POST /api/ai/regenerate
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 본문:**

```json
{
  "generation_id": "gen_abc123",
  "sentence": "오늘 하루가 선물 같았다",
  "style": {
    "tone": "healing",
    "length": "short",
    "type": "poem"
  },
  "exclude_previous": true
}
```

**요청 필드:**
| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| generation_id | string | N | 이전 생성 ID (캐시 무효화용) |
| sentence | string | N | 입력 문장 |
| style | object | N | 스타일 설정 |
| exclude_previous | boolean | N | 이전 결과 제외 여부 (기본: false) |

**성공 응답 (200 OK):**

**응답 헤더:**

```http
Cache-Control: no-cache, private
X-Cache-Status: REGENERATED
X-Cache-Invalidated: ai:gen:hash_abc123
X-Rate-Limit-Remaining: 28
X-Rate-Limit-Reset: 1641646800
```

**응답 헤더:**

```http
Cache-Control: no-cache, private
X-Cache-Status: REGENERATED
X-Cache-Invalidated: ai:gen:hash_abc123
X-Rate-Limit-Remaining: 28
X-Rate-Limit-Reset: 1641646800
```

```json
{
  "success": true,
  "data": {
    "generated_text": "고요한 바다가 건네는\n평화로운 인사말\n노을빛 물결 속에서\n하루의 마침표를 찍는다",
    "style_applied": {
      "tone": "healing",
      "length": "short",
      "type": "poem"
    },
    "tokens_used": 120,
    "generation_id": "gen_def456",
    "is_regenerated": true,
    "cache_info": {
      "cached": false,
      "previous_cache_invalidated": "ai:gen:hash_abc123",
      "new_cache_key": "ai:gen:hash_def456",
      "ttl_seconds": 3600,
      "expires_at": "2025-01-08T13:05:00Z"
    },
    "cache_info": {
      "cached": false,
      "previous_cache_invalidated": "ai:gen:hash_abc123",
      "new_cache_key": "ai:gen:hash_def456",
      "ttl_seconds": 3600,
      "expires_at": "2025-01-08T13:05:00Z"
    }
  },
  "message": "새로운 글귀가 생성되었습니다.",
  "timestamp": "2025-01-08T12:05:00Z",
  "request_id": "req_regen789"
}
```

#### 월간 감정 리포트

```http
GET /api/ai/emotion-report?year=2025&month=1
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| year | integer | Y | 년도 |
| month | integer | Y | 월 (1-12) |

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "period": "2025-01",
    "total_entries": 25,
    "emotion_distribution": {
      "happy": 12,
      "peaceful": 7,
      "sad": 3,
      "worried": 2,
      "angry": 1
    },
    "emotion_percentage": {
      "happy": 48.0,
      "peaceful": 28.0,
      "sad": 12.0,
      "worried": 8.0,
      "angry": 4.0
    },
    "keyword_cloud": [
      { "word": "여행", "count": 5, "weight": 0.9 },
      { "word": "가족", "count": 4, "weight": 0.8 },
      { "word": "일상", "count": 4, "weight": 0.8 },
      { "word": "행복", "count": 3, "weight": 0.7 },
      { "word": "휴식", "count": 3, "weight": 0.7 }
    ],
    "ai_summary": "이번 달은 전반적으로 긍정적인 감정이 우세했습니다. 특히 여행과 가족과의 시간이 행복감의 주요 원천이었으며, 일상 속에서도 작은 기쁨을 찾는 모습이 보입니다. (AI가 글과 사진을 분석한 감정 기반)",
    "trend_analysis": "월초 대비 월말로 갈수록 평온한 감정이 증가하는 추세를 보였습니다. (AI 분석 감정 기반)",
    "recommendations": [
      "긍정적인 감정 상태를 유지하기 위해 규칙적인 여가 활동을 계속하세요.",
      "스트레스가 있었던 날들을 되돌아보고 대처 방법을 기록해보세요."
    ]
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_hij456"
}
```

<!-- MVP 이후 개발 예정 기능
### 5.4 분석 서비스 (Analytics) - P1 기능

#### 감정 분석 리포트

```http
GET /api/analytics/emotion-analysis?year=2025&month=1&type=mismatch
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| year | integer | Y | 분석 년도 |
| month | integer | N | 분석 월 (전체 년도 분석시 생략) |
| type | string | N | 분석 유형 (mismatch, accuracy, confidence) |

**분석 유형:**

- `mismatch`: 사용자 감정과 AI 분석 불일치 패턴
- `accuracy`: AI 감정 분석 정확도 추이
- `confidence`: AI 신뢰도별 분포 분석

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "period": "2025-01",
    "analysis_type": "mismatch",
    "total_entries": 25,
    "matched_emotions": 18,
    "mismatched_emotions": 7,
    "match_rate": 72.0,
    "mismatch_patterns": [
      {
        "user_emotion": "worried",
        "ai_emotion": "sad",
        "count": 3,
        "percentage": 42.8,
        "avg_confidence": 0.65
      },
      {
        "user_emotion": "happy",
        "ai_emotion": "peaceful",
        "count": 2,
        "percentage": 28.6,
        "avg_confidence": 0.78
      }
    ],
    "confidence_analysis": {
      "high_confidence_matches": 15,
      "high_confidence_mismatches": 2,
      "low_confidence_matches": 3,
      "low_confidence_mismatches": 5
    },
    "insights": [
      "걱정 상태일 때 AI가 슬픔으로 오인하는 경우가 많습니다.",
      "신뢰도 0.8 이상일 때 일치율이 94%로 높아집니다."
    ],
    "recommendations": [
      "감정 표현 시 더 구체적인 키워드를 사용해보세요.",
      "AI 분석이 맞지 않을 때 수정하여 개인화를 향상시키세요."
    ]
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_analysis123"
}
```
-->

### 5.5 알림 (Notification)

#### 알림 목록 조회

```http
GET /api/notifications
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**쌍리 매개변수:**

- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 아이템 수 (기본값: 20, 최대: 100)
- `type`: 알림 유형 필터 (diary_reminder | report_ready | ai_complete)
- `is_read`: 읽음 상태 필터 (true | false)

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "type": "diary_reminder",
        "title": "다이어리 작성 알림",
        "message": "오늘의 감정을 새김에 기록해보세요.",
        "data": {
          "action": "write_diary",
          "suggested_emotion": "peaceful"
        },
        "is_read": false,
        "scheduled_at": "2025-08-09T21:00:00Z",
        "created_at": "2025-08-09T21:00:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "type": "report_ready",
        "title": "월간 감정 리포트 준비 완료",
        "message": "8월 감정 리포트가 준비되었습니다. 확인해보세요!",
        "data": {
          "action": "view_report",
          "report_id": "report_2025_08",
          "month": "2025-08"
        },
        "is_read": true,
        "scheduled_at": "2025-08-31T09:00:00Z",
        "created_at": "2025-08-31T09:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 45,
      "has_next": true
    }
  },
  "message": null,
  "timestamp": "2025-08-09T12:00:00Z",
  "request_id": "req_notif123"
}
```

#### 알림 읽음 처리

```http
PATCH /api/notifications/{notification_id}/read
```

**경로 매개변수:**

- `notification_id`: 알림 ID (UUID)

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "is_read": true,
    "read_at": "2025-08-09T12:30:00Z"
  },
  "message": "알림을 읽음 처리했습니다.",
  "timestamp": "2025-08-09T12:30:00Z",
  "request_id": "req_read123"
}
```

#### 알림 설정 조회

```http
GET /api/notifications/settings
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "diary_reminder": {
      "enabled": true,
      "time": "21:00",
      "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    },
    "report_notification": {
      "enabled": true,
      "monthly_report": true
    },
    "ai_processing": {
      "enabled": true,
      "completion_alerts": true
    },
    "browser_push": {
      "enabled": true,
      "permission_granted": true
    }
  },
  "message": null,
  "timestamp": "2025-08-09T12:00:00Z",
  "request_id": "req_settings123"
}
```

#### 알림 설정 업데이트

```http
PUT /api/notifications/settings
```

**요청 본문:**

```json
{
  "diary_reminder": {
    "enabled": true,
    "time": "20:30",
    "days": ["mon", "wed", "fri"]
  },
  "report_notification": {
    "enabled": true,
    "monthly_report": true
  },
  "ai_processing": {
    "enabled": false,
    "completion_alerts": false
  },
  "browser_push": {
    "enabled": true
  }
}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "updated_settings": {
      "diary_reminder": {
        "enabled": true,
        "time": "20:30",
        "days": ["mon", "wed", "fri"]
      },
      "report_notification": {
        "enabled": true,
        "monthly_report": true
      },
      "ai_processing": {
        "enabled": false,
        "completion_alerts": false
      },
      "browser_push": {
        "enabled": true,
        "permission_granted": true
      }
    }
  },
  "message": "알림 설정이 업데이트되었습니다.",
  "timestamp": "2025-08-09T12:15:00Z",
  "request_id": "req_update123"
}
```

### 5.6 이미지 (Image)

#### 이미지 업로드

```http
POST /api/image/upload
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**요청 본문:**

- files: 이미지 파일 배열 (binary[])
- 최대 파일 갯수: 10개
- 파일당 최대 크기: 15MB
- 총 업로드 크기: 120MB
- 지원 형식: JPEG, PNG, WebP

**성공 응답 (201 Created):**

```json
{
  "success": true,
  "data": {
    "image_id": "550e8400-e29b-41d4-a716-446655440005",
    "url": "https://cdn.saegim.app/images/def456.jpg",
    "thumbnail_url": "https://cdn.saegim.app/thumbnails/def456.jpg",
    "size": 2048576,
    "mime_type": "image/jpeg",
    "width": 3000,
    "height": 2000,
    "exif_removed": true
  },
  "message": "이미지가 성공적으로 업로드되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_klm789"
}
```

#### 이미지 합성

```http
POST /api/image/synthesis
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 본문:**

```json
{
  "image_id": "550e8400-e29b-41d4-a716-446655440005",
  "text": "노을이 물든 바다 위로\n평화가 내려앉는 저녁",
  "template_id": "template_romantic_01",
  "options": {
    "font": "NanumMyeongjo",
    "font_size": 24,
    "color": "#FFFFFF",
    "position": "bottom",
    "opacity": 0.9,
    "shadow": true
  }
}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "synthesized_image_url": "https://cdn.saegim.app/synthesized/ghi789.jpg",
    "download_url": "https://cdn.saegim.app/download/ghi789.jpg",
    "expires_at": "2025-01-08T13:00:00Z",
    "synthesis_id": "syn_nop012"
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_nop012"
}
```

#### 이미지 삭제

```http
DELETE /api/image/{image_id}
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": null,
  "message": "이미지가 삭제되었습니다.",
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_qrs345"
}
```

### 5.5 통계 (Statistics)

#### 감정 통계 조회

```http
GET /api/stats/emotions?start_date=2025-01-01&end_date=2025-01-31
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| start_date | string | Y | 시작 날짜 (YYYY-MM-DD) |
| end_date | string | Y | 종료 날짜 (YYYY-MM-DD) |

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    },
    "daily_emotions": [
      {
        "date": "2025-01-01",
        "emotions": {
          "happy": 2,
          "peaceful": 1
        }
      },
      {
        "date": "2025-01-02",
        "emotions": {
          "worried": 1
        }
      }
    ],
    "total_summary": {
      "happy": 12,
      "peaceful": 7,
      "sad": 3,
      "worried": 2,
      "angry": 1
    },
    "most_frequent_emotion": "happy",
    "emotion_streak": {
      "current": {
        "user_emotion": "happy",
        "days": 3
      },
      "longest": {
        "user_emotion": "happy",
        "days": 5,
        "period": {
          "start": "2025-01-10",
          "end": "2025-01-14"
        }
      }
    }
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_tuv678"
}
```

#### 사용 통계 조회

```http
GET /api/stats/usage?month=2025-01
```

**요청 헤더:**

```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 OK):**

```json
{
  "success": true,
  "data": {
    "period": "2025-01",
    "diary_stats": {
      "total_created": 25,
      "total_words": 12500,
      "average_words_per_diary": 500,
      "with_images": 18,
      "with_ai_text": 20
    },
    "ai_usage": {
      "text_generations": 35,
      "keyword_suggestions": 15,
      "total_tokens_used": 5250,
      "average_tokens_per_request": 150
    },
    "image_stats": {
      "total_uploaded": 45,
      "total_size_mb": 125.5,
      "synthesized_images": 12
    },
    "activity_heatmap": {
      "most_active_hour": 21,
      "most_active_day": "Sunday",
      "activity_by_hour": {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 1,
        "7": 2,
        "8": 3,
        "9": 2,
        "10": 1,
        "11": 1,
        "12": 2,
        "13": 1,
        "14": 1,
        "15": 2,
        "16": 1,
        "17": 2,
        "18": 3,
        "19": 4,
        "20": 5,
        "21": 8,
        "22": 6,
        "23": 3
      }
    }
  },
  "message": null,
  "timestamp": "2025-01-08T12:00:00Z",
  "request_id": "req_wxy901"
}
```

---

## 6. 데이터 모델

### 6.1 감정 타입 (EmotionType)

```typescript
enum EmotionType {
  HAPPY = 'happy', // 😊 행복
  SAD = 'sad', // 😢 슬픔
  ANGRY = 'angry', // 😡 화남
  PEACEFUL = 'peaceful', // 😌 평온
  WORRIED = 'worried', // 🫨 불안
}
```

**UI/UX 디자인 가이드**

감정 타입의 시각적 표현 및 디자인 가이드라인은 별도 문서에서 관리됩니다.
자세한 내용은 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md#3-감정-타입-uiux-시스템)를 참조하세요.

**API 응답 예시:**

- JSON 응답: `"user_emotion": "worried"`
- 프론트엔드에서 `worried` 값을 디자인 시스템의 매핑 테이블에 따라 `🫨 불안`으로 표시

### 6.2 다이어리 모델 (Diary)

```typescript
interface Diary {
  diary_id: string; // UUID
  user_id: string; // UUID
  title: string;
  content: string;
  user_emotion?: EmotionType; // 사용자가 선택한 감정
  ai_emotion?: EmotionType; // AI가 분석한 감정
  ai_emotion_confidence?: number; // AI 감정 분석 신뢰도 (0.0-1.0)
  images: ImageData[];
  ai_generated_text?: string;
  is_public: boolean;
  keywords: string[]; // 키워드
  created_at: string; // ISO 8601 형식
  updated_at: string; // ISO 8601 형식
}

interface EmotionAnalysis {
  user_emotion?: EmotionType; // 사용자가 수정한 감정 (선택사항)
  ai_emotion?: EmotionType; // AI가 글과 사진을 분석하여 추출한 감정
  confidence: number; // AI 분석 신뢰도 (0.0-1.0)
  is_match?: boolean; // 사용자 수정과 AI 분석 일치 여부
}
```

### 6.3 AI 스타일 옵션

```typescript
interface AIStyleOptions {
  tone: 'romantic' | 'healing' | 'calm' | 'humorous';
  length: 'short' | 'medium' | 'long';
  type: 'poem' | 'prose' | 'quote';
}
```

### 6.4 이미지 합성 옵션

```typescript
interface SynthesisOptions {
  font: string;
  font_size: number;
  color: string;
  position: 'top' | 'center' | 'bottom';
  opacity: number;
  shadow: boolean;
}
```

---

## 7. 웹훅 (Webhooks) - 향후 구현

### 7.1 웹훅 이벤트 타입

| 이벤트               | 설명                  | 페이로드        |
| -------------------- | --------------------- | --------------- |
| diary.created        | 다이어리 생성 시      | diary 객체      |
| diary.updated        | 다이어리 수정 시      | diary 객체      |
| diary.deleted        | 다이어리 삭제 시      | diary_id        |
| ai.regenerated       | AI 글귀 재생성 완료   | generation 객체 |
| emotion.report_ready | 월간 리포트 생성 완료 | report 객체     |

### 7.2 웹훅 페이로드 구조

```json
{
  "event": "diary.created",
  "timestamp": "2025-01-08T12:00:00Z",
  "data": {
    // 이벤트별 데이터
  }
}
```

---

## 8. SDK 및 클라이언트 라이브러리

### 8.1 지원 언어

- JavaScript/TypeScript (공식)
- Python (커뮤니티)
- Swift (iOS - 계획)
- Kotlin (Android - 계획)

### 8.2 JavaScript SDK 예시

```javascript
import { SaeGimClient } from '@saegim/sdk';

const client = new SaeGimClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.saegim.app',
});

// 소셜 로그인 URL 가져오기
const { data: authUrl } = await client.auth.getSocialLoginUrl('google');
window.location.href = authUrl;

// 소셜 로그인 콜백 처리
const { data: tokens } = await client.auth.handleSocialCallback('google', {
  code: 'oauth_code',
  state: 'csrf_state',
});

// 다이어리 작성
const { data: diary } = await client.diary.create({
  title: '오늘의 일기',
  content: '...',
  // 감정은 AI가 글과 사진을 분석하여 자동 추출
});

// AI 글귀 생성
const { data: aiText } = await client.ai.generate({
  style: {
    tone: 'healing',
    length: 'medium',
    type: 'poem',
  },
});
```

---

## 9. 테스트 환경

### 9.1 테스트 서버

- **Base URL**: `https://api-test.saegim.app`
- **특징**: 프로덕션과 동일한 환경, 테스트 데이터 사용

### 9.2 테스트 계정

```json
{
  "email": "test@saegim.app",
  "password": "TestPass123!"
}
```

### 9.3 Rate Limit (테스트 환경)

**기본 정책 (프로덕션과 동일):**

- 일반 API: 1,000 requests/minute
- AI API: 30 requests/minute
- 이미지 업로드: 60 requests/hour

**테스트 전용 확장 정책 (개발/디버깅 시에만 활성화):**

- 개발 환경에서 테스트 목적으로만 AI API 100 requests/minute 허용
- 환경변수 `TEST_RATE_LIMIT_EXTENDED=true` 설정 시에만 적용
- 프로덕션 환경에서는 절대 활성화 불가

---

## 10. 변경 로그

### Version 1.0 (2025-08-08)

- 초기 API 명세 작성
- 인증, 다이어리, AI, 이미지, 통계 API 정의

---

## Appendix

### A. HTTP 헤더 참조

| 헤더            | 설명           | 예시               |
| --------------- | -------------- | ------------------ |
| Authorization   | JWT 토큰       | Bearer eyJhbGci... |
| Content-Type    | 요청 본문 타입 | application/json   |
| Accept          | 응답 타입      | application/json   |
| X-Request-ID    | 요청 추적 ID   | 550e8400-e29b...   |
| Accept-Language | 선호 언어      | ko-KR              |

### B. 타임존

- 모든 시간은 UTC 기준
- 클라이언트에서 로컬 시간으로 변환

### C. 문의 및 지원

- **이메일**: api-support@saegim.app
- **개발자 포털**: https://developers.saegim.app
- **API 상태**: https://status.saegim.app

---

_본 문서는 '새김' 프로젝트의 API 명세서로, 지속적으로 업데이트됩니다._
