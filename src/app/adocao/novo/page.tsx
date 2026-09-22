import { redirect } from "next/navigation";

import { AdoptionPetForm } from "@/components/adoption/AdoptionPetForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

const MAX_PENDING_PUBLICATIONS = 2;

export default async function NewAdoptionPetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: pendingCount } = await supabase
    .from("adoption_pets")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("author_id", user.id)
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
            Adoção
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Publicar animal para adoção
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Informe os dados do animal. A publicação ficará aguardando
            análise antes de aparecer publicamente.
          </p>
        </div>

        {hasReachedPendingLimit ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <p className="text-lg font-bold text-amber-900">
              Limite de solicitações pendentes atingido
            </p>

            <p className="mt-3 leading-7 text-amber-950">
              Você já possui duas publicações de adoção aguardando
              análise. Aguarde a moderação de uma delas antes de enviar
              uma nova solicitação.
            </p>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <AdoptionPetForm
              initialPendingCount={currentPendingCount}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}