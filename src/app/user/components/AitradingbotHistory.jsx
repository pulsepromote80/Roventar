"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  History,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  Calendar,
  Bot,
  Wallet,
  DollarSign,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getRechargetransactionHIstory } from "@/app/redux/slices/fundManagerSlice";
import { getUserId } from "@/app/api/auth";

/* =========================
   STYLES WITH LIGHT & DARK MODE
========================= */

const styles = `
  /* ===== CSS VARIABLES - LIGHT MODE (Default) ===== */
  :root {
    --sb-text-1: #0f172a;
    --sb-text-2: #475569;
    --sb-text-3: #94a3b8;
    --sb-border: #e2e8f0;
    --sb-border-2: #cbd5e1;
    --sb-bg-1: #ffffff;
    --sb-bg-2: #f8fafc;
    --sb-bg-hover: #f1f5f9;
    --sb-blue: #2563eb;
    --sb-blue-light: #dbeafe;
    --sb-blue-dark: #1d4ed8;
    --sb-green: #22c55e;
    --sb-green-light: #dcfce7;
    --sb-red: #ef4444;
    --sb-red-light: #fee2e2;
    --sb-purple: #9333ea;
    --sb-purple-light: #f3e8ff;
    --sb-orange: #f97316;
    --sb-orange-light: #fff7ed;
    --sb-yellow: #eab308;
    --sb-yellow-light: #fefce8;
    --sb-amber: #f59e0b;
    --sb-amber-light: #fef3c7;
    --sb-shadow: 0 1px 3px rgba(0,0,0,0.1);
    --sb-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
    --sb-shadow-modal: 0 25px 50px -12px rgba(0,0,0,0.25);
    --sb-radius: 16px;
    --sb-radius-sm: 8px;
    --sb-transition: 0.3s ease;
    --sb-bg-overlay: rgba(0,0,0,0.5);
  }

  /* ===== DARK MODE ===== */
  [data-theme="dark"] {
    --sb-text-1: #f1f5f9;
    --sb-text-2: #cbd5e1;
    --sb-text-3: #94a3b8;
    --sb-border: #334155;
    --sb-border-2: #475569;
    --sb-bg-1: #1e293b;
    --sb-bg-2: #0f172a;
    --sb-bg-hover: #334155;
    --sb-blue: #60a5fa;
    --sb-blue-light: #1e3a5f;
    --sb-blue-dark: #3b82f6;
    --sb-green: #4ade80;
    --sb-green-light: #14532d;
    --sb-red: #f87171;
    --sb-red-light: #7f1d1d;
    --sb-purple: #a78bfa;
    --sb-purple-light: #2e1065;
    --sb-orange: #fb923c;
    --sb-orange-light: #431407;
    --sb-yellow: #facc15;
    --sb-yellow-light: #422006;
    --sb-amber: #fbbf24;
    --sb-amber-light: #451a03;
    --sb-shadow: 0 1px 3px rgba(0,0,0,0.3);
    --sb-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.4);
    --sb-shadow-modal: 0 25px 50px -12px rgba(0,0,0,0.5);
    --sb-bg-overlay: rgba(0,0,0,0.7);
  }

  /* ===== BASE ===== */
  * {
    transition: background-color var(--sb-transition), 
                color var(--sb-transition), 
                border-color var(--sb-transition),
                box-shadow var(--sb-transition);
  }

  .sb-container {
    min-height: 100vh;
    color: var(--sb-text-1);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  /* ===== SECTION ===== */
  .sb-section {
    padding: 16px 20px;
  }

  /* ===== STATS GRID ===== */
  .sb-stats-grid-top {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .sb-stat-card {
    background: var(--sb-bg-1);
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius);
    padding: 14px 16px;
    box-shadow: var(--sb-shadow);
    transition: all var(--sb-transition);
  }

  .sb-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--sb-shadow-lg);
  }

  .sb-stat-label {
    font-size: 11px;
    color: var(--sb-text-3);
    font-weight: 500;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sb-stat-value {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
  }

  .sb-stat-value-blue { color: var(--sb-blue); }
  .sb-stat-value-green { color: var(--sb-green); }
  .sb-stat-value-amber { color: var(--sb-amber); }
  .sb-stat-value-purple { color: var(--sb-purple); }

  .sb-stat-sub {
    font-size: 11px;
    color: var(--sb-text-3);
    margin: 2px 0 0 0;
  }

  /* ===== CARDS GRID ===== */
  .sb-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  /* ===== HISTORY CARD ===== */
  .sb-history-card {
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius);
    background: var(--sb-bg-1);
    box-shadow: var(--sb-shadow);
    transition: all var(--sb-transition);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .sb-history-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--sb-shadow-lg);
  }

  .sb-history-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 14px;
    border-bottom: 1px solid var(--sb-border);
    gap: 8px;
  }

  .sb-history-card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .sb-history-card-icon {
    display: flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .sb-icon-blue { background: var(--sb-blue-light); }
  .sb-icon-green { background: var(--sb-green-light); }
  .sb-icon-purple { background: var(--sb-purple-light); }
  .sb-icon-orange { background: var(--sb-orange-light); }
  .sb-icon-yellow { background: var(--sb-yellow-light); }
  .sb-icon-red { background: var(--sb-red-light); }

  .sb-history-card-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin: 0;
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-history-card-subtitle {
    font-size: 10px;
    color: var(--sb-text-3);
    margin: 1px 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-history-card-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .sb-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sb-status-success { background: var(--sb-green); }
  .sb-status-pending { background: var(--sb-amber); animation: sb-pulse 1.5s ease-in-out infinite; }
  .sb-status-failed { background: var(--sb-red); }

  .sb-status-text-success { color: var(--sb-green); }
  .sb-status-text-pending { color: var(--sb-amber); }
  .sb-status-text-failed { color: var(--sb-red); }

  /* ===== CARD BODY ===== */
  .sb-history-card-body {
    padding: 12px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* ===== DETAIL ROWS ===== */
  .sb-history-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
  }

  .sb-history-detail-label {
    font-size: 10px;
    color: var(--sb-text-3);
    font-weight: 500;
  }

  .sb-history-detail-value {
    font-size: 12px;
    font-weight: 600;
    color: var(--sb-text-1);
  }

  .sb-history-detail-value-green {
    color: var(--sb-green);
  }

  .sb-history-detail-value-red {
    color: var(--sb-red);
  }

  .sb-history-detail-value-blue {
    color: var(--sb-blue);
  }

  .sb-history-detail-value-amber {
    color: var(--sb-amber);
  }

  /* ===== PACKAGE BADGE ===== */
  .sb-package-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
  }

  .sb-package-basic {
    background: var(--sb-blue-light);
    color: var(--sb-blue);
  }

  .sb-package-standard {
    background: var(--sb-purple-light);
    color: var(--sb-purple);
  }

  .sb-package-elite {
    background: var(--sb-orange-light);
    color: var(--sb-orange);
  }

  .sb-package-growth {
    background: var(--sb-green-light);
    color: var(--sb-green);
  }

  .sb-package-megabullx {
    background: var(--sb-amber-light);
    color: var(--sb-amber);
  }

  /* ===== BOTTOM STATS ===== */
  .sb-history-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
    border-radius: var(--sb-radius-sm);
    border: 1px solid var(--sb-border);
    margin-top: 4px;
  }

  .sb-history-stat-item {
    padding: 6px 4px;
    text-align: center;
  }

  .sb-history-stat-border {
    border-left: 1px solid var(--sb-border);
    border-right: 1px solid var(--sb-border);
  }

  .sb-history-stat-label {
    font-size: 9px;
    color: var(--sb-text-3);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .sb-history-stat-value {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-1);
    margin: 2px 0 0 0;
  }

  /* ===== FILTER BAR ===== */
  .sb-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: var(--sb-bg-1);
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius);
    box-shadow: var(--sb-shadow);
  }

  .sb-filter-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .sb-filter-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .sb-filter-input {
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    font-size: 13px;
    color: var(--sb-text-1);
    background: var(--sb-bg-1);
    min-width: 120px;
    transition: border-color var(--sb-transition);
  }

  .sb-filter-input:focus {
    outline: none;
    border-color: var(--sb-blue);
  }

  .sb-filter-select {
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    font-size: 13px;
    color: var(--sb-text-1);
    background: var(--sb-bg-1);
    min-width: 110px;
    cursor: pointer;
    transition: border-color var(--sb-transition);
  }

  .sb-filter-select:focus {
    outline: none;
    border-color: var(--sb-blue);
  }

  .sb-filter-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-1);
    color: var(--sb-text-1);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--sb-transition);
  }

  .sb-filter-btn:hover {
    background: var(--sb-bg-hover);
    border-color: var(--sb-border-2);
  }

  .sb-filter-btn-primary {
    background: var(--sb-blue);
    color: #fff;
    border-color: var(--sb-blue);
  }

  .sb-filter-btn-primary:hover {
    background: var(--sb-blue-dark);
    border-color: var(--sb-blue-dark);
  }

  /* ===== THEME TOGGLE BUTTON ===== */
  .sb-theme-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-1);
    color: var(--sb-text-1);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--sb-transition);
  }

  .sb-theme-toggle:hover {
    background: var(--sb-bg-hover);
    border-color: var(--sb-border-2);
  }

  .sb-theme-toggle-icon {
    width: 16px;
    height: 16px;
    color: var(--sb-amber);
  }

  /* ===== EMPTY STATE ===== */
  .sb-empty {
    text-align: center;
    padding: 40px 20px;
    background: var(--sb-bg-1);
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius);
    grid-column: 1 / -1;
  }

  .sb-empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .sb-empty-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin-bottom: 6px;
  }

  .sb-empty-subtitle {
    font-size: 13px;
    color: var(--sb-text-3);
  }

  /* ===== FOOTER ===== */
  .sb-footer {
    margin-top: 16px;
    padding: 10px 16px;
    border: 1px solid var(--sb-border);
    border-radius: 12px;
    background: var(--sb-bg-1);
    font-size: 11px;
    color: var(--sb-text-3);
  }

  .sb-footer-inner {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  @media (min-width: 768px) {
    .sb-footer-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .sb-footer-label {
    font-weight: 600;
    color: var(--sb-text-1);
  }

  .sb-footer-provider {
    font-weight: 600;
    color: var(--sb-blue);
  }

  /* ===== RESULTS COUNT ===== */
  .sb-results-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sb-results-text {
    font-size: 13px;
    color: var(--sb-text-3);
    margin: 0;
  }

  /* ===== LOADING ===== */
  .sb-loading {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background: var(--sb-bg-2);
  }

  .sb-loading-content {
    text-align: center;
  }

  .sb-loading-icon {
    font-size: 40px;
    margin-bottom: 16px;
  }

  .sb-loading-text {
    font-size: 18px;
    color: var(--sb-text-1);
  }

  /* ===== ANIMATIONS ===== */
  @keyframes sb-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .sb-tab-content {
    animation: sb-fadeIn 0.3s ease-out;
  }

  @keyframes sb-fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1200px) {
    .sb-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .sb-cards-grid {
      grid-template-columns: 1fr;
    }

    .sb-filter-bar {
      flex-direction: column;
    }
    
    .sb-filter-group {
      flex-direction: column;
      align-items: stretch;
    }
    
    .sb-filter-input,
    .sb-filter-select {
      min-width: unset;
      width: 100%;
    }

    .sb-stats-grid-top {
      grid-template-columns: 1fr 1fr;
    }

    .sb-history-stats-grid {
      grid-template-columns: 1fr;
    }

    .sb-history-stat-border {
      border: none;
      border-top: 1px solid var(--sb-border);
    }

    .sb-history-card-header {
      flex-wrap: wrap;
    }

    .sb-history-card-title {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .sb-stats-grid-top {
      grid-template-columns: 1fr;
    }

    .sb-section {
      padding: 12px;
    }

    .sb-stat-value {
      font-size: 18px;
    }

    .sb-history-card-body {
      padding: 10px 12px;
    }
  }
    /* ===== DETAILS CLEAN ===== */
.sb-details-clean {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 8px 10px;
  background: var(--sb-bg-2);
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-sm);
}

.sb-detail-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sb-detail-row:first-child {
  border-right: 1px solid var(--sb-border);
  padding-right: 10px;
}

.sb-detail-row:last-child {
  padding-left: 10px;
}

.sb-detail-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--sb-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sb-detail-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--sb-text-1);
}

@media (max-width: 400px) {
  .sb-details-clean {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  
  .sb-detail-row:first-child {
    border-right: none;
    padding-right: 0;
  }
  
  .sb-detail-row:last-child {
    padding-left: 0;
  }
}
`;

/* =========================
   HISTORY CARD COMPONENT
========================= */

function HistoryCard({ transaction, index }) {
  // Determine status - always "Active" for these transactions
  const getStatus = () => {
    return { label: 'Active', class: 'success' };
  };

  const status = getStatus();

  // Get package color based on PackageName
  const getPackageColor = (packageName) => {
    if (!packageName) return 'sb-package-basic';
    const name = packageName.toLowerCase();
    if (name.includes('start')) return 'sb-package-basic';
    if (name.includes('titan')) return 'sb-package-standard';
    if (name.includes('quantum')) return 'sb-package-elite';
    if (name.includes('megabull') || name.includes('mega bull')) return 'sb-package-megabullx';
    if (name.includes('growth')) return 'sb-package-growth';
    return 'sb-package-basic';
  };

  // Get icon background based on category name
  const getIconBg = (categoryName) => {
    if (!categoryName) return 'sb-icon-blue';
    const name = categoryName.toLowerCase();
    if (name.includes('scalper')) return 'sb-icon-blue';
    if (name.includes('forex')) return 'sb-icon-purple';
    if (name.includes('phantom') || name.includes('stealth') || name.includes('mario')) return 'sb-icon-orange';
    if (name.includes('sniper')) return 'sb-icon-green';
    if (name.includes('gold')) return 'sb-icon-yellow';
    return ['sb-icon-blue', 'sb-icon-green', 'sb-icon-purple', 'sb-icon-orange', 'sb-icon-yellow'][index % 5];
  };

  // Get bot icon based on category name
  const getBotIcon = (categoryName) => {
    if (!categoryName) return '🤖';
    const name = categoryName.toLowerCase();
    if (name.includes('scalper')) return '🤖';
    if (name.includes('forex')) return '🧠';
    if (name.includes('phantom') || name.includes('stealth')) return '🥷';
    if (name.includes('sniper')) return '🎯';
    if (name.includes('gold')) return '🪙';
    if (name.includes('mario')) return '🍄';
    return '🤖';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Date is in format "09-01-2026"
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[2], parts[1] - 1, parts[0]);
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    const num = parseFloat(amount);
    if (isNaN(num)) return `$${amount}`;
    return `$${num.toFixed(2)}`;
  };

  // Format ROI
  const formatROI = (roi) => {
    if (!roi && roi !== 0) return '0%';
    const num = parseFloat(roi);
    if (isNaN(num)) return `${roi}%`;
    return `${num.toFixed(2)}%`;
  };

  return (
    <div className="sb-history-card">
      {/* Card Header */}
      <div className="sb-history-card-header">
        <div className="sb-history-card-header-left">
          <div className={`sb-history-card-icon ${getIconBg(transaction.CategoryName)}`}>
            {getBotIcon(transaction.CategoryName)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 className="sb-history-card-title">
              {transaction.CategoryName || 'AI Bot'}
            </h3>
            <p className="sb-history-card-subtitle">
              {transaction.productName || transaction.CategoryName || 'Bot'}
            </p>
          </div>
        </div>
        <div className="sb-history-card-status">
          <span className={`sb-status-dot sb-status-${status.class}`} />
          <span className={`sb-status-text-${status.class}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="sb-history-card-body">
        {/* Amount */}
        <div className="sb-history-detail-row">
          <span className="sb-history-detail-label">Invested Amount</span>
          <span className="sb-history-detail-value sb-history-detail-value-green">
            {formatAmount(transaction.Rkprice)}
          </span>
        </div>



        <div className="sb-history-detail-row">
          <span className="sb-history-detail-label">Package Limit</span>
          <span>
            <span className={`sb-package-badge ${getPackageColor(transaction.PackageName)}`}>
              {transaction.PackageName ? transaction.PackageName.split(',')[0].trim() : 'Basic'}
            </span>
          </span>
        </div>



        {/* Details Section - Redesigned */}
        {/* Details Section - Simple Clean */}
        <div className="sb-details-clean">
          <div className="sb-detail-row">
            <span className="sb-detail-label">Activated By</span>
            <span className="sb-detail-value">
              {transaction.AuthLogin || 'Welcome'}
            </span>
          </div>

          <div className="sb-detail-row">
            <span className="sb-detail-label">Date</span>
            <span className="sb-detail-value">
              {formatDate(transaction.OrderDate)}
            </span>
          </div>
        </div>


        {/* Bottom Stats */}
        <div className="sb-history-stats-grid">
          <div className="sb-history-stat-item">
            <p className="sb-history-stat-label">APY</p>
            <p className="sb-history-stat-value" style={{ color: 'var(--sb-green)' }}>
              {/* {formatROI(transaction?.APY)} */}
              {transaction?.APY}
            </p>
          </div>
          <div className="sb-history-stat-item sb-history-stat-border">
            <p className="sb-history-stat-label">Status</p>
            <p className="sb-history-stat-value" style={{ color: 'var(--sb-green)' }}>
              Active
            </p>
          </div>
          <div className="sb-history-stat-item">
            <p className="sb-history-stat-label">Type</p>
            <p className="sb-history-stat-value" style={{ color: 'var(--sb-amber)' }}>
              {transaction.PackageName || 'Standard'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN HISTORY PAGE
========================= */

export default function InvestmentHistory() {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Inject styles
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Fetch transaction history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get userId from auth
        const userId = getUserId();

        // Call the API
        const result = await dispatch(getRechargetransactionHIstory()).unwrap();

        let historyData = [];

        if (result?.data && Array.isArray(result.data)) {
          historyData = result.data;
        } else if (Array.isArray(result)) {
          historyData = result;
        } else if (result?.transactions && Array.isArray(result.transactions)) {
          historyData = result.transactions;
        } else {
          // If data is wrapped in another structure
          const data = result?.data || result;
          if (Array.isArray(data)) {
            historyData = data;
          } else if (data && typeof data === 'object') {
            // Check if it's a single transaction object
            if (data.Rkprice !== undefined || data.CategoryName) {
              historyData = [data];
            }
          }
        }

        historyData = historyData.filter(item => item && typeof item === 'object' && (item.Rkprice !== undefined || item.CategoryName));
        setTransactions(historyData);

        if (historyData.length === 0) {
          console.log('No transaction data found in response');
        }
      } catch (err) {
        console.error('Error fetching investment history:', err);
        setError(err?.message || 'Failed to load investment history');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [dispatch]);

  // Filter transactions
  const filteredTransactions = transactions.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (item.CategoryName || '').toLowerCase().includes(searchLower) ||
      (item.productName || '').toLowerCase().includes(searchLower) ||
      (item.PackageName || '').toLowerCase().includes(searchLower) ||
      (item.AuthLogin || '').toLowerCase().includes(searchLower);

    const matchesPackage = packageFilter === 'all' ||
      (item.PackageName || '').toLowerCase().includes(packageFilter.toLowerCase());

    // All transactions are "Active" so status filter always matches
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active';

    return matchesSearch && matchesStatus && matchesPackage;
  });

  // Get unique packages for filter
  const getUniquePackages = () => {
    const packages = new Set();
    transactions.forEach(item => {
      if (item.PackageName) packages.add(item.PackageName);
    });
    return Array.from(packages);
  };

  // Calculate summary stats from the API data
  const getSummaryStats = () => {
    if (transactions.length === 0) {
      return {
        total: 0,
        count: 0,
        income: 0,
        limit: 0,
        remaining: 0
      };
    }

    // Use the summary data from the first transaction (all have same summary)
    const first = transactions[0];

    return {
      total: first.TotalInvestment || transactions.reduce((sum, item) => {
        const amount = parseFloat(item.Rkprice || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
      count: transactions.length,
      income: first.TotalIncome || 0,
      limit: first.EarningLimit || 0,
      remaining: first.RemainingLimit || 0
    };
  };

  const stats = getSummaryStats();

  if (loading) {
    return (
      <div className="sb-loading">
        <div className="sb-loading-content">
          <div className="sb-loading-icon">📊</div>
          <div className="sb-loading-text">Loading Investment History...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-container">
      <div className="sb-section">
        {/* Stats Grid */}
        <div className="sb-stats-grid-top">
          <div className="sb-stat-card">
            <p className="sb-stat-label">Active Bots</p>
            <p className="sb-stat-value sb-stat-value-blue">{stats.count}</p>
            <p className="sb-stat-sub">Bots</p>
          </div>
          <div className="sb-stat-card">
            <p className="sb-stat-label">Total Investment</p>
            <p className="sb-stat-value sb-stat-value-green">
              ${typeof stats.total === 'number' ? stats.total.toFixed(2) : '0.00'}
            </p>
            <p className="sb-stat-sub">User Investment</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sb-filter-bar">
          <div className="sb-filter-group">
            <span className="sb-filter-label">🔍 Search</span>
            <input
              className="sb-filter-input"
              placeholder="Search by bot, package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sb-filter-group">
            <span className="sb-filter-label">📦 Package</span>
            <select
              className="sb-filter-select"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
            >
              <option value="all">All Packages</option>
              {getUniquePackages().map(pkg => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
          <div className="sb-filter-group">
            <span className="sb-filter-label">📊 Status</span>
            <select
              className="sb-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="sb-results-count">
          <p className="sb-results-text">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
          <button className="sb-filter-btn" onClick={() => window.print()}>
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Cards Grid - 3 per row */}
        <div className="sb-cards-grid">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <HistoryCard
                key={transaction.id || transaction.transactionId || index}
                transaction={transaction}
                index={index}
              />
            ))
          ) : (
            <div className="sb-empty">
              <div className="sb-empty-icon">📭</div>
              <h3 className="sb-empty-title">No Transactions Found</h3>
              <p className="sb-empty-subtitle">
                {searchTerm || packageFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start investing in AI bots to see your history'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}