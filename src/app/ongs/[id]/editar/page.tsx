import {
  notFound,
  redirect,
} from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { EditNgoForm } from "@/components/ngos/EditNgoForm";

import { createClient } from "@/lib/supabase/server";

import type { Ngo } from "@/types/ngo";

type EditNgoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditNgoPage({
  params,
}: EditNgoPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const ngo = data as Ngo;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="font-semibold text-emerald-700">
            ONGs
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Editar organização
          </h1>

          <p className="mt-4 text-slate-600">
            Atualize os dados da organização. Alterações em um cadastro
            aprovado exigem nova análise administrativa.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <EditNgoForm ngo={ngo} />
        </section>
      </main>

      <Footer />
    </div>
  );
}