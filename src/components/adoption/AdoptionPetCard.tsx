import Link from "next/link";

import type { AdoptionPet } from "@/types/adoption-pet";

type AdoptionPetCardProps = {
  pet: AdoptionPet;
};

export function AdoptionPetCard({
  pet,
}: AdoptionPetCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div
        className="h-64 bg-slate-200 bg-cover bg-center"
        style={
          pet.image_url
            ? {
                backgroundImage: `url("${pet.image_url}")`,
              }
            : undefined
        }
      />

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            {pet.name}
          </h2>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Para adoção
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          {pet.species}
          {pet.breed ? ` • ${pet.breed}` : ""}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {pet.age && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              {pet.age}
            </span>
          )}

          {pet.size && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Porte {pet.size.toLowerCase()}
            </span>
          )}

          {pet.sex && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              {pet.sex}
            </span>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600">
          {pet.administrative_region}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

        <Link
          href={`/adocao/${pet.id}`}
          className="mt-6 block w-full rounded-xl bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}