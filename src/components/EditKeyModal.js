import { useState, useEffect } from "react";

export default function EditKeyModal({ open, onClose, onEdit, keyData }) {
  const [keyName, setKeyName] = useState(keyData?.name || "");
  const [keyType, setKeyType] = useState(keyData?.type || "development");
  const [limitUsage, setLimitUsage] = useState(!!keyData?.usageLimit);
  const [usageLimit, setUsageLimit] = useState(keyData?.usageLimit || "");

  useEffect(() => {
    setKeyName(keyData?.name || "");
    setKeyType(keyData?.type || "development");
    setLimitUsage(!!keyData?.usageLimit);
    setUsageLimit(keyData?.usageLimit || "");
  }, [keyData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit({
      ...keyData,
      name: keyName,
      type: keyType,
      usageLimit: limitUsage ? usageLimit : null,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in border border-gray-200">
        <h2 className="text-xl font-bold mb-2">Edit API key</h2>
        <p className="text-gray-500 mb-6">
          Update the details for this API key.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Name{" "}
              <span className="text-gray-400">
                — A unique name to identify this key
              </span>
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Key Name"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Type{" "}
              <span className="text-gray-400">
                — Choose the environment for this key
              </span>
            </label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setKeyType("production")}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  keyType === "production"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                Production{" "}
                <span className="block text-xs font-normal">
                  Rate limited to 1,000 requests/minute
                </span>
              </button>
              <button
                type="button"
                onClick={() => setKeyType("development")}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  keyType === "development"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                Development{" "}
                <span className="block text-xs font-normal">
                  Rate limited to 100 requests/minute
                </span>
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={limitUsage}
                onChange={(e) => setLimitUsage(e.target.checked)}
              />
              Limit monthly usage*
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              type="number"
              placeholder="1000"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              disabled={!limitUsage}
              min={1}
            />
            <p className="text-xs text-gray-400 mt-1">
              * If the combined usage of all your keys exceeds your plan's
              limit, all requests will be rejected.
            </p>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
