import Link from "next/link";
import { redirect } from "next/navigation";

import { DeleteAdoptionPetButton } from "@/components/adoption/DeleteAdoptionPetButton";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DeleteLostPetButton } from "@/components/lost-pets/DeleteLostPetButton";
import { DeleteNgoButton } from "@/components/ngos/DeleteNgoButton";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { AdoptionPet } from "@/types/adoption-pet";
import type { LostPet } from "@/types/lost-pet";
import type { Ngo } from "@/types/ngo";

const statusLabels = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-700",
  },
  APPROVED: {
    label: "Aprovado",
    className: "bg-emerald-50 text-emerald-700",
  },
  REJECTED: {
    label: "Rejeitado",
    className: "bg-red-50 text-red-700",
  },
} as const;

const ngoStatusLabels = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-700",
  },
  APPROVED: {
    label: "Aprovada",
    className: "bg-emerald-50 text-emerald-700",
  },
  REJECTED: {
    label: "Rejeitada",
    className: "bg-red-50 text-red-700",
  },
} as const;

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "ADMIN";

  const name =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : "Usuário";

  const { data: lostPetData } = await supabase
    .from("lost_pets")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  const { data: adoptionPetData } = await supabase
    .from("adoption_pets")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  const { data: ngoData } = await supabase
    .from("ngos")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  const lostPets = (lostPetData ?? []) as LostPet[];

  const adoptionPets =
    (adoptionPetData ?? []) as AdoptionPet[];

  const ngos = (ngoData ?? []) as Ngo[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Account */}

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="font-semibold text-emerald-700">
            Minha conta
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Olá, {name}.
          </h1>

          <p className="mt-4 text-slate-600">
            Acompanhe suas publicações e gerencie sua conta no
            Pinheiro Pets.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">
              E-mail cadastrado
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {user.email}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LogoutButton />

            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Acessar painel administrativo
              </Link>
            )}
          </div>
        </section>

        {/* Pets perdidos */}

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold text-emerald-700">
                Pets perdidos
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Minhas publicações
              </h2>

              <p className="mt-2 text-slate-600">
                Consulte o andamento dos anúncios de animais
                desaparecidos que você enviou.
              </p>
            </div>

            <Link
              href="/perdidos/novo"
              className="rounded-full bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
            >
              Publicar pet perdido
            </Link>
          </div>

          {lostPets.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-900">
                Você ainda não publicou nenhum pet perdido.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Suas publicações aparecerão aqui após o envio.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {lostPets.map((pet) => {
                const status = statusLabels[pet.status];

                return (
                  <article
                    key={pet.id}
                    className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className="h-20 w-20 shrink-0 rounded-2xl bg-slate-200 bg-cover bg-center"
                        style={
                          pet.image_url
                            ? {
                                backgroundImage: `url("${pet.image_url}")`,
                              }
                            : undefined
                        }
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold">
                            {pet.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {pet.species} •{" "}
                          {pet.administrative_region}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Enviado em{" "}
                          {new Date(
                            pet.created_at,
                          ).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {pet.status === "APPROVED" && (
                        <Link
                          href={`/perdidos/${pet.id}`}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Ver publicação
                        </Link>
                      )}

                      <Link
                        href={`/perdidos/${pet.id}/editar`}
                        className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Editar
                      </Link>

                      <DeleteLostPetButton
                        petId={pet.id}
                        imagePath={pet.image_path}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Adoção */}

        <section className="mt-16 border-t border-slate-200 pt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold text-emerald-700">
                Adoção
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Meus animais para adoção
              </h2>

              <p className="mt-2 text-slate-600">
                Acompanhe o andamento dos animais que você
                cadastrou para adoção.
              </p>
            </div>

            <Link
              href="/adocao/novo"
              className="rounded-full bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
            >
              Publicar animal para adoção
            </Link>
          </div>

          {adoptionPets.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-900">
                Você ainda não publicou nenhum animal para adoção.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Seus anúncios de adoção aparecerão aqui após o envio.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {adoptionPets.map((pet) => {
                const status = statusLabels[pet.status];

                return (
                  <article
                    key={pet.id}
                    className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className="h-20 w-20 shrink-0 rounded-2xl bg-slate-200 bg-cover bg-center"
                        style={
                          pet.image_url
                            ? {
                                backgroundImage: `url("${pet.image_url}")`,
                              }
                            : undefined
                        }
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold">
                            {pet.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {pet.species}
                          {pet.breed ? ` • ${pet.breed}` : ""}
                          {" • "}
                          {pet.administrative_region}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Enviado em{" "}
                          {new Date(
                            pet.created_at,
                          ).toLocaleDateString("pt-BR")}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {pet.vaccinated && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              Vacinado
                            </span>
                          )}

                          {pet.neutered && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              Castrado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {pet.status === "APPROVED" && (
                        <Link
                          href={`/adocao/${pet.id}`}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Ver publicação
                        </Link>
                      )}

                      <Link
                        href={`/adocao/${pet.id}/editar`}
                        className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Editar
                      </Link>

                      <DeleteAdoptionPetButton
                        petId={pet.id}
                        imagePath={pet.image_path}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ONGs */}

        <section className="mt-16 border-t border-slate-200 pt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold text-emerald-700">
                ONGs e projetos
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Minhas organizações
              </h2>

              <p className="mt-2 text-slate-600">
                Acompanhe os cadastros de organizações e projetos
                enviados por você.
              </p>
            </div>

            <Link
              href="/ongs/novo"
              className="rounded-full bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
            >
              Cadastrar ONG
            </Link>
          </div>

          {ngos.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-900">
                Você ainda não cadastrou nenhuma organização.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Seus cadastros aparecerão aqui após o envio.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {ngos.map((ngo) => {
                const status =
                  ngoStatusLabels[ngo.status];

                return (
                  <article
                    key={ngo.id}
                    className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-5">
                      {ngo.logo_url ? (
                        <div
                          className="h-20 w-20 shrink-0 rounded-2xl bg-slate-100 bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url("${ngo.logo_url}")`,
                          }}
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-700">
                          {ngo.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold">
                            {ngo.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {ngo.administrative_region}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Enviado em{" "}
                          {new Date(
                            ngo.created_at,
                          ).toLocaleDateString("pt-BR")}
                        </p>

                        {ngo.pix_key && (
                          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Doações via Pix
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {ngo.status === "APPROVED" && (
                        <Link
                          href={`/ongs/${ngo.id}`}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Ver publicação
                        </Link>
                      )}

                      <Link
                        href={`/ongs/${ngo.id}/editar`}
                        className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Editar
                      </Link>

                      <DeleteNgoButton
                        ngoId={ngo.id}
                        logoPath={ngo.logo_path}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}