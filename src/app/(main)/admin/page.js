"use client";

import { useState, useEffect, useMemo } from 'react';
import AllUsersSearch from '@/components/AllUsersSearch';
import { exportUsersToExcel } from '@/app/utils/exportUsersToExcel';
import {
  RiUser3Line,
  RiChat3Line,
  RiGroupLine,
  RiCalendarLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiWalletLine,
  RiMoneyDollarCircleLine,
  RiBankLine,
  RiExchangeLine,
  RiLineChartLine,
  RiTimeLine,
  RiBriefcaseLine,
} from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDashboardDetails, getSearchAllUsersDetails } from '@/app/redux/slices/authSlice';
import { getAdminUserId } from '@/app/api/auth';



/* ── Mini bar chart SVG ── */
const MiniBarChart = ({ color = '#6366f1', bars = [40, 65, 45, 80, 55, 70, 60] }) => (
  <svg width="64" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {bars.map((h, i) => (
      <rect
        key={i}
        x={i * 9 + 1}
        y={32 - h * 0.32}
        width="7"
        height={h * 0.32}
        rx="2"
        fill={color}
        opacity={i === bars.length - 1 ? 1 : 0.35}
      />
    ))}
  </svg>
);

/* ── Donut chart SVG ── */
const DonutChart = ({ pct = 75, color = '#14b8a6', size = 64, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">
        {pct}%
      </text>
    </svg>
  );
};

/* ── Progress bar ── */
const ProgressBar = ({ pct = 60, color = 'bg-violet-500' }) => (
  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllActivity, setShowAllActivity] = useState(false);
  const dispatch = useDispatch();
  const { loading, adminDashboardData, searchAllUsersData } = useSelector((state) => state.auth);

  const adminUserId = getAdminUserId();

  useEffect(() => {
    if (adminUserId) {
      dispatch(getAdminDashboardDetails(adminUserId));
    }
    dispatch(getSearchAllUsersDetails());
  }, [dispatch, adminUserId]);

  const getAPIData = () => {
    if (!adminDashboardData?.data?.[0]) return null;
    return adminDashboardData.data[0];
  };

  const apiData = getAPIData();
  const fmt = (val) => Number(val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 });
  const recentActivity = [
    { id: 1, user: 'Today ROI', action: `$${apiData?.todayROI}`, time: '2 min ago', type: 'conversation' },
    { id: 2, user: 'Today Direct Income', action: `$${apiData?.TodayDirectIncome}`, time: '5 min ago', type: 'message' },
    { id: 3, user: 'Today Tier Reward', action: `$${apiData?.TodayTierReward}`, time: '15 min ago', type: 'onboarding' },
    // { id: 4, user: 'Sarah Wilson', action: 'Updated profile', time: '1 hour ago', type: 'profile' },
    // { id: 5, user: 'Tom Brown', action: 'Changed settings', time: '2 hours ago', type: 'settings' },
  ];
  /* ── Top 5 stat cards ── */
  const topStats = [
    {
      label: 'Total Joining',
      value: fmt(apiData?.TotalJoining),
      icon: RiGroupLine,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      accent: '#6366f1',
      barColor: '#6366f1',
      bars: [30, 50, 38, 65, 48, 72, 60],
      trend: '+12%',
      trendUp: true,
    },
    // {
    //   label: 'Working Income Total',
    //   value: `$${fmt(apiData?.WorkingIncomeTotal)}`,
    //   icon: RiMoneyDollarCircleLine,
    //   iconBg: 'bg-emerald-50',
    //   iconColor: 'text-emerald-500',
    //   accent: '#10b981',
    //   barColor: '#10b981',
    //   bars: [45, 60, 38, 80, 55, 68, 74],
    //   trend: '+8.3%',
    //   trendUp: true,
    // },
    {
      label: 'Total Today Joining',
      value: fmt(apiData?.TotalToadyJoining),
      icon: RiCalendarLine,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      accent: '#f59e0b',
      barColor: '#f59e0b',
      bars: [55, 40, 65, 38, 70, 48, 62],
      trend: '+3.1%',
      trendUp: true,
    },
    {
      label: 'Total Activated',
      value: fmt(apiData?.TotalActivated),
      icon: RiUser3Line,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
      accent: '#07dbc7',
      barColor: '#07dbc7',
      bars: [60, 45, 70, 50, 80, 55, 65],
      trend: '+5.7%',
      trendUp: true,
    },
    // {
    //   label: 'Total Business',
    //   value: `$${fmt(apiData?.TotalBusiness)}`,
    //   icon: RiBriefcaseLine,
    //   iconBg: 'bg-rose-50',
    //   iconColor: 'text-rose-500',
    //   accent: '#f43f5e',
    //   barColor: '#f43f5e',
    //   bars: [70, 55, 45, 65, 40, 58, 50],
    //   trend: '-2.4%',
    //   trendUp: false,
    // },
  ];

  /* ── Wallet banner cards ── */
  const walletCards = [
    {
      label: 'Total Balance',
      value: `$${fmt(apiData?.totalDepositWallet)}`,
      gradient: 'from-teal-400 via-cyan-500 to-sky-500',
      chipText: 'Deposit Wallet',
    },
    {
      label: 'Total Balance',
      value: `$${fmt(apiData?.TotalIncomeWallet)}`,
      gradient: 'from-violet-500 via-indigo-500 to-blue-500',
      chipText: 'Working Wallet',
    },
    {
      label: 'Total Balance',
      value: `$${fmt(apiData?.totalROIWallet)}`,
      gradient: 'from-teal-400 via-cyan-500 to-sky-500',
      chipText: 'ROI Trade Wallet',
    },
  ];

  /* ── Bottom 5 stat cards ── */
  const bottomStats = [
    { label: 'ROI Withdrawal', value: `$${fmt(apiData?.ROIWithdrawal)}`, pct: 62, barCol: 'bg-blue-500', dotCol: 'bg-blue-500', icon: RiBankLine },
    { label: 'Total Working Withdrawal', value: `$${fmt(apiData?.TotalIncomeWithdrawal)}`, pct: 48, barCol: 'bg-amber-500', dotCol: 'bg-amber-500', icon: RiExchangeLine },
    { label: 'USDT Deposit', value: `$${fmt(apiData?.USDTDeposit)}`, pct: 75, barCol: 'bg-violet-500', dotCol: 'bg-violet-500', icon: RiLineChartLine },
    { label: 'Fund Deposit By Admin', value: `$${fmt(apiData?.FundDepositBySystem)}`, pct: 55, barCol: 'bg-rose-500', dotCol: 'bg-rose-500', icon: RiMoneyDollarCircleLine },
    { label: 'FUND TRANSFER', value: `$${fmt(apiData?.FUNDTRANSFER)}`, pct: 68, barCol: 'bg-teal-500', dotCol: 'bg-teal-500', icon: RiBriefcaseLine },
  ];

  /* ── Recent activity builder ── */
  const dynamicRecentActivity = useMemo(() => {
    if (!searchAllUsersData?.data || searchAllUsersData.data.length === 0) return null;
    const users = searchAllUsersData.data;
    const sortedUsers = [...users]
      .filter(u => u.CreatedDate)
      .sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));
    return sortedUsers.map((user, index) => {
      const date = new Date(user.CreatedDate);
      const now = new Date();
      const diffMins = Math.floor((now - date) / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const timeAgo =
        diffMins < 1 ? 'Just now' :
          diffMins < 60 ? `${diffMins}m ago` :
            diffHours < 24 ? `${diffHours}h ago` :
              diffDays < 7 ? `${diffDays}d ago` :
                date.toLocaleDateString();
      return {
        id: index + 1,
        user: user.FullName || 'Unknown User',
        action: user.Status === 'Active' ? 'Account activated' : user.Status === 'Inactive' ? 'Account deactivated' : 'Joined the platform',
        time: timeAgo,
        type: 'user_activity',
      };
    });
  }, [searchAllUsersData]);

  const displayActivity = (() => {
    if (adminDashboardData?.data?.recentActivity?.length > 0) {
      return adminDashboardData.data.recentActivity.map((a, i) => ({
        id: i + 1,
        user: a.user || a.UserName || 'Unknown User',
        action: a.action || a.Action || 'Performed an action',
        time: a.time || a.Time || 'Just now',
        type: a.type || 'activity',
      }));
    }
    if (dynamicRecentActivity?.length > 0) return dynamicRecentActivity;
    return recentActivity;
  })();

  const displayedActivity = useMemo(() =>
    showAllActivity ? displayActivity : displayActivity.slice(0, 6),
    [displayActivity, showAllActivity]
  );

  const handleExport = (users) => {
    if (users?.length > 0) exportUsersToExcel(users, 'dashboard_users_export');
  };

  /* ── Helpers ── */
  const avatarGradients = [
    'from-violet-400 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-sky-400 to-blue-500',
    'from-fuchsia-400 to-purple-500',
  ];
  const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';

  /* ── Skeleton ── */
  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-14 h-5 rounded-full bg-slate-100" />
      </div>
      <div className="h-7 w-24 bg-slate-100 rounded-lg mb-2" />
      <div className="h-3 w-20 bg-slate-100 rounded-full" />
    </div>
  );

  /* ────────────────────────────────────────── */
  return (
    <div className="min-h-screen  dark:bg-[#0f1117] font-sans">
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              Welcome back! Here&apos;s what&apos;s happening.
            </p>
          </div>

          {/* Tabs */}
          {/* <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] w-full sm:w-auto">
            {['overview', 'users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {tab === 'overview' ? '⊞ Overview' : '👥 Users'}
              </button>
            ))}
          </div> */}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* ── TOP STAT CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {loading
                ? Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)
                : topStats.map((stat, i) => (
                  <div
                    key={i}
                    className="group bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5
                      shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none
                      dark:border dark:border-slate-700/60
                      hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1
                      transition-all duration-300 overflow-hidden relative"
                  >
                    {/* top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                      style={{ background: stat.accent }}
                    />

                    {/* icon + trend */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${stat.iconBg} dark:bg-slate-700 flex items-center justify-center`}>
                        <stat.icon className={`text-lg ${stat.iconColor}`} />
                      </div>
                      <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full
                        ${stat.trendUp
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400'}`}
                      >
                        {stat.trendUp ? <RiArrowUpLine /> : <RiArrowDownLine />}
                        {stat.trend}
                      </span>
                    </div>

                    {/* value + label */}
                    <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tabular-nums leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide mb-3">
                      {stat.label}
                    </p>

                    {/* mini bar chart */}
                    <div className="flex justify-end">
                      <MiniBarChart color={stat.barColor} bars={stat.bars} />
                    </div>
                  </div>
                ))
              }
            </div>

            {/* ── WALLET CARDS + DONUT ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

              {/* wallet card 1 */}
              {walletCards.map((card, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl bg-gradient-to-br ${card.gradient}
                    p-6 sm:p-7 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.14)]
                    group hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]
                    transition-all duration-300`}
                >
                  {/* card decorations */}
                  <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-2 right-2 w-20 h-20 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-700" />

                  {/* chip dots row */}
                  <div className="flex items-center gap-1.5 mb-5">
                    <div className="w-7 h-5 rounded bg-yellow-300/80" />
                    <div className="w-5 h-5 rounded-full bg-white/30" />
                    <span className="ml-2 text-xs text-white/70 font-semibold tracking-widest uppercase">{card.chipText}</span>
                  </div>

                  <p className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight leading-none mb-2">
                    {card.value}
                  </p>
                  <p className="text-sm text-white/75 font-medium mb-4">{card.label}</p>

                  {/* card dots */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="w-5 h-2 rounded-full bg-white/30" />
                      ))}
                    </div>
                    <svg className="opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" width="32" height="32" viewBox="0 0 48 48" fill="none">
                      <path d="M6 24L42 6L30 42L22 28L6 24Z" fill="white" fillOpacity="0.9" />
                      <path d="M22 28L30 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              ))}

              {/* donut — Total Revenue summary */}
              {/* <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6
                shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:border dark:border-slate-700/60
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300
                flex flex-col justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1">ROI Wallet</p>
                  <p className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">
                    ${fmt(apiData?.totalROIWallet) || '82k'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Total ROI Wallet</p>
                </div>
                <div className="flex items-center gap-5">
                  <DonutChart pct={75} color="#14b8a6" size={72} stroke={9} />
                  <div className="space-y-2 flex-1">
                    {[
                      { label: 'Business', pct: 75, col: 'bg-teal-500' },
                      { label: 'Income', pct: 58, col: 'bg-violet-500' },
                      { label: 'Deposit', pct: 42, col: 'bg-indigo-400' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{item.label}</span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{item.pct}%</span>
                        </div>
                        <ProgressBar pct={item.pct} color={item.col} />
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>

            {/* ── BOTTOM STAT CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {loading
                ? Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)
                : bottomStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5
                      shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:border dark:border-slate-700/60
                      hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] hover:-translate-y-0.5
                      transition-all duration-200"
                  >
                    <div className={`w-9 h-9 rounded-xl ${stat.dotCol.replace('bg-', 'bg-').replace('500', '50')} dark:bg-slate-700 flex items-center justify-center mb-3`}>
                      <stat.icon className={`text-base ${stat.dotCol.replace('bg-', 'text-')}`} />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tabular-nums leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide mb-2">
                      {stat.label}
                    </p>
                    <ProgressBar pct={stat.pct} color={stat.barCol} />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 text-right">{stat.pct}%</p>
                  </div>
                ))
              }
            </div>

            {/* ── MAIN GRID: Users table + Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

              {/* Users search */}
              {/* <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl
                shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:border dark:border-slate-700/60 overflow-hidden">
                <AllUsersSearch onExport={handleExport} />
              </div> */}

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl
                shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:border dark:border-slate-700/60
                flex flex-col overflow-hidden">

                {/* header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                        <RiTimeLine className="text-violet-500 text-base" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-white">Today Income</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                      Live
                    </span>
                  </div>
                </div>

                {/* list */}
                <div className="flex-1 overflow-y-auto max-h-[400px] divide-y divide-slate-50 dark:divide-slate-700/40">
                  {loading
                    ? Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-28 bg-slate-100 dark:bg-slate-700 rounded-full" />
                          <div className="h-2.5 w-36 bg-slate-100 dark:bg-slate-700 rounded-full" />
                        </div>
                        <div className="h-5 w-12 bg-slate-100 dark:bg-slate-700 rounded-full" />
                      </div>
                    ))
                    : displayedActivity.map((activity, idx) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 px-4 py-3.5
                          hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150"
                      >
                        {/* avatar */}
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]}
                          flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-[11px] font-black text-white leading-none">
                            {getInitials(activity.user)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">
                            {activity.user}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{activity.action}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg font-semibold whitespace-nowrap flex-shrink-0">
                          {activity.time}
                        </span>
                      </div>
                    ))
                  }
                </div>

                {/* footer */}
                {displayActivity.length > 6 && (
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      onClick={() => setShowAllActivity(!showAllActivity)}
                      className="w-full py-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 tracking-wide transition-colors"
                    >
                      {showAllActivity ? '↑ Show Less' : 'View All Activity →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl
            shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:border dark:border-slate-700/60 overflow-hidden">
            <AllUsersSearch onExport={handleExport} />
          </div>
        )}

      </div>
    </div>
  );
}