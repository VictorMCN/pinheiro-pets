import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { DeleteLostPetButton } from "@/components/lost-pets/DeleteLostPetButton";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { LostPet } from "@/types/lost-pet";

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

export default async function AccountPage() {
  const supabase = await createClient();

  // Get the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the user's application role.
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

  // Load publications created by the current user.
  const { data: lostPets } = await supabase
    .from("lost_pets")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const pets = (lostPets ?? []) as LostPet[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Account information */}

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

          {/* Account actions */}

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

        {/* User publications */}

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
                Consulte o andamento dos anúncios que você enviou.
              </p>
            </div>

            <Link
              href="/perdidos/novo"
              className="rounded-full bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
            >
              Publicar pet perdido
            </Link>
          </div>

          {pets.length === 0 ? (
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
              {pets.map((pet) => {
                const status = statusLabels[pet.status];

                return (
                  <article
                    key={pet.id}
                    className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-5">
                      {/* Pet image */}

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

                      {/* Publication information */}

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
                          {pet.species} • {pet.administrative_region}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Enviado em{" "}
                          {new Date(
                            pet.created_at,
                          ).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {/* Publication actions */}

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
      </main>

      <Footer />
    </div>
  );
}