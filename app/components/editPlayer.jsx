"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";

function EditPlayer({ player, onClose }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: player?.name,
      phone: player?.phone,
      desc: player?.desc,
    },
  });

  // مهم لو اللاعب اتغير
  useEffect(() => {
    if (player) {
      reset({
        name: player.name,
        phone: player.phone,
        desc: player.desc,
      });
    }
  }, [player, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/players/${player._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update player");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player updated successfully 🎉");
      onClose?.();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
        <h2 className="text-xl font-bold mb-6 text-center">
          Edit Player
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name", { required: true })}
            placeholder="Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            {...register("phone", { required: true })}
            placeholder="Phone"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

        

          <textarea
            {...register("desc")}
            placeholder="Description"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition cursor-pointer"
            >
              {mutation.isPending ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlayer;
