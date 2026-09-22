import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import type { LostPet } from "@/types/lost-pet";

type LostPetDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LostPetDetailsPage({
  params,
}: LostPetDetailsPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data } = await supabase
    .from("lost_pets")
    .select("*")
    .eq("id", id)
    .eq("status", "APPROVED")
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const pet = data as LostPet;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div
            className="h-80 bg-slate-200 bg-cover bg-center md:h-[480px]"
            style={
              pet.image_url
                ? { backgroundImage: `url("${pet.image_url}")` }
                : undefined
            }
          />

          <div className="p-8 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-emerald-700">
                  Animal desaparecido
                </p>

                <h1 className="mt-2 text-4xl font-bold">{pet.name}</h1>

                <p className="mt-2 text-slate-600">
                  {pet.species}
                  {pet.breed ? ` • ${pet.breed}` : ""}
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {pet.administrative_region}
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Sexo" value={pet.sex} />
              <Detail label="Cor" value={pet.color} />
              <Detail label="Porte" value={pet.size} />
              <Detail
                label="Desapareceu em"
                value={new Date(
                  `${pet.disappeared_at}T12:00:00`,
                ).toLocaleDateString("pt-BR")}
              />
              <Detail
                label="Último local visto"
                value={pet.last_seen_location}
              />
              <Detail
                label="Região administrativa"
                value={pet.administrative_region}
              />
            </div>

            {pet.description && (
              <div className="mt-10">
                <h2 className="text-xl font-bold">Características</h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {pet.description}
                </p>
              </div>
            )}

            <div className="mt-10 rounded-3xl bg-emerald-50 p-6">
              <h2 className="text-xl font-bold text-emerald-950">
                Informações para contato
              </h2>

              <p className="mt-4 text-emerald-950">
                <strong>Responsável:</strong> {pet.contact_name}
              </p>

              <p className="mt-2 text-emerald-950">
                <strong>Telefone:</strong> {pet.contact_phone}
              </p>

              <p className="mt-4 text-sm leading-6 text-emerald-800">
                Entre em contato com o responsável caso tenha informações sobre
                este animal.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-slate-900">{value || "Não informado"}</p>
    </div>
  );
}