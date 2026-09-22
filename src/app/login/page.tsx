import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16 sm:py-24">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div>
            <p className="font-semibold text-emerald-700">Área do usuário</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Entre na sua conta
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              Acesse sua conta para acompanhar e gerenciar suas publicações no
              Pinheiro Pets.
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Ainda não possui uma conta?
            </p>

            <Link
              href="/cadastro"
              className="mt-2 inline-block font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Criar conta
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}