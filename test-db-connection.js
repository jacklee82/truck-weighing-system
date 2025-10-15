import { Pool } from "pg";
import dotenv from "dotenv";

// 환경변수 로드
dotenv.config({ path: "./apps/web/.env.local" });

console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    console.log("🔄 데이터베이스 연결 시도 중...");
    
    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as current_time");
    console.log("✅ 데이터베이스 연결 성공:", result.rows[0]);
    
    // 테이블 존재 확인
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("📋 생성된 테이블들:", tables.rows.map(row => row.table_name));
    
    client.release();
    
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error.message);
    console.error("상세 오류:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
