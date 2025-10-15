"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

export function UserMenu() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
			setLoading(false);
		};

		getUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			toast.success("로그아웃 되었습니다");
			window.location.href = "/";
		} catch (error: any) {
			toast.error(error.message || "로그아웃 실패");
		}
	};

	if (loading) {
		return <Button variant="ghost" disabled>로딩중...</Button>;
	}

	if (!user) {
		return (
			<Button variant="default" onClick={() => (window.location.href = "/auth/login")}>
				로그인
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{user.email}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>내 계정</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

