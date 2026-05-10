import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminSidebar } from "../components/AdminSidebar.jsx";
import { AdminTopbar } from "../components/AdminTopbar.jsx";
import { AdminToastProvider } from "../context/ToastContext.jsx";
import { AdminDataProvider } from "../context/AdminDataContext.jsx";

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <AdminToastProvider>
      <AdminDataProvider>
      <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 opacity-95">
          <div className="absolute -top-[30%] right-[-25%] h-[520px] w-[520px] rounded-full blur-[140px] bg-amber-500/[0.08]" />
          <div className="absolute bottom-[-20%] left-[-18%] h-[460px] w-[460px] rounded-full blur-[120px] bg-fuchsia-500/[0.05]" />
        </div>
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <div
          className={`md:transition-[margin] md:duration-300 ${
            collapsed ? "md:ml-[4.85rem]" : "md:ml-64"
          } relative z-[1]`}
        >
          <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
          <main className="relative z-[1] px-4 pb-16 md:px-8 lg:px-10">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
      </AdminDataProvider>
    </AdminToastProvider>
  );
}
