# Better T Stack 프로젝트 개발 및 배포 진행 상황

## 📋 프로젝트 개요

**프로젝트명**: Better T Stack Application  
**기술 스택**: Next.js 15, tRPC, Drizzle ORM, Supabase Auth, TailwindCSS, shadcn/ui  
**저장소**: https://github.com/jacklee82/better-t-stack-app  
**배포 플랫폼**: Vercel

---

## ✅ 완료된 작업

### 1단계: 프로젝트 초기 설정
- [x] **패키지 설치**: 134개 패키지 설치 완료 (`bun install`)
- [x] **환경 변수 설정**: `apps/web/.env` 파일 생성
  ```env
  DATABASE_URL=postgresql://postgres:uiZZ5LoWcNfhLSKn@db.qsqnejqjlhtwvzqxamyk.supabase.co:5432/postgres
  ```
- [x] **데이터베이스 스키마 생성**:
  - `packages/db/src/schema/users.ts` - users 테이블 정의
  - `packages/db/src/schema/index.ts` - 스키마 export
  - `packages/db/src/index.ts` - 스키마 export 추가
- [x] **서버 실행**: Next.js 개발 서버 포트 3001에서 정상 실행

### 2단계: Supabase Auth 연결
- [x] **패키지 설치**:
  - `@supabase/supabase-js@2.75.0`
  - `@supabase/ssr@0.7.0`
- [x] **환경 변수 추가**:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://qsqnejqjlhtwvzqxamyk.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[사용자가 설정]
  ```
- [x] **Supabase 클라이언트 설정**:
  - `src/lib/supabase/client.ts` - 브라우저 클라이언트
  - `src/lib/supabase/server.ts` - 서버 클라이언트
  - `src/lib/supabase/middleware.ts` - 세션 관리 미들웨어
  - `src/middleware.ts` - Next.js 미들웨어
- [x] **Auth UI 컴포넌트 구현**:
  - `src/components/auth/login-form.tsx` - 로그인/회원가입 폼
  - `src/components/auth/user-menu.tsx` - 사용자 메뉴 (드롭다운)
  - `src/app/auth/login/page.tsx` - 로그인 페이지
  - `src/components/header.tsx` - 헤더에 UserMenu 통합

### 3단계: 기능 테스트
- [x] **회원가입 테스트**: test@example.com 계정 생성 성공
- [x] **자동 로그인**: 세션 유지 확인
- [x] **사용자 메뉴**: 이메일 표시 및 드롭다운 작동
- [x] **로그아웃**: 로그아웃 후 로그인 버튼으로 전환
- [x] **API 연결**: "API Status: Connected" 확인

### 4단계: Git 저장소 설정
- [x] **Git 커밋**: 16개 파일 변경사항 커밋
- [x] **GitHub 저장소 생성**: `jacklee82/better-t-stack-app`
- [x] **코드 푸시**: 97개 객체 푸시 완료
- [x] **.gitignore 설정**: Next.js 관련 항목 추가

---

## 🔄 진행 중인 작업

### 5단계: Vercel 배포
- [x] **Vercel CLI 설치**: v48.2.9 설치 완료
- [x] **Vercel 로그인**: 인증 완료
- [x] **로컬 빌드 테스트**: 성공 (경고 무시)
- [x] **vercel.json 설정**: 빌드 설정 완료
- [x] **프로젝트 생성**: Vercel에서 새 프로젝트 생성
- [x] **Root Directory 설정**: `apps/web` 설정
- [x] **환경 변수 설정**: 3개 변수 추가
  - `DATABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **배포 완료**: 현재 환경 변수 오류로 빌드 실패

---

## ❌ 발생한 문제 및 해결

### 문제 1: 데이터베이스 연결 실패
**오류**: `password authentication failed for user "postgres"`
**상태**: 해결됨 (올바른 비밀번호로 수정)

### 문제 2: Vercel Root Directory 설정
**오류**: `No Next.js version detected`
**해결**: vercel.json 설정 및 Root Directory `apps/web` 설정

### 문제 3: vercel.json 설정 오류
**오류**: `Invalid vercel.json - should NOT have additional property 'rootDirectory'`
**해결**: vercel.json에서 잘못된 속성 제거

### 문제 4: 현재 배포 오류
**오류**: `@supabase/ssr: Your project's URL and API key are required`
**상태**: 해결 중 (환경 변수 확인 필요)

---

## 📁 최종 프로젝트 구조

```
my-better-t-app/
├── apps/
│   └── web/                    # Next.js 프론트엔드
│       ├── .env                # 환경 변수
│       ├── .env.example        # 환경 변수 예시
│       ├── src/
│       │   ├── app/
│       │   │   ├── auth/login/ # 로그인 페이지
│       │   │   ├── api/trpc/   # tRPC API
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── auth/       # Auth 컴포넌트
│       │   │   ├── ui/         # shadcn/ui 컴포넌트
│       │   │   └── header.tsx
│       │   ├── lib/
│       │   │   ├── supabase/   # Supabase 클라이언트
│       │   │   └── utils.ts
│       │   └── middleware.ts   # Next.js 미들웨어
│       └── package.json
├── packages/
│   ├── api/                    # tRPC API 레이어
│   └── db/                     # Drizzle ORM
│       └── src/
│           ├── schema/         # 데이터베이스 스키마
│           └── index.ts
├── vercel.json                 # Vercel 배포 설정
├── .gitignore
└── package.json
```

---

## 🔧 환경 변수 설정

### 로컬 개발 (.env)
```env
DATABASE_URL=postgresql://postgres:uiZZ5LoWcNfhLSKn@db.qsqnejqjlhtwvzqxamyk.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://qsqnejqjlhtwvzqxamyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[사용자 설정]
```

### Vercel 배포
- 동일한 환경 변수를 Vercel Dashboard에서 설정
- Production, Preview 환경에 모두 적용

---

## 🚀 배포 설정

### vercel.json
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": ".next",
  "installCommand": "bun install",
  "framework": "nextjs"
}
```

### Vercel 설정
- **Root Directory**: `apps/web`
- **Framework**: Next.js
- **Build Command**: `bun run build`
- **Output Directory**: `.next`

---

## 📊 테스트 결과

### 로컬 테스트
- ✅ 홈페이지 로드: http://localhost:3001
- ✅ API Status: Connected
- ✅ 로그인 페이지: http://localhost:3001/auth/login
- ✅ 회원가입: test@example.com 성공
- ✅ 로그인/로그아웃: 정상 작동
- ✅ 세션 관리: 쿠키 기반 세션 유지

### 배포 테스트
- ✅ 빌드 시작: 성공
- ✅ 패키지 설치: 476개 패키지 설치
- ✅ Next.js 감지: v15.5.4 감지
- ❌ 환경 변수: Supabase 클라이언트 생성 실패

---

## 🎯 다음 단계

### 즉시 해결 필요
1. **환경 변수 확인**: Vercel Dashboard에서 Supabase URL과 ANON KEY 값 확인
2. **재배포**: 환경 변수 수정 후 재배포
3. **배포 테스트**: 배포 URL에서 전체 기능 테스트

### 향후 개선사항
1. **Supabase RLS 설정**: Row Level Security 정책 추가
2. **에러 핸들링**: 더 나은 에러 메시지 및 처리
3. **성능 최적화**: 이미지 최적화, 코드 스플리팅
4. **모니터링**: Vercel Analytics, Supabase Logs 설정

---

## 📝 참고사항

### 기술 스택 버전
- Next.js: 15.5.4
- React: 19.1.0
- Supabase: 2.75.0
- tRPC: 11.6.0
- Drizzle ORM: 0.44.2
- TailwindCSS: 4.1.14

### 주요 의존성
- `@supabase/supabase-js`: Supabase 클라이언트
- `@supabase/ssr`: 서버사이드 렌더링 지원
- `@trpc/server`: tRPC 서버
- `@trpc/client`: tRPC 클라이언트
- `drizzle-orm`: TypeScript ORM
- `next-themes`: 다크/라이트 모드
- `sonner`: Toast 알림

---

---

## 🚛 화물차 계근 시스템 개발 계획

### 📋 프로젝트 개요

**프로젝트명**: 화물차 계근 관리 시스템  
**목적**: 공장 내 화물차 계근 자동화 및 관리  
**대상 사용자**: 화물차 운전자 (주로 어르신), 공장 관리자  
**접근 방식**: QR 코드 스캔을 통한 간편한 모바일 접근

### 🎯 핵심 기능

#### **1. QR 코드 기반 접근**
- 공장 입구 QR 코드 스캔
- 자동 계근 페이지 접속
- 위치별 QR 코드 관리

#### **2. 계근 정보 입력**
- **자동 입력**: 날짜, 시간, 계근 위치
- **사용자 입력**: 소속, 이름, 전화번호, 무게
- 어르신 친화적 UI (큰 글씨, 큰 버튼)

#### **3. 관리자 기능**
- 계근 기록 조회 및 통계
- QR 코드 위치 관리
- 소속 회사 관리
- 데이터 내보내기

### 🎨 UI/UX 설계 원칙

#### **어르신 친화적 디자인**
```
🔤 큰 글씨 (최소 24px)
🎨 높은 대비 (검은 글씨, 흰 배경)
📱 큰 버튼 (최소 60px 높이)
🎯 간단한 레이아웃
⚡ 빠른 로딩
```

#### **색상 팔레트**
```
🎨 주요 색상:
- 배경: #FFFFFF (흰색)
- 텍스트: #000000 (검은색)
- 버튼: #007BFF (파란색)
- 강조: #28A745 (초록색)
- 경고: #DC3545 (빨간색)
```

### 🏗️ 데이터베이스 설계

#### **계근 기록 테이블**
```sql
CREATE TABLE vehicle_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id TEXT NOT NULL,           -- QR 코드 식별자
  location TEXT NOT NULL,             -- 계근 위치
  company TEXT NOT NULL,              -- 소속
  driver_name TEXT NOT NULL,          -- 운전자 이름
  phone_number TEXT NOT NULL,         -- 전화번호
  weight DECIMAL(10,2) NOT NULL,      -- 무게
  log_date DATE NOT NULL,             -- 날짜
  log_time TIME NOT NULL,             -- 시간
  created_at TIMESTAMP DEFAULT NOW()  -- 생성 시간
);
```

#### **QR 코드 관리 테이블**
```sql
CREATE TABLE qr_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code TEXT UNIQUE NOT NULL,       -- QR 코드 값
  location_name TEXT NOT NULL,        -- 위치명
  is_active BOOLEAN DEFAULT true      -- 활성 상태
);
```

#### **소속 회사 테이블**
```sql
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,          -- 회사명
  is_active BOOLEAN DEFAULT true      -- 활성 상태
);
```

### 📱 페이지 구조

#### **1. QR 스캔 페이지**
```
URL: /qr/:code
기능: QR 코드 정보 확인 및 계근 페이지로 리다이렉트
```

#### **2. 계근 입력 페이지**
```
URL: /log/:qrCode
기능: 계근 정보 입력 (어르신 친화적 UI)
```

#### **3. 관리자 대시보드**
```
URL: /admin
기능: 계근 기록 조회, 통계, 관리
```

### 🛠️ 기술 스택

#### **프론트엔드**
```
⚛️ React 19 + Next.js 15
🎨 TailwindCSS (큰 글씨, 높은 대비)
📱 PWA (앱처럼 사용)
🔍 QR 코드 스캔 (react-qr-scanner)
```

#### **백엔드**
```
🚀 tRPC (타입세이프 API)
🗄️ Supabase (PostgreSQL + Auth)
📊 실시간 데이터 (Supabase Realtime)
```

### 📅 개발 계획

#### **Phase 1: 기본 구조 (1주)**
- [ ] 데이터베이스 스키마 설계
- [ ] 기본 페이지 구조 생성
- [ ] QR 코드 시스템 구현
- [ ] 어르신 친화적 UI 컴포넌트

#### **Phase 2: 핵심 기능 (1주)**
- [ ] 계근 입력 폼 구현
- [ ] 데이터 저장 및 조회
- [ ] QR 코드 생성 및 관리
- [ ] 반응형 디자인

#### **Phase 3: 관리 기능 (1주)**
- [ ] 관리자 대시보드
- [ ] 데이터 통계 및 차트
- [ ] 내보내기 기능
- [ ] 사용자 관리

#### **Phase 4: 최적화 (1주)**
- [ ] 성능 최적화
- [ ] 오프라인 지원
- [ ] PWA 기능
- [ ] 테스트 및 배포

### 🎯 사용자 시나리오

#### **화물차 운전자 (어르신)**
```
1. 공장 입구에서 QR 코드 스캔
2. 자동으로 계근 페이지 접속
3. 소속 선택 (드롭다운)
4. 이름 입력 (큰 글씨 키보드)
5. 전화번호 입력 (숫자 키패드)
6. 무게 입력 (숫자 키패드)
7. 제출 버튼 클릭 (큰 버튼)
8. 완료 메시지 확인
```

#### **공장 관리자**
```
1. 관리자 대시보드 접속
2. 오늘의 계근 현황 확인
3. 특정 기간 데이터 조회
4. 통계 및 차트 확인
5. 데이터 내보내기
6. QR 코드 위치 관리
```

### 🔒 보안 고려사항

#### **데이터 보호**
```
🛡️ RLS (Row Level Security) 적용
🔒 사용자별 데이터 접근 제한
📊 관리자 권한 분리
```

#### **QR 코드 보안**
```
🔐 고유한 QR 코드 생성
⏰ 시간 기반 만료
📍 위치별 접근 제한
```

---

**마지막 업데이트**: 2024년 10월 15일  
**현재 상태**: 화물차 계근 시스템 개발 계획 수립 완료
