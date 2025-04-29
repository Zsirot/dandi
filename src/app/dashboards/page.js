"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  FiEye,
  FiCopy,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiChevronDown,
  FiExternalLink,
  FiInfo,
  FiCheck,
} from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import PlanCard from "@/components/PlanCard";
import CreateKeyModal from "@/components/CreateKeyModal";
import EditKeyModal from "@/components/EditKeyModal";
import FlashMessage from "@/components/FlashMessage";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKey, setShowKey] = useState({});
  const [copied, setCopied] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState("success");

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async (keyData) => {
    try {
      // First, get the next ID from the sequence
      const { data: nextId, error: idError } = await supabase.rpc(
        "get_next_api_key_id"
      );

      if (idError) throw idError;

      const newKey = {
        id: nextId,
        name: keyData.name,
        type: keyData.type,
        key: generateApiKey(),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("api_keys")
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;

      setApiKeys([...apiKeys, data]);
      setModalOpen(false);
      setFlashMessage("API key created successfully");
      setFlashType("success");
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 3000);
    } catch (error) {
      console.error("Error creating API key:", error);
      setFlashMessage("Failed to create API key");
      setFlashType("error");
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 3000);
    }
  };

  const generateApiKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);

      if (error) throw error;

      setApiKeys(apiKeys.filter((key) => key.id !== id));
      setFlashMessage("API key deleted successfully");
      setFlashType("error");
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 3000);
    } catch (error) {
      console.error("Error deleting API key:", error);
      setFlashMessage("Failed to delete API key");
      setFlashType("error");
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 3000);
    }
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      setCopied(null);
    }, 2000);
  };

  const editApiKey = async (keyData) => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .update({
          name: keyData.name,
          type: keyData.type,
        })
        .eq("id", keyData.id)
        .select()
        .single();

      if (error) throw error;

      setApiKeys(apiKeys.map((key) => (key.id === data.id ? data : key)));
      setEditModalOpen(false);
      setFlashMessage("API key updated successfully");
      setFlashType("success");
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 3000);
    } catch (error) {
      console.error("Error updating API key:", error);
      setFlashMessage("Failed to update API key");
      setFlashType("error");
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showFlash && <FlashMessage message="Copied API Key to Clipboard" />}
      {showFlashMessage && (
        <FlashMessage
          message={flashMessage}
          type={flashType}
          onClose={() => setShowFlashMessage(false)}
        />
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <PlanCard />
            {/* API Keys Card */}
            <div className="bg-white rounded-2xl shadow p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold flex items-center gap-2">
                  API Keys{" "}
                  <button
                    className="ml-2 p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Add API Key"
                    onClick={() => setModalOpen(true)}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                The key is used to authenticate your requests. To learn more,
                see the{" "}
                <a href="#" className="text-blue-600 underline">
                  documentation
                </a>{" "}
                page.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        NAME
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        KEY
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        CREATED
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        KEY TYPE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="border-b last:border-0">
                        <td className="px-4 py-2 font-medium">{key.name}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <input
                              type={showKey[key.id] ? "text" : "password"}
                              value={key.key}
                              readOnly
                              className="bg-gray-100 px-2 py-1 rounded w-56 font-mono text-xs"
                              style={{ letterSpacing: "2px" }}
                            />
                            <div className="flex items-center justify-between w-40">
                              <button
                                onClick={() =>
                                  setShowKey((prev) => ({
                                    ...prev,
                                    [key.id]: !prev[key.id],
                                  }))
                                }
                                className="p-1 text-gray-500 hover:text-blue-600"
                                title="Show/Hide"
                              >
                                <FiEye />
                              </button>
                              <button
                                onClick={() => handleCopy(key.key)}
                                className="p-1 text-gray-500 hover:text-blue-600"
                                title="Copy"
                              >
                                <FiCopy />
                              </button>
                              <button
                                onClick={() => {
                                  setEditKey(key);
                                  setEditModalOpen(true);
                                }}
                                className="p-1 text-gray-500 hover:text-blue-600"
                                title="Edit"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => deleteApiKey(key.id)}
                                className="p-1 text-gray-500 hover:text-red-600"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {new Date(key.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              key.type === "production"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {key.type.charAt(0).toUpperCase() +
                              key.type.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CreateKeyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createApiKey}
      />
      <EditKeyModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={editApiKey}
        keyData={editKey}
      />
    </div>
  );
}
