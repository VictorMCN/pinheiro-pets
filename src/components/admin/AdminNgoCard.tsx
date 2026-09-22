import Link from "next/link";

import { NgoModerationActions } from "@/components/admin/NgoModerationActions";

import type { Ngo } from "@/types/ngo";

type AdminNgoCardProps = {
  ngo: Ngo;
};

const statusLabels = {
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

export function AdminNgoCard({
  ngo,
}: AdminNgoCardProps) {
  const status = statusLabels[ngo.status];

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row">
        {ngo.logo_url ? (
          <div
            className="h-40 w-full shrink-0 rounded-2xl bg-slate-100 bg-contain bg-center bg-no-repeat md:w-40"
            style={{
              backgroundImage: `url("${ngo.logo_url}")`,
            }}
          />
        ) : (
          <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-4xl font-bold text-emerald-700 md:w-40">
            {ngo.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold">
              {ngo.name}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            <strong>Região:</strong>{" "}
            {ngo.administrative_region}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            <strong>Telefone:</strong>{" "}
            {ngo.phone}
          </p>

          {ngo.email && (
            <p className="mt-2 text-sm text-slate-600">
              <strong>E-mail:</strong>{" "}
              {ngo.email}
            </p>
          )}

          {ngo.instagram && (
            <p className="mt-2 text-sm text-slate-600">
              <strong>Instagram:</strong>{" "}
              {ngo.instagram}
            </p>
          )}

          {ngo.pix_key && (
            <p className="mt-2 break-all text-sm text-slate-600">
              <strong>Pix:</strong>{" "}
              {ngo.pix_key}
            </p>
          )}

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700">
              Descrição
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {ngo.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-start gap-3">
            {ngo.status === "APPROVED" && (
              <Link
                href={`/ongs/${ngo.id}`}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver publicação
              </Link>
            )}

            <NgoModerationActions
              ngoId={ngo.id}
              status={ngo.status}
              logoPath={ngo.logo_path}
            />
          </div>
        </div>
      </div>
    </article>
  );
}