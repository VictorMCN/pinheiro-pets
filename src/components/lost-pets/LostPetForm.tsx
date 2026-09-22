"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { administrativeRegions } from "@/lib/constants/administrative-regions";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PENDING_PUBLICATIONS = 2;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type LostPetFormProps = {
  initialPendingCount: number;
};

export function LostPetForm({
  initialPendingCount,
}: LostPetFormProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [pendingCount, setPendingCount] = useState(
    initialPendingCount,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      setError("Selecione uma foto do animal.");
      setIsLoading(false);
      return;
    }

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

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        "Você precisa estar autenticado para criar uma publicação.",
      );
      setIsLoading(false);
      return;
    }

    /*
     * Check the current number of pending publications again.
     *
     * The page already performs this check on the server, but this
     * second verification prevents stale pages or multiple browser
     * tabs from uploading an unnecessary image.
     *
     * The database trigger remains the final security layer.
     */
    const {
      count: currentPendingCount,
      error: pendingCountError,
    } = await supabase
      .from("lost_pets")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("author_id", user.id)
      .eq("status", "PENDING");

    if (pendingCountError) {
      setError(
        "Não foi possível verificar suas solicitações pendentes. Tente novamente.",
      );
      setIsLoading(false);
      return;
    }

    const verifiedPendingCount = currentPendingCount ?? 0;

    setPendingCount(verifiedPendingCount);

    if (
      verifiedPendingCount >= MAX_PENDING_PUBLICATIONS
    ) {
      setError(
        `Você já possui ${MAX_PENDING_PUBLICATIONS} publicações aguardando análise. Aguarde a moderação antes de enviar uma nova solicitação.`,
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

    const imagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("lost-pets")
      .upload(imagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      setError("Não foi possível enviar a foto. Tente novamente.");
      setIsLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("lost-pets")
      .getPublicUrl(imagePath);

    const { error: insertError } = await supabase
      .from("lost_pets")
      .insert({
        author_id: user.id,
        name: String(formData.get("name") ?? "").trim(),
        species: String(
          formData.get("species") ?? "",
        ).trim(),
        breed:
          String(formData.get("breed") ?? "").trim() ||
          null,
        sex:
          String(formData.get("sex") ?? "").trim() ||
          null,
        color:
          String(formData.get("color") ?? "").trim() ||
          null,
        size:
          String(formData.get("size") ?? "").trim() ||
          null,
        description:
          String(
            formData.get("description") ?? "",
          ).trim() || null,
        administrative_region: String(
          formData.get("administrativeRegion") ?? "",
        ).trim(),
        last_seen_location: String(
          formData.get("lastSeenLocation") ?? "",
        ).trim(),
        disappeared_at: String(
          formData.get("disappearedAt") ?? "",
        ).trim(),
        contact_name: String(
          formData.get("contactName") ?? "",
        ).trim(),
        contact_phone: String(
          formData.get("contactPhone") ?? "",
        ).trim(),
        image_url: publicUrl,
        image_path: imagePath,
        status: "PENDING",
      });

    if (insertError) {
      /*
       * Remove the uploaded image when the database refuses the
       * publication. This avoids orphaned files in Storage.
       */
      await supabase.storage
        .from("lost-pets")
        .remove([imagePath]);

      if (
        insertError.message.includes(
          "at most 2 pending lost pet publications",
        )
      ) {
        setPendingCount(MAX_PENDING_PUBLICATIONS);

        setError(
          `Você já possui ${MAX_PENDING_PUBLICATIONS} publicações aguardando análise. Aguarde a moderação antes de enviar uma nova solicitação.`,
        );
      } else {
        setError(
          "Não foi possível enviar a publicação. Tente novamente.",
        );
      }

      setIsLoading(false);
      return;
    }

    form.reset();

    setPendingCount(
      verifiedPendingCount + 1,
    );

    setIsSubmitted(true);
    setIsLoading(false);
  }

  if (isSubmitted) {
    const hasReachedPendingLimit =
      pendingCount >= MAX_PENDING_PUBLICATIONS;

    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-lg font-bold text-emerald-800">
          Publicação enviada para análise!
        </p>

        <p className="mt-3 leading-7 text-emerald-950">
          As informações do pet foram cadastradas com sucesso e ficarão
          pendentes até a análise de um administrador.
        </p>

        {hasReachedPendingLimit && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-amber-900">
              Você atingiu o limite de solicitações pendentes.
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              Aguarde a análise de uma das suas publicações antes de
              cadastrar outro animal desaparecido.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4">
          {!hasReachedPendingLimit && (
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Cadastrar outro pet
            </button>
          )}

          <Link
            href="/conta"
            className="rounded-xl border border-emerald-700 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            Ver minhas publicações
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">
          Solicitações aguardando análise:{" "}
          {pendingCount}/{MAX_PENDING_PUBLICATIONS}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Você pode manter no máximo duas publicações pendentes ao mesmo
          tempo.
        </p>
      </div>

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
            placeholder="Ex.: Bob"
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
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="" disabled>
              Selecione
            </option>
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
            placeholder="Ex.: Beagle ou sem raça definida"
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
            defaultValue=""
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
            placeholder="Ex.: Marrom e branco"
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
            defaultValue=""
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
          placeholder="Descreva características que possam ajudar na identificação do animal."
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
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="" disabled>
              Selecione a região
            </option>

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
          placeholder="Ex.: Próximo à Feira Central, Ceilândia"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />

        <p className="mt-2 text-sm text-slate-500">
          Evite informar endereço residencial completo. Prefira pontos de
          referência.
        </p>
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
            placeholder="Nome do tutor ou responsável"
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
            placeholder="(61) 99999-9999"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-semibold text-slate-700"
        >
          Foto do animal
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-sm text-slate-500">
          Formatos permitidos: JPEG, PNG e WEBP. Tamanho máximo: 5 MB.
        </p>
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
        {isLoading
          ? "Enviando publicação..."
          : "Enviar para análise"}
      </button>
    </form>
  );
}