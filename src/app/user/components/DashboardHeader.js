
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import {
  FiGrid,
  FiZap,
  FiBarChart2,
  FiCpu,
  FiRefreshCw,
  FiCreditCard,
  FiUsers,
  FiFileText,
  FiUser,
  FiSettings,
  FiX,
  FiChevronRight,
  FiTrendingUp,
  FiLogOut,
  FiAward,
  FiBookOpen // Added for Fund Director icon
} from "react-icons/fi";
import { FaBitcoin } from "react-icons/fa";
import { doUserLogout } from "@/app/api/auth";
import { useTheme } from "@/components/ThemeProvider";

export default function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}) {

  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();

  const closeSidebar = () => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setSidebarOpen(false);
    }
  };

  const handleNavClick = () => {
    closeSidebar();
  };

  const handleSignOut = () => {
    doUserLogout()
    router.push('/user/login');
  };

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <Image
          src={isDark ? "/logo.png" : "/LOG02.png"}
          alt="Logo"
          width={200}
          height={60}
          priority
        />

        {/* Close Button */}
        <button className="close-sidebar-btn" onClick={closeSidebar}>
          <FiX />
        </button>
      </div>

      <div className="nb">
        <div className="nlbl">Platform</div>

        <Link href="/user/dashboard" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard' ? 'on' : '')}>
          <span className="ic">
            <FiGrid />
          </span>
          <span>Dashboard</span>
        </Link>
        <Link href="/user/dashboard/AI-Trading-Bots" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/AI-Trading-Bots' ? 'on' : '')}>
          <span className="ic">
            <FiZap />
          </span>
          <span>AI Trading Bots</span>
          <span className="npip pg"></span>
        </Link>
        <Link href="/user/dashboard/engine" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/engine' ? 'on' : '')}>
          <span className="ic">
            <FiZap />
          </span>
          <span>Roventar Engine</span>
          <span className="npip pg"></span>
        </Link>


        <Link href="/user/dashboard/Team" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/Team' ? 'on' : '')}>
          <span className="ic">
            <FiUsers />
          </span>
          <span>Genealogy</span>
        </Link>
        <Link href="/user/dashboard/my-rewards" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/my-rewards' ? 'on' : '')}>
          <span className="ic">
            <FiAward />
          </span>
          <span>Rank Progress</span>
        </Link>
        <Link href="/user/dashboard/crypto-terminal" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/crypto-terminal' ? 'on' : '')}>
          <span className="ic">
            <FaBitcoin />
          </span>
          <span>Crypto Terminal</span>
        </Link>
        <Link href="/user/dashboard/ai-assistant" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/ai-assistant' ? 'on' : '')}>
          <span className="ic">
            <FiCpu />
          </span>
          <span>AI Assistant</span>
        </Link>
      </div>

      <div className="nb">
        <div className="nlbl">Finance</div>


        <Link href="/user/dashboard/income-statement" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/income-statement' ? 'on' : '')}>
          <span className="ic">
            <FiCreditCard />
          </span>
          <span>Income Statement</span>
        </Link>


        <Link href="/user/dashboard/wallet-statement" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/wallet-statement' ? 'on' : '')}>
          <span className="ic">
            <FiFileText />
          </span>
          <span>Wallet Statement</span>
        </Link>

        <Link href="/user/dashboard/analytics" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/analytics' ? 'on' : '')}>
          <span className="ic">
            <FiBarChart2 />
          </span>
          <span>Analytics</span>
        </Link>

        {/* Fund Director Menu Item - Added here */}
        <Link href="/user/dashboard/fund-director" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/fund-director' ? 'on' : '')}>
          <span className="ic">
            <FiTrendingUp />
          </span>
          <span>Fund Director</span>
        </Link>
      </div>

      <div className="nb">
        <div className="nlbl">Account</div>

        <Link href="/user/dashboard/profile" onClick={handleNavClick} className={"ni " + (pathname === '/user/dashboard/profile' ? 'on' : '')}>
          <span className="ic">
            <FiUser />
          </span>
          <span>Profile</span>
        </Link>
        <Link
          href="/user/login"
          onClick={() => {
            doUserLogout();
            handleNavClick();
          }}
          className="ni"
        >
          <span className="ic">
            <FiLogOut />
          </span>
          <span>Logout</span>
        </Link>


      </div>

    </aside>
  );
}