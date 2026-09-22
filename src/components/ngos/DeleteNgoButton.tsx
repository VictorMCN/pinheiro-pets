"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type DeleteNgoButtonProps = {
  ngoId: string;
  logoPath: string | null;
};

export function DeleteNgoButton({
  ngoId,
  logoPath,
}: DeleteNgoButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta organização? Esta ação não poderá ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    const supabase = createClient();

    const { data, error: deleteError } = await supabase
      .from("ngos")
      .delete()
      .eq("id", ngoId)
      .select("id")
      .maybeSingle();

    if (deleteError || !data) {
      setError(
        "Não foi possível excluir a organização.",
      );

      setIsDeleting(false);
      return;
    }

    if (logoPath) {
      const { error: storageError } = await supabase.storage
        .from("ngo-logos")
        .remove([logoPath]);

      if (storageError) {
        console.error(
          "NGO logo removal error:",
          storageError,
        );
      }
    }

    setIsDeleting(false);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Excluindo..." : "Excluir"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}