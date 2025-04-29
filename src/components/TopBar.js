export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
      <div className="text-xs text-gray-400">
        Pages / <span className="text-gray-900 font-semibold">Overview</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>{" "}
          Operational
        </span>
        <a href="#" className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15.5h-2v-2h2v-1.5c0-2.07 1.23-3.2 3.1-3.2.9 0 1.84.16 1.84.16v2.02h-1.04c-1.03 0-1.36.64-1.36 1.3V13.5h2.3l-.37 2h-1.93v6.3c4.56-.93 8-4.96 8-9.8 0-5.52-4.48-10-10-10z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6a4.28 4.28 0 0 1-1.94-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
          </svg>
        </a>
        <button className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M21 12.79A9 9 0 1 1 12.79 3a7 7 0 0 0 8.21 9.79z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
