import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../Sidebar/Sidebar";
import Content from "../Content/Content";
import Topbar from "../Topbar/Topbar";
import NotificationEngine from "../../../features/notifications/components/NotificationEngine/NotificationEngine";
import ThemeManager from "../../../features/settings/components/ThemeManager/ThemeManager";
import CommandPalette from "../../CommandPalette/CommandPalette";
import CurrencyRateEngine from "../../../features/settings/components/CurrencyRateEngine/CurrencyRateEngine";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-background text-text-primary transition-colors duration-300">
      <ThemeManager />
<CurrencyRateEngine />
<NotificationEngine />
      <CommandPalette />

      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuOpen={openMobileMenu} />

        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
}