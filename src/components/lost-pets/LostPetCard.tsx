import Link from "next/link";
import type { LostPet } from "@/types/lost-pet";

type LostPetCardProps = {
  pet: LostPet;
};

export function LostPetCard({ pet }: LostPetCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className="h-56 bg-slate-200 bg-cover bg-center"
        style={
          pet.image_url
            ? { backgroundImage: `url("${pet.image_url}")` }
            : undefined
        }
      >
        {!pet.image_url && (
          <div className="flex h-full items-center justify-center text-slate-500">
            Sem foto
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{pet.name}</h2>

            <p className="mt-1 text-sm text-slate-500">
              {pet.species}
              {pet.breed ? ` • ${pet.breed}` : ""}
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {pet.administrative_region}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-500">
            Último local visto
          </p>

          <p className="mt-1 text-slate-700">{pet.last_seen_location}</p>
        </div>

        <Link
          href={`/perdidos/${pet.id}`}
          className="mt-6 inline-block font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Ver detalhes →
        </Link>
      </div>
    </article>
  );
}