import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import { DonorDashboard } from "./components/DonorDashboard";
import { UrgentNeedsPanel } from "./components/UrgentNeedsPanel";
import { BloodBankPortal } from "./components/BloodBankPortal";
import { AdminVerificationPanel } from "./components/AdminVerificationPanel";
import { HospitalDashboard } from "./components/HospitalDashboard";
import { Badge } from "./components/ui/badge";
import {
  Heart,
  AlertCircle,
  Building2,
  Shield,
  Bell,
  Menu,
  X,
  Hospital,
  LogOut,
} from "lucide-react";

const NAVIGATION = [
  {
    id: "donor",
    name: "Donor Dashboard",
    icon: Heart,
    color: "from-blue-500 to-teal-500",
    badge: 2,
  },
  {
    id: "urgent",
    name: "Urgent Needs",
    icon: AlertCircle,
    color: "from-red-500 to-orange-500",
    badge: 5,
  },
  {
    id: "hospital",
    name: "Hospital Dashboard",
    icon: Hospital,
    color: "from-green-500 to-lime-500",
  },
  {
    id: "bloodbank",
    name: "Blood Bank Portal",
    icon: Building2,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "admin",
    name: "Admin Panel",
    icon: Shield,
    color: "from-purple-500 to-indigo-500",
  },
];

const COMPONENTS = {
  donor: DonorDashboard,
  urgent: UrgentNeedsPanel,
  hospital: HospitalDashboard,
  bloodbank: BloodBankPortal,
  admin: AdminVerificationPanel,
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("donor");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const CurrentComponent = COMPONENTS[currentRole];

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Inter, Poppins, sans-serif" }}
    >
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-blue-600">Medi-Bridge</h1>
                <p className="text-xs text-gray-500">Healthcare Connect</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
                5
              </Badge>
            </button>
            <div
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={handleLogout}
              title="Click to Logout"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm">
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-gray-500">
                  Role: {currentUser.role}
                </p>
              </div>
              <LogOut className="w-4 h-4 ml-2 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside
          className={`fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] bg-white border-r shadow-lg lg:shadow-none transition-transform duration-300 z-40 w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <nav className="p-4 space-y-2">
            <p className="text-xs text-gray-500 px-3 mb-3 uppercase tracking-wider">
              Navigation
            </p>
            {NAVIGATION.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentRole(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      className={
                        isActive ? "bg-white text-blue-600" : "bg-red-500"
                      }
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="p-4 mt-6 border-t">
            <p className="text-xs text-gray-500 px-3 mb-3 uppercase tracking-wider">
              Impact Stats
            </p>
            <div className="space-y-3 px-3">
              {[
                { label: "Medicines Donated", value: "127" },
                { label: "Lives Impacted", value: "342" },
                { label: "Blood Donations", value: "89" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className="text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden top-[73px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl">
          <CurrentComponent currentUser={currentUser} />
        </main>
      </div>
    </div>
  );
}

export default App;
