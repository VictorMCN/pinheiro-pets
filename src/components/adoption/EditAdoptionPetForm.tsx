"use client";

import Link from "next/link";
import {
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { administrativeRegions } from "@/lib/constants/administrative-regions";
import { createClient } from "@/lib/supabase/client";

import type { AdoptionPet } from "@/types/adoption-pet";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type EditAdoptionPetFormProps = {
  pet: AdoptionPet;
};

export function EditAdoptionPetForm({
  pet,
}: EditAdoptionPetFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const image = formData.get("image");

    let newImagePath: string | null = null;
    let newImageUrl: string | null = null;

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        "Você precisa estar autenticado para editar esta publicação.",
      );

      setIsLoading(false);
      return;
    }

    if (user.id !== pet.author_id) {
      setError(
        "Você não possui permissão para editar esta publicação.",
      );

      setIsLoading(false);
      return;
    }

    if (
      image instanceof File &&
      image.size > 0
    ) {
      if (
        !allowedImageTypes.includes(
          image.type,
        )
      ) {
        setError(
          "A foto deve estar nos formatos JPEG, PNG ou WEBP.",
        );

        setIsLoading(false);
        return;
      }

      if (image.size > MAX_FILE_SIZE) {
        setError(
          "A foto deve possuir no máximo 5 MB.",
        );

        setIsLoading(false);
        return;
      }

      const extension =
        image.type === "image/png"
          ? "png"
          : image.type === "image/webp"
            ? "webp"
            : "jpg";

      newImagePath =
        `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("adoption-pets")
          .upload(
            newImagePath,
            image,
            {
              contentType: image.type,
              upsert: false,
            },
          );

      if (uploadError) {
        console.error(
          "Adoption image update error:",
          uploadError,
        );

        setError(
          `Não foi possível enviar a nova foto: ${uploadError.message}`,
        );

        setIsLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("adoption-pets")
        .getPublicUrl(newImagePath);

      newImageUrl = publicUrl;
    }

    const vaccinated =
      formData.get("vaccinated") ===
      "true";

    const neutered =
      formData.get("neutered") ===
      "true";

    const updateData = {
      name: String(
        formData.get("name") ?? "",
      ).trim(),

      species: String(
        formData.get("species") ?? "",
      ).trim(),

      breed:
        String(
          formData.get("breed") ?? "",
        ).trim() || null,

      age:
        String(
          formData.get("age") ?? "",
        ).trim() || null,

      sex:
        String(
          formData.get("sex") ?? "",
        ).trim() || null,

      size:
        String(
          formData.get("size") ?? "",
        ).trim() || null,

      vaccinated,

      neutered,

      description: String(
        formData.get("description") ?? "",
      ).trim(),

      administrative_region: String(
        formData.get(
          "administrativeRegion",
        ) ?? "",
      ).trim(),

      contact_name: String(
        formData.get("contactName") ?? "",
      ).trim(),

      contact_phone: String(
        formData.get("contactPhone") ?? "",
      ).trim(),

      ...(newImagePath &&
      newImageUrl
        ? {
            image_path: newImagePath,
            image_url: newImageUrl,
          }
        : {}),
    };

    const {
      data,
      error: updateError,
    } = await supabase
      .from("adoption_pets")
      .update(updateData)
      .eq("id", pet.id)
      .eq("author_id", user.id)
      .select("id")
      .maybeSingle();

    if (updateError || !data) {
      if (newImagePath) {
        await supabase.storage
          .from("adoption-pets")
          .remove([newImagePath]);
      }

      if (
        updateError?.message.includes(
          "at most 2 pending adoption pet publications",
        )
      ) {
        setError(
          "Você já possui duas outras publicações de adoção aguardando análise. Aguarde a moderação antes de editar este anúncio.",
        );
      } else {
        console.error(
          "Adoption publication update error:",
          updateError,
        );

        setError(
          updateError
            ? `Não foi possível atualizar a publicação: ${updateError.message}`
            : "Não foi possível atualizar a publicação.",
        );
      }

      setIsLoading(false);
      return;
    }

    if (
      newImagePath &&
      pet.image_path &&
      newImagePath !== pet.image_path
    ) {
      const { error: removeError } =
        await supabase.storage
          .from("adoption-pets")
          .remove([pet.image_path]);

      if (removeError) {
        console.error(
          "Old adoption image removal error:",
          removeError,
        );
      }
    }

    router.push("/conta");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {pet.status === "APPROVED" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">
            Esta publicação está aprovada.
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            Ao alterar as informações, ela voltará para análise e ficará
            temporariamente indisponível na página pública de adoção.
          </p>
        </div>
      )}

      {pet.status === "REJECTED" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-900">
            Esta publicação foi rejeitada.
          </p>

          <p className="mt-2 text-sm leading-6 text-red-800">
            Você pode corrigir as informações e enviá-la novamente para
            análise.
          </p>
        </div>
      )}

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
            <option value="Cachorro">
              Cachorro
            </option>

            <option value="Gato">
              Gato
            </option>

            <option value="Outro">
              Outro
            </option>
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
            defaultValue={
              pet.breed ?? ""
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-semibold text-slate-700"
          >
            Idade aproximada
          </label>

          <input
            id="age"
            name="age"
            type="text"
            defaultValue={
              pet.age ?? ""
            }
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
            defaultValue={
              pet.sex ?? ""
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              Não informado
            </option>

            <option value="Macho">
              Macho
            </option>

            <option value="Fêmea">
              Fêmea
            </option>
          </select>
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
            defaultValue={
              pet.size ?? ""
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              Não informado
            </option>

            <option value="Pequeno">
              Pequeno
            </option>

            <option value="Médio">
              Médio
            </option>

            <option value="Grande">
              Grande
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="vaccinated"
            className="block text-sm font-semibold text-slate-700"
          >
            Vacinação
          </label>

          <select
            id="vaccinated"
            name="vaccinated"
            required
            defaultValue={
              pet.vaccinated
                ? "true"
                : "false"
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="true">
              Vacinado
            </option>

            <option value="false">
              Não vacinado
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="neutered"
            className="block text-sm font-semibold text-slate-700"
          >
            Castração
          </label>

          <select
            id="neutered"
            name="neutered"
            required
            defaultValue={
              pet.neutered
                ? "true"
                : "false"
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="true">
              Castrado
            </option>

            <option value="false">
              Não castrado
            </option>
          </select>
        </div>
      </div>

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
          defaultValue={
            pet.administrative_region
          }
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        >
          {administrativeRegions.map(
            (region) => (
              <option
                key={region}
                value={region}
              >
                {region}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700"
        >
          Descrição
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          required
          defaultValue={
            pet.description
          }
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
            defaultValue={
              pet.contact_name
            }
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
            defaultValue={
              pet.contact_phone
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <p className="block text-sm font-semibold text-slate-700">
          Foto atual
        </p>

        {pet.image_url ? (
          <div
            className="mt-3 h-48 w-full max-w-sm rounded-2xl bg-slate-200 bg-cover bg-center"
            style={{
              backgroundImage: `url("${pet.image_url}")`,
            }}
          />
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Nenhuma foto cadastrada.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-semibold text-slate-700"
        >
          Alterar foto
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-sm text-slate-500">
          Deixe vazio para manter a foto atual. Formatos permitidos:
          JPEG, PNG e WEBP. Máximo de 5 MB.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Salvando alterações..."
            : "Salvar alterações"}
        </button>

        <Link
          href="/conta"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}