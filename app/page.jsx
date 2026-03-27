"use client";
import AddPlayer from "./components/addPlayer";
import PlayersList from "./components/playerList";
import SendMessage from "./components/sendMsg";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { MessageSquare, Users, PlusCircle } from "lucide-react";
import Image from "next/image";

export default function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {""}
         <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <Users className="w-8 h-8 text-white" /> */}
            <Image
              className="rounded-2xl shadow-2xl"
              src="/logo.png"
              alt=""
              width={90}
              height={80}
            />

            <h1 className="text-4xl font-bold   bg-clip-text text-orange-500">
              Shape Shifter 
            </h1>

            <Image
              className="rounded-2xl shadow-2xl"
              src="/logo.png"
              alt=""
              width={90}
              height={80}
            />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your players and send them messages efficiently
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1 shadow-lg inline-flex">
            <button
              onClick={() => setActiveTab("players")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "players"
                  ? "   bg-orange-500 shadow-md "
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-5 h-5" />
              Manage Players
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "add"
                  ? "   bg-orange-500 shadow-md cursor-pointer" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              Add Player
            </button>
            <button
              onClick={() => setActiveTab("message")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "message"
                   ? "   bg-orange-500 shadow-md cursor-pointer"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Send Messages
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main>
          {activeTab === "players" && (
            <PlayersList
              selectedPlayers={selectedPlayers}
              setSelectedPlayers={setSelectedPlayers}
            />
          )}

          {activeTab === "add" && <AddPlayer />}

          {activeTab === "message" && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <SendMessage
                    selectedPlayers={selectedPlayers}
                    setSelectedPlayers={setSelectedPlayers}
                  />
                </div>
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">
                    Selected Players
                  </h3>
                  {selectedPlayers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No players selected</p>
                      <p className="text-sm mt-2">
                        Go to Manage Players to select players
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedPlayers.map((id, index) => (
                        <div
                          key={id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-blue-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            Player ID: {id.slice(-6)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Stats Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Selected Players</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {selectedPlayers.length}
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ready to Send</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedPlayers.length > 0 ? "Yes" : "No"}
                  </p>
                </div>
                <MessageSquare className="w-10 h-10 text-green-100" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">System Status</p>
                  <p className="text-3xl font-bold text-emerald-600">Online</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "white",
            color: "#374151",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            style: {
              borderLeft: "4px solid #10b981",
            },
          },
          error: {
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />
      <footer className="mt-16 mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 shadow-sm">
          <span className="text-sm text-gray-500">Developed by</span>
          <span className="text-sm font-semibold text-blue-600">
            Fady Maher
          </span>
        </div>
      </footer>
    </div>
  );
}
