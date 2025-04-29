import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiHome,
  FiCode,
  FiBookOpen,
  FiCreditCard,
  FiSettings,
  FiFileText,
  FiDatabase,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Overview",
      href: "/dashboards",
      icon: FiHome,
    },
    {
      name: "API Playground",
      href: "/playground",
      icon: FiCode,
    },
    {
      name: "Use Cases",
      href: "/use-cases",
      icon: FiBookOpen,
    },
    {
      name: "Billing",
      href: "/billing",
      icon: FiCreditCard,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: FiSettings,
    },
    {
      name: "Documentation",
      href: "/docs",
      icon: FiFileText,
      external: true,
    },
    {
      name: "Dandi MCP",
      href: "/mcp",
      icon: FiDatabase,
      external: true,
    },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 h-screen flex flex-col relative group transition-all duration-300 ease-in-out`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
      >
        {isCollapsed ? (
          <FiChevronRight size={14} />
        ) : (
          <FiChevronLeft size={14} />
        )}
      </button>

      <div className="p-6">
        <h1
          className={`font-bold text-gray-900 ${
            isCollapsed ? "text-center text-lg" : "text-xl"
          }`}
        >
          {isCollapsed ? "D" : "Dandi"}
        </h1>
      </div>

      <nav className={`flex-1 ${isCollapsed ? "px-2" : "px-4"}`}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li
                key={item.name}
                className={`rounded-lg transition-colors ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors w-full ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  <div
                    className={`relative group/icon ${
                      isCollapsed ? "mx-auto" : ""
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <span className={`${isCollapsed ? "hidden" : "block"}`}>
                    {item.name}
                  </span>
                  {item.external && !isCollapsed && (
                    <FiExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`p-4 border-t border-gray-200 ${isCollapsed ? "px-2" : ""}`}
      >
        <div
          className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-600 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="relative group/avatar">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium">JD</span>
            </div>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all whitespace-nowrap z-50">
                John Doe
                <br />
                john@example.com
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-gray-400 text-xs">john@example.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
