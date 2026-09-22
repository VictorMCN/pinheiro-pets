import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
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

          <RegisterForm />

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