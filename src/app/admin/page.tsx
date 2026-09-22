import { redirect } from "next/navigation";

import { AdminAdoptionPetCard } from "@/components/admin/AdminAdoptionPetCard";
import { AdminLostPetCard } from "@/components/admin/AdminLostPetCard";
import { AdminNgoCard } from "@/components/admin/AdminNgoCard";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { AdoptionPet } from "@/types/adoption-pet";
import type { LostPet } from "@/types/lost-pet";
import type { Ngo } from "@/types/ngo";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    profile?.role !== "ADMIN"
  ) {
    redirect("/conta");
  }

  const {
    data: lostPetData,
    error: lostPetError,
  } = await supabase
    .from("lost_pets")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const {
    data: adoptionPetData,
    error: adoptionPetError,
  } = await supabase
    .from("adoption_pets")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const {
    data: ngoData,
    error: ngoError,
  } = await supabase
    .from("ngos")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const lostPets =
    (lostPetData ?? []) as LostPet[];

  const adoptionPets =
    (adoptionPetData ?? []) as AdoptionPet[];

  const ngos =
    (ngoData ?? []) as Ngo[];

  const pendingLostPets =
    lostPets.filter(
      (pet) => pet.status === "PENDING",
    );

  const approvedLostPets =
    lostPets.filter(
      (pet) => pet.status === "APPROVED",
    );

  const rejectedLostPets =
    lostPets.filter(
      (pet) => pet.status === "REJECTED",
    );

  const pendingAdoptionPets =
    adoptionPets.filter(
      (pet) => pet.status === "PENDING",
    );

  const approvedAdoptionPets =
    adoptionPets.filter(
      (pet) => pet.status === "APPROVED",
    );

  const rejectedAdoptionPets =
    adoptionPets.filter(
      (pet) => pet.status === "REJECTED",
    );

  const pendingNgos =
    ngos.filter(
      (ngo) => ngo.status === "PENDING",
    );

  const approvedNgos =
    ngos.filter(
      (ngo) => ngo.status === "APPROVED",
    );

  const rejectedNgos =
    ngos.filter(
      (ngo) => ngo.status === "REJECTED",
    );

  const hasError =
    Boolean(lostPetError) ||
    Boolean(adoptionPetError) ||
    Boolean(ngoError);

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
            Gerencie as solicitações e publicações do
            Pinheiro Pets.
          </p>
        </section>

        {hasError ? (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700">
            Não foi possível carregar todas as publicações.
          </div>
        ) : (
          <>
            {/* Pets perdidos */}

            <section className="mb-20">
              <div className="mb-8">
                <p className="font-semibold text-emerald-700">
                  Pets perdidos
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Moderação de animais desaparecidos
                </h2>
              </div>

              <div className="mb-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Pendentes
                  </p>

                  <p className="mt-3 text-4xl font-bold text-amber-700">
                    {pendingLostPets.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Aprovadas
                  </p>

                  <p className="mt-3 text-4xl font-bold text-emerald-700">
                    {approvedLostPets.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Rejeitadas
                  </p>

                  <p className="mt-3 text-4xl font-bold text-red-700">
                    {rejectedLostPets.length}
                  </p>
                </div>
              </div>

              <section className="mb-12">
                <h3 className="text-2xl font-bold">
                  Solicitações pendentes
                </h3>

                <div className="mt-6 space-y-5">
                  {pendingLostPets.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma solicitação pendente.
                    </div>
                  ) : (
                    pendingLostPets.map((pet) => (
                      <AdminLostPetCard
                        key={pet.id}
                        pet={pet}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-bold">
                  Publicações aprovadas
                </h3>

                <div className="mt-6 space-y-5">
                  {approvedLostPets.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma publicação aprovada.
                    </div>
                  ) : (
                    approvedLostPets.map((pet) => (
                      <AdminLostPetCard
                        key={pet.id}
                        pet={pet}
                      />
                    ))
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold">
                  Publicações rejeitadas
                </h3>

                <div className="mt-6 space-y-5">
                  {rejectedLostPets.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma publicação rejeitada.
                    </div>
                  ) : (
                    rejectedLostPets.map((pet) => (
                      <AdminLostPetCard
                        key={pet.id}
                        pet={pet}
                      />
                    ))
                  )}
                </div>
              </section>
            </section>

            {/* Adoção */}

            <section className="mb-20">
              <div className="mb-8 border-t border-slate-200 pt-16">
                <p className="font-semibold text-emerald-700">
                  Adoção
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Moderação de animais para adoção
                </h2>
              </div>

              <div className="mb-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Pendentes
                  </p>

                  <p className="mt-3 text-4xl font-bold text-amber-700">
                    {pendingAdoptionPets.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Aprovadas
                  </p>

                  <p className="mt-3 text-4xl font-bold text-emerald-700">
                    {approvedAdoptionPets.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Rejeitadas
                  </p>

                  <p className="mt-3 text-4xl font-bold text-red-700">
                    {rejectedAdoptionPets.length}
                  </p>
                </div>
              </div>

              <section className="mb-12">
                <h3 className="text-2xl font-bold">
                  Solicitações pendentes
                </h3>

                <div className="mt-6 space-y-5">
                  {pendingAdoptionPets.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma solicitação de adoção pendente.
                    </div>
                  ) : (
                    pendingAdoptionPets.map((pet) => (
                      <AdminAdoptionPetCard
                        key={pet.id}
                        pet={pet}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-bold">
                  Publicações aprovadas
                </h3>

                <div className="mt-6 space-y-5">
                  {approvedAdoptionPets.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma publicação de adoção aprovada.
                    </div>
                  ) : (
                    approvedAdoptionPets.map((pet) => (
                      <AdminAdoptionPetCard
                        key={pet.id}
                        pet={pet}
                      />
                    ))
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold">
                  Publicações rejeitadas
                </h3>

                <div className="mt-6 space-y-5">
                  {rejectedAdoptionPets.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma publicação de adoção rejeitada.
                    </div>
                  ) : (
                    rejectedAdoptionPets.map((pet) => (
                      <AdminAdoptionPetCard
                        key={pet.id}
                        pet={pet}
                      />
                    ))
                  )}
                </div>
              </section>
            </section>

            {/* ONGs */}

            <section>
              <div className="mb-8 border-t border-slate-200 pt-16">
                <p className="font-semibold text-emerald-700">
                  ONGs e projetos
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Moderação de organizações
                </h2>
              </div>

              <div className="mb-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Pendentes
                  </p>

                  <p className="mt-3 text-4xl font-bold text-amber-700">
                    {pendingNgos.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Aprovadas
                  </p>

                  <p className="mt-3 text-4xl font-bold text-emerald-700">
                    {approvedNgos.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-600">
                    Rejeitadas
                  </p>

                  <p className="mt-3 text-4xl font-bold text-red-700">
                    {rejectedNgos.length}
                  </p>
                </div>
              </div>

              <section className="mb-12">
                <h3 className="text-2xl font-bold">
                  Solicitações pendentes
                </h3>

                <div className="mt-6 space-y-5">
                  {pendingNgos.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma organização aguardando análise.
                    </div>
                  ) : (
                    pendingNgos.map((ngo) => (
                      <AdminNgoCard
                        key={ngo.id}
                        ngo={ngo}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-bold">
                  Organizações aprovadas
                </h3>

                <div className="mt-6 space-y-5">
                  {approvedNgos.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma organização aprovada.
                    </div>
                  ) : (
                    approvedNgos.map((ngo) => (
                      <AdminNgoCard
                        key={ngo.id}
                        ngo={ngo}
                      />
                    ))
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold">
                  Organizações rejeitadas
                </h3>

                <div className="mt-6 space-y-5">
                  {rejectedNgos.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                      Nenhuma organização rejeitada.
                    </div>
                  ) : (
                    rejectedNgos.map((ngo) => (
                      <AdminNgoCard
                        key={ngo.id}
                        ngo={ngo}
                      />
                    ))
                  )}
                </div>
              </section>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}