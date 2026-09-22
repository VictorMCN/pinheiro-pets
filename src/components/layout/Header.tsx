import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-emerald-700"
        >
          Pinheiro Pets
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Início
          </Link>

          <Link
            href="/perdidos"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Pets perdidos
          </Link>

          <Link
            href="/adocao"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Adoção
          </Link>

          <Link
            href="/ongs"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            ONGs
          </Link>
        </nav>

        <Link
          href="/login"
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}