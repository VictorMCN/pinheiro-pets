import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : "Usuário";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="font-semibold text-emerald-700">Minha conta</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Olá, {name}.
          </h1>

          <p className="mt-4 text-slate-600">
            Você está autenticado no Pinheiro Pets.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">
              E-mail cadastrado
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {user.email}
            </p>
          </div>

          <div className="mt-8">
            <LogoutButton />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}