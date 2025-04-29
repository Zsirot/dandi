import { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function PlanCard() {
  const [payAsYouGo, setPayAsYouGo] = useState(false);
  // Example usage values
  const usage = 0;
  const credits = 1000;
  const planName = "Researcher";

  return (
    <div className="rounded-2xl p-8 mb-8 w-full bg-gradient-to-tr from-[#e0c3fc] via-[#8ec5fc] to-[#a9c9ff] relative overflow-hidden shadow flex flex-col sm:flex-row items-center justify-between min-h-[220px]">
      <div className="flex-1">
        <div className="mb-2">
          <span className="bg-white/40 text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
            CURRENT PLAN
          </span>
        </div>
        <div className="text-4xl font-bold text-white drop-shadow mb-4">
          {planName}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white/90 font-medium">API Usage</span>
          <FiInfo className="text-white/70" />
        </div>
        <div className="text-white/80 text-sm mb-2">Plan</div>
        <div className="w-full h-2 bg-white/30 rounded-full mb-2">
          <div
            className="h-2 bg-white/80 rounded-full"
            style={{ width: `${(usage / credits) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center gap-2 text-white/90 text-sm">
          <span>
            {usage} / {credits} Credits
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={payAsYouGo}
              onChange={() => setPayAsYouGo((v) => !v)}
              className="sr-only"
            />
            <span
              className={`w-10 h-6 flex items-center bg-white/40 rounded-full p-1 duration-300 ${
                payAsYouGo ? "bg-blue-500/80" : ""
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  payAsYouGo ? "translate-x-4" : ""
                }`}
              ></span>
            </span>
            <span className="ml-2 text-white/90 text-sm">
              Pay as you go <FiInfo className="inline ml-1 text-white/70" />
            </span>
          </label>
        </div>
      </div>
      <div className="mt-6 sm:mt-0 sm:ml-8 flex-shrink-0">
        <button className="bg-white/60 hover:bg-white/80 text-blue-700 font-semibold px-5 py-2 rounded-lg shadow transition">
          Manage Plan
        </button>
      </div>
    </div>
  );
}
