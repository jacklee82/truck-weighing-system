"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [limit, setLimit] = useState(50);

  // 계근 기록 조회
  const { data: logs = [], isLoading, refetch } = trpc.weighing.list.useQuery({
    limit,
    offset: 0,
  });

  // 검색 및 날짜 필터링
  const filteredLogs = logs.filter(log => {
    // 안전한 문자열 검색 (undefined 체크)
    const driverName = log.driverName || '';
    const company = log.company || '';
    const location = log.location || '';
    
    const matchesSearch = 
      driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      new Date(log.createdAt).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            관리자 대시보드
          </h1>
          <p className="text-lg text-gray-600">
            계근 기록 관리 및 통계
          </p>
        </div>


        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>
              운전자명, 회사명, 계근대 위치로 검색하고 날짜별로 필터링할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="검색어 입력 (운전자명, 회사명, 계근대 위치)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-48"
              />
              <Button onClick={() => refetch()}>
                새로고침
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              총 {filteredLogs.length}건의 계근 기록
            </div>
          </CardContent>
        </Card>

        {/* 계근 기록 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>계근 기록</CardTitle>
            <CardDescription>
              계근 기록을 테이블 형태로 확인할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-500">로딩 중...</div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-500">계근 기록이 없습니다.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">계근 시간</th>
                      <th className="text-left p-3 font-semibold">운전자</th>
                      <th className="text-left p-3 font-semibold">회사</th>
                      <th className="text-left p-3 font-semibold">계근대</th>
                      <th className="text-left p-3 font-semibold">무게 (kg)</th>
                      <th className="text-left p-3 font-semibold">전화번호</th>
                      <th className="text-left p-3 font-semibold">사진</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          {new Date(log.createdAt).toLocaleString('ko-KR')}
                        </td>
                        <td className="p-3 font-medium">{log.driverName}</td>
                        <td className="p-3">{log.company}</td>
                        <td className="p-3">{log.location}</td>
                        <td className="p-3 text-green-600 font-semibold">
                          {parseFloat(log.weight).toLocaleString()}
                        </td>
                        <td className="p-3">{log.phoneNumber}</td>
                        <td className="p-3">
                          {log.photoUrl ? (
                            <img
                              src={log.photoUrl}
                              alt="계근 사진"
                              className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => {
                                if (log.photoUrl) window.open(log.photoUrl, '_blank');
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">없음</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}