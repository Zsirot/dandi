import { FiCheck, FiX, FiInfo } from "react-icons/fi";

export default function FlashMessage({ message, type = "success", onClose }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck className="text-lg" />;
      case "error":
        return <FiX className="text-lg" />;
      case "info":
        return <FiInfo className="text-lg" />;
      default:
        return <FiCheck className="text-lg" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="absolute top-4 left-0 right-0 z-50 flex justify-center">
      <div
        className={`ml-12 ${getBackgroundColor()} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`}
      >
        {getIcon()}
        <span>{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
