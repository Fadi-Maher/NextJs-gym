"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, Filter, Search, Trash } from "lucide-react";
import { useState, useMemo } from "react";
import { Edit } from "lucide-react";
import EditPlayer from "./editPlayer";
import toast from "react-hot-toast";
import { Plus, Minus } from "lucide-react";
import { useMutation ,useQueryClient  } from "@tanstack/react-query";

export default function PlayersList({ selectedPlayers, setSelectedPlayers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState(null);

  const queryClient = useQueryClient();


  const fetchPlayers = async () => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`);
    if (!res.ok) throw new Error("Failed to fetch players");
    return res.json();
  };

  const {
    data: players = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: 30000,
  });

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        searchTerm === "" ||
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.phone.includes(searchTerm);

      if (showSelectedOnly) {
        return matchesSearch && selectedPlayers.includes(player._id);
      }
      return matchesSearch;
    });
  }, [players, searchTerm, showSelectedOnly, selectedPlayers]);

  const handleSelectAll = () => {
    if (filteredPlayers.length === selectedPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(filteredPlayers.map((p) => p._id));
    }
  };

  const handleDelete = async (playerId) => {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/${playerId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete player");
      }
      refetch();
      toast.success("Player deleted successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  //update counter

  const updateSessions = async ({ id, sessions }) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessions }),
    });

    if (!res.ok) throw new Error("Failed to update sessions");
    return res.json();
  };

  const sessionsMutation = useMutation({
    mutationFn: updateSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
    onError: () => {
      toast.error("Failed to update sessions");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading players...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium mb-3">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Players List</h2>
            <p className="text-gray-500 text-sm">
              {players.length} player{players.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
{""}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              showSelectedOnly
                ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            {showSelectedOnly ? "Show All" : "Show Selected"}
          </button>
        

          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
          >
            {filteredPlayers.length === selectedPlayers.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No players found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => (
            <div
              key={player._id}
              className={`rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                selectedPlayers.includes(player._id)
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => {
                setSelectedPlayers((prev) =>
                  prev.includes(player._id)
                    ? prev.filter((id) => id !== player._id)
                    : [...prev, player._id],
                );
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0)}
                  </div> 
                  <div>
                    <h3 className="font-bold text-gray-800">{player.name}</h3>
                    <p className="text-sm text-gray-500">{player.phone}</p>


                    {/* update counter */}

                    <div
                      className="flex items-center gap-3 mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          sessionsMutation.mutate({
                            id: player._id,
                            sessions: Math.max(0, player.sessions - 1),
                          })
                        }
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="text-sm font-semibold text-gray-700">
                        {player.sessions} sessions
                      </span>

                      <button
                        onClick={() =>
                          sessionsMutation.mutate({
                            id: player._id,
                            sessions: player.sessions + 1,
                          })
                        }
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(player._id)}
                  onChange={(e) => e.stopPropagation()}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {player.desc}
              </p>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  ID: {player._id.slice(-6)}
                </span>
                <span className=" flex gap-5 ml-2 text-blue-500 cursor-pointer">
                  <Edit
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPlayer(player);
                      setOpenEdit(true);
                    }}
                    className="w-5 h-5  cursor-pointer"
                  />

                  <Trash
                    onClick={(e) => {
                      setDeletingPlayer(player);

                      e.stopPropagation();
                      setConfirmDelete(true);
                    }}
                    className="w-5 h-5 text-red-500 cursor-pointer"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlayers.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">
                🎯 {selectedPlayers.length} player
                {selectedPlayers.length !== 1 ? "s" : ""} selected
              </p>
              <p className="text-blue-600 text-sm">Ready for message sending</p>
            </div>
            <button
              onClick={() => setSelectedPlayers([])}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
      {openEdit && editingPlayer && (
        <EditPlayer onClose={() => setOpenEdit(false)} player={editingPlayer} />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            className="absolute inset-0"
            onClick={() => setConfirmDelete(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h2 className="text-xl font-bold mb-4 text-center">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this player? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleDelete(deletingPlayer._id);
                  setConfirmDelete(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
