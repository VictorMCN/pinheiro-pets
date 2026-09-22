import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { AdoptionPet } from "@/types/adoption-pet";

type AdoptionPetDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdoptionPetDetailsPage({
  params,
}: AdoptionPetDetailsPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("adoption_pets")
    .select("*")
    .eq("id", id)
    .eq("status", "APPROVED")
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const pet = data as AdoptionPet;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/adocao"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          ← Voltar para adoção
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <section>
            <div
              className="min-h-[420px] rounded-3xl bg-slate-200 bg-cover bg-center shadow-sm"
              style={
                pet.image_url
                  ? {
                      backgroundImage: `url("${pet.image_url}")`,
                    }
                  : undefined
              }
            />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {pet.name}
              </h1>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Para adoção
              </span>
            </div>

            <p className="mt-4 text-lg text-slate-600">
              {pet.species}
              {pet.breed ? ` • ${pet.breed}` : ""}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">
                  Idade
                </p>

                <p className="mt-1 font-medium">
                  {pet.age || "Não informada"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">
                  Sexo
                </p>

                <p className="mt-1 font-medium">
                  {pet.sex || "Não informado"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">
                  Porte
                </p>

                <p className="mt-1 font-medium">
                  {pet.size || "Não informado"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">
                  Região
                </p>

                <p className="mt-1 font-medium">
                  {pet.administrative_region}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  pet.vaccinated
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {pet.vaccinated
                  ? "Vacinado"
                  : "Não vacinado"}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  pet.neutered
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {pet.neutered
                  ? "Castrado"
                  : "Não castrado"}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">
                Sobre o animal
              </h2>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                {pet.description}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <h2 className="text-lg font-bold text-emerald-950">
                Interesse em adotar?
              </h2>

              <p className="mt-4 text-sm text-emerald-950">
                <strong>Responsável:</strong>{" "}
                {pet.contact_name}
              </p>

              <p className="mt-2 text-sm text-emerald-950">
                <strong>Telefone:</strong>{" "}
                {pet.contact_phone}
              </p>

              <p className="mt-4 text-sm leading-6 text-emerald-800">
                Entre em contato diretamente com o responsável para
                conversar sobre o processo de adoção.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}