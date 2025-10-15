import { Pool } from 'pg';

// PostgreSQL 연결 풀
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 타입 정의 (기존 Drizzle 스키마와 동일)
export interface VehicleLog {
  id: string;
  location: string;
  company: string;
  driverName: string;
  phoneNumber: string;
  weight: string;
  photoUrl?: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

// Raw SQL 함수들
export const dbRaw = {
  // 계근 기록 생성
  async createVehicleLog(data: {
    location: string;
    company: string;
    driverName: string;
    phoneNumber: string;
    weight: string;
    photoUrl?: string;
  }): Promise<VehicleLog> {
    const result = await pool.query(`
      INSERT INTO vehicle_logs (location, company, driver_name, phone_number, weight, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [data.location, data.company, data.driverName, data.phoneNumber, data.weight, data.photoUrl]);
    
    return result.rows[0];
  },

  // 계근 기록 목록 조회
  async getVehicleLogs(limit: number, offset: number): Promise<VehicleLog[]> {
    const result = await pool.query(`
      SELECT * FROM vehicle_logs
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    return result.rows;
  },

  // 활성 회사 목록 조회
  async getActiveCompanies(): Promise<Company[]> {
    const result = await pool.query(`
      SELECT * FROM companies
      WHERE is_active = true
      ORDER BY name
    `);
    
    return result.rows;
  },

  // 회사 추가
  async createCompany(name: string): Promise<Company> {
    const result = await pool.query(`
      INSERT INTO companies (name)
      VALUES ($1)
      RETURNING *
    `, [name]);
    
    return result.rows[0];
  }
};
