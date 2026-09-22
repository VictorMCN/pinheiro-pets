import Link from "next/link";

import { ModerationActions } from "@/components/admin/ModerationActions";

import type { LostPet } from "@/types/lost-pet";

type AdminLostPetCardProps = {
  pet: LostPet;
};

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

export function AdminLostPetCard({ pet }: AdminLostPetCardProps) {
  const status = statusLabels[pet.status];

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row">
        <div
          className="h-48 w-full shrink-0 rounded-2xl bg-slate-200 bg-cover bg-center md:h-44 md:w-44"
          style={
            pet.image_url
              ? {
                  backgroundImage: `url("${pet.image_url}")`,
                }
              : undefined
          }
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold">{pet.name}</h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {pet.species} • {pet.administrative_region}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Último local visto:</strong> {pet.last_seen_location}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Responsável:</strong> {pet.contact_name}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Contato:</strong> {pet.contact_phone}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Data do desaparecimento:</strong>{" "}
            {new Date(
              `${pet.disappeared_at}T12:00:00`,
            ).toLocaleDateString("pt-BR")}
          </p>

          {pet.description && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700">
                Características
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {pet.description}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {pet.status === "APPROVED" && (
              <Link
                href={`/perdidos/${pet.id}`}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver publicação
              </Link>
            )}

            <ModerationActions
              petId={pet.id}
              status={pet.status}
              imagePath={pet.image_path}
            />
          </div>
        </div>
      </div>
    </article>
  );
}