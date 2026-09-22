import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { Ngo } from "@/types/ngo";

type NgoDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NgoDetailsPage({
  params,
}: NgoDetailsPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("id", id)
    .eq("status", "APPROVED")
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const ngo = data as Ngo;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/ongs"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          ← Voltar para ONGs
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {ngo.logo_url ? (
              <div
                className="h-40 w-40 shrink-0 rounded-3xl bg-slate-100 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${ngo.logo_url}")`,
                }}
              />
            ) : (
              <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-5xl font-bold text-emerald-700">
                {ngo.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  {ngo.name}
                </h1>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ONG aprovada
                </span>
              </div>

              <p className="mt-4 font-medium text-slate-600">
                {ngo.administrative_region}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold">
              Sobre a organização
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
              {ngo.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Telefone
              </p>

              <p className="mt-2 font-medium">
                {ngo.phone}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">
                E-mail
              </p>

              <p className="mt-2 font-medium">
                {ngo.email || "Não informado"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Instagram
              </p>

              <p className="mt-2 font-medium">
                {ngo.instagram || "Não informado"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Endereço
              </p>

              <p className="mt-2 font-medium">
                {ngo.address || "Não informado"}
              </p>
            </div>
          </div>

          {ngo.pix_key && (
            <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
              <p className="font-semibold text-emerald-700">
                Apoie esta organização
              </p>

              <h2 className="mt-1 text-2xl font-bold text-emerald-950">
                Doação via Pix
              </h2>

              <div className="mt-5 rounded-2xl bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Chave Pix informada pela organização
                </p>

                <p className="mt-2 break-all font-medium text-slate-900">
                  {ngo.pix_key}
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-emerald-800">
                Confira os dados do destinatário no aplicativo do seu
                banco antes de concluir qualquer transferência.
              </p>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}