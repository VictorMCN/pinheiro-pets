import Link from "next/link";

import type { Ngo } from "@/types/ngo";

type NgoCardProps = {
  ngo: Ngo;
};

export function NgoCard({
  ngo,
}: NgoCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-48 items-center justify-center bg-slate-100 p-8">
        {ngo.logo_url ? (
          <div
            className="h-32 w-32 rounded-3xl bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${ngo.logo_url}")`,
            }}
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-emerald-50 text-4xl font-bold text-emerald-700">
            {ngo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            {ngo.name}
          </h2>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ONG aprovada
          </span>
        </div>

        <p className="mt-3 text-sm font-medium text-slate-600">
          {ngo.administrative_region}
        </p>

        <p className="mt-4 line-clamp-3 leading-6 text-slate-600">
          {ngo.description}
        </p>

        {ngo.pix_key && (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Aceita doações via Pix
            </p>
          </div>
        )}

        <Link
          href={`/ongs/${ngo.id}`}
          className="mt-6 block rounded-xl bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
        >
          Ver ONG
        </Link>
      </div>
    </article>
  );
}