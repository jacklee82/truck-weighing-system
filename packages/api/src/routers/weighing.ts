import { z } from "zod";
import { publicProcedure, router } from "..";
import { db, vehicleLogs, companies } from "@my-better-t-app/db";
import { desc, eq } from "drizzle-orm";

export const weighingRouter = router({
  // 계근 기록 생성
  create: publicProcedure
    .input(
      z.object({
        location: z.string(),
        company: z.string(),
        driverName: z.string(),
        phoneNumber: z.string(),
        weight: z.number(),
        photoUrl: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(vehicleLogs).values({
        location: input.location,
        company: input.company,
        driverName: input.driverName,
        phoneNumber: input.phoneNumber,
        weight: input.weight.toString(),
        photoUrl: input.photoUrl,
      }).returning();
      
      return result[0];
    }),

  // 계근 기록 목록 조회
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const logs = await db
        .select()
        .from(vehicleLogs)
        .orderBy(desc(vehicleLogs.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return logs;
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

  // 회사 추가
  addCompany: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(companies).values({
        name: input.name,
      }).returning();
      
      return result[0];
    }),
});
