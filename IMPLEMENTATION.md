# 🚛 화물차 계근 시스템 - 구현 완료 문서

## 📋 프로젝트 개요

**목적**: 공장 내 화물차 계근 자동화 및 관리  
**대상 사용자**: 화물차 운전자 (주로 어르신), 공장 관리자  
**접근 방식**: QR 코드 URL을 통한 간편한 모바일 접근

---

## ✅ 완료된 기능

### **1. 데이터베이스 스키마**

#### **계근 기록 테이블 (`vehicle_logs`)**
```typescript
{
  id: uuid (PK)
  location: text          // QR 파라미터에서 가져옴
  company: text           // 사용자 입력
  driver_name: text       // 사용자 입력
  phone_number: text      // 사용자 입력
  weight: decimal         // 사용자 입력
  photo_url: text         // 사진 URL (선택)
  created_at: timestamp   // 자동 생성
}
```

#### **회사 목록 테이블 (`companies`)**
```typescript
{
  id: uuid (PK)
  name: text (UNIQUE)
  is_active: boolean
  created_at: timestamp
}
```

---

### **2. UI 컴포넌트 (shadcn/ui)**

설치된 컴포넌트:
- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Card
- ✅ Select (드롭다운)
- ✅ Form (폼 관리)
- ✅ Textarea (메모 입력)
- ✅ Sonner (토스트 알림)

---

### **3. 페이지 구조**

#### **홈페이지 (`/`)**
- 시스템 소개
- 테스트 페이지 링크
- QR 코드 생성 방법 안내

#### **계근 입력 페이지 (`/weighing?location=위치명`)**
- 자동 표시: 위치, 날짜, 시간
- 사용자 입력:
  - 소속 (드롭다운)
  - 이름
  - 전화번호
  - 무게
  - 사진 첨부 (선택)
  - 메모 (선택)
- 실시간 날짜/시간 업데이트
- 사진 미리보기
- 폼 유효성 검증

---

### **4. tRPC API 엔드포인트**

#### **계근 관련 (`weighing`)**
```typescript
// 계근 기록 생성
weighing.create({
  location, company, driverName, 
  phoneNumber, weight, photoUrl
})

// 계근 기록 목록 조회
weighing.list({ limit, offset })

// 회사 목록 조회
weighing.getCompanies()

// 회사 추가
weighing.addCompany({ name })
```

---

## 🎨 UI/UX 특징

### **어르신 친화적 디자인**
- 📏 큰 글씨 (24px ~ 32px)
- 🔘 큰 버튼 (높이 60px ~ 80px)
- 📝 큰 입력 필드 (높이 60px)
- 🎨 높은 대비 (검정/흰색 기반)
- 📱 반응형 디자인 (모바일 최적화)
- ⚡ 간단한 레이아웃

### **색상 팔레트**
- 배경: Gradient (Blue 50 → White)
- 주요 버튼: Blue 600
- 성공 버튼: Green 600
- 경고: Yellow 50
- 텍스트: Gray 900

---

## 🔗 QR 코드 URL 구조

### **기본 형식**
```
https://your-domain.vercel.app/weighing?location=위치명
```

### **예시**
```
https://your-domain.vercel.app/weighing?location=1번계근대
https://your-domain.vercel.app/weighing?location=2번계근대
https://your-domain.vercel.app/weighing?location=북문계근대
```

### **QR 코드 생성 방법**
1. 위 URL을 QR 코드 생성기에 입력
2. QR 코드 이미지 다운로드
3. 계근대에 부착

**추천 QR 코드 생성기**:
- https://www.qr-code-generator.com/
- https://www.the-qrcode-generator.com/
- https://goqr.me/

---

## 📱 사용자 시나리오

### **화물차 운전자 (어르신)**
```
1. 공장 입구 계근대의 QR 코드 스캔
2. 자동으로 계근 페이지 접속
3. 위치, 날짜, 시간 자동 표시 확인
4. 소속 선택 (드롭다운)
5. 이름 입력
6. 전화번호 입력
7. 무게 입력
8. (선택) 사진 첨부
9. (선택) 메모 입력
10. "계근 완료" 버튼 클릭
11. 완료 메시지 확인
```

---

## 🚀 로컬 개발 환경 실행

### **1. 서버 실행**
```bash
cd my-better-t-app
bun dev
```

### **2. 접속**
- 홈페이지: http://localhost:3001
- 계근 페이지: http://localhost:3001/weighing?location=1번계근대

### **3. 테스트**
1. 홈페이지에서 "테스트 페이지 열기" 클릭
2. 계근 정보 입력
3. 콘솔에서 데이터 확인

---

## 📦 배포 (Vercel)

### **1. 환경 변수 설정**
Vercel 대시보드에서 다음 환경 변수 설정:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **2. Root Directory 설정**
Vercel 프로젝트 설정에서:
- Root Directory: `apps/web`

### **3. 배포**
```bash
cd apps/web
vercel --prod
```

---

## 🔄 다음 단계 (Phase 2)

### **데이터베이스 연결**
- [ ] Supabase 데이터베이스 연결 확인
- [ ] 스키마 마이그레이션 실행
- [ ] 초기 회사 데이터 입력

### **실제 데이터 저장**
- [ ] tRPC API 호출 활성화
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 에러 핸들링 강화

### **관리자 대시보드**
- [ ] 계근 기록 조회 페이지
- [ ] 날짜별/회사별 필터링
- [ ] 통계 차트
- [ ] 데이터 내보내기 (CSV/Excel)
- [ ] 회사 관리 페이지

### **PWA 기능**
- [ ] 오프라인 지원
- [ ] 홈 화면 추가
- [ ] 푸시 알림

---

## 📝 파일 구조

```
my-better-t-app/
├── apps/
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── page.tsx              # 홈페이지
│           │   └── weighing/
│           │       └── page.tsx          # 계근 입력 페이지
│           └── components/
│               └── ui/                   # shadcn/ui 컴포넌트
│
└── packages/
    ├── api/
    │   └── src/
    │       └── routers/
    │           ├── index.ts              # 메인 라우터
    │           └── weighing.ts           # 계근 API
    │
    └── db/
        └── src/
            └── schema/
                ├── index.ts
                ├── users.ts
                └── vehicle-logs.ts       # 계근 스키마
```

---

## 🎯 핵심 기술 스택

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **UI Library**: shadcn/ui
- **Backend**: tRPC
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle
- **Form**: React Hook Form + Zod
- **Deployment**: Vercel

---

## 📞 문의 및 지원

문제가 발생하거나 추가 기능이 필요한 경우:
1. 개발 문서 확인 (`DEVELOPMENT.md`)
2. 프로젝트 범위 문서 확인 (`SCOPE.md`)
3. 콘솔 로그 확인

---

**마지막 업데이트**: 2024년 10월 15일  
**버전**: 1.0.0  
**상태**: ✅ Phase 1 완료

