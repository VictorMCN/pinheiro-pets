import Link from "next/link";

import { AdoptionModerationActions } from "@/components/admin/AdoptionModerationActions";

import type { AdoptionPet } from "@/types/adoption-pet";

type AdminAdoptionPetCardProps = {
  pet: AdoptionPet;
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

export function AdminAdoptionPetCard({
  pet,
}: AdminAdoptionPetCardProps) {
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
            <h3 className="text-xl font-bold">
              {pet.name}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {pet.species}
            {pet.breed ? ` • ${pet.breed}` : ""}
          </p>

          {pet.age && (
            <p className="mt-2 text-sm text-slate-600">
              <strong>Idade:</strong> {pet.age}
            </p>
          )}

          {pet.sex && (
            <p className="mt-2 text-sm text-slate-600">
              <strong>Sexo:</strong> {pet.sex}
            </p>
          )}

          {pet.size && (
            <p className="mt-2 text-sm text-slate-600">
              <strong>Porte:</strong> {pet.size}
            </p>
          )}

          <p className="mt-2 text-sm text-slate-600">
            <strong>Região:</strong>{" "}
            {pet.administrative_region}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Vacinação:</strong>{" "}
            {pet.vaccinated
              ? "Vacinado"
              : "Não vacinado"}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Castração:</strong>{" "}
            {pet.neutered
              ? "Castrado"
              : "Não castrado"}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Responsável:</strong>{" "}
            {pet.contact_name}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Contato:</strong>{" "}
            {pet.contact_phone}
          </p>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700">
              Descrição
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {pet.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-start gap-3">
            {pet.status === "APPROVED" && (
              <Link
                href={`/adocao/${pet.id}`}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver publicação
              </Link>
            )}

            <AdoptionModerationActions
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