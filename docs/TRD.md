# 감성 AI 다이어리 '새김' - Technical Requirements Document (TRD)

---

## 1. 문서 개요

### 문서 목적

본 문서는 '새김' 서비스의 기술적 요구사항과 구현 전략을 정의합니다. PRD에 명시된 기능을 기술적으로 실현하기 위한 구체적인 아키텍처, 기술 스택, API 설계 등을 다룹니다.

### 문서 정보

- **작성일**: 2025년 8월 8일
- **버전**: 1.0
- **작성자**: 새김꾼들
- **관련 문서**: PRD.md

---

## 2. 시스템 아키텍처

### 2.1 전체 아키텍처 개요

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Web App   │  │ Mobile Web  │  │     PWA     │     │
│  │  (Next.js)  │  │ (Responsive)│  │  (Future)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                          │
│                      (Nginx)                             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              FastAPI Backend Server               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │   Auth   │  │   Core   │  │    AI    │      │   │
│  │  │  Module  │  │  Logic   │  │  Module  │      │   │
│  │  └──────────┘  └──────────┘  └──────────┘      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ PostgreSQL  │  │    Redis    │  │    MinIO    │     │
│  │  (Primary)  │  │   (Cache)   │  │  (Storage)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ OpenAI API  │  │   AWS SES   │  │  Analytics  │     │
│  │    (GPT)    │  │   (Email)   │  │   (Future)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 2.2 기술 스택 상세

| 계층               | 기술           | 버전    | 선정 이유                            |
| ------------------ | -------------- | ------- | ------------------------------------ |
| **Frontend**       | Next.js        | 14.x    | SSR/SSG 지원, SEO 최적화, 빠른 개발  |
|                    | TypeScript     | 5.x     | 타입 안정성, 개발 생산성 향상        |
|                    | TailwindCSS    | 3.x     | 일관된 디자인 시스템, 빠른 스타일링  |
|                    | Zustand        | 5.x     | 경량 상태관리, 간단한 API            |
| **Backend**        | FastAPI        | 0.100+  | 고성능 비동기 API, OpenAPI 자동 생성 |
|                    | Python         | 3.11+   | AI/ML 생태계, 빠른 프로토타이핑      |
|                    | SQLModel       | 0.0.14+ | 타입 안정성, FastAPI 호환성          |
|                    | Pydantic       | 2.x     | 데이터 검증, 직렬화                  |
| **Database**       | PostgreSQL     | 14+     | ACID 준수, JSON 지원, 확장성         |
|                    | Redis          | 7.x     | 세션 관리, 캐싱, Rate limiting       |
| **Storage**        | MinIO          | Latest  | S3 호환, 자체 호스팅 가능            |
| **Infrastructure** | Docker         | 24.x    | 컨테이너화, 일관된 배포 환경         |
|                    | Docker Compose | 2.x     | 로컬 개발 환경 구성                  |
|                    | Jenkins        | 2.4x    | CI/CD 자동화                         |
|                    | Nginx          | 1.24+   | 리버스 프록시, API Gateway           |

---

## 3. API 설계

### 3.1 API 응답 표준화

#### 3.1.1 표준 응답 구조

모든 API 응답은 일관된 구조를 따르며, 성공/실패를 명확히 구분합니다:

```python
# 기본 응답 모델
class BaseResponse(BaseModel):
    success: bool                      # 요청 성공 여부
    data: Optional[Any] = None        # 응답 데이터
    message: Optional[str] = None     # 사용자 메시지
    timestamp: datetime                # 응답 시간 (ISO 8601)
    request_id: str                   # 요청 추적 ID (UUID)
```

#### 3.1.2 에러 응답 구조

```python
class ErrorDetail(BaseModel):
    code: str                         # 에러 코드 (예: "AUTH_001")
    field: Optional[str] = None      # 문제가 있는 필드명
    message: str                      # 사용자 친화적 메시지

class ErrorResponse(BaseResponse):
    success: bool = False
    errors: Optional[List[ErrorDetail]] = None
```

#### 3.1.3 페이지네이션 표준

```python
class PaginationInfo(BaseModel):
    page: int                         # 현재 페이지 (1부터 시작)
    page_size: int                   # 페이지 크기
    total_items: int                 # 전체 항목 수
    total_pages: int                 # 전체 페이지 수
    has_next: bool                   # 다음 페이지 존재 여부
    has_previous: bool               # 이전 페이지 존재 여부

class PaginatedResponse(BaseModel):
    success: bool = True
    data: List[Any]                  # 실제 데이터 목록
    pagination: PaginationInfo       # 페이지네이션 정보
    message: Optional[str] = None
    timestamp: datetime
    request_id: Optional[str] = None
```

#### 3.1.4 에러 코드 체계

**하이브리드 접근 방식**: 설명적 코드를 기본으로 하되, 로깅과 모니터링을 위한 숫자 코드 병행

| 카테고리     | 에러 코드                        | 숫자 코드 | 설명                              |
| ------------ | -------------------------------- | --------- | --------------------------------- |
| **인증**     | AUTH_SOCIAL_PROVIDER_ERROR       | 1001      | 소셜 제공자 오류                  |
|              | AUTH_SOCIAL_TOKEN_INVALID        | 1002      | 유효하지 않은 OAuth 토큰          |
|              | AUTH_SOCIAL_USER_DENIED          | 1003      | 사용자가 권한 거부                |
|              | AUTH_SOCIAL_EMAIL_REQUIRED       | 1004      | 이메일 정보 필수                  |
|              | AUTH_SOCIAL_PROVIDER_UNSUPPORTED | 1005      | 지원하지 않는 제공자              |
|              | AUTH_TOKEN_EXPIRED               | 1006      | 액세스 토큰 만료                  |
|              | AUTH_TOKEN_INVALID               | 1007      | 유효하지 않은 토큰                |
|              | AUTH_PERMISSION_DENIED           | 1008      | 권한 없음                         |
|              | AUTH_REFRESH_TOKEN_EXPIRED       | 1009      | 리프레시 토큰 만료                |
| **다이어리** | DIARY_NOT_FOUND                  | 2001      | 다이어리를 찾을 수 없음           |
|              | DIARY_ACCESS_DENIED              | 2002      | 다이어리 접근 권한 없음           |
|              | DIARY_UPDATE_DENIED              | 2003      | 다이어리 수정 권한 없음           |
|              | DIARY_DELETE_DENIED              | 2004      | 다이어리 삭제 권한 없음           |
|              | DIARY_LIMIT_EXCEEDED             | 2005      | 일일 다이어리 작성 한도 초과      |
| **AI**       | AI_SERVICE_UNAVAILABLE           | 3001      | AI 서비스 일시적 오류             |
|              | AI_TOKEN_LIMIT_EXCEEDED          | 3002      | AI 토큰 한도 초과                 |
|              | AI_INVALID_STYLE                 | 3003      | 지원하지 않는 스타일 옵션         |
|              | AI_GENERATION_FAILED             | 3004      | AI 텍스트 생성 실패               |
|              | AI_RATE_LIMIT_EXCEEDED           | 3005      | AI API 호출 한도 초과             |
|              | AI_REGENERATION_FAILED           | 3006      | AI 재생성 실패                    |
|              | AI_GENERATION_NOT_FOUND          | 3007      | 재생성 대상을 찾을 수 없음        |
| **이미지**   | IMG_SIZE_EXCEEDED                | 4001      | 파일 크기 초과 (15MB)             |
|              | IMG_INVALID_FORMAT               | 4002      | 지원하지 않는 이미지 형식         |
|              | IMG_UPLOAD_FAILED                | 4003      | 이미지 업로드 실패                |
|              | IMG_NOT_FOUND                    | 4004      | 이미지를 찾을 수 없음             |
|              | IMG_PROCESSING_FAILED            | 4005      | 이미지 처리 실패                  |
|              | IMG_COUNT_EXCEEDED               | 4006      | 이미지 갯수 초과 (최대 10개 파일) |
| **검증**     | VALIDATION_FAILED                | 5001      | 입력 데이터 검증 실패             |
|              | VALIDATION_EMAIL_INVALID         | 5002      | 유효하지 않은 이메일 형식         |
|              | VALIDATION_REQUIRED_FIELD        | 5004      | 필수 필드 누락                    |
| **시스템**   | SYSTEM_ERROR                     | 9001      | 서버 내부 오류                    |
|              | SYSTEM_DB_ERROR                  | 9002      | 데이터베이스 연결 실패            |
|              | SYSTEM_STORAGE_ERROR             | 9003      | 스토리지 서비스 오류              |
|              | SYSTEM_RATE_LIMIT                | 9004      | API 호출 한도 초과                |
|              | SYSTEM_MAINTENANCE               | 9005      | 시스템 점검 중                    |

**에러 코드 사용 예시**:

```python
class ErrorCode:
    # 소셜 인증 관련
    AUTH_SOCIAL_PROVIDER_ERROR = ("AUTH_SOCIAL_PROVIDER_ERROR", 1001, "소셜 로그인 제공자 오류가 발생했습니다.")
    AUTH_SOCIAL_TOKEN_INVALID = ("AUTH_SOCIAL_TOKEN_INVALID", 1002, "유효하지 않은 OAuth 토큰입니다.")

    # 사용 예시
    def get_error_response(self):
        return {
            "code": self[0],      # "AUTH_EMAIL_DUPLICATE"
            "error_id": self[1],  # 1001
            "message": self[2]    # "이미 사용 중인 이메일입니다."
        }
```

### 3.2 RESTful API 명세

#### 소셜 인증 관련 API

```yaml
# 소셜 로그인 시작
GET /api/auth/social/{provider}/login
Parameters:
  provider: google | kakao | naver

# 302 Redirect Response
Location: https://{oauth-provider}/authorize?client_id=xxx&redirect_uri=xxx

# 소셜 로그인 콜백
GET /api/auth/social/{provider}/callback
Parameters:
  provider: google | kakao | naver
  code: string (OAuth authorization code)
  state: string (CSRF protection)

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "user": {
        "user_id": "uuid",
        "email": "encrypted_email",
        "nickname": "string",
        "provider": "google"
      }
    },
    "message": "로그인 성공",
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_abc123"
  }

# 에러 응답 (400 Bad Request)
Error Response:
  {
    "success": false,
    "data": null,
    "message": "소셜 로그인 실패",
    "errors": [
      {
        "code": "AUTH_SOCIAL_PROVIDER_ERROR",
        "error_id": 1001,
        "field": "provider",
        "message": "소셜 로그인 제공자 오류가 발생했습니다."
      }
    ],
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_abc123"
  }

# 소셜 계정 연결 해제
DELETE /api/auth/social/{provider}/disconnect
Headers:
  Authorization: Bearer {access_token}
Parameters:
  provider: google | kakao | naver

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "provider": "google",
      "disconnected_at": "2025-01-08T12:00:00Z"
    },
    "message": "소셜 계정 연결이 해제되었습니다.",
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_def456"
  }

# 토큰 갱신
POST /api/auth/refresh
Headers:
  Authorization: Bearer {refresh_token}

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "access_token": "jwt_string",
      "token_type": "bearer",
      "expires_in": 3600
    },
    "message": null,
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_ghi789"
  }
```

#### 다이어리 관련 API

```yaml

# 다이어리 작성
POST /api/diary
Headers:
  Authorization: Bearer {access_token}
Request:
  {
    "title": "string",
    "content": "string",
    "emotion": "enum[happy,sad,angry,peaceful,worried]",
    "images": ["uuid"],
    "ai_generated_text": "string",
    "is_public": false
  }

# 성공 응답 (201 Created)
Response:
  {
    "success": true,
    "data": {
      "diary_id": "uuid",
      "title": "string",
      "created_at": "2025-01-08T12:00:00Z"
    },
    "message": "다이어리가 성공적으로 작성되었습니다.",
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_jkl012"
  }

# 다이어리 목록 조회
GET /api/diary?page=1&page_size=20&month=2025-01
Headers:
  Authorization: Bearer {access_token}

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": [
      {
        "diary_id": "uuid",
        "title": "string",
        "emotion": "happy",
        "thumbnail": "url",
        "created_at": "2025-01-08T12:00:00Z"
      }
    ],
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
    "request_id": "req_mno345"
  }

# 다이어리 상세 조회
GET /api/diary/{diary_id}
Headers:
  Authorization: Bearer {access_token}

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "diary_id": "uuid",
      "title": "string",
      "content": "string",
      "emotion": "happy",
      "images": ["url"],
      "ai_generated_text": "string",
      "created_at": "2025-01-08T12:00:00Z",
      "updated_at": "2025-01-08T12:00:00Z"
    },
    "message": null,
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_pqr678"
  }

# 에러 응답 (404 Not Found)
Error Response:
  {
    "success": false,
    "data": null,
    "message": "다이어리를 찾을 수 없습니다.",
    "errors": [
      {
        "code": "DIARY_NOT_FOUND",
        "error_id": 2001,
        "field": null,
        "message": "요청한 다이어리가 존재하지 않거나 접근 권한이 없습니다."
      }
    ],
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_pqr678"
  }

# 다이어리 수정
PUT /api/diary/{diary_id}
Headers:
  Authorization: Bearer {access_token}
Request:
  {
    "title": "string",
    "content": "string",
    "emotion": "string",
  }

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "diary_id": "uuid",
      "updated_at": "2025-01-08T12:00:00Z"
    },
    "message": "다이어리가 수정되었습니다.",
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_stu901"
  }

# 다이어리 삭제
DELETE /api/diary/{diary_id}
Headers:
  Authorization: Bearer {access_token}

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": null,
    "message": "다이어리가 삭제되었습니다.",
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_vwx234"
  }
```

#### AI 관련 API

```yaml
# AI 글귀 생성
POST /api/ai/generate
Headers:
  Authorization: Bearer {access_token}
Request:
  {
    "sentence": "string",
    "emotion": "string",
    "style": {
      "tone": "enum[romantic,healing,calm,humorous]",
      "length": "enum[short,medium,long]",
      "type": "enum[poem,prose,quote]"
    }
  }

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "generated_text": "string",
      "style_applied": {
        "tone": "romantic",
        "length": "medium",
        "type": "poem"
      },
      "tokens_used": 150
    },
    "message": null,
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_yza567"
  }

# AI 글귀 재생성
POST /api/ai/regenerate
Headers:
  Authorization: Bearer {access_token}
Request:
  {
    "generation_id": "string",        # 이전 생성 ID (선택)
    "sentence": "string",             # 입력 문장 (선택)
    "style": {
      "tone": "enum[romantic,healing,calm,humorous]",
      "length": "enum[short,medium,long]",
      "type": "enum[poem,prose,quote]"
    },
    "exclude_previous": "boolean"     # 이전 결과 제외 여부
  }

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "generated_text": "string",
      "style_applied": {
        "tone": "healing",
        "length": "short",
        "type": "poem"
      },
      "tokens_used": 120,
      "generation_id": "gen_def456",
      "is_regenerated": true
    },
    "message": "새로운 글귀가 생성되었습니다.",
    "timestamp": "2025-01-08T12:05:00Z",
    "request_id": "req_regen789"
  }

# 에러 응답 (503 Service Unavailable)
Error Response:
  {
    "success": false,
    "data": null,
    "message": "AI 서비스를 일시적으로 사용할 수 없습니다.",
    "errors": [
      {
        "code": "AI_SERVICE_UNAVAILABLE",
        "error_id": 3001,
        "field": null,
        "message": "OpenAI API 서비스가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해주세요."
      }
    ],
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_yza567"
  }

# 월간 감정 리포트
GET /api/ai/emotion-report?year=2025&month=1
Headers:
  Authorization: Bearer {access_token}

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "period": "2025-01",
      "emotion_distribution": {
        "happy": 45,
        "peaceful": 30,
        "sad": 15,
        "worried": 10
      },
      "keyword_cloud": [
        {"word": "여행", "count": 5},
        {"word": "가족", "count": 3}
      ],
      "ai_summary": "string",
      "trend_analysis": "string"
    },
    "message": null,
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_efg123"
  }
```

#### 알림 관련 API

```yaml
# 알림 목록 조회
GET /api/notifications
Headers:
  Authorization: Bearer {access_token}
Query Parameters:
  page: integer (default: 1)
  limit: integer (default: 20, max: 100)
  type: string (diary_reminder | report_ready | ai_complete)
  is_read: boolean

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "notifications": [
        {
          "id": "uuid",
          "type": "diary_reminder",
          "title": "다이어리 작성 알림",
          "message": "오늘의 감정을 새김에 기록해보세요.",
          "is_read": false,
          "scheduled_at": "2025-08-09T21:00:00Z",
          "created_at": "2025-08-09T21:00:00Z"
        }
      ],
      "pagination": {
        "total_pages": 3,
        "total_items": 45
      }
    },
    "timestamp": "2025-08-09T12:00:00Z"
  }

# 알림 읽음 처리
PATCH /api/notifications/{notification_id}/read
Headers:
  Authorization: Bearer {access_token}

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "id": "uuid",
      "is_read": true,
      "read_at": "2025-08-09T12:30:00Z"
    },
    "message": "알림을 읽음 처리했습니다."
  }

# 알림 설정 조회
GET /api/notifications/settings

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "diary_reminder": {
        "enabled": true,
        "time": "21:00",
        "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
      },
      "report_notification": {
        "enabled": true
      },
      "browser_push": {
        "enabled": true,
        "permission_granted": true
      }
    }
  }

# 알림 설정 업데이트
PUT /api/notifications/settings
Request:
  {
    "diary_reminder": {
      "enabled": true,
      "time": "20:30",
      "days": ["mon", "wed", "fri"]
    },
    "report_notification": {
      "enabled": true
    },
    "browser_push": {
      "enabled": false
    }
  }
```

#### 이미지 관련 API

```yaml
# 이미지 업로드
POST /api/image/upload
Headers:
  Authorization: Bearer {access_token}
  Content-Type: multipart/form-data
Request:
  files: binary[]  # 최대 10개 파일, 각 파일 최대 15MB

# 성공 응답 (201 Created)
Response:
  {
    "success": true,
    "data": {
      "image_id": "uuid",
      "url": "string",
      "thumbnail_url": "string",
      "size": 1024000,
      "mime_type": "image/jpeg"
    },
    "message": "이미지가 업로드되었습니다.",
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_hij456"
  }

# 에러 응답 (413 Payload Too Large)
Error Response:
  {
    "success": false,
    "data": null,
    "message": "파일 크기가 너무 큽니다.",
    "errors": [
      {
        "code": "IMG_SIZE_EXCEEDED",
        "error_id": 4001,
        "field": "file",
        "message": "이미지 파일은 15MB를 초과할 수 없습니다. 최대 10개 파일, 총 120MB까지 업로드 가능합니다."
      }
    ],
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_hij456"
  }

# 이미지 합성
POST /api/image/synthesis
Headers:
  Authorization: Bearer {access_token}
Request:
  {
    "image_id": "uuid",
    "text": "string",
    "template_id": "string",
    "options": {
      "font": "string",
      "color": "string",
      "position": "enum[top,center,bottom]"
    }
  }

# 성공 응답 (200 OK)
Response:
  {
    "success": true,
    "data": {
      "synthesized_image_url": "string",
      "download_url": "string",
      "expires_at": "2025-01-08T13:00:00Z"
    },
    "message": null,
    "timestamp": "2025-01-08T12:00:00Z",
    "request_id": "req_klm789"
  }
```

### 3.3 HTTP 상태 코드 및 에러 처리

#### 3.3.1 HTTP 상태 코드 사용 지침

| 상태 코드                     | 용도                             | 예시                             |
| ----------------------------- | -------------------------------- | -------------------------------- |
| **200 OK**                    | 성공적인 GET, PUT 요청           | 다이어리 조회, 수정              |
| **201 Created**               | 성공적인 POST 요청 (리소스 생성) | 회원가입, 다이어리 작성          |
| **204 No Content**            | 성공적인 DELETE 요청             | 다이어리 삭제                    |
| **400 Bad Request**           | 잘못된 요청 데이터               | 유효하지 않은 입력값             |
| **401 Unauthorized**          | 인증 실패                        | 로그인 실패, 토큰 없음           |
| **403 Forbidden**             | 권한 없음                        | 다른 사용자의 다이어리 수정 시도 |
| **404 Not Found**             | 리소스 없음                      | 존재하지 않는 다이어리           |
| **422 Unprocessable Entity**  | 검증 실패                        | Pydantic 모델 검증 실패          |
| **429 Too Many Requests**     | Rate Limit 초과                  | API 호출 제한 초과               |
| **500 Internal Server Error** | 서버 내부 오류                   | 예상치 못한 서버 오류            |
| **503 Service Unavailable**   | 서비스 일시 중단                 | 외부 API 장애                    |

#### 3.3.2 에러 처리 구현 예시

```python
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from datetime import datetime
import uuid

app = FastAPI()

# 검증 에러 핸들러
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        errors.append({
            "code": "VALIDATION_ERROR",
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"]
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "data": None,
            "message": "입력 데이터 검증 실패",
            "errors": errors,
            "timestamp": datetime.now().isoformat(),
            "request_id": str(uuid.uuid4())
        }
    )

# HTTP 예외 핸들러
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.detail,
            "errors": None,
            "timestamp": datetime.now().isoformat(),
            "request_id": str(uuid.uuid4())
        }
    )
```

### 3.4 API 보안 정책

- **인증**: JWT 기반 Bearer Token
- **토큰 만료**: Access Token 1시간, Refresh Token 7일
- **Rate Limiting** (전체 환경 공통):
  - 일반 API: 1,000 requests/minute
  - AI API: 30 requests/minute (프로덕션/테스트 동일)
  - 이미지 업로드: 60 uploads/hour
  - 버스트 허용: 2,000 requests/minute (10초간)
  - **개발 환경 예외**: `TEST_RATE_LIMIT_EXTENDED=true` 시에만 AI API 100 requests/minute 허용
- **CORS**: 프로덕션 도메인만 허용
- **입력 검증**: Pydantic 모델 기반 자동 검증
- **에러 메시지**: 보안 정보 노출 방지 (디버그 정보는 로그에만 기록)
- **요청 추적**: 모든 요청에 고유 request_id 할당

---

## 4. 데이터베이스 설계

### 4.1 ER 다이어그램

```sql
-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,  -- 평문 저장
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('google', 'kakao', 'naver')),
    provider_id VARCHAR(255) NOT NULL,  -- 소셜 제공자의 사용자 ID
    nickname VARCHAR(50) NOT NULL,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 복합 유니크 인덱스
    UNIQUE KEY unique_provider_user (provider, provider_id),
    UNIQUE KEY unique_email (email)
);

-- OAuth 토큰 테이블 (신규)
CREATE TABLE oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL,
    access_token TEXT NOT NULL,  -- 암호화 저장
    refresh_token TEXT,  -- 암호화 저장
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_user_provider (user_id, provider)
);

-- 다이어리 테이블
CREATE TABLE diaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    content TEXT,
    user_emotion VARCHAR(20),  -- 사용자 선택 감정
    ai_emotion VARCHAR(20),    -- AI 분석 감정
    ai_emotion_confidence FLOAT,  -- AI 감정 분석 신뢰도 (0.0-1.0)
    ai_generated_text TEXT,
    is_public BOOLEAN DEFAULT false,
    keywords JSONB DEFAULT [],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_emotion_analysis (user_emotion, ai_emotion)
);

-- 이미지 테이블
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_id UUID REFERENCES diaries(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    mime_type VARCHAR(50),
    file_size INTEGER,
    exif_removed BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_diary_images (diary_id)
);

-- 감정 통계 테이블 (월간 집계용)
CREATE TABLE emotion_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    emotion VARCHAR(20) NOT NULL,
    count INTEGER DEFAULT 0,
    UNIQUE KEY unique_user_period_emotion (user_id, year, month, emotion)
);

-- AI 사용 로그 테이블
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    api_type VARCHAR(50) NOT NULL, -- 'generate', 'report'
    tokens_used INTEGER,
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC)
);
```

### 4.2 인덱싱 전략

#### 기본 인덱스

- **Primary Keys**: UUID 사용으로 분산 환경 대비
- **Foreign Keys**: 참조 무결성 보장
- **Composite Indexes**: 자주 사용되는 쿼리 패턴 최적화
- **JSONB**: 유연한 데이터 저장 (request/response logs)

#### 추가 성능 최적화 인덱스

```sql
-- 감정 통계 조회 최적화
CREATE INDEX idx_user_emotion_period ON emotion_stats(user_id, year, month);

-- AI 감정 분석 신뢰도 조회 최적화
CREATE INDEX idx_ai_confidence ON diaries(ai_emotion_confidence)
    WHERE ai_emotion_confidence IS NOT NULL;

-- 감정 불일치 분석용 인덱스
CREATE INDEX idx_emotion_mismatch ON diaries(user_id, created_at)
    WHERE user_emotion != ai_emotion AND ai_emotion IS NOT NULL;
```

#### 인덱스 적용 이유

- `idx_user_emotion_period`: 월간 감정 리포트 생성 시 성능 향상
- `idx_ai_confidence`: AI 감정 분석 신뢰도 기반 필터링 최적화
- `idx_emotion_mismatch`: 사용자 감정과 AI 분석 불일치 케이스 분석용

### 4.3 관계 제약사항 및 CASCADE 정책

#### 다이어리 삭제 시

- **images**: SET NULL (이미지는 유지, 연결만 해제)

#### CASCADE 정책 상세

| 부모 테이블 | 자식 테이블   | CASCADE 정책 | 설명                              |
| ----------- | ------------- | ------------ | --------------------------------- |
| users       | diaries       | RESTRICT     | 사용자 삭제 전 다이어리 처리 필요 |
| users       | images        | RESTRICT     | 사용자 삭제 전 이미지 처리 필요   |
| users       | emotion_stats | CASCADE      | 사용자 삭제 시 통계도 삭제        |
| users       | ai_usage_logs | CASCADE      | 사용자 삭제 시 로그도 삭제        |
| diaries     | images        | SET NULL     | 다이어리 삭제 시 이미지는 유지    |

---

## 5. 보안 요구사항

### 5.1 인증 및 인가

- **비밀번호**: bcrypt 해싱 (cost factor: 12)
- **JWT 구성**:
  ```json
  {
    "sub": "user_id",
    "email": "user@example.com",
    "exp": 1234567890,
    "iat": 1234567890,
    "jti": "unique_token_id"
  }
  ```
- **세션 관리**: Redis 기반 블랙리스트 관리

### 5.2 데이터 보안

#### 5.2.1 전송 보안

- **프로토콜**: HTTPS only (TLS 1.3 이상)
- **HSTS 헤더**: `max-age=31536000; includeSubDomains; preload`
- **Certificate Pinning**: 모바일 앱에서 인증서 고정
- **API 통신**:
  - 모든 API 요청/응답 HTTPS 필수
  - HTTP 요청 시 자동 HTTPS 리다이렉트

#### 5.2.2 저장 보안

- **데이터베이스 암호화**:
  - 암호화 알고리즘: AES-256-GCM
  - 키 관리: 환경 변수 기반 관리
  - 암호화 대상:
    - `diaries.content` - 일기 내용
    - `diaries.ai_generated_text` - AI 생성 텍스트
    - `users.email` - 이메일 주소 (검색용 해시 별도 저장)
- **파일 시스템 암호화**:
  - MinIO 저장소 암호화 (SSE-S3)
  - 이미지 파일 암호화 저장
- **데이터베이스 연결**:
  - SSL/TLS 필수 (`sslmode=require`)
  - 연결 문자열 예시:
    ```
    postgresql://user:pass@host:5432/db?sslmode=require&sslcert=client.crt&sslkey=client.key
    ```

#### 5.2.3 이미지 보안

- **업로드 제한**:
  - 다이어리당 최대 10개 파일
  - 파일당 최대 크기: 15MB
  - 총 업로드 크기: 100MB (10개 × 15MB)
  - 지원 형식: JPEG, PNG, WebP
  - Rate Limiting: 60 uploads/hour (사용자당)
- **업로드 검증**:
  - MIME 타입 검증 (image/jpeg, image/png, image/webp만 허용)
  - 매직 넘버 검증 (파일 시그니처 확인)
  - 파일 크기 및 갯수 제한 확인
- **처리**:
  - EXIF 메타데이터 완전 제거
  - 이미지 재인코딩으로 악성 코드 제거
  - 안전한 파일명 생성 (UUID 기반)

### 5.3 암호화 구현 상세

#### 5.3.1 비밀번호 해싱

```python
import bcrypt

# 비밀번호 해싱
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)  # cost factor 12
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# 비밀번호 검증
def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

#### 5.3.2 데이터 암호화

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

class DataEncryption:
    def __init__(self, key: bytes):
        self.cipher = AESGCM(key)

    def encrypt(self, plaintext: str) -> tuple[bytes, bytes]:
        nonce = os.urandom(12)  # 96-bit nonce for GCM
        ciphertext = self.cipher.encrypt(nonce, plaintext.encode(), None)
        return nonce, ciphertext

    def decrypt(self, nonce: bytes, ciphertext: bytes) -> str:
        plaintext = self.cipher.decrypt(nonce, ciphertext, None)
        return plaintext.decode()
```

#### 5.3.3 키 관리 정책

- **마스터 키**: 환경 변수 또는 보안 볼트에 저장
- **키 로테이션**: 분기별 키 로테이션 (90일 주기)
- **키 파생**: PBKDF2 또는 Argon2id 사용
- **키 저장**:
  - 개발: 환경 변수 (.env 파일)
  - 운영: 서버 환경 변수 또는 Docker secrets
- **키 백업**: 암호화된 키 백업 3개 이상 유지

### 5.4 개인정보 보호

- **데이터 최소화**: 필수 정보만 수집
- **암호화**: 개인식별정보 암호화 저장
- **접근 제어**: Role-based Access Control
- **감사 로그**: 모든 데이터 접근 기록

---

## 6. 성능 요구사항

### 6.1 응답 시간 목표

| API 종류      | 목표 응답 시간 | 최대 허용 시간 |
| ------------- | -------------- | -------------- |
| 일반 조회     | < 200ms        | 500ms          |
| AI 글귀 생성  | < 3s           | 5s             |
| 이미지 업로드 | < 2s           | 5s             |
| 이미지 합성   | < 4s           | 7s             |
| 월간 리포트   | < 2s           | 4s             |

### 6.2 처리량 목표

- **동시 접속자**: 1,000명
- **일일 활성 사용자**: 10,000명
- **피크 시간 동시 접속자**: 1,000명
- **초당 요청 처리**:
  - 일반 API: 1,000 req/min (≈16.7 req/s)
  - AI API: 30 req/min (≈0.5 req/s)
  - 버스트: 2,000 req/min (≈33.3 req/s, 10초간)
- **데이터베이스 연결 풀**: 100 connections
- **Redis 연결 풀**: 50 connections

### 6.3 최적화 전략

- **캐싱**:
  - Redis: 세션, 자주 조회되는 데이터
  - CDN: 정적 리소스 (이미지, CSS, JS)
  - 브라우저 캐싱: Cache-Control 헤더

**상세 캐싱 TTL 정책**:

- **AI 서비스**:
  - AI 생성 결과: 1시간 TTL
  - AI 키워드 추천: 30분 TTL
- **다이어리 데이터**:
  - 다이어리 목록: 10분 TTL
  - 다이어리 상세: 30분 TTL
- **통계 및 리포트**:
  - 월간 감정 통계: 24시간 TTL
  - 감정 리포트: 24시간 TTL
  - 집계 결과: 1시간 TTL
- **이미지 데이터**:
  - 이미지 메타데이터: 24시간 TTL
  - 썸네일: 7일 TTL
  - 합성 이미지: 1시간 TTL
- **비동기 처리**:
  - Celery: 이미지 처리, 리포트 생성
  - WebSocket: 실시간 알림 (향후)
- **데이터베이스 최적화**:
  - 쿼리 최적화 및 인덱싱
  - Read Replica 구성 (확장 시)

---

## 7. 인프라 및 배포

### 7.1 개발 환경

```yaml
# docker-compose.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost/api
    volumes:
      - ./frontend:/app

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/saegim
      - REDIS_URL=redis://redis:6379
      - MINIO_URL=http://minio:9000
      - TEST_RATE_LIMIT_EXTENDED=false # true: 개발환경 AI API 100 req/min 허용
    depends_on:
      - postgres
      - redis
      - minio

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=saegim
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  minio:
    image: minio/minio:latest
    ports:
      - '9000:9000'
      - '9001:9001'
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=password
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

#### Nginx 설정 예시

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=1000r/m;
    limit_req_zone $binary_remote_addr zone=ai:10m rate=30r/m;

    server {
        listen 80;
        server_name localhost;

        # Frontend 요청
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # API 요청 (일반)
        location /api/ {
            limit_req zone=api burst=100 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Authorization $http_authorization;
        }

        # AI API 요청 (제한 강화)
        location /api/ai/ {
            limit_req zone=ai burst=10 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Authorization $http_authorization;
        }
    }
}
```

### 7.2 환경별 Rate Limiting 정책

#### 프로덕션 환경 (Production)

- **AI API**: 30 requests/minute (고정)
- **일반 API**: 1,000 requests/minute
- **이미지 업로드**: 60 requests/hour
- **버스트 허용**: 2,000 requests/minute (10초간)

#### 테스트/스테이징 환경 (Testing/Staging)

- **기본 정책**: 프로덕션과 동일 (AI API 30 requests/minute)
- **목적**: 프로덕션 환경과 동일한 조건에서 테스트 수행

#### 개발 환경 (Development)

- **기본값**: 프로덕션과 동일
- **확장 모드**: `TEST_RATE_LIMIT_EXTENDED=true` 설정 시
  - AI API: 100 requests/minute (개발/디버깅 편의성)
  - 일반 API: 2,000 requests/minute
  - 이미지 업로드: 120 requests/hour

**환경 구분 원칙**:

- 테스트 환경의 유효성 확보를 위해 프로덕션과 동일한 제한 적용
- 개발 편의성을 위한 확장 모드는 개발 환경에서만 선택적 활성화
- 프로덕션 환경에서는 `TEST_RATE_LIMIT_EXTENDED` 변수 무시

### 7.3 CI/CD 파이프라인

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                sh 'npm run test'
                sh 'pytest'
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t saegim-frontend ./frontend'
                sh 'docker build -t saegim-backend ./backend'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose -f docker-compose.prod.yml up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
```

### 7.3 모니터링 및 로깅

- **애플리케이션 모니터링**:
  - Prometheus + Grafana
  - Custom metrics (API 응답 시간, 에러율)
- **로그 관리**:
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - 구조화된 로깅 (JSON format)
- **알림**:
  - 에러율 > 1%
  - 응답 시간 > SLA
  - 디스크 사용률 > 80%

---

## 8. 개발 일정

### 8.1 MVP 개발 일정 (4주)

| 주차      | 기간      | 주요 목표                | 결과물                                          |
| --------- | --------- | ------------------------ | ----------------------------------------------- |
| **1주차** | Day 1-7   | 환경 구축 및 백엔드 기반 | DB 설계, 사용자 인증 API, 알림 시스템 기초      |
| **2주차** | Day 8-14  | 핵심 기능 개발           | 다이어리 CRUD, 이미지 업로드, 알림 시스템 구현  |
| **3주차** | Day 15-21 | AI 기능 통합             | GPT API 연동, 감정 분석, 글귀 생성, 월간 리포트 |
| **4주차** | Day 22-28 | 프론트엔드 및 배포       | UI 구현, 알림 UI 통합, 통합 테스트, MVP 배포    |

**알림 시스템 개발 세부 일정:**

- **1주차**: 알림 데이터베이스 설계 및 기본 API 설계
- **2주차**: 알림 CRUD API, 알림 설정 API, 예약 전송 로직 구현
- **3주차**: 브라우저 푸시 알림 연동, 다이어리/리포트 알림 통합
- **4주차**: 알림 UI 컴포넌트, 알림 설정 페이지, 최종 통합 테스트

#### 상세 일정표

| 주차      | 기간      | Backend                                                                                                | Frontend                                                                                            | Infrastructure                                                                                    |
| --------- | --------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **1주차** | Day 1-7   | • DB 스키마 설계 (Day 1-2)<br>• 사용자 인증 API (Day 3-5)<br>• JWT 토큰 구현 (Day 6-7)                 | • 프로젝트 초기 설정 (Day 1-2)<br>• 라우팅 구성 (Day 3-4)<br>• 레이아웃 구현 (Day 5-7)              | • Docker 환경 구성 (Day 1-3)<br>• PostgreSQL/Redis 설정 (Day 4-5)<br>• CI/CD 파이프라인 (Day 6-7) |
| **2주차** | Day 8-14  | • 다이어리 CRUD API (Day 8-10)<br>• 이미지 업로드 API (Day 11-12)<br>• MinIO 연동 (Day 13-14)          | • 로그인/회원가입 UI (Day 8-10)<br>• 다이어리 작성 폼 (Day 11-12)<br>• 이미지 업로드 UI (Day 13-14) | • 개발 서버 배포 (Day 8-9)<br>• 모니터링 설정 (Day 10-11)<br>• 로그 수집 시스템 (Day 12-14)       |
| **3주차** | Day 15-21 | • OpenAI GPT API 연동 (Day 15-17)<br>• AI 감정 분석 로직 (Day 18-19)<br>• AI 글귀 생성 API (Day 20-21) | • AI 글귀 생성 UI (Day 15-17)<br>• AI 감정 분석 결과 표시 (Day 18-19)<br>• 결과 표시 UI (Day 20-21) | • 스테이징 환경 구성 (Day 15-17)<br>• API 키 관리 (Day 18-19)<br>• 보안 점검 (Day 20-21)          |
| **4주차** | Day 22-30 | • API 성능 최적화 (Day 22-24)<br>• 버그 수정 (Day 25-27)<br>• 통합 테스트 (Day 28-30)                  | • UI/UX 개선 (Day 22-24)<br>• 반응형 디자인 (Day 25-26)<br>• E2E 테스트 (Day 27-30)                 | • 프로덕션 환경 준비 (Day 22-24)<br>• 백업 시스템 (Day 25-26)<br>• MVP 배포 (Day 27-30)           |

### 8.2 기술 리스크 및 대응

| 리스크                | 영향도 | 발생 가능성 | 대응 방안                     |
| --------------------- | ------ | ----------- | ----------------------------- |
| **OpenAI API 장애**   | 높음   | 중간        | Fallback 모델 준비, 캐싱 강화 |
| **이미지 처리 성능**  | 중간   | 높음        | 비동기 처리, CDN 활용         |
| **데이터베이스 부하** | 높음   | 중간        | 인덱싱 최적화, Read Replica   |
| **보안 취약점**       | 높음   | 낮음        | 정기 보안 감사, 침투 테스트   |
| **자체 서버 장애**    | 높음   | 낮음        | 이중화, 자동 복구 스크립트    |

---

### 3.5 Pydantic 모델 정의

```python
# models/response.py
from typing import Optional, Any, List, Generic, TypeVar
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
import uuid

T = TypeVar('T')

# 감정 타입 정의
class EmotionType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    PEACEFUL = "peaceful"
    WORRIED = "worried"

# 도메인 모델 (위에 정의된 BaseResponse, ErrorResponse, PaginatedResponse 사용)
class UserResponse(BaseModel):
    user_id: str
    email: str
    nickname: str
    created_at: datetime

class DiaryListItem(BaseModel):
    diary_id: str
    title: str
    user_emotion: Optional[EmotionType]  # 사용자 선택 감정
    ai_emotion: Optional[EmotionType]     # AI 분석 감정
    ai_emotion_confidence: Optional[float]  # AI 감정 분석 신뢰도 (0.0-1.0)
    thumbnail: Optional[str]
    created_at: datetime

class DiaryDetail(BaseModel):
    diary_id: str
    title: str
    content: str
    user_emotion: Optional[EmotionType]  # 사용자 선택 감정
    ai_emotion: Optional[EmotionType]     # AI 분석 감정
    ai_emotion_confidence: Optional[float]  # AI 감정 분석 신뢰도 (0.0-1.0)
    images: List[str]
    ai_generated_text: Optional[str]
    created_at: datetime
    updated_at: datetime
```

---

## 9. 테스트 전략

### 9.1 테스트 레벨

- **단위 테스트**: 80% 이상 커버리지 목표
- **통합 테스트**: 70% 이상 커버리지 목표, API 엔드포인트 전체 포함
- **E2E 테스트**: 핵심 사용자 시나리오
- **성능 테스트**: 부하 테스트, 스트레스 테스트
- **보안 테스트**: OWASP Top 10 점검

### 9.2 테스트 커버리지 품질 기준

#### 최소 커버리지 요구사항

- **단위 테스트 (Unit Test)**:

  - 목표: 80% 이상
  - 측정 도구: pytest-cov (Python), Jest coverage (JavaScript)
  - 대상: 비즈니스 로직, 유틸리티 함수, 데이터 검증

- **통합 테스트 (Integration Test)**:
  - 목표: 70% 이상
  - 측정 도구: pytest + coverage.py
  - 대상: API 엔드포인트, 데이터베이스 연동, 외부 서비스 연동

#### 품질 게이트 (Quality Gates)

```yaml
quality_gates:
  unit_test_coverage: '≥80%'
  integration_test_coverage: '≥70%'
  code_smell_threshold: 'A' # SonarQube 기준
  duplicated_lines: '<5%'
  test_success_rate: '100%' # CI/CD 파이프라인 통과 조건
```

### 9.3 테스트 자동화

```python
# pytest 예시 - 표준화된 응답 형식 테스트
def test_diary_creation():
    response = client.post("/api/diary",
        json={
            "title": "Test",
            "content": "Content",
            "emotion": "happy"
        },
        headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 201
    data = response.json()

    # 표준 응답 구조 검증
    assert data["success"] is True
    assert "data" in data
    assert "message" in data
    assert "timestamp" in data
    assert "request_id" in data

    # 실제 데이터 검증
    assert "diary_id" in data["data"]
    assert data["data"]["title"] == "Test"

def test_diary_list_pagination():
    response = client.get("/api/diary?page=1&page_size=10",
        headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()

    # 페이지네이션 응답 구조 검증
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert "pagination" in data

    # 페이지네이션 정보 검증
    pagination = data["pagination"]
    assert "page" in pagination
    assert "page_size" in pagination
    assert "total_items" in pagination
    assert "total_pages" in pagination
    assert "has_next" in pagination
    assert "has_previous" in pagination

def test_social_auth_error():
    # 잘못된 소셜 제공자로 요청
    response = client.get("/api/auth/social/invalid/login")

    assert response.status_code == 401
    data = response.json()

    # 에러 응답 구조 검증
    assert data["success"] is False
    assert data["data"] is None
    assert "message" in data
    assert "errors" in data
    assert "timestamp" in data
    assert "request_id" in data

    # 에러 상세 정보 검증
    if data["errors"]:
        error = data["errors"][0]
        assert "code" in error
        assert "message" in error
```

---

## 10. 유지보수 계획

### 10.1 정기 작업

- **일일**: 로그 모니터링, 에러 체크
- **주간**: 백업 검증, 성능 리포트
- **월간**: 보안 패치, 의존성 업데이트
- **분기**: 침투 테스트, 재해 복구 훈련

### 10.2 SLA (Service Level Agreement)

- **가용성**: 99.9% (월간 43분 이내 장애)
- **응답 시간**: 95 percentile < 1초
- **데이터 손실**: RPO 1시간, RTO 4시간
- **지원 응답**: Critical 1시간, Major 4시간

---

## Appendix

### A. 기술 용어집

| 용어     | 설명                                                 |
| -------- | ---------------------------------------------------- |
| **SSR**  | Server-Side Rendering, 서버에서 HTML 생성            |
| **JWT**  | JSON Web Token, 인증 토큰 표준                       |
| **CORS** | Cross-Origin Resource Sharing, 교차 출처 리소스 공유 |
| **EXIF** | Exchangeable Image File Format, 이미지 메타데이터    |
| **RPO**  | Recovery Point Objective, 복구 시점 목표             |
| **RTO**  | Recovery Time Objective, 복구 시간 목표              |

### B. 참고 자료

1. [FastAPI Documentation](https://fastapi.tiangolo.com)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
4. [OWASP Security Guidelines](https://owasp.org)
5. [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

_본 문서는 '새김' 프로젝트의 기술 요구사항 정의서로, 개발팀의 구현 가이드라인입니다._
