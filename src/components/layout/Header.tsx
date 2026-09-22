import Link from "next/link";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

const navigationItems = [
  {
    href: "/",
    label: "Início",
  },
  {
    href: "/perdidos",
    label: "Pets perdidos",
  },
  {
    href: "/adocao",
    label: "Adoção",
  },
  {
    href: "/ongs",
    label: "ONGs",
  },
];

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    typeof user?.user_metadata?.name === "string"
      ? user.user_metadata.name
      : "Usuário";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <Image
            src="/branding/pinheiro-pets-logo.png"
            alt="Logo do Pinheiro Pets"
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
            priority
          />

          <div className="hidden sm:block">
            <p className="text-xl font-bold text-emerald-700">
              Pinheiro Pets
            </p>

            <p className="text-sm text-slate-500">
              Projeto educacional de extensão
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-slate-700 transition hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {user ? (
            <Link
              href="/conta"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white transition hover:bg-emerald-800"
              aria-label="Acessar minha conta"
              title={userName}
            >
              {userInitial}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}