"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { administrativeRegions } from "@/lib/constants/administrative-regions";
import { createClient } from "@/lib/supabase/client";
import type { LostPet } from "@/types/lost-pet";

type EditLostPetFormProps = {
  pet: LostPet;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function EditLostPetForm({ pet }: EditLostPetFormProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Você precisa estar autenticado para editar esta publicação.");
      setIsLoading(false);
      return;
    }

    const image = formData.get("image");

    let imageUrl = pet.image_url;
    let imagePath = pet.image_path;
    let newImagePath: string | null = null;

    if (image instanceof File && image.size > 0) {
      if (!allowedImageTypes.includes(image.type)) {
        setError("A foto deve estar nos formatos JPEG, PNG ou WEBP.");
        setIsLoading(false);
        return;
      }

      if (image.size > MAX_FILE_SIZE) {
        setError("A foto deve possuir no máximo 5 MB.");
        setIsLoading(false);
        return;
      }

      const extension =
        image.type === "image/png"
          ? "png"
          : image.type === "image/webp"
            ? "webp"
            : "jpg";

      newImagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("lost-pets")
        .upload(newImagePath, image, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        setError("Não foi possível enviar a nova foto.");
        setIsLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("lost-pets").getPublicUrl(newImagePath);

      imageUrl = publicUrl;
      imagePath = newImagePath;
    }

    const { error: updateError } = await supabase
      .from("lost_pets")
      .update({
        name: String(formData.get("name") ?? "").trim(),
        species: String(formData.get("species") ?? "").trim(),
        breed: String(formData.get("breed") ?? "").trim() || null,
        sex: String(formData.get("sex") ?? "").trim() || null,
        color: String(formData.get("color") ?? "").trim() || null,
        size: String(formData.get("size") ?? "").trim() || null,
        description:
          String(formData.get("description") ?? "").trim() || null,
        administrative_region: String(
          formData.get("administrativeRegion") ?? "",
        ).trim(),
        last_seen_location: String(
          formData.get("lastSeenLocation") ?? "",
        ).trim(),
        disappeared_at: String(
          formData.get("disappearedAt") ?? "",
        ).trim(),
        contact_name: String(formData.get("contactName") ?? "").trim(),
        contact_phone: String(formData.get("contactPhone") ?? "").trim(),
        image_url: imageUrl,
        image_path: imagePath,
      })
      .eq("id", pet.id)
      .eq("author_id", user.id);

    if (updateError) {
      if (newImagePath) {
        await supabase.storage.from("lost-pets").remove([newImagePath]);
      }

      setError("Não foi possível atualizar a publicação.");
      setIsLoading(false);
      return;
    }

    if (
      newImagePath &&
      pet.image_path &&
      pet.image_path !== newImagePath
    ) {
      await supabase.storage
        .from("lost-pets")
        .remove([pet.image_path]);
    }

    setIsUpdated(true);
    setIsLoading(false);
  }

  if (isUpdated) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-lg font-bold text-emerald-800">
          Alterações enviadas para análise!
        </p>

        <p className="mt-3 leading-7 text-emerald-950">
          A publicação foi atualizada e ficará pendente até uma nova análise
          administrativa.
        </p>

        <Link
          href="/conta"
          className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Voltar para minha conta
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-700"
          >
            Nome do animal
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={pet.name}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="species"
            className="block text-sm font-semibold text-slate-700"
          >
            Espécie
          </label>

          <select
            id="species"
            name="species"
            required
            defaultValue={pet.species}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="breed"
            className="block text-sm font-semibold text-slate-700"
          >
            Raça
          </label>

          <input
            id="breed"
            name="breed"
            type="text"
            defaultValue={pet.breed ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="sex"
            className="block text-sm font-semibold text-slate-700"
          >
            Sexo
          </label>

          <select
            id="sex"
            name="sex"
            defaultValue={pet.sex ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Não informado</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-semibold text-slate-700"
          >
            Cor
          </label>

          <input
            id="color"
            name="color"
            type="text"
            defaultValue={pet.color ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="size"
            className="block text-sm font-semibold text-slate-700"
          >
            Porte
          </label>

          <select
            id="size"
            name="size"
            defaultValue={pet.size ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Não informado</option>
            <option value="Pequeno">Pequeno</option>
            <option value="Médio">Médio</option>
            <option value="Grande">Grande</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700"
        >
          Características e observações
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={pet.description ?? ""}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="administrativeRegion"
            className="block text-sm font-semibold text-slate-700"
          >
            Região administrativa
          </label>

          <select
            id="administrativeRegion"
            name="administrativeRegion"
            required
            defaultValue={pet.administrative_region}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            {administrativeRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="disappearedAt"
            className="block text-sm font-semibold text-slate-700"
          >
            Data do desaparecimento
          </label>

          <input
            id="disappearedAt"
            name="disappearedAt"
            type="date"
            required
            defaultValue={pet.disappeared_at}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="lastSeenLocation"
          className="block text-sm font-semibold text-slate-700"
        >
          Último local visto
        </label>

        <input
          id="lastSeenLocation"
          name="lastSeenLocation"
          type="text"
          required
          defaultValue={pet.last_seen_location}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="contactName"
            className="block text-sm font-semibold text-slate-700"
          >
            Nome para contato
          </label>

          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            defaultValue={pet.contact_name}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="contactPhone"
            className="block text-sm font-semibold text-slate-700"
          >
            Telefone para contato
          </label>

          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            required
            defaultValue={pet.contact_phone}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <p className="block text-sm font-semibold text-slate-700">
          Foto atual
        </p>

        {pet.image_url && (
          <div
            className="mt-2 h-48 max-w-sm rounded-2xl bg-slate-200 bg-cover bg-center"
            style={{
              backgroundImage: `url("${pet.image_url}")`,
            }}
          />
        )}

        <label
          htmlFor="image"
          className="mt-5 block text-sm font-semibold text-slate-700"
        >
          Trocar foto
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-sm text-slate-500">
          Deixe este campo vazio para manter a foto atual.
        </p>
      </div>

      <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Qualquer alteração enviada fará esta publicação voltar para análise
        administrativa antes de aparecer novamente publicamente.
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Salvando alterações..." : "Salvar alterações"}
      </button>
    </form>
  );
}