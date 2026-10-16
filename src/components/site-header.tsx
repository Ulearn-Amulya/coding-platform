"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Problems" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-800 text-sm font-semibold tracking-wide text-white">
            CP
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            CodePractice
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "font-semibold text-teal-800"
                    : "font-medium text-stone-600 hover:text-stone-900"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
