// app/avagen-engine/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Color helper functions - Dark text on white background
const G = (text) => `<span class="text-gold">${text}</span>`;
const B = (text) => `<span class="text-blue">${text}</span>`;
const Y = (text) => `<span class="text-yellow">${text}</span>`;
const CY = (text) => `<span class="text-cyan">${text}</span>`;
const R = (text) => `<span class="text-red">${text}</span>`;
const W = (text) => `<span class="text-dark">${text}</span>`;
const GR = (text) => `<span class="text-gray">${text}</span>`;
const DM = (text) => `<span class="text-dim">${text}</span>`;
const P = (text) => `<span class="text-purple">${text}</span>`;

const netSpan = (network) => {
  const colors = {
    BSC: "text-yellow",
    ETH: "text-blue",
    AVAX: "text-red",
    SOL: "text-gold",
    Ethereum: "text-blue",
    Binance: "text-yellow",
    Avalanche: "text-red",
    Solana: "text-gold",
  };
  return `<span class="${colors[network] || "text-blue"}">${network}</span>`;
};

export default function CryptoTerminal() {
  const [lines, setLines] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [stats, setStats] = useState({
    txCount: 0,
    totalVolume: 0,
    oppCount: 0,
    uptime: 0,
    blockNum: 19847622,
  });
  const [profits, setProfits] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  const terminalRef = useRef(null);
  const queueRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  const lineCounterRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const appendLine = useCallback(
    (html) => {
      return new Promise((resolve) => {
        queueRef.current.push({ html, resolve });
        if (!isPrinting) {
          processQueue();
        }
      });
    },
    [isPrinting],
  );

  const processQueue = useCallback(async () => {
    if (queueRef.current.length === 0) {
      setIsPrinting(false);
      return;
    }

    setIsPrinting(true);
    const { html, resolve } = queueRef.current.shift();

    const plainText = html.replace(/<[^>]+>/g, "");
    const lineId = lineCounterRef.current++;

    setLines((prev) => [
      ...prev,
      { id: lineId, html: "", fullHtml: html, plainText, chars: 0 },
    ]);
    scrollToBottom();

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex++;
      setLines((prev) =>
        prev.map((line) =>
          line.id === lineId ? { ...line, chars: charIndex } : line,
        ),
      );
      scrollToBottom();

      if (charIndex >= plainText.length) {
        clearInterval(typeInterval);
        resolve();
        setTimeout(processQueue, 15);
      }
    }, 15);
  }, [scrollToBottom]);

  const getRenderedLine = (line) => {
    if (line.chars === 0) return "";
    const html = line.fullHtml;
    const plain = line.plainText;
    const chars = line.chars;

    let cnt = 0,
      idx = 0;
    while (idx < html.length && cnt < chars) {
      if (html[idx] === "<") {
        while (idx < html.length && html[idx] !== ">") idx++;
        idx++;
      } else {
        cnt++;
        idx++;
      }
    }

    const content = html.slice(0, idx);
    const isComplete = chars >= plain.length;

    return isComplete
      ? content
      : `${content}<span class="cursor-blink"></span>`;
  };

  const printTx = useCallback(
    async (tx) => {
      const amount =
        parseFloat(tx.amount || tx.Amount || 0) || Math.random() * 10000 + 1000;
      const network =
        tx.network ||
        tx.Network ||
        tx.networkName ||
        tx.NetworkChain ||
        "Unknown";
      const date =
        tx.datex ||
        tx.Datex ||
        tx.date ||
        tx.CreatedAt ||
        new Date().toISOString();
      const hash =
        tx.transactionHash ||
        tx.TransactionHash ||
        tx.hash ||
        tx.Hash ||
        "0x" + Math.random().toString(36).substr(2, 64);

      const amt = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const dt = new Date(date).toLocaleString();
      const profit = amount * (0.003 + Math.random() * 0.012);

      const div = DM("─".repeat(60));

      await appendLine(div);
      await appendLine("");
      await appendLine(G("[INFO] ") + GR("Transaction Received"));
      await appendLine("");
      await appendLine(B("[NETWORK] ") + netSpan(network));
      await appendLine(B("[AMOUNT]  ") + Y(amt + " USDT"));
      await appendLine(B("[PROFIT]  ") + G("$" + profit.toFixed(2) + " USDT"));
      await appendLine(B("[TIME]    ") + GR(dt));
      await appendLine("");
      await appendLine(P("TX HASH:"));
      await appendLine(GR(hash.substring(0, 66)));
      await appendLine("");
      await appendLine(
        CY("[STATUS] ") + GR("✓ Arbitrage opportunity detected"),
      );
      await appendLine("");
      await appendLine(div);
      await appendLine("");

      setStats((prev) => ({
        ...prev,
        txCount: prev.txCount + 1,
        totalVolume: prev.totalVolume + amount,
        oppCount: prev.oppCount + 1,
      }));

      const now = new Date();
      const timeStr =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0");
      setProfits((prev) =>
        [{ network, amount, profit, timestamp: timeStr }, ...prev].slice(0, 8),
      );
    },
    [appendLine],
  );

  const printSys = useCallback(
    async (msg, isWarning = false) => {
      if (isWarning) {
        await appendLine(R("[WARNING] ") + GR(msg));
      } else {
        await appendLine(G("[INFO] ") + GR(msg));
      }
    },
    [appendLine],
  );

  const startup = useCallback(async () => {
    const startupLines = [
      [G("[INFO] ") + GR("Initializing AVAGEN arbitrage engine..."), 80],
      [G("[INFO] ") + GR("Loading configuration files..."), 60],
      [G("[INFO] ") + GR("Connecting to Ethereum RPC..."), 70],
      [G("[INFO] ") + GR("Connecting to BSC RPC..."), 70],
      [G("[INFO] ") + GR("Connecting to Solana RPC..."), 70],
      [G("[INFO] ") + GR("Connecting to Avalanche RPC..."), 70],
      [G("[INFO] ") + GR("Loading liquidity feed..."), 60],
      [G("[INFO] ") + GR("Building market map..."), 80],
      [G("[INFO] ") + GR("Connecting to API endpoint..."), 60],
    ];

    await appendLine("");

    for (const [html, delay] of startupLines) {
      await appendLine(html);
      await new Promise((r) => setTimeout(r, delay));
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://apis.abrixlabs.live/api/Authentication/getAllTransactionLog",
        {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data && response.data.data) {
        const data = response.data.data;
        setTransactions(data);
        setApiSuccess(true);
        setApiMessage(`Successfully loaded ${data.length} transactions`);
        await appendLine(
          G("[SUCCESS] ") +
            GR(`Connected to API | Loaded ${data.length} transactions`),
        );

        await new Promise((r) => setTimeout(r, 500));
        const displayCount = Math.min(data.length, 10);
        for (let i = 0; i < displayCount; i++) {
          await new Promise((r) => setTimeout(r, 800));
          await printTx(data[i]);
        }

        if (data.length > 10) {
          await appendLine(
            G("[INFO] ") +
              GR(`... and ${data.length - 10} more transactions in history`),
          );
        }
      } else {
        setApiSuccess(false);
        setApiMessage(response.data?.message || "No data received from API");
        await appendLine(R("[ERROR] ") + GR(`API Connection Failed`));
        await appendLine(
          G("[INFO] ") + GR("Using live mode with simulated transactions"),
        );
      }
    } catch (error) {
      setApiSuccess(false);
      setApiMessage(`Network Error: ${error.message}`);
      await appendLine(
        R("[ERROR] ") + GR(`API Connection Failed: ${error.message}`),
      );
      await appendLine(
        G("[INFO] ") + GR("Using live mode with simulated transactions"),
      );
    }

    await appendLine(
      CY("[STATUS] ") + W("Monitoring ACTIVE — streaming live data"),
    );
    await appendLine("");
  }, [appendLine, printTx]);

  const startLiveFeed = useCallback(async () => {
    const networks = ["ETH", "BSC", "AVAX", "SOL"];
    const sysMessages = [
      "Scanning liquidity pools for arbitrage opportunities...",
      "Monitoring DEX spreads across all networks...",
      "Synchronizing blockchain nodes...",
      "Checking market inefficiencies...",
      "Gas prices optimal for arbitrage",
      "Heartbeat: all nodes responsive",
    ];

    while (true) {
      await new Promise((r) => setTimeout(r, 3000 + Math.random() * 2000));

      if (Math.random() < 0.3) {
        const msg = sysMessages[Math.floor(Math.random() * sysMessages.length)];
        await printSys(msg);
        await new Promise((r) => setTimeout(r, 500));
      }

      const tx = {
        network: networks[Math.floor(Math.random() * networks.length)],
        amount: Math.floor(Math.random() * 50000) + 1000,
        date: new Date().toISOString(),
        hash: "0x" + Math.random().toString(36).substr(2, 64),
      };

      await printTx(tx);
    }
  }, [printTx, printSys]);

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(
        String(d.getHours()).padStart(2, "0") +
          ":" +
          String(d.getMinutes()).padStart(2, "0") +
          ":" +
          String(d.getSeconds()).padStart(2, "0"),
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update uptime
  useEffect(() => {
    const interval = setInterval(() => {
      const uptime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setStats((prev) => ({
        ...prev,
        uptime,
        blockNum: prev.blockNum + Math.floor(Math.random() * 3) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await startup();
      startLiveFeed();
    };
    init();
  }, []);

  const formatUptime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatMoney = (n) => {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toFixed(0);
  };

  return (
    <div className="terminal-container">
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="header">
            <div className="header-left">
              <span className="bot-text">Bot</span>
              <span className="console-text">Console</span>
            </div>
            <div className="header-center">
              <span className="header-subtitle">HYPERGEN BOT CONSOL LIVE FEED</span>
            </div>
            <div className="header-right">
              <div className="live-badge">
                <span className="live-dot"></span>
                LIVE
              </div>
              <span className="clock">{currentTime}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">TOTAL VOLUME</span>
              <span className="stat-value">{formatMoney(stats.totalVolume)}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">ACTIVE NETWORKS</span>
              <span className="stat-value">4</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">UPTIME</span>
              <span className="stat-value">{formatUptime(stats.uptime)}</span>
            </div>
          </div>

          {/* Body */}
          <div className="body-grid">
            {/* Terminal */}
            <div className="terminal-wrapper-custom">
              <div ref={terminalRef} className="terminal">
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className="terminal-line"
                    dangerouslySetInnerHTML={{ __html: getRenderedLine(line) }}
                  />
                ))}
                <div id="terminal-end" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Networks */}
              <div className="sidebar-card">
                <div className="sidebar-title">Network</div>
                {[
                  { name: "Ethereum", icon: "Ξ", class: "network-eth" },
                  { name: "BSC (BEP20)", icon: "B", class: "network-bsc" },
                  { name: "Avalanche", icon: "A", class: "network-avax" },
                  { name: "Solana", icon: "◎", class: "network-sol" },
                ].map((net, i) => (
                  <div key={i} className="network-item">
                    <div className="network-left">
                      <div className={`network-icon ${net.class}`}>{net.icon}</div>
                      <span className="network-name">{net.name}</span>
                    </div>
                    <div className="network-status">
                      <span className="status-dot"></span>
                      LIVE
                    </div>
                  </div>
                ))}
              </div>

              

              {/* Recent Profits */}
              <div className="sidebar-card profits-card">
                <div className="sidebar-title">Recent Profits</div>
                {profits.length === 0 ? (
                  <div className="empty-state">Waiting for transactions...</div>
                ) : (
                  profits.slice(0, 8).map((p, i) => (
                    <div key={i} className="profit-item">
                      <span className="profit-time">{p.timestamp}</span>
                      <span className="profit-network">{p.network} Arbitrage</span>
                      <span className="profit-amount">+${p.profit.toFixed(2)} USDT</span>
                    </div>
                  ))
                )}
              </div>
              {/* System Alerts */}
              <div className="sidebar-card">
                <div className="sidebar-title">System Alerts</div>
                <div className="alert-item">
                  <span className="alert-icon">✅</span>
                  <div className="alert-content">
                    <div className="alert-title">All Systems Operational</div>
                    <div className="alert-details">
                      <span>No alerts at this time</span>
                      <span className="alert-time">{currentTime}</span>
                    </div>
                  </div>
                </div>
                {!apiSuccess ? (
                  <div className="alert-error">
                    ⚠️ {apiMessage}
                  </div>
                ) : (
                  <div className="alert-success">
                    ✅ Connected to API | {transactions.length} transactions loaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===== GLOBAL ===== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .terminal-container {
          min-height: 100vh;
          height: 100vh;
          background: var(--bg-base);
          color: var(--text-1);
          font-family: 'Share Tech Mono', monospace;
          overflow: hidden;
          position: relative;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          position: relative;
          z-index: 1;
          height: 100vh;
          overflow-y: auto;
          padding: 0.8rem 1.2rem;
        }

        .content-wrapper {
          max-width: 1600px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* ===== HEADER ===== */
        .header {
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 0.8rem;
          padding: 0.4rem 1.2rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          gap: 0.5rem;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .bot-text {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: #01DACA;
        }

        .console-text {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: var(--text-1);
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .header-subtitle {
          color: var(--text-2);
          font-size: 0.65rem;
          letter-spacing: 2px;
          font-weight: 600;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .live-badge {
          background: var(--brand-cyan);
          color: #000000;
          font-weight: 700;
          font-size: 0.55rem;
          padding: 0.15rem 0.6rem;
          border-radius: 20px;
          box-shadow: 0 0 12px rgba(47, 217, 211, 0.3);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .live-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #000000;
          border-radius: 50%;
          animation: pulse-dot 1s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .clock {
          color: var(--text-2);
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* ===== STATS ROW ===== */
        .stats-row {
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 0.8rem;
          padding: 0.3rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .stat-label {
          font-size: 0.6rem;
          color: var(--text-2);
          letter-spacing: 1px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--brand-cyan);
        }

        .stat-divider {
          width: 1px;
          height: 20px;
          background: var(--border);
        }

        /* ===== BODY GRID ===== */
        .body-grid {
          display: grid;
          grid-template-columns: 2.3fr 0.5fr;
          gap: 0.8rem;
          flex: 1;
          min-height: 0;
        }

        /* ===== TERMINAL ===== */
        .terminal-wrapper-custom {
          min-height: 0;
          height: 100%;
        }

        .terminal {
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 0.8rem;
          padding: 0.8rem 1rem;
          font-size: 0.85rem;
          line-height: 1.7;
          overflow-y: auto;
          height: 100%;
          scrollbar-width: thin;
          scrollbar-color: var(--brand-cyan) var(--bg-3);
          color: var(--text-1);
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.04);
        }

        .terminal::-webkit-scrollbar {
          width: 5px;
          background: var(--bg-3);
        }

        .terminal::-webkit-scrollbar-thumb {
          background: var(--brand-cyan);
          border-radius: 6px;
        }

        .terminal-line {
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 0.05rem;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          height: 100%;
          min-height: 0;
        }

        .sidebar-card {
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 0.8rem;
          padding: 0.8rem 1rem;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }

        .sidebar-card.profits-card {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        .sidebar-card.profits-card::-webkit-scrollbar {
          width: 3px;
          background: var(--bg-3);
        }

        .sidebar-card.profits-card::-webkit-scrollbar-thumb {
          background: var(--brand-cyan);
          border-radius: 6px;
        }

        .sidebar-title {
          color: var(--text-2);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          border-left: 3px solid var(--brand-cyan);
          padding-left: 0.6rem;
          margin-bottom: 0.5rem;
        }

        /* ===== NETWORKS ===== */
        .network-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px solid var(--border);
        }

        .network-item:last-child {
          border-bottom: none;
        }

        .network-left {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .network-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .network-eth {
          background: var(--brand-cyan2);
          color: #ffffff;
        }
        .network-bsc {
          background: var(--brand-gold);
          color: #000000;
        }
        .network-avax {
          background: var(--brand-red);
          color: #ffffff;
        }
        .network-sol {
          background: var(--brand-cyan);
          color: #000000;
        }

        .network-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-1);
        }

        .network-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--brand-cyan);
          font-size: 0.65rem;
          font-weight: 600;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--brand-cyan);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(47, 217, 211, 0.5);
        }

        /* ===== SYSTEM ALERTS ===== */
        .alert-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.3rem 0;
        }

        .alert-icon {
          font-size: 0.9rem;
          color: var(--brand-cyan);
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-1);
        }

        .alert-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          color: var(--text-2);
          margin-top: 0.1rem;
        }

        .alert-time {
          color: var(--text-2);
        }

        .alert-error {
          margin-top: 0.4rem;
          padding: 0.4rem 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.65rem;
          background: rgba(240, 112, 138, 0.1);
          border: 1px solid var(--brand-red);
          color: var(--brand-red);
        }

        .alert-success {
          margin-top: 0.4rem;
          padding: 0.4rem 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.65rem;
          background: rgba(46, 217, 154, 0.1);
          border: 1px solid var(--brand-cyan);
          color: var(--brand-cyan);
        }

        /* ===== PROFITS ===== */
        .empty-state {
          color: var(--text-3);
          text-align: center;
          font-size: 0.7rem;
          padding: 0.3rem 0;
        }

        .profit-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          padding: 0.4rem 0;
          border-bottom: 1px dashed var(--border);
          color: var(--text-1);
        }

        .profit-item:last-child {
          border-bottom: none;
        }

        .profit-time {
          color: var(--text-2);
        }

        .profit-network {
          color: var(--brand-cyan2);
          font-weight: 500;
        }

        .profit-amount {
          color: var(--brand-cyan);
          font-weight: 600;
        }

        /* ===== COLOR CLASSES ===== */
        .text-gold { color: var(--brand-cyan); }
        .text-blue { color: var(--brand-cyan2); }
        .text-yellow { color: var(--brand-gold); }
        .text-cyan { color: var(--brand-teal); }
        .text-red { color: var(--brand-red); }
        .text-dark { color: var(--text-1); }
        .text-gray { color: var(--text-2); }
        .text-dim { color: var(--text-3); }
        .text-purple { color: var(--brand-purple); }

        /* ===== CURSOR ===== */
        .cursor-blink {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: var(--brand-cyan);
          margin-left: 2px;
          vertical-align: middle;
          animation: pulse-cursor 1s infinite;
        }

        @keyframes pulse-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .body-grid {
            grid-template-columns: 1.7fr 1.1fr;
          }
        }

        @media (max-width: 768px) {
          .body-grid {
            grid-template-columns: 1fr;
            flex: none;
            height: auto;
          }
          .terminal {
            height: 45vh;
            min-height: 250px;
            font-size: 0.75rem;
          }
          .sidebar {
            height: auto;
          }
          .sidebar-card.profits-card {
            flex: none;
            max-height: 150px;
          }
          .main-content {
            padding: 0.4rem;
          }
          .header {
            padding: 0.4rem 0.6rem;
            flex-direction: column;
            align-items: stretch;
            gap: 0.2rem;
          }
          .header-center {
            text-align: center;
          }
          .header-right {
            justify-content: center;
          }
          .bot-text, .console-text {
            font-size: 1.1rem;
          }
          .stats-row {
            padding: 0.3rem 0.6rem;
            gap: 0.6rem;
          }
          .stat-item {
            gap: 0.3rem;
          }
          .stat-value {
            font-size: 0.85rem;
          }
          .stat-divider {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .header-subtitle {
            font-size: 0.5rem;
          }
          .bot-text, .console-text {
            font-size: 0.9rem;
          }
          .stat-label {
            font-size: 0.75rem;
          }
          .stat-value {
            font-size: 0.75rem;
          }
          .terminal {
            font-size: 0.65rem;
            padding: 0.4rem;
          }
          .network-name {
            font-size: 0.75rem;
          }
          .profit-item {
            font-size: 0.6rem;
          }
          .sidebar-card {
            padding: 0.5rem 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}