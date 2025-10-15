import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qsqnejqjlhtwvzqxamyk.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcW5lanFqbGh0d3Z6cXhhbXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjU4MTYsImV4cCI6MjA3NjAwMTgxNn0.HVA9wnRpTJUIwEcX9UQyl9qs3Nk0kuqL8SbdXfGP_9o'
);

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

// Supabase 함수들
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
    const { data: result, error } = await supabase
      .from('vehicle_logs')
      .insert({
        location: data.location,
        company: data.company,
        driver_name: data.driverName,
        phone_number: data.phoneNumber,
        weight: data.weight,
        photo_url: data.photoUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  // 계근 기록 목록 조회
  async getVehicleLogs(limit: number, offset: number): Promise<VehicleLog[]> {
    const { data, error } = await supabase
      .from('vehicle_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data || [];
  },

  // 활성 회사 목록 조회
  async getActiveCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // 회사 추가
  async createCompany(name: string): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert({ name })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
