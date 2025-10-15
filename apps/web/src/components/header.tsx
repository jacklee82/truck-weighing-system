"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./auth/user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/admin", label: "관리자" }
  ] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} href={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<UserMenu />
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
