"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteLostPetButtonProps = {
  petId: string;
  imagePath: string | null;
};

export function DeleteLostPetButton({
  petId,
  imagePath,
}: DeleteLostPetButtonProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta publicação? Esta ação não poderá ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("lost_pets")
      .delete()
      .eq("id", petId);

    if (deleteError) {
      setError("Não foi possível excluir a publicação.");
      setIsDeleting(false);
      return;
    }

    if (imagePath) {
      await supabase.storage.from("lost-pets").remove([imagePath]);
    }

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