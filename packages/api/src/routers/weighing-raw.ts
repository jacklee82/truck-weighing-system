import { z } from "zod";
import { publicProcedure, router } from "..";
import { dbRaw } from "../lib/db-raw";

export const weighingRouter = router({
  // 데이터베이스 연결 테스트
  testConnection: publicProcedure.query(async () => {
    try {
      const { dbRaw } = await import("../lib/db-raw");
      // 간단한 쿼리로 연결 테스트
      const result = await dbRaw.getActiveCompanies();
      return { 
        success: true, 
        message: "Database connection successful",
        companiesCount: result.length 
      };
    } catch (error) {
      console.error('Database connection test failed:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        error: String(error)
      };
    }
  }),

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
      const result = await dbRaw.createVehicleLog({
        location: input.location,
        company: input.company,
        driverName: input.driverName,
        phoneNumber: input.phoneNumber,
        weight: input.weight.toString(),
        photoUrl: input.photoUrl,
      });
      
      return result;
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
      const logs = await dbRaw.getVehicleLogs(input.limit, input.offset);
      return logs;
    }),

  // 회사 목록 조회
  getCompanies: publicProcedure.query(async () => {
    const companyList = await dbRaw.getActiveCompanies();
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
      const result = await dbRaw.createCompany(input.name);
      return result;
    }),
});
