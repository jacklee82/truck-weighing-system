"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const supabase = createClient();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			toast.success("로그인 성공!");
			window.location.href = "/";
		} catch (error: any) {
			toast.error(error.message || "로그인 실패");
		} finally {
			setLoading(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;

			toast.success("회원가입 성공! 이메일을 확인해주세요.");
		} catch (error: any) {
			toast.error(error.message || "회원가입 실패");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>로그인</CardTitle>
				<CardDescription>이메일과 비밀번호를 입력하세요</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleLogin} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">이메일</Label>
						<Input
							id="email"
							type="email"
							placeholder="your@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">비밀번호</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex gap-2">
						<Button type="submit" disabled={loading} className="flex-1">
							{loading ? "처리 중..." : "로그인"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={handleSignUp}
							disabled={loading}
							className="flex-1"
						>
							회원가입
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

