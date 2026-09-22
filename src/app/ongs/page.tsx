import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NgoCard } from "@/components/ngos/NgoCard";

import { createClient } from "@/lib/supabase/server";

import type { Ngo } from "@/types/ngo";

export default async function NgosPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("status", "APPROVED")
    .order("created_at", {
      ascending: false,
    });

  const ngos = (data ?? []) as Ngo[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-emerald-700">
              Proteção animal
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              ONGs e projetos
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Conheça organizações e projetos de proteção animal
              cadastrados no Pinheiro Pets e descubra formas de apoiar
              suas atividades.
            </p>
          </div>

          <Link
            href="/ongs/novo"
            className="rounded-full bg-emerald-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
          >
            Cadastrar ONG
          </Link>
        </section>

        {error ? (
          <div className="mt-10 rounded-2xl bg-red-50 p-6 text-red-700">
            Não foi possível carregar as ONGs.
          </div>
        ) : ngos.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              Nenhuma ONG publicada no momento
            </h2>

            <p className="mt-3 text-slate-600">
              Quando houver cadastros aprovados, eles aparecerão aqui.
            </p>
          </section>
        ) : (
          <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ngos.map((ngo) => (
              <NgoCard
                key={ngo.id}
                ngo={ngo}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}