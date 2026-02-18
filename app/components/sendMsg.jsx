"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Send } from "lucide-react";

export default function SendMessage({ selectedPlayers, setSelectedPlayers }) {
  const [message, setMessage] = useState("");
  
  const sendMutation = useMutation({
    mutationFn: async ({ message, playerIds }) => {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, playerIds }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }
      return res.json();
    },
    onSuccess: () => {
      setMessage("");
     setSelectedPlayers([]);
      toast.success("Message sent successfully! ✅", {
        duration: 3000,
        position: "bottom-right",
      });
    },
    onError: (err) => {
      toast.error(`Error: ${err.message} ❌`, {
        duration: 4000,
      });
    },
  });

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message", {
        duration: 3000,
      });
      return;
    }
    
    if (selectedPlayers.length === 0) {
      toast.error("Please select at least one player", {
        duration: 3000,
      });
      return;
    }
    
    sendMutation.mutate({
      message,
      playerIds: selectedPlayers,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-8 w-full max-w-2xl mx-auto border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Send Message
          </h1>
          <p className="text-gray-500 mt-2">
            Send to {selectedPlayers.length} selected player{selectedPlayers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Send className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Content
        </label>
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={6}
          className="w-full border-2 border-gray-200 rounded-2xl p-5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200 bg-white shadow-sm hover:shadow-md"
          disabled={sendMutation.isPending}
        />
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>Press Ctrl + Enter to send</span>
          <span>{message.length}/500 characters</span>
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={sendMutation.isPending || selectedPlayers.length === 0}
        className="w-full py-4 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        {sendMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>

      {selectedPlayers.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-700 text-sm font-medium">
            📤 Ready to send to {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}