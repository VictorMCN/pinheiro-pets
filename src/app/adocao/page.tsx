import Link from "next/link";

import { AdoptionPetCard } from "@/components/adoption/AdoptionPetCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { AdoptionPet } from "@/types/adoption-pet";

export default async function AdoptionPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("adoption_pets")
    .select("*")
    .eq("status", "APPROVED")
    .order("created_at", {
      ascending: false,
    });

  const pets = (data ?? []) as AdoptionPet[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-emerald-700">
              Adoção responsável
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Animais para adoção
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Conheça animais que estão procurando uma nova família.
              As publicações disponíveis nesta página foram analisadas
              antes de serem exibidas publicamente.
            </p>
          </div>

          <Link
            href="/adocao/novo"
            className="rounded-full bg-emerald-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
          >
            Publicar animal para adoção
          </Link>
        </section>

        {error ? (
          <div className="mt-10 rounded-2xl bg-red-50 p-6 text-red-700">
            Não foi possível carregar os animais disponíveis para adoção.
          </div>
        ) : pets.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              Nenhum animal disponível no momento
            </h2>

            <p className="mt-3 text-slate-600">
              Quando houver publicações aprovadas, elas aparecerão aqui.
            </p>
          </section>
        ) : (
          <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <AdoptionPetCard
                key={pet.id}
                pet={pet}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}