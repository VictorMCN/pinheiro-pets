import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LostPetCard } from "@/components/lost-pets/LostPetCard";
import { administrativeRegions } from "@/lib/constants/administrative-regions";
import { createClient } from "@/lib/supabase/server";
import type { LostPet } from "@/types/lost-pet";

type LostPetsPageProps = {
  searchParams: Promise<{
    region?: string;
    species?: string;
  }>;
};

export default async function LostPetsPage({
  searchParams,
}: LostPetsPageProps) {
  const { region, species } = await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from("lost_pets")
    .select("*")
    .eq("status", "APPROVED")
    .order("created_at", { ascending: false });

  if (region) {
    query = query.eq("administrative_region", region);
  }

  if (species) {
    query = query.eq("species", species);
  }

  const { data, error } = await query;

  const pets = (data ?? []) as LostPet[];

  const hasFilters = Boolean(region || species);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main>
        <section className="border-b border-emerald-100 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold text-emerald-700">
                Ajude um pet a voltar para casa
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Pets perdidos
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Consulte animais desaparecidos no Distrito Federal e ajude a
                compartilhar informações que possam contribuir com o reencontro.
              </p>
            </div>

            <Link
              href="/perdidos/novo"
              className="rounded-full bg-emerald-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
            >
              Publicar pet perdido
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pt-10">
          <form
            method="get"
            className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-semibold text-slate-700"
              >
                Região administrativa
              </label>

              <select
                id="region"
                name="region"
                defaultValue={region ?? ""}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Todas as regiões</option>

                {administrativeRegions.map((administrativeRegion) => (
                  <option
                    key={administrativeRegion}
                    value={administrativeRegion}
                  >
                    {administrativeRegion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="species"
                className="block text-sm font-semibold text-slate-700"
              >
                Espécie
              </label>

              <select
                id="species"
                name="species"
                defaultValue={species ?? ""}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Todas as espécies</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Filtrar
              </button>

              {hasFilters && (
                <Link
                  href="/perdidos"
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar
                </Link>
              )}
            </div>
          </form>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          {error ? (
            <div className="rounded-2xl bg-red-50 p-5 text-red-700">
              Não foi possível carregar as publicações.
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <h2 className="text-xl font-bold">
                Nenhuma publicação encontrada.
              </h2>

              <p className="mt-3 text-slate-600">
                {hasFilters
                  ? "Não encontramos pets com os filtros selecionados."
                  : "Os anúncios aprovados aparecerão aqui."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <LostPetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}