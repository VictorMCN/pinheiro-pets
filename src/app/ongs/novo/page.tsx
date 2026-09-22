import { redirect } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NgoForm } from "@/components/ngos/NgoForm";

import { createClient } from "@/lib/supabase/server";

const MAX_PENDING_PUBLICATIONS = 2;

export default async function NewNgoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: pendingCount } = await supabase
    .from("ngos")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("owner_id", user.id)
    .eq("status", "PENDING");

  const currentPendingCount = pendingCount ?? 0;

  const hasReachedPendingLimit =
    currentPendingCount >= MAX_PENDING_PUBLICATIONS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="font-semibold text-emerald-700">
            ONGs
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Cadastrar organização
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Informe os dados da organização ou projeto. O cadastro será
            analisado antes de aparecer publicamente.
          </p>
        </div>

        {hasReachedPendingLimit ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <p className="text-lg font-bold text-amber-900">
              Limite de solicitações pendentes atingido
            </p>

            <p className="mt-3 leading-7 text-amber-950">
              Você já possui duas organizações aguardando análise.
              Aguarde a moderação antes de enviar outro cadastro.
            </p>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <NgoForm
              initialPendingCount={currentPendingCount}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}