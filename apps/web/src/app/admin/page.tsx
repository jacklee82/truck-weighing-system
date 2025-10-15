"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);

  // 계근 기록 조회
  const { data: logs = [], isLoading, refetch } = trpc.weighing.list.useQuery({
    limit,
    offset: 0,
  });

  // 검색 필터링
  const filteredLogs = logs.filter(log => 
    log.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 통계 계산
  const totalLogs = logs.length;
  const totalWeight = logs.reduce((sum, log) => sum + parseFloat(log.weight), 0);
  const companies = [...new Set(logs.map(log => log.company))];
  const locations = [...new Set(logs.map(log => log.location))];

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

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                총 계근 건수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalLogs.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                총 무게 (kg)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalWeight.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                등록 회사 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {companies.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                계근대 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {locations.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>계근 기록 검색</CardTitle>
            <CardDescription>
              운전자명, 회사명, 계근대 위치로 검색할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="검색어 입력..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => refetch()}>
                새로고침
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">
                총 {filteredLogs.length}건
              </Badge>
              {companies.map(company => (
                <Badge key={company} variant="secondary">
                  {company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 계근 기록 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>계근 기록 목록</CardTitle>
            <CardDescription>
              최근 계근 기록을 확인할 수 있습니다.
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
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="text-sm text-gray-500">운전자</div>
                        <div className="font-semibold">{log.driverName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">회사</div>
                        <div className="font-semibold">{log.company}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">계근대</div>
                        <div className="font-semibold">{log.location}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">무게</div>
                        <div className="font-semibold text-green-600">
                          {parseFloat(log.weight).toLocaleString()} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">전화번호</div>
                        <div className="font-semibold">{log.phoneNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">계근 시간</div>
                        <div className="font-semibold text-sm">
                          {new Date(log.createdAt).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                    {log.photoUrl && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-500 mb-2">첨부 사진</div>
                        <img
                          src={log.photoUrl}
                          alt="계근 사진"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
