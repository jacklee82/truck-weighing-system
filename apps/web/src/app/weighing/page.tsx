"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// 폼 유효성 검증 스키마
const formSchema = z.object({
  company: z.string().min(1, { message: "소속을 선택해주세요" }),
  driverName: z.string().min(1, { message: "이름을 입력해주세요" }),
  phoneNumber: z.string().min(10, { message: "전화번호를 입력해주세요" }),
  weight: z.string().min(1, { message: "무게를 입력해주세요" }),
  photo: z.any().optional(),
  notes: z.string().optional(),
});

function WeighingForm() {
  const [location, setLocation] = useState("알 수 없음");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setLocation(params.get("location") || "알 수 없음");
    }
  }, []);
  
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 현재 날짜와 시간 업데이트
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }));
      setCurrentTime(now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 폼 초기화
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      driverName: "",
      phoneNumber: "",
      weight: "",
      notes: "",
    },
  });

  // 사진 업로드 처리
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // tRPC API 호출
      const result = await trpc.weighing.create.mutate({
        location,
        company: values.company,
        driverName: values.driverName,
        phoneNumber: values.phoneNumber,
        weight: values.weight,
        photoUrl: photoPreview || undefined,
      });
      
      console.log("계근 데이터 저장 완료:", result);
      
      // 성공 메시지
      toast.success("계근이 완료되었습니다!", {
        description: `${values.driverName}님의 계근 정보가 저장되었습니다.`,
      });
      
      // 폼 초기화
      form.reset();
      setPhotoPreview(null);
      
    } catch (error) {
      console.error("계근 저장 실패:", error);
      toast.error("계근 저장에 실패했습니다", {
        description: "다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 회사 목록 API에서 가져오기
  const { data: companiesData = [] } = trpc.weighing.getCompanies.useQuery();
  const companies = companiesData.map(company => ({
    value: company.name,
    label: company.name,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            🚛 화물차 계근 시스템
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            정보를 입력해주세요
          </p>
        </div>

        {/* 자동 정보 카드 */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">자동 입력 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-xl">
              <span className="font-semibold">📍 위치:</span>
              <span className="text-blue-700 font-bold">{location}</span>
            </div>
            <div className="flex items-center gap-3 text-xl">
              <span className="font-semibold">📅 날짜:</span>
              <span className="text-gray-700">{currentDate}</span>
            </div>
            <div className="flex items-center gap-3 text-xl">
              <span className="font-semibold">⏰ 시간:</span>
              <span className="text-gray-700">{currentTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* 입력 폼 */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl">계근 정보 입력</CardTitle>
            <CardDescription className="text-lg">
              모든 필수 항목을 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 소속 선택 */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        소속 *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-16 text-2xl border-2">
                            <SelectValue placeholder="소속을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem 
                              key={company.value} 
                              value={company.value}
                              className="text-2xl py-4"
                            >
                              {company.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />

                {/* 이름 입력 */}
                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        이름 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="이름을 입력하세요"
                          className="h-16 text-2xl border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />

                {/* 전화번호 입력 */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        전화번호 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="010-1234-5678"
                          className="h-16 text-2xl border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />

                {/* 무게 입력 */}
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        무게 (kg) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="무게를 입력하세요"
                          className="h-16 text-2xl border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />

                {/* 사진 첨부 */}
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        사진 첨부 (선택)
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="h-16 text-xl border-2 cursor-pointer"
                            onChange={handlePhotoChange}
                          />
                          {photoPreview && (
                            <div className="relative">
                              <img
                                src={photoPreview}
                                alt="미리보기"
                                className="w-full max-h-64 object-contain rounded-lg border-2"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setPhotoPreview(null)}
                              >
                                삭제
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />

                {/* 메모 */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        메모 (선택)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="추가 메모가 있으면 입력하세요"
                          className="min-h-24 text-xl border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />

                {/* 제출 버튼 */}
                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full h-20 text-3xl font-bold bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "저장 중..." : "✓ 계근 완료"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-16 text-2xl"
                    onClick={() => {
                      form.reset();
                      setPhotoPreview(null);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 도움말 */}
        <Card className="bg-yellow-50 border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="space-y-2 text-lg text-gray-700">
              <p>💡 <strong>도움말:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>모든 필수 항목(*)을 입력해주세요</li>
                <li>사진은 선택사항입니다</li>
                <li>입력한 정보는 자동으로 저장됩니다</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function WeighingPage() {
  return <WeighingForm />;
}
