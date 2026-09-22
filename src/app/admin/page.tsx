import { redirect } from "next/navigation";

import { AdminLostPetCard } from "@/components/admin/AdminLostPetCard";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/server";

import type { LostPet } from "@/types/lost-pet";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "ADMIN") {
    redirect("/conta");
  }

  const { data, error } = await supabase
    .from("lost_pets")
    .select("*")
    .order("created_at", { ascending: false });

  const pets = (data ?? []) as LostPet[];

  const pendingPets = pets.filter(
    (pet) => pet.status === "PENDING",
  );

  const approvedPets = pets.filter(
    (pet) => pet.status === "APPROVED",
  );

  const rejectedPets = pets.filter(
    (pet) => pet.status === "REJECTED",
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="mb-12">
          <p className="font-semibold text-emerald-700">
            Administração
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Painel administrativo
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Gerencie as solicitações de publicação e os conteúdos disponíveis
            no Pinheiro Pets.
          </p>
        </section>

        <section className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-600">
              Publicações pendentes
            </p>

            <p className="mt-3 text-4xl font-bold text-amber-700">
              {pendingPets.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Aguardando análise administrativa
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-600">
              Publicações aprovadas
            </p>

            <p className="mt-3 text-4xl font-bold text-emerald-700">
              {approvedPets.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Disponíveis publicamente
            </p>
          </div>

          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-600">
              Publicações rejeitadas
            </p>

            <p className="mt-3 text-4xl font-bold text-red-700">
              {rejectedPets.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Não disponíveis publicamente
            </p>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700">
            Não foi possível carregar as publicações.
          </div>
        ) : (
          <>
            <section className="mb-16">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  Solicitações pendentes
                </h2>

                <p className="mt-2 text-slate-600">
                  Analise as informações dos animais antes de autorizar
                  sua publicação.
                </p>
              </div>

              {pendingPets.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                  <p className="font-semibold text-slate-700">
                    Nenhuma solicitação pendente.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {pendingPets.map((pet) => (
                    <AdminLostPetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              )}
            </section>

            <section className="mb-16">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  Publicações aprovadas
                </h2>

                <p className="mt-2 text-slate-600">
                  Gerencie os anúncios disponíveis publicamente.
                </p>
              </div>

              {approvedPets.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                  <p className="font-semibold text-slate-700">
                    Nenhuma publicação aprovada.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {approvedPets.map((pet) => (
                    <AdminLostPetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  Publicações rejeitadas
                </h2>

                <p className="mt-2 text-slate-600">
                  Consulte as solicitações rejeitadas e remova registros
                  quando necessário.
                </p>
              </div>

              {rejectedPets.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                  <p className="font-semibold text-slate-700">
                    Nenhuma publicação rejeitada.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {rejectedPets.map((pet) => (
                    <AdminLostPetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}