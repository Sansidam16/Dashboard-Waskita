import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";

export default function DashboardLayout({ children }) {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? "dark bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <div className="flex min-h-screen">
        <Sidebar dark={dark} />
        <main className="flex-1 min-h-screen transition-colors duration-300">
          <Header dark={dark} setDark={setDark} />
          <Breadcrumbs />
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

