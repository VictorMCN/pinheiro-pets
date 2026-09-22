import {
  notFound,
  redirect,
} from "next/navigation";

import { EditAdoptionPetForm } from "@/components/adoption/EditAdoptionPetForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import { createClient } from "@/lib/supabase/server";

import type { AdoptionPet } from "@/types/adoption-pet";

type EditAdoptionPetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdoptionPetPage({
  params,
}: EditAdoptionPetPageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data,
    error,
  } = await supabase
    .from("adoption_pets")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const pet =
    data as AdoptionPet;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="font-semibold text-emerald-700">
            Adoção
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Editar publicação
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Atualize as informações do animal. Alterações em uma
            publicação já aprovada exigem uma nova análise
            administrativa.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <EditAdoptionPetForm
            pet={pet}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}