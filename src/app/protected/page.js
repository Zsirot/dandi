"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import FlashMessage from "@/components/FlashMessage";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Separate client component for key validation
function KeyValidator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFlash, setShowFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState("success");

  useEffect(() => {
    const validateKey = async () => {
      const key = searchParams.get("key");
      if (!key) {
        router.push("/playground");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("api_keys")
          .select()
          .eq("key", key)
          .single();

        if (error || !data) {
          setFlashMessage("Invalid API key");
          setFlashType("error");
          setShowFlash(true);
          setTimeout(() => {
            setShowFlash(false);
            router.push("/playground");
          }, 3000);
          return;
        }

        setFlashMessage("Valid API key, /protected can be accessed");
        setFlashType("success");
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 3000);
      } catch (error) {
        console.error("Error validating API key:", error);
        setFlashMessage("Error validating API key");
        setFlashType("error");
        setShowFlash(true);
        setTimeout(() => {
          setShowFlash(false);
          router.push("/playground");
        }, 3000);
      }
    };

    validateKey();
  }, [searchParams, router]);

  return showFlash ? (
    <FlashMessage
      message={flashMessage}
      type={flashType}
      onClose={() => setShowFlash(false)}
    />
  ) : null;
}

// Main protected page component
export default function Protected() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8">
          <Suspense fallback={<div>Loading...</div>}>
            <KeyValidator />
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Protected Page</h1>
                <p className="text-gray-600">
                  This page can only be accessed with a valid API key.
                </p>
              </div>
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
