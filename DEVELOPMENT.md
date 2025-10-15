# 🚛 화물차 계근 시스템 개발 단계별 가이드

## 📋 개발 개요

**프로젝트명**: 화물차 계근 관리 시스템  
**기반 기술**: Better T Stack (Next.js + tRPC + Supabase)  
**개발 기간**: 4주 (4단계)  
**대상 사용자**: 화물차 운전자 (어르신), 공장 관리자

---

## 🎯 Phase 1: 기본 구조 구축 (1주차)

### 📅 Day 1-2: 데이터베이스 설계 및 구축

#### **1.1 Supabase 데이터베이스 스키마 생성**

**파일**: `packages/db/src/schema/vehicle-logs.ts`
```typescript
import { pgTable, uuid, text, decimal, date, time, timestamp } from "drizzle-orm/pg-core";

export const vehicleLogs = pgTable("vehicle_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  qrCodeId: text("qr_code_id").notNull(),
  location: text("location").notNull(),
  company: text("company").notNull(),
  driverName: text("driver_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  logDate: date("log_date").notNull(),
  logTime: time("log_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**파일**: `packages/db/src/schema/qr-locations.ts`
```typescript
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const qrLocations = pgTable("qr_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  qrCode: text("qr_code").unique().notNull(),
  locationName: text("location_name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**파일**: `packages/db/src/schema/companies.ts`
```typescript
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### **1.2 스키마 인덱스 및 관계 설정**

**파일**: `packages/db/src/schema/index.ts`
```typescript
export * from "./users";
export * from "./vehicle-logs";
export * from "./qr-locations";
export * from "./companies";

// 인덱스 설정
export const vehicleLogsIndexes = {
  qrCodeId: "idx_vehicle_logs_qr_code_id",
  logDate: "idx_vehicle_logs_log_date",
  company: "idx_vehicle_logs_company",
};
```

#### **1.3 데이터베이스 마이그레이션**

```bash
# 스키마 푸시
cd packages/db
bun db:generate
bun db:push
```

### 📅 Day 3-4: 어르신 친화적 UI 컴포넌트

#### **1.4 큰 글씨 컴포넌트**

**파일**: `apps/web/src/components/ui/senior-friendly.tsx`
```typescript
import { cn } from "@/lib/utils";

// 큰 글씨 텍스트
export function LargeText({ 
  children, 
  className, 
  size = "lg" 
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "text-lg",    // 18px
    md: "text-xl",    // 20px
    lg: "text-2xl",   // 24px
    xl: "text-3xl",   // 30px
  };

  return (
    <span className={cn("font-medium text-black", sizeClasses[size], className)}>
      {children}
    </span>
  );
}

// 큰 버튼
export function LargeButton({ 
  children, 
  className, 
  size = "lg",
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: "md" | "lg" | "xl";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClasses = {
    md: "h-12 px-6 text-lg",    // 48px 높이
    lg: "h-16 px-8 text-xl",    // 64px 높이
    xl: "h-20 px-10 text-2xl",  // 80px 높이
  };

  return (
    <button
      className={cn(
        "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 큰 입력 필드
export function LargeInput({ 
  className, 
  size = "lg",
  ...props 
}: { 
  className?: string;
  size?: "md" | "lg" | "xl";
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const sizeClasses = {
    md: "h-12 px-4 text-lg",    // 48px 높이
    lg: "h-16 px-6 text-xl",    // 64px 높이
    xl: "h-20 px-8 text-2xl",   // 80px 높이
  };

  return (
    <input
      className={cn(
        "border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
```

#### **1.5 숫자 키패드 컴포넌트**

**파일**: `apps/web/src/components/ui/number-keypad.tsx`
```typescript
"use client";

import { useState } from "react";
import { LargeButton } from "./senior-friendly";

interface NumberKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export function NumberKeypad({ 
  value, 
  onChange, 
  maxLength = 10,
  placeholder = "숫자를 입력하세요"
}: NumberKeypadProps) {
  const handleNumberClick = (num: string) => {
    if (value.length < maxLength) {
      onChange(value + num);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      {/* 입력 표시 */}
      <div className="text-center">
        <div className="text-2xl font-bold text-black bg-gray-100 p-4 rounded-lg min-h-[60px] flex items-center justify-center">
          {value || placeholder}
        </div>
      </div>

      {/* 숫자 키패드 */}
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <LargeButton
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            size="lg"
            className="bg-gray-200 hover:bg-gray-300 text-black"
          >
            {num}
          </LargeButton>
        ))}
        
        <LargeButton
          onClick={handleClear}
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          지우기
        </LargeButton>
        
        <LargeButton
          onClick={() => handleNumberClick("0")}
          size="lg"
          className="bg-gray-200 hover:bg-gray-300 text-black"
        >
          0
        </LargeButton>
        
        <LargeButton
          onClick={handleBackspace}
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          ←
        </LargeButton>
      </div>
    </div>
  );
}
```

### 📅 Day 5-7: 기본 페이지 구조

#### **1.6 QR 코드 스캔 페이지**

**파일**: `apps/web/src/app/qr/[code]/page.tsx`
```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface QRPageProps {
  params: {
    code: string;
  };
}

export default async function QRPage({ params }: QRPageProps) {
  const supabase = await createClient();
  
  // QR 코드 유효성 검증
  const { data: qrLocation, error } = await supabase
    .from("qr_locations")
    .select("*")
    .eq("qr_code", params.code)
    .eq("is_active", true)
    .single();

  if (error || !qrLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            잘못된 QR 코드입니다
          </h1>
          <p className="text-xl text-gray-600">
            올바른 QR 코드를 스캔해주세요
          </p>
        </div>
      </div>
    );
  }

  // 계근 페이지로 리다이렉트
  redirect(`/log/${params.code}`);
}
```

#### **1.7 계근 입력 페이지 기본 구조**

**파일**: `apps/web/src/app/log/[qrCode]/page.tsx`
```typescript
import { createClient } from "@/lib/supabase/server";
import { VehicleLogForm } from "@/components/vehicle-log-form";

interface LogPageProps {
  params: {
    qrCode: string;
  };
}

export default async function LogPage({ params }: LogPageProps) {
  const supabase = await createClient();
  
  // QR 코드 정보 가져오기
  const { data: qrLocation } = await supabase
    .from("qr_locations")
    .select("*")
    .eq("qr_code", params.qrCode)
    .single();

  // 회사 목록 가져오기
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-black mb-8">
            화물차 계근
          </h1>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold text-black mb-2">
              계근 위치
            </h2>
            <p className="text-xl text-gray-700">
              {qrLocation?.locationName || "위치 정보 없음"}
            </p>
          </div>

          <VehicleLogForm 
            qrCode={params.qrCode}
            location={qrLocation?.locationName || ""}
            companies={companies || []}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Phase 2: 핵심 기능 구현 (2주차)

### 📅 Day 8-10: 계근 입력 폼 구현

#### **2.1 계근 입력 폼 컴포넌트**

**파일**: `apps/web/src/components/vehicle-log-form.tsx`
```typescript
"use client";

import { useState } from "react";
import { LargeText, LargeButton, LargeInput, NumberKeypad } from "@/components/ui/senior-friendly";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
}

interface VehicleLogFormProps {
  qrCode: string;
  location: string;
  companies: Company[];
}

export function VehicleLogForm({ qrCode, location, companies }: VehicleLogFormProps) {
  const [formData, setFormData] = useState({
    company: "",
    driverName: "",
    phoneNumber: "",
    weight: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNumberKeypad, setShowNumberKeypad] = useState<"phone" | "weight" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date();
      const logData = {
        qrCodeId: qrCode,
        location,
        company: formData.company,
        driverName: formData.driverName,
        phoneNumber: formData.phoneNumber,
        weight: parseFloat(formData.weight),
        logDate: now.toISOString().split('T')[0],
        logTime: now.toTimeString().split(' ')[0],
      };

      // API 호출 (tRPC)
      // const result = await api.vehicleLogs.create.mutate(logData);
      
      toast.success("계근이 완료되었습니다!");
      
      // 폼 초기화
      setFormData({
        company: "",
        driverName: "",
        phoneNumber: "",
        weight: "",
      });
    } catch (error) {
      toast.error("계근 처리 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 소속 선택 */}
      <div>
        <LargeText size="xl" className="block mb-3">
          소속 *
        </LargeText>
        <select
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full h-16 px-4 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        >
          <option value="">소속을 선택하세요</option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* 이름 입력 */}
      <div>
        <LargeText size="xl" className="block mb-3">
          이름 *
        </LargeText>
        <LargeInput
          type="text"
          value={formData.driverName}
          onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
          placeholder="이름을 입력하세요"
          size="lg"
          required
        />
      </div>

      {/* 전화번호 입력 */}
      <div>
        <LargeText size="xl" className="block mb-3">
          전화번호 *
        </LargeText>
        <LargeInput
          type="text"
          value={formData.phoneNumber}
          onClick={() => setShowNumberKeypad("phone")}
          placeholder="전화번호를 입력하세요"
          size="lg"
          readOnly
          required
        />
      </div>

      {/* 무게 입력 */}
      <div>
        <LargeText size="xl" className="block mb-3">
          무게 (kg) *
        </LargeText>
        <LargeInput
          type="text"
          value={formData.weight}
          onClick={() => setShowNumberKeypad("weight")}
          placeholder="무게를 입력하세요"
          size="lg"
          readOnly
          required
        />
      </div>

      {/* 제출 버튼 */}
      <div className="pt-6">
        <LargeButton
          type="submit"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "처리 중..." : "계근 완료"}
        </LargeButton>
      </div>

      {/* 숫자 키패드 모달 */}
      {showNumberKeypad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-center mb-6">
              {showNumberKeypad === "phone" ? "전화번호 입력" : "무게 입력"}
            </h3>
            
            <NumberKeypad
              value={showNumberKeypad === "phone" ? formData.phoneNumber : formData.weight}
              onChange={(value) => {
                if (showNumberKeypad === "phone") {
                  setFormData({ ...formData, phoneNumber: value });
                } else {
                  setFormData({ ...formData, weight: value });
                }
              }}
              maxLength={showNumberKeypad === "phone" ? 11 : 6}
              placeholder={showNumberKeypad === "phone" ? "전화번호" : "무게"}
            />
            
            <div className="mt-6 flex gap-4">
              <LargeButton
                onClick={() => setShowNumberKeypad(null)}
                size="lg"
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                취소
              </LargeButton>
              <LargeButton
                onClick={() => setShowNumberKeypad(null)}
                size="lg"
                className="flex-1"
              >
                확인
              </LargeButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
```

### 📅 Day 11-14: tRPC API 구현

#### **2.2 tRPC 라우터 구현**

**파일**: `packages/api/src/routers/vehicle-logs.ts`
```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@my-better-t-app/db";
import { vehicleLogs, qrLocations, companies } from "@my-better-t-app/db/schema";
import { eq, desc } from "drizzle-orm";

export const vehicleLogsRouter = createTRPCRouter({
  // 계근 기록 생성
  create: publicProcedure
    .input(
      z.object({
        qrCodeId: z.string(),
        location: z.string(),
        company: z.string(),
        driverName: z.string(),
        phoneNumber: z.string(),
        weight: z.number(),
        logDate: z.string(),
        logTime: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [log] = await db
        .insert(vehicleLogs)
        .values(input)
        .returning();
      
      return log;
    }),

  // 계근 기록 조회
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const logs = await db
        .select()
        .from(vehicleLogs)
        .orderBy(desc(vehicleLogs.createdAt))
        .limit(input.limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (logs.length > input.limit) {
        const nextItem = logs.pop();
        nextCursor = nextItem?.id;
      }

      return {
        logs,
        nextCursor,
      };
    }),

  // QR 코드 정보 조회
  getQRInfo: publicProcedure
    .input(z.object({ qrCode: z.string() }))
    .query(async ({ input }) => {
      const qrInfo = await db
        .select()
        .from(qrLocations)
        .where(eq(qrLocations.qrCode, input.qrCode))
        .limit(1);

      return qrInfo[0] || null;
    }),

  // 회사 목록 조회
  getCompanies: publicProcedure.query(async () => {
    const companyList = await db
      .select()
      .from(companies)
      .where(eq(companies.isActive, true))
      .orderBy(companies.name);

    return companyList;
  }),
});
```

#### **2.3 메인 라우터에 추가**

**파일**: `packages/api/src/routers/index.ts`
```typescript
import { createTRPCRouter } from "../trpc";
import { vehicleLogsRouter } from "./vehicle-logs";

export const appRouter = createTRPCRouter({
  vehicleLogs: vehicleLogsRouter,
});

export type AppRouter = typeof appRouter;
```

---

## 🎯 Phase 3: 관리 기능 구현 (3주차)

### 📅 Day 15-17: 관리자 대시보드

#### **3.1 관리자 대시보드 페이지**

**파일**: `apps/web/src/app/admin/page.tsx`
```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // TODO: 관리자 권한 확인 로직 추가

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          관리자 대시보드
        </h1>
        
        <AdminDashboard />
      </div>
    </div>
  );
}
```

#### **3.2 관리자 대시보드 컴포넌트**

**파일**: `apps/web/src/components/admin-dashboard.tsx`
```typescript
"use client";

import { useState } from "react";
import { LargeText, LargeButton } from "@/components/ui/senior-friendly";
import { api } from "@/utils/trpc";

export function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: logs, isLoading } = api.vehicleLogs.getAll.useQuery({
    limit: 100,
  });

  const todayLogs = logs?.logs.filter(log => 
    log.logDate === selectedDate
  ) || [];

  const totalWeight = todayLogs.reduce((sum, log) => sum + Number(log.weight), 0);
  const uniqueCompanies = new Set(todayLogs.map(log => log.company)).size;

  return (
    <div className="space-y-8">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <LargeText size="lg" className="text-gray-600">
            오늘 계근 건수
          </LargeText>
          <LargeText size="xl" className="text-blue-600 font-bold">
            {todayLogs.length}건
          </LargeText>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <LargeText size="lg" className="text-gray-600">
            총 무게
          </LargeText>
          <LargeText size="xl" className="text-green-600 font-bold">
            {totalWeight.toLocaleString()}kg
          </LargeText>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <LargeText size="lg" className="text-gray-600">
            참여 회사
          </LargeText>
          <LargeText size="xl" className="text-purple-600 font-bold">
            {uniqueCompanies}개사
          </LargeText>
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <LargeText size="lg" className="mb-4">
          조회 날짜
        </LargeText>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-12 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 계근 기록 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <LargeText size="lg">
            계근 기록 ({todayLogs.length}건)
          </LargeText>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-semibold">시간</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">소속</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">이름</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">전화번호</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">무게</th>
                <th className="px-6 py-4 text-left text-lg font-semibold">위치</th>
              </tr>
            </thead>
            <tbody>
              {todayLogs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="px-6 py-4 text-lg">{log.logTime}</td>
                  <td className="px-6 py-4 text-lg">{log.company}</td>
                  <td className="px-6 py-4 text-lg">{log.driverName}</td>
                  <td className="px-6 py-4 text-lg">{log.phoneNumber}</td>
                  <td className="px-6 py-4 text-lg">{log.weight}kg</td>
                  <td className="px-6 py-4 text-lg">{log.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 내보내기 버튼 */}
      <div className="text-center">
        <LargeButton
          size="lg"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            // CSV 내보내기 로직
            const csvContent = generateCSV(todayLogs);
            downloadCSV(csvContent, `vehicle-logs-${selectedDate}.csv`);
          }}
        >
          데이터 내보내기 (CSV)
        </LargeButton>
      </div>
    </div>
  );
}

function generateCSV(logs: any[]) {
  const headers = ["시간", "소속", "이름", "전화번호", "무게", "위치"];
  const rows = logs.map(log => [
    log.logTime,
    log.company,
    log.driverName,
    log.phoneNumber,
    log.weight,
    log.location
  ]);
  
  return [headers, ...rows].map(row => row.join(",")).join("\n");
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## 🎯 Phase 4: 최적화 및 배포 (4주차)

### 📅 Day 22-24: PWA 및 오프라인 지원

#### **4.1 PWA 설정**

**파일**: `apps/web/public/manifest.json`
```json
{
  "name": "화물차 계근 시스템",
  "short_name": "계근시스템",
  "description": "공장 화물차 계근 관리 시스템",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007BFF",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### **4.2 오프라인 지원**

**파일**: `apps/web/src/lib/offline-storage.ts`
```typescript
// 오프라인 데이터 저장
export class OfflineStorage {
  private static instance: OfflineStorage;
  private dbName = 'vehicle-logs-offline';
  private version = 1;

  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  async saveLog(logData: any) {
    if ('indexedDB' in window) {
      // IndexedDB에 저장
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['logs'], 'readwrite');
        const store = transaction.objectStore('logs');
        store.add({ ...logData, id: Date.now().toString() });
      };
    } else {
      // localStorage에 저장
      const logs = JSON.parse(localStorage.getItem('offline-logs') || '[]');
      logs.push({ ...logData, id: Date.now().toString() });
      localStorage.setItem('offline-logs', JSON.stringify(logs));
    }
  }

  async getOfflineLogs() {
    if ('indexedDB' in window) {
      // IndexedDB에서 읽기
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['logs'], 'readonly');
          const store = transaction.objectStore('logs');
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
          };
        };
      });
    } else {
      // localStorage에서 읽기
      return JSON.parse(localStorage.getItem('offline-logs') || '[]');
    }
  }

  async syncOfflineLogs() {
    const offlineLogs = await this.getOfflineLogs();
    
    for (const log of offlineLogs) {
      try {
        // 서버에 동기화
        // await api.vehicleLogs.create.mutate(log);
        
        // 성공하면 오프라인 저장소에서 삭제
        await this.removeOfflineLog(log.id);
      } catch (error) {
        console.error('동기화 실패:', error);
      }
    }
  }

  private async removeOfflineLog(id: string) {
    // 오프라인 저장소에서 로그 삭제
    if ('indexedDB' in window) {
      const request = indexedDB.open(this.dbName, this.version);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['logs'], 'readwrite');
        const store = transaction.objectStore('logs');
        store.delete(id);
      };
    } else {
      const logs = JSON.parse(localStorage.getItem('offline-logs') || '[]');
      const filteredLogs = logs.filter((log: any) => log.id !== id);
      localStorage.setItem('offline-logs', JSON.stringify(filteredLogs));
    }
  }
}
```

### 📅 Day 25-28: 테스트 및 배포

#### **4.3 테스트 코드 작성**

**파일**: `apps/web/src/__tests__/vehicle-log-form.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VehicleLogForm } from '@/components/vehicle-log-form';

const mockCompanies = [
  { id: '1', name: '테스트 회사 1' },
  { id: '2', name: '테스트 회사 2' },
];

describe('VehicleLogForm', () => {
  it('폼이 올바르게 렌더링된다', () => {
    render(
      <VehicleLogForm
        qrCode="test-qr"
        location="테스트 위치"
        companies={mockCompanies}
      />
    );

    expect(screen.getByText('소속 *')).toBeInTheDocument();
    expect(screen.getByText('이름 *')).toBeInTheDocument();
    expect(screen.getByText('전화번호 *')).toBeInTheDocument();
    expect(screen.getByText('무게 (kg) *')).toBeInTheDocument();
  });

  it('필수 필드를 모두 입력해야 제출할 수 있다', async () => {
    render(
      <VehicleLogForm
        qrCode="test-qr"
        location="테스트 위치"
        companies={mockCompanies}
      />
    );

    const submitButton = screen.getByText('계근 완료');
    expect(submitButton).toBeDisabled();
  });

  it('모든 필드를 입력하면 제출 버튼이 활성화된다', async () => {
    render(
      <VehicleLogForm
        qrCode="test-qr"
        location="테스트 위치"
        companies={mockCompanies}
      />
    );

    // 소속 선택
    const companySelect = screen.getByDisplayValue('소속을 선택하세요');
    fireEvent.change(companySelect, { target: { value: '테스트 회사 1' } });

    // 이름 입력
    const nameInput = screen.getByPlaceholderText('이름을 입력하세요');
    fireEvent.change(nameInput, { target: { value: '홍길동' } });

    // 전화번호 입력
    const phoneInput = screen.getByPlaceholderText('전화번호를 입력하세요');
    fireEvent.click(phoneInput);
    
    // 숫자 키패드에서 번호 입력
    const numberButton = screen.getByText('0');
    fireEvent.click(numberButton);

    // 무게 입력
    const weightInput = screen.getByPlaceholderText('무게를 입력하세요');
    fireEvent.click(weightInput);
    
    const weightButton = screen.getByText('1');
    fireEvent.click(weightButton);

    const submitButton = screen.getByText('계근 완료');
    expect(submitButton).not.toBeDisabled();
  });
});
```

#### **4.4 배포 설정**

**파일**: `apps/web/next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // 성능 최적화
  experimental: {
    optimizeCss: true,
  },
  
  // 이미지 최적화
  images: {
    domains: ['qsqnejqjlhtwvzqxamyk.supabase.co'],
  },
};

export default nextConfig;
```

---

## 📋 개발 체크리스트

### ✅ Phase 1: 기본 구조 (1주차)
- [ ] 데이터베이스 스키마 생성
- [ ] 어르신 친화적 UI 컴포넌트
- [ ] 숫자 키패드 컴포넌트
- [ ] QR 코드 스캔 페이지
- [ ] 계근 입력 페이지 기본 구조

### ✅ Phase 2: 핵심 기능 (2주차)
- [ ] 계근 입력 폼 구현
- [ ] tRPC API 라우터
- [ ] 데이터 저장 및 조회
- [ ] 폼 유효성 검증
- [ ] 에러 처리

### ✅ Phase 3: 관리 기능 (3주차)
- [ ] 관리자 대시보드
- [ ] 통계 및 차트
- [ ] 데이터 내보내기
- [ ] QR 코드 관리
- [ ] 회사 관리

### ✅ Phase 4: 최적화 (4주차)
- [ ] PWA 설정
- [ ] 오프라인 지원
- [ ] 성능 최적화
- [ ] 테스트 코드
- [ ] 배포 및 모니터링

---

## 🚀 배포 및 운영

### **배포 환경**
- **프론트엔드**: Vercel
- **백엔드**: Supabase
- **도메인**: 사용자 지정 도메인

### **모니터링**
- **에러 추적**: Sentry
- **성능 모니터링**: Vercel Analytics
- **사용자 분석**: Google Analytics

### **유지보수**
- **정기 백업**: Supabase 자동 백업
- **보안 업데이트**: 정기적 의존성 업데이트
- **사용자 피드백**: 지속적 개선

---

**개발 완료 예상일**: 4주 후  
**배포 예상일**: 5주차  
**운영 시작**: 6주차
