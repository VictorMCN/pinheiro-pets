import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16 sm:py-24">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div>
            <p className="font-semibold text-emerald-700">
              Faça parte da comunidade
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Crie sua conta
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              Com uma conta, você poderá solicitar publicações de pets perdidos,
              animais para adoção e cadastros de ONGs.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700"
              >
                Nome
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Senha
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Crie uma senha"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-slate-700"
              >
                Confirme sua senha
              </label>

              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Digite novamente sua senha"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              As publicações enviadas por usuários cadastrados passam por análise
              administrativa antes de serem exibidas publicamente.
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Criar conta
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">Já possui uma conta?</p>

            <Link
              href="/login"
              className="mt-2 inline-block font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Entrar
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}