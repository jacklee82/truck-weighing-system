import { pgTable, uuid, text, decimal, timestamp, boolean } from "drizzle-orm/pg-core";

// 계근 기록 테이블
export const vehicleLogs = pgTable("vehicle_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  location: text("location").notNull(),
  company: text("company").notNull(),
  driverName: text("driver_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  photoUrl: text("photo_url"), // 사진 URL (선택사항)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 회사 목록 테이블
export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
