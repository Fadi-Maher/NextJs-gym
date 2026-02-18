"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserPlus, Loader2 ,Minus , Plus} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AddPlayer() {
  const queryClient = useQueryClient();
  const [sessions, setSessions] = useState(0);

  const addPlayerApi = async (playerData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add player");
    }

    return res.json();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: addPlayerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      reset();
      setSessions(0);
      toast.success("Player added successfully! 🎉", {
        duration: 3000,
      });
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`, {
        duration: 4000,
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, sessions });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 max-w-lg mx-auto border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-50 rounded-lg">
          <UserPlus className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Add New Player</h2>
      </div>

      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player Name
          </label>
          <input
            placeholder="Enter player name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
              maxLength: { value: 50, message: "Maximum 50 characters" },
            })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            placeholder="Enter 11-digit phone number +2***********"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\+2[0-9]{11}$/,
                message: "Must be exactly 11 digits",
              },
            })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {errors.phone.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter player description"
            {...register("desc", {
              required: "Description is required",
              minLength: { value: 10, message: "Minimum 10 characters" },
              maxLength: { value: 200, message: "Maximum 200 characters" },
            })}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200"
          />
          {errors.desc && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              ⚠️ {errors.desc.message}
            </p>
          )}
        </div>

        {/* counter*/}
        {/* Counter Field */}
        <div className="flex flex-col items-center mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sessions
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSessions((prev) => Math.max(0, prev - 1))}
              className="p-2 bg-gray-200 rounded-full"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold">{sessions}</span>
            <button
              type="button"
              onClick={() => setSessions((prev) => prev + 1)}
              className="p-2 bg-gray-200 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Image
          src="/qr.png"
          alt="Add Player"
          width={200}
          height={200}
          className="w-40 h-auto mx-auto"
        />

        <button
          type="submit"
          disabled={mutation.isPending || !isValid}
          className="w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding Player...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Add Player
            </>
          )}
        </button>
      </div>
    </form>
  );
}
