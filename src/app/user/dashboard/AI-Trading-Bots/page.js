"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Activity,
  Radio,
  BarChart3,
  Settings,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Zap,
  History,
  Clock,
  Sun,
  Moon,
  Eye,
  Download,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveProducts } from "@/app/redux/slices/productSlice";
import { getFundRequestReport, usernameByLoginId, addRechargeTransactionUser, getRechargetransactionHIstory } from "@/app/redux/slices/fundManagerSlice";
import { AuthLogin, getUserId } from "@/app/api/auth";
import { activeProducts, productLoading } from "@/app/(main)/admin/product/product-selectors";
import html2pdf from 'html2pdf.js';
import InvestmentHistory from "../../components/AitradingbotHistory";

/* =========================
   LIVE DATA HOOK - Binance WebSocket
========================= */

function useLiveMarket() {
  const [livePrice, setLivePrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketPrices, setMarketPrices] = useState({});
  const previousPriceRef = useRef(null);
  const priceHistoryRef = useRef([]);

  const generateLivePrice = (basePrice, symbol) => {
    const volatility = symbol === "XAU/USD" ? 0.002 : 0.001;
    const change = (Math.random() - 0.5) * volatility * basePrice;
    return basePrice + change;
  };

  useEffect(() => {
    const stream = "btcusdt@trade";
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);

      if (Number.isFinite(price)) {
        setLivePrice(price);
        setLastUpdate(Date.now());

        if (previousPriceRef.current) {
          const change = ((price - previousPriceRef.current) / previousPriceRef.current) * 100;
          setPriceChange(change);
        }
        previousPriceRef.current = price;

        setChartData((prev) => {
          const newData = [...prev, price];
          if (newData.length > 50) {
            return newData.slice(-50);
          }
          return newData;
        });

        setMarketPrices({
          "EUR/USD": {
            price: generateLivePrice(1.16642, "EUR/USD"),
            change: ((Math.random() - 0.5) * 0.2).toFixed(2),
            positive: Math.random() > 0.5,
          },
          "GBP/USD": {
            price: generateLivePrice(1.31867, "GBP/USD"),
            change: ((Math.random() - 0.5) * 0.25).toFixed(2),
            positive: Math.random() > 0.5,
          },
          "XAU/USD": {
            price: generateLivePrice(3523.41, "XAU/USD"),
            change: ((Math.random() - 0.5) * 0.3).toFixed(2),
            positive: Math.random() > 0.5,
          },
          "USD/JPY": {
            price: generateLivePrice(146.217, "USD/JPY"),
            change: ((Math.random() - 0.5) * 0.15).toFixed(2),
            positive: Math.random() > 0.5,
          },
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const fallbackInterval = setInterval(() => {
      if (!wsConnected) {
        const simulatedPrice = 43000 + (Math.random() - 0.5) * 200;
        setLivePrice(simulatedPrice);
        setLastUpdate(Date.now());

        setPriceChange((Math.random() - 0.5) * 0.5);

        setChartData((prev) => {
          const newData = [...prev, simulatedPrice];
          if (newData.length > 50) return newData.slice(-50);
          return newData;
        });

        setMarketPrices({
          "EUR/USD": {
            price: 1.16642 + (Math.random() - 0.5) * 0.005,
            change: ((Math.random() - 0.5) * 0.3).toFixed(2),
            positive: Math.random() > 0.5,
          },
          "GBP/USD": {
            price: 1.31867 + (Math.random() - 0.5) * 0.005,
            change: ((Math.random() - 0.5) * 0.3).toFixed(2),
            positive: Math.random() > 0.5,
          },
          "XAU/USD": {
            price: 3523.41 + (Math.random() - 0.5) * 10,
            change: ((Math.random() - 0.5) * 0.3).toFixed(2),
            positive: Math.random() > 0.5,
          },
          "USD/JPY": {
            price: 146.217 + (Math.random() - 0.5) * 0.5,
            change: ((Math.random() - 0.5) * 0.3).toFixed(2),
            positive: Math.random() > 0.5,
          },
        });
      }
    }, 3000);

    return () => clearInterval(fallbackInterval);
  }, [wsConnected]);

  return {
    livePrice,
    priceChange,
    chartData,
    wsConnected,
    lastUpdate,
    marketPrices,
  };
}

/* =========================
   BOT MAPPING CONFIGURATION
========================= */

const botConfig = {
  "SONIC SCALPER AI": {
    subtitle: "Scalping Strategy",
    icon: "🤖",
    iconBg: "sb-icon-blue",
    symbols: ["EUR/USD"],
    chartColor: "#2563eb",
    rsi: "62.4",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "EUR/USD",
    confidence: "82%",
    timeframe: "5M",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "Revolut AI": {
    subtitle: "Trend Following Strategy",
    icon: "🧠",
    iconBg: "sb-icon-purple",
    symbols: ["USD/JPY"],
    chartColor: "#9333ea",
    rsi: "58.7",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "USD/JPY",
    confidence: "76%",
    timeframe: "15M",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "Phantom Stealth AI": {
    subtitle: "Grid Trading Strategy",
    icon: "🥷",
    iconBg: "sb-icon-orange",
    symbols: ["GBP/USD"],
    chartColor: "#f97316",
    rsi: "45.3",
    macd: "Bearish",
    trend: "Sideways",
    signal: "SELL",
    signalSymbol: "GBP/USD",
    confidence: "64%",
    timeframe: "1H",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/lv/members/pg_forexoffecial/phantom-bot/12073391",
  },
  "Pip Sniper AI": {
    subtitle: "Breakout Strategy",
    icon: "🎯",
    iconBg: "sb-icon-green",
    symbols: ["EUR/USD"],
    chartColor: "#22c55e",
    rsi: "65.1",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "EUR/USD",
    confidence: "79%",
    timeframe: "15M",
    market: "Forex",
    risk: "Medium",
    myfxbookLink: "https://www.myfxbook.com/members/MT4Sniper/pip-sniper/9468462",
  },
  "Gold Rush AI": {
    subtitle: "Gold Trading Strategy",
    icon: "🪙",
    iconBg: "sb-icon-yellow",
    symbols: ["XAU/USD"],
    chartColor: "#eab308",
    rsi: "53.6",
    macd: "Bearish",
    trend: "Sideways",
    signal: "SELL",
    signalSymbol: "XAU/USD",
    confidence: "68%",
    timeframe: "15M",
    market: "Commodities",
    myfxbookLink: "https://www.myfxbook.com/members/FXEAMASTER/gold-rush/9875023",
  },


};

// Default config for unknown products
const defaultConfig = {
  subtitle: "AI Trading Strategy",
  icon: "🤖",
  iconBg: "sb-icon-blue",
  symbols: ["EUR/USD", "GBP/USD"],
  chartColor: "#2563eb",
  rsi: "50.0",
  macd: "Neutral",
  trend: "Sideways",
  signal: "BUY",
  signalSymbol: "EUR/USD",
  confidence: "50%",
  timeframe: "15M",
  market: "Forex",
  myfxbookLink: "https://www.myfxbook.com",
};


const getBotConfig = (productName) => {
  if (!productName) return defaultConfig;
  
  const searchName = productName.trim();
  

  if (botConfig[searchName]) {
    return botConfig[searchName];
  }
  

  const upperName = searchName.toUpperCase();
  for (const key of Object.keys(botConfig)) {
    if (key.toUpperCase() === upperName) {
      return botConfig[key];
    }
  }
  

  for (const key of Object.keys(botConfig)) {
    const keyUpper = key.toUpperCase();
    if (upperName.includes(keyUpper) || keyUpper.includes(upperName)) {
      return botConfig[key];
    }
  }
  
  // 4. Remove common words and match
  const cleanName = searchName.replace(/AI|BOT|STRATEGY|TRADING/gi, '').trim().toUpperCase();
  for (const key of Object.keys(botConfig)) {
    const cleanKey = key.replace(/AI|BOT|STRATEGY|TRADING/gi, '').trim().toUpperCase();
    if (cleanName === cleanKey) {
      return botConfig[key];
    }
  }
  
  // 5. Log karo ki match nahi mila
  console.log('❌ No match found for:', searchName);
  console.log('Available keys:', Object.keys(botConfig));
  
  return defaultConfig;
};


const mapApiDataToBots = (activeProducts) => {
  if (!activeProducts || !Array.isArray(activeProducts)) return [];


  const mappedBots = activeProducts.map((product) => {
    const config = getBotConfig(product.productName);

    return {
      id: product.productId,
      name: product.productName,
      subtitle: config.subtitle,
      icon: config.icon,
      iconBg: config.iconBg,
      symbols: config.symbols,
      chartColor: config.chartColor,
      rsi: config.rsi,
      macd: config.macd,
      trend: config.trend,
      signal: config.signal,
      signalSymbol: config.signalSymbol,
      confidence: config.confidence,
      timeframe: config.timeframe,
      market: config.market,
      myfxbookLink: config.myfxbookLink,
      risk: config.risk || "Medium",
      apr: `${product.roi}%`,
      winRate: `${product.winrate}%`,
      traders: product.traders?.toLocaleString() || "0",
      type: product.type,
      minInvest: product.mininvest,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      description: product.tittle,
    };
  });

  // Sort bots: Commodities (Gold) first, then Forex
  return mappedBots.sort((a, b) => {
    if (a.market === "Commodities" && b.market !== "Commodities") return -1;
    if (a.market !== "Commodities" && b.market === "Commodities") return 1;
    return 0;
  });
};



function MiniChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="sb-chart-placeholder">
        <span className="sb-chart-loading">Loading chart...</span>
      </div>
    );
  }

  const width = 300;
  const height = 90;
  const padding = 5;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sb-mini-chart">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sb-chart-line"
      />
    </svg>
  );
}

/* =========================
   MARKET ROW
========================= */

function MarketRow({ symbol, marketPrices, livePrice }) {
  const market = marketPrices?.[symbol];

  if (!market) {
    return (
      <div className="sb-market-row sb-market-loading">
        <span className="sb-market-symbol">{symbol}</span>
        <span className="sb-market-loading-text">Loading...</span>
      </div>
    );
  }

  const price = market.price;
  const change = parseFloat(market.change);
  const positive = market.positive;

  const formattedPrice = symbol === "XAU/USD"
    ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : price.toFixed(5);

  return (
    <div className="sb-market-row">
      <span className="sb-market-symbol">{symbol}</span>
      <span className="sb-market-price">${formattedPrice}</span>
      <span className={`sb-market-change ${positive ? "sb-change-positive" : "sb-change-negative"}`}>
        {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  );
}

/* =========================
   BOT CARD
========================= */

function BotCard({ bot, marketPrices, lastUpdate, chartData, livePrice, wsConnected, onInvest, onViewDetails }) {
  const isBuy = bot.signal === "BUY";
  const isConnected = wsConnected;

  return (
    <div className="sb-card">
      {/* Header */}
      <div className="sb-card-header">
        <div className="sb-card-header-left">
          <div className={`sb-card-icon ${bot.iconBg}`}>
            {bot.icon}
          </div>
          <div>
            <h2 className="sb-card-title">{bot.name}</h2>
            <p className="sb-card-subtitle">{bot.subtitle}</p>
          </div>
        </div>
        <div className="sb-card-status">
          <span className={`sb-status-dot ${isConnected ? 'sb-status-live' : 'sb-status-offline'}`} />
          <span className={isConnected ? 'sb-status-live-text' : 'sb-status-offline-text'}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="sb-card-body">
        <div className="sb-card-grid">
          {/* Left */}
          <div className="sb-card-left">
            <p className="sb-section-label">Live Market</p>
            <div className="sb-market-list">
              {bot.symbols.map((symbol) => (
                <MarketRow
                  key={symbol}
                  symbol={symbol}
                  marketPrices={marketPrices}
                  livePrice={livePrice}
                />
              ))}
            </div>

            <div className="sb-chart-label">
              {bot.signalSymbol} • {bot.timeframe} Chart
            </div>

            <MiniChart data={chartData.length > 0 ? chartData : bot.chart || []} />

            {/* Details */}
            <div className="sb-details-grid">
              <div className="sb-detail-item">
                <p className="sb-detail-label">Timeframe</p>
                <p className="sb-detail-value">{bot.timeframe}</p>
              </div>
              <div className="sb-detail-item sb-detail-border">
                <p className="sb-detail-label">Market</p>
                <p className="sb-detail-value">{bot.market}</p>
              </div>

            </div>
          </div>

          {/* Right */}
          <div className="sb-card-right">
            <p className="sb-strategy-label">Strategy Indicators</p>

            <div className="sb-indicators">
              <div className="sb-indicator-item">
                <span className="sb-indicator-label">RSI</span>
                <span className="sb-indicator-value">{bot.rsi}</span>
              </div>
              <div className="sb-indicator-item">
                <span className="sb-indicator-label">MACD</span>
                <span className={`sb-indicator-value ${bot.macd === "Bullish" ? "sb-indicator-bullish" : "sb-indicator-bearish"}`}>
                  {bot.macd}
                </span>
              </div>
              <div className="sb-indicator-item">
                <span className="sb-indicator-label">Trend</span>
                <span className={`sb-indicator-value ${bot.trend === "Uptrend" ? "sb-indicator-uptrend" :
                  bot.trend === "Downtrend" ? "sb-indicator-downtrend" : "sb-indicator-sideways"
                  }`}>
                  {bot.trend}
                </span>
              </div>
            </div>

            {/* Signal */}
            <p className="sb-signal-label">Signal</p>
            <div className={`sb-signal-box ${isBuy ? "sb-signal-buy" : "sb-signal-sell"}`}>
              <div className={`sb-signal-content ${isBuy ? "sb-signal-buy-text" : "sb-signal-sell-text"}`}>
                {isBuy ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {bot.signal}
              </div>
              <p className="sb-signal-symbol">{bot.signalSymbol}</p>
            </div>

            {/* Confidence */}
            <div className="sb-confidence">
              <span className="sb-confidence-label">Confidence</span>
              <span className={`sb-confidence-value ${isBuy ? "sb-confidence-buy" : "sb-confidence-sell"}`}>
                {bot.confidence}
              </span>
            </div>

            <div className="sb-last-update">
              <span className="sb-update-label">Last Update</span>
              <span className="sb-update-value">
                {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "--:--:--"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="sb-action-buttons">
              {/* View Details Button */}
              <button
                onClick={() => onViewDetails(bot)}
                className="sb-view-btn"
              >
                <Eye size={14} />
                View Details
              </button>

              {/* Invest Now Button */}
              <button
                onClick={() => onInvest(bot)}
                className="sb-invest-btn"
              >
                Invest Now
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="sb-stats-grid">
          <div className="sb-stat-item">
            <p className="sb-stat-label">Backtest APR</p>
            <p className="sb-stat-value">{bot.apr}</p>
          </div>
          <div className="sb-stat-item sb-stat-border">
            <p className="sb-stat-label">Win Rate</p>
            <p className="sb-stat-value">{bot.winRate}</p>
          </div>
          <div className="sb-stat-item">
            <p className="sb-stat-label">Demo Traders</p>
            <p className="sb-stat-value">{bot.traders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INVEST MODAL
========================= */

function InvestModal({ bot, onClose, onSubmit, walletBalance, isLoading }) {
  const dispatch = useDispatch();
  const [uid, setUid] = useState("");
  const [uname, setUname] = useState("");
  const [uerr, setUerr] = useState("");
  const [userURID, setUserURID] = useState("");
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (!uid.trim()) {
        setUname("");
        setUerr("");
        setUserURID("");
        setIsFetchingUser(false);
        return;
      }

      setIsFetchingUser(true);
      try {
        const result = await dispatch(usernameByLoginId(uid));

        if (result?.payload && result?.payload?.data?.name) {
          setUname(result.payload.data.name);
          setUserURID(result.payload.data.urid || result.payload.data.id || "");
          setUerr("");
        } else {
          setUname("");
          setUerr("Invalid User ID");
          setUserURID("");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUname("");
        setUerr("Error fetching user");
        setUserURID("");
      } finally {
        setIsFetchingUser(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [uid, dispatch]);

  const getInvestmentAmount = () => {
    const amount = customAmount && customAmount !== "" ? parseFloat(customAmount) : 0;
    return amount;
  };

  // Get max investment (always 14999)
  const getMaxInvestment = () => {
    return 14999;
  };

  // Get package name based on trading amount
  const getPackageNameByAmount = (amount) => {
    if (!amount || isNaN(amount)) return null;

    // Check if amount is within valid range
    if (amount < 100) return "Minimum $100 required";
    if (amount > 14999) return "Maximum $14,999 allowed";

    // Package determination based on trading amount
    if (amount >= 100 && amount <= 999) return "Basic";
    else if (amount >= 1000 && amount <= 4999) return "Standard";
    else if (amount >= 5000 && amount <= 9999) return "Elite";
    else if (amount >= 10000 && amount <= 14999) return "Growth";

    return null;
  };

  // Validate amount with new limits
  const validateAmount = (value) => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setAmountError("Please enter a valid amount");
      return false;
    }

    // Check minimum amount (100)
    if (numValue < 100) {
      setAmountError("Minimum investment amount is $100");
      return false;
    }

    // Check maximum amount (14,999)
    if (numValue > 14999) {
      setAmountError("Maximum investment amount is $14,999");
      return false;
    }

    if (numValue > walletBalance) {
      setAmountError(`Insufficient balance! Your wallet balance is $${walletBalance.toLocaleString()}`);
      return false;
    }

    setAmountError("");
    return true;
  };

  // Handle amount change with validation
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setCustomAmount("");
      setAmountError("");
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCustomAmount(numValue);
      validateAmount(numValue);
    }
  };

  const handleSubmit = () => {
    if (!uname) {
      setUerr("Please enter a valid User ID");
      return;
    }

    const investmentAmount = getInvestmentAmount();

    // Validate amount range
    if (investmentAmount < 100) {
      setAmountError("Minimum investment amount is $100");
      return;
    }

    if (investmentAmount > 14999) {
      setAmountError("Maximum investment amount is $14,999");
      return;
    }

    if (walletBalance < investmentAmount) {
      setAmountError(`Insufficient funds! Your wallet balance is $${walletBalance.toLocaleString()}`);
      return;
    }

    onSubmit({
      uid,
      uname,
      userURID,
      amount: investmentAmount,
      bot
    });
  };

  return (
    <div className="sb-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sb-modal">
        <div className="sb-modal-header">
          <div>
            <h3 className="sb-modal-title">Invest in {bot?.name}</h3>
            <p className="sb-modal-subtitle">Enter investment details below</p>
          </div>
          <button onClick={onClose} className="sb-modal-close">✕</button>
        </div>

        {/* Wallet Balance */}
        <div className="sb-modal-wallet">
          <div className="sb-modal-wallet-inner">
            <span className="sb-modal-wallet-label">Wallet Balance</span>
            <span className="sb-modal-wallet-value">${walletBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* User ID Input */}
        <div className="sb-modal-field">
          <label className="sb-modal-label">User ID *</label>
          <input
            className="sb-modal-input"
            placeholder="Enter User ID (e.g. R123445)"
            value={uid}
            onChange={e => setUid(e.target.value)}
          />
          {!uid.trim() ? (
            <div className="sb-modal-error">⚠ Please enter User ID</div>
          ) : isFetchingUser ? (
            <div className="sb-modal-info">⏳ Fetching user details...</div>
          ) : uname ? (
            <div className="sb-modal-success">✓ {uname}</div>
          ) : uerr ? (
            <div className="sb-modal-error">⚠ {uerr}</div>
          ) : null}
        </div>

        {/* Selected Bot */}
        <div className="sb-modal-field">
          <label className="sb-modal-label">Selected Bot</label>
          <div className="sb-modal-bot-display">
            <span>{bot?.icon || "🤖"}</span>
            <span className="sb-modal-bot-name">{bot?.name}</span>
          </div>
        </div>

        {/* Investment Amount */}
        <div className="sb-modal-field">
          <label className="sb-modal-label">Investment Amount (USD) *</label>
          <p className="sb-modal-helper">Min: $100 | Max: $14,999</p>
          <input
            type="number"
            step="1"
            className={`sb-modal-input ${amountError ? "sb-modal-input-error" : ""}`}
            placeholder="Enter amount between"
            value={customAmount}
            onChange={handleAmountChange}
          />
          {amountError ? (
            <div className="sb-modal-error">⚠ {amountError}</div>
          ) : customAmount && parseFloat(customAmount) >= 100 && parseFloat(customAmount) <= 14999 && (
            (() => {
              const packageName = getPackageNameByAmount(parseFloat(customAmount));
              if (packageName && !packageName.includes("Minimum") && !packageName.includes("Maximum")) {
                return (
                  <div className="sb-modal-package">
                    Package: <strong>{packageName}</strong>
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>

        <button
          className="sb-modal-submit"
          onClick={handleSubmit}
          disabled={
            !uname ||
            isLoading ||
            isFetchingUser ||
            !customAmount ||
            amountError ||
            parseFloat(customAmount) < 100 ||
            parseFloat(customAmount) > 14999 ||
            walletBalance < parseFloat(customAmount || 0)
          }
        >
          {isLoading ? "Processing..." : "🚀 Activate Investment"}
        </button>
      </div>
    </div>
  );
}

/* =========================
   STYLES WITH LIGHT & DARK MODE - FULLY RESPONSIVE
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
    box-sizing: border-box;
  }

  .sb-container {
    min-height: 100vh;
    background: var(--sb-bg-2);
    color: var(--sb-text-1);
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* ===== HEADER ===== */
  .sb-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--sb-border);
    background: var(--sb-bg-1);
  }

  .sb-header-inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    max-width: 100%;
  }

  .sb-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sb-header-icon {
    color: var(--sb-blue);
    flex-shrink: 0;
  }

  .sb-header-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin: 0;
    font-family: "Manrope", "Inter", ui-sans-serif, system-ui, sans-serif;
  }

  .sb-header-subtitle {
    font-size: 11px;
    color: var(--sb-text-3);
    margin: 0;
  }

  .sb-header-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .sb-header-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-1);
    box-shadow: var(--sb-shadow);
  }

  .sb-header-badge-icon {
    color: var(--sb-amber);
    flex-shrink: 0;
  }

  .sb-header-badge-text {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-1);
    white-space: nowrap;
  }

  .sb-header-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-1);
    box-shadow: var(--sb-shadow);
  }

  .sb-status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sb-status-indicator-live {
    background: var(--sb-green);
    animation: sb-pulse 1.5s ease-in-out infinite;
  }

  .sb-status-indicator-offline {
    background: var(--sb-red);
  }

  .sb-status-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-1);
    white-space: nowrap;
  }

  .sb-header-wallet {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid var(--sb-green);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-green-light);
    box-shadow: var(--sb-shadow);
  }

  .sb-header-wallet-text {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-green);
    white-space: nowrap;
  }

  /* ===== THEME TOGGLE BUTTON ===== */
  .sb-theme-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-1);
    color: var(--sb-text-1);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--sb-transition);
    flex-shrink: 0;
  }

  .sb-theme-toggle:hover {
    background: var(--sb-bg-hover);
    border-color: var(--sb-border-2);
  }

  .sb-theme-toggle-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .sb-theme-toggle-icon-sun {
    color: var(--sb-amber);
  }

  .sb-theme-toggle-icon-moon {
    color: var(--sb-blue);
  }

  /* ===== TAB NAVIGATION ===== */
  .sb-tabs {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--sb-bg-2);
    border-radius: var(--sb-radius-sm);
    border: 1px solid var(--sb-border);
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .sb-tab {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--sb-text-3);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .sb-tab:hover {
    background: var(--sb-bg-hover);
    color: var(--sb-text-1);
  }

  .sb-tab-active {
    background: var(--sb-bg-1);
    color: var(--sb-blue);
    box-shadow: var(--sb-shadow);
  }

  .sb-tab-active:hover {
    background: var(--sb-bg-1);
  }

  .sb-tab-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  /* ===== SECTION ===== */
  .sb-section {
    padding: 12px 16px;
  }

  /* ===== CARD ===== */
  .sb-card {
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius);
    background: var(--sb-bg-1);
    box-shadow: var(--sb-shadow);
    transition: all var(--sb-transition);
    margin-bottom: 16px;
    overflow: hidden;
    width: 100%;
  }

  .sb-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--sb-shadow-lg);
  }

  .sb-card-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--sb-border);
    gap: 8px;
  }

  .sb-card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .sb-card-icon {
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 18px;
    flex-shrink: 0;
  }

  .sb-icon-blue { background: var(--sb-blue-light); }
  .sb-icon-purple { background: var(--sb-purple-light); }
  .sb-icon-orange { background: var(--sb-orange-light); }
  .sb-icon-green { background: var(--sb-green-light); }
  .sb-icon-yellow { background: var(--sb-yellow-light); }

  .sb-card-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin: 0;
    letter-spacing: 0.02em;
    word-break: break-word;
    font-family: "Manrope", "Inter", ui-sans-serif, system-ui, sans-serif;
  }

  .sb-card-subtitle {
    font-size: 11px;
    color: var(--sb-text-3);
    margin: 2px 0 0 0;
  }

  .sb-card-status {
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

  .sb-status-live { background: var(--sb-green); animation: sb-pulse 1.5s ease-in-out infinite; }
  .sb-status-offline { background: var(--sb-red); }
  .sb-status-live-text { color: var(--sb-green); }
  .sb-status-offline-text { color: var(--sb-red); }

  .sb-card-body {
    padding: 12px 16px;
  }

  .sb-card-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (min-width: 992px) {
    .sb-card-grid {
      display: grid;
      grid-template-columns: 1fr 200px;
    }
  }

  @media (min-width: 1200px) {
    .sb-card-grid {
      grid-template-columns: 1fr 220px;
    }
  }

  .sb-card-left {
    min-width: 0;
    width: 100%;
  }

  .sb-section-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--sb-text-3);
    margin-bottom: 6px;
  }

  .sb-market-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sb-market-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
    gap: 4px;
  }

  .sb-market-loading {
    opacity: 0.6;
  }

  .sb-market-symbol {
    font-size: 11px;
    font-weight: 500;
    color: var(--sb-text-1);
  }

  .sb-market-price {
    font-size: 12px;
    font-weight: 600;
    color: var(--sb-text-1);
  }

  .sb-market-change {
    font-size: 11px;
    font-weight: 600;
  }

  .sb-change-positive { color: var(--sb-green); }
  .sb-change-negative { color: var(--sb-red); }

  .sb-market-loading-text {
    font-size: 11px;
    color: var(--sb-text-3);
  }

  .sb-chart-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--sb-text-1);
    margin: 12px 0 6px 0;
  }

  .sb-mini-chart {
    width: 100%;
    height: 80px;
  }

  .sb-chart-line {
    color: var(--sb-blue);
  }

  .sb-chart-placeholder {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sb-chart-loading {
    font-size: 11px;
    color: var(--sb-text-3);
  }

  .sb-details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    overflow: hidden;
    border-radius: var(--sb-radius-sm);
    border: 1px solid var(--sb-border);
    margin-top: 10px;
  }

  .sb-detail-item {
    padding: 6px;
    text-align: center;
  }

  .sb-detail-border {
    border-left: 1px solid var(--sb-border);
    border-right: 1px solid var(--sb-border);
  }

  .sb-detail-label {
    font-size: 9px;
    color: var(--sb-text-3);
    margin: 0;
  }

  .sb-detail-value {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-1);
    margin: 3px 0 0 0;
  }

  .sb-detail-risk {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-amber);
    margin: 3px 0 0 0;
  }

  .sb-card-right {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .sb-strategy-label {
    padding: 4px 8px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--sb-text-1);
    margin: 0;
  }

  .sb-indicators {
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    overflow: hidden;
  }

  .sb-indicator-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    border-bottom: 1px solid var(--sb-border);
  }

  .sb-indicator-item:last-child {
    border-bottom: none;
  }

  .sb-indicator-label {
    font-size: 11px;
    color: var(--sb-text-3);
  }

  .sb-indicator-value {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-1);
  }

  .sb-indicator-bullish { color: var(--sb-green); }
  .sb-indicator-bearish { color: var(--sb-red); }
  .sb-indicator-uptrend { color: var(--sb-green); }
  .sb-indicator-downtrend { color: var(--sb-red); }
  .sb-indicator-sideways { color: var(--sb-amber); }

  .sb-signal-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--sb-text-3);
    margin: 3px 0 0 0;
  }

  .sb-signal-box {
    border-radius: var(--sb-radius-sm);
    padding: 10px;
    text-align: center;
    border: 1px solid;
  }

  .sb-signal-buy {
    border-color: var(--sb-green);
    background: var(--sb-green-light);
  }

  .sb-signal-sell {
    border-color: var(--sb-red);
    background: var(--sb-red-light);
  }

  .sb-signal-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 16px;
    font-weight: 700;
  }

  .sb-signal-buy-text { color: var(--sb-green); }
  .sb-signal-sell-text { color: var(--sb-red); }

  .sb-signal-symbol {
    font-size: 11px;
    color: var(--sb-text-1);
    margin: 3px 0 0 0;
  }

  .sb-confidence {
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
  }

  .sb-confidence-label {
    font-size: 10px;
    color: var(--sb-text-3);
  }

  .sb-confidence-value {
    font-size: 12px;
    font-weight: 700;
  }

  .sb-confidence-buy { color: var(--sb-green); }
  .sb-confidence-sell { color: var(--sb-red); }

  .sb-last-update {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
  }

  .sb-update-label {
    color: var(--sb-text-3);
  }

  .sb-update-value {
    font-weight: 500;
    color: var(--sb-text-1);
  }

  /* ===== ACTION BUTTONS ===== */
  .sb-action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-top: 4px;
  }

  .sb-view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 10px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
    font-size: 10px;
    font-weight: 500;
    color: var(--sb-text-1);
    cursor: pointer;
    transition: all var(--sb-transition);
    white-space: nowrap;
  }

  .sb-view-btn:hover {
    background: var(--sb-bg-hover);
    border-color: var(--sb-border-2);
    transform: translateY(-1px);
  }

  .sb-invest-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 10px;
    border: 1px solid var(--sb-blue);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-blue-light);
    font-size: 10px;
    font-weight: 600;
    color: var(--sb-blue);
    cursor: pointer;
    transition: all var(--sb-transition);
    white-space: nowrap;
  }

  .sb-invest-btn:hover {
    background: var(--sb-blue);
    color: #fff;
    transform: translateY(-1px);
  }

  /* ===== RESPONSIVE ACTION BUTTONS ===== */
  @media (max-width: 768px) {
    .sb-action-buttons {
      grid-template-columns: 1fr 1fr;
    }
    
    .sb-view-btn,
    .sb-invest-btn {
      padding: 8px 8px;
      font-size: 10px;
    }
  }

  @media (max-width: 400px) {
    .sb-action-buttons {
      grid-template-columns: 1fr;
    }
    
    .sb-view-btn,
    .sb-invest-btn {
      padding: 10px 12px;
      font-size: 11px;
    }
  }

  .sb-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
    border-radius: var(--sb-radius-sm);
    border: 1px solid var(--sb-border);
    margin-top: 12px;
  }

  .sb-stat-item {
    padding: 6px;
    text-align: center;
  }

  .sb-stat-border {
    border-left: 1px solid var(--sb-border);
    border-right: 1px solid var(--sb-border);
  }

  .sb-stat-label {
    font-size: 9px;
    color: var(--sb-text-3);
    margin: 0;
  }

  .sb-stat-value {
    font-size: 11px;
    font-weight: 600;
    color: var(--sb-text-1);
    margin: 3px 0 0 0;
  }

  /* ===== FOOTER ===== */
  .sb-footer {
    margin-top: 16px;
    padding: 10px 14px;
    border: 1px solid var(--sb-border);
    border-radius: 12px;
    background: var(--sb-bg-1);
    font-size: 10px;
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
      flex-wrap: wrap;
    }
  }

  .sb-footer-label {
    font-weight: 600;
    color: var(--sb-text-1);
  }

  .sb-footer-status {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sb-footer-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sb-footer-dot-live { background: var(--sb-green); }
  .sb-footer-dot-sim { background: var(--sb-yellow); }

  .sb-footer-provider {
    font-weight: 600;
    color: var(--sb-blue);
  }

  /* ===== MODAL ===== */
  .sb-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: var(--sb-bg-overlay);
    animation: sb-fadeIn 0.2s ease-out;
  }

  .sb-modal {
    width: 100%;
    max-width: 460px;
    border-radius: var(--sb-radius);
    background: var(--sb-bg-1);
    padding: 20px;
    box-shadow: var(--sb-shadow-modal);
    max-height: 90vh;
    overflow-y: auto;
    animation: sb-slideUp 0.3s ease-out;
  }

  @keyframes sb-slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sb-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
    gap: 12px;
  }

  .sb-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin: 0;
    font-family: "Manrope", "Inter", ui-sans-serif, system-ui, sans-serif;
  }

  .sb-modal-subtitle {
    font-size: 12px;
    color: var(--sb-text-3);
    margin: 3px 0 0 0;
  }

  .sb-modal-close {
    background: var(--sb-bg-hover);
    border: 1px solid var(--sb-border);
    color: var(--sb-text-3);
    border-radius: var(--sb-radius-sm);
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sb-modal-close:hover {
    background: var(--sb-border);
  }

  .sb-modal-wallet {
    margin-bottom: 14px;
    padding: 10px 14px;
    border: 1px solid var(--sb-green);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-green-light);
  }

  .sb-modal-wallet-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  .sb-modal-wallet-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--sb-green);
  }

  .sb-modal-wallet-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--sb-green);
  }

  .sb-modal-field {
    margin-bottom: 10px;
  }

  .sb-modal-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--sb-text-1);
    margin-bottom: 4px;
  }

  .sb-modal-helper {
    font-size: 11px;
    color: var(--sb-text-3);
    margin-bottom: 4px;
  }

  .sb-modal-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    font-size: 13px;
    color: var(--sb-text-1);
    background: var(--sb-bg-1);
    transition: border-color var(--sb-transition);
  }

  .sb-modal-input:focus {
    outline: none;
    border-color: var(--sb-blue);
  }

  .sb-modal-input-error {
    border-color: var(--sb-red);
  }

  .sb-modal-error {
    margin-top: 4px;
    font-size: 11px;
    color: var(--sb-red);
  }

  .sb-modal-info {
    margin-top: 4px;
    font-size: 11px;
    color: var(--sb-text-3);
  }

  .sb-modal-success {
    margin-top: 4px;
    font-size: 11px;
    color: var(--sb-green);
    font-weight: 600;
  }

  .sb-modal-bot-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
  }

  .sb-modal-bot-name {
    font-weight: 600;
    color: var(--sb-text-1);
    font-size: 13px;
  }

  .sb-modal-package {
    margin-top: 4px;
    font-size: 12px;
    color: var(--sb-blue);
    font-weight: 600;
  }

  .sb-modal-submit {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: var(--sb-radius-sm);
    background: var(--sb-blue);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--sb-transition);
  }

  .sb-modal-submit:hover:not(:disabled) {
    background: var(--sb-blue-dark);
  }

  .sb-modal-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ===== SUCCESS MODAL ===== */
  .sb-success-modal {
    width: 100%;
    max-width: 420px;
    border-radius: var(--sb-radius);
    background: var(--sb-bg-1);
    padding: 20px;
    box-shadow: var(--sb-shadow-modal);
    text-align: center;
    animation: sb-slideUp 0.3s ease-out;
  }

  .sb-success-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }

  .sb-success-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin-bottom: 8px;
    font-family: "Manrope", "Inter", ui-sans-serif, system-ui, sans-serif;
  }

  .sb-success-subtitle {
    font-size: 13px;
    color: var(--sb-text-1);
    margin-bottom: 14px;
  }

  .sb-success-details {
    margin-bottom: 14px;
    padding: 14px;
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius-sm);
    background: var(--sb-bg-2);
    text-align: left;
  }

  .sb-success-detail {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid var(--sb-border);
    gap: 8px;
  }

  .sb-success-detail:last-child {
    border-bottom: none;
  }

  .sb-success-detail-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--sb-text-1);
  }

  .sb-success-detail-value {
    font-size: 12px;
    color: var(--sb-text-1);
    word-break: break-word;
  }

  .sb-success-detail-value-highlight {
    font-weight: 700;
    color: var(--sb-text-1);
  }

  .sb-success-btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: var(--sb-radius-sm);
    background: var(--sb-blue);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--sb-transition);
  }

  .sb-success-btn:hover {
    background: var(--sb-blue-dark);
  }

  /* ===== GRID ===== */
  .sb-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 768px) {
    .sb-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1200px) {
    .sb-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1536px) {
    .sb-grid {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  /* ===== ANIMATIONS ===== */
  @keyframes sb-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
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
    font-size: 48px;
    margin-bottom: 16px;
    animation: sb-bounce 1.5s ease-in-out infinite;
  }

  .sb-loading-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--sb-text-1);
  }

  @keyframes sb-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* ===== TAB CONTENT TRANSITION ===== */
  .sb-tab-content {
    animation: sb-fadeIn 0.3s ease-out;
  }

  /* ===== RESPONSIVE HEADER ===== */
  @media (max-width: 640px) {
    .sb-header {
      padding: 10px 12px;
    }
    
    .sb-header-title {
      font-size: 15px;
    }
    
    .sb-header-subtitle {
      font-size: 10px;
    }
    
    .sb-header-right {
      gap: 6px;
    }
    
    .sb-header-badge,
    .sb-header-status,
    .sb-header-wallet {
      padding: 4px 8px;
    }
    
    .sb-header-badge-text,
    .sb-status-label,
    .sb-header-wallet-text {
      font-size: 10px;
    }
    
    .sb-tabs {
      width: 100%;
      justify-content: stretch;
    }
    
    .sb-tab {
      flex: 1;
      justify-content: center;
      font-size: 11px;
      padding: 5px 8px;
    }
    
    .sb-tab-icon {
      width: 12px;
      height: 12px;
    }
    
    .sb-theme-toggle {
      font-size: 10px;
      padding: 4px 8px;
    }
    
    .sb-theme-toggle-icon {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    .sb-header-title {
      font-size: 14px;
    }
    
    .sb-header-right {
      flex-direction: column;
      align-items: stretch;
      gap: 4px;
    }
    
    .sb-tabs {
      width: 100%;
    }
    
    .sb-tab {
      font-size: 10px;
      padding: 4px 6px;
    }
    
    .sb-header-badge,
    .sb-header-status,
    .sb-header-wallet {
      width: 100%;
      justify-content: center;
    }
    
    .sb-section {
      padding: 8px 10px;
    }
    
    .sb-card-header {
      padding: 10px 12px;
    }
    
    .sb-card-body {
      padding: 10px 12px;
    }
    
    .sb-card-title {
      font-size: 12px;
    }
    
    .sb-card-subtitle {
      font-size: 10px;
    }
    
    .sb-modal {
      padding: 16px;
      margin: 8px;
    }
  }

  /* ===== HISTORY TAB RESPONSIVE ===== */
  .sb-history-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 768px) {
    .sb-history-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .sb-history-card {
    border: 1px solid var(--sb-border);
    border-radius: var(--sb-radius);
    background: var(--sb-bg-1);
    padding: 16px;
    transition: all var(--sb-transition);
  }

  .sb-history-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--sb-shadow-lg);
  }

  .sb-history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sb-history-icon {
    font-size: 32px;
  }

  .sb-history-status {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    background: var(--sb-green-light);
    color: var(--sb-green);
    border: 1px solid rgba(16, 185, 129, 0.25);
  }

  .sb-history-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin-bottom: 4px;
  }

  .sb-history-subtitle {
    font-size: 12px;
    color: var(--sb-text-3);
    margin-bottom: 8px;
  }

  .sb-history-amount {
    font-size: 22px;
    font-weight: 800;
    color: var(--sb-text-1);
    margin-bottom: 4px;
  }

  .sb-history-package {
    font-size: 14px;
    font-weight: 700;
    color: var(--sb-green);
    margin-bottom: 8px;
  }

  .sb-history-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--sb-border);
    flex-wrap: wrap;
    gap: 8px;
  }

  .sb-history-date {
    font-size: 11px;
    color: var(--sb-text-3);
  }

  .sb-history-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .sb-history-btn {
    padding: 4px 10px;
    border: 1px solid var(--sb-border);
    border-radius: 6px;
    background: var(--sb-bg-2);
    font-size: 10px;
    font-weight: 500;
    color: var(--sb-text-1);
    cursor: pointer;
    transition: all var(--sb-transition);
  }

  .sb-history-btn:hover {
    background: var(--sb-bg-hover);
  }

  .sb-history-btn-primary {
    border-color: var(--sb-blue);
    background: var(--sb-blue-light);
    color: var(--sb-blue);
  }

  .sb-history-btn-primary:hover {
    background: var(--sb-blue);
    color: #fff;
  }

  .sb-history-detail-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid var(--sb-border);
    font-size: 12px;
  }

  .sb-history-detail-row:last-child {
    border-bottom: none;
  }

  .sb-history-detail-label {
    color: var(--sb-text-3);
  }

  .sb-history-detail-value {
    font-weight: 500;
    color: var(--sb-text-1);
  }

  /* ===== EMPTY STATE ===== */
  .sb-empty {
    text-align: center;
    padding: 60px 20px;
  }

  .sb-empty-icon {
    font-size: 56px;
    margin-bottom: 16px;
  }

  .sb-empty-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--sb-text-1);
    margin-bottom: 8px;
  }

  .sb-empty-subtitle {
    font-size: 13px;
    color: var(--sb-text-3);
  }

  /* ===== SCROLLBAR ===== */
  .sb-modal::-webkit-scrollbar {
    width: 4px;
  }

  .sb-modal::-webkit-scrollbar-track {
    background: var(--sb-bg-2);
  }

  .sb-modal::-webkit-scrollbar-thumb {
    background: var(--sb-border);
    border-radius: 2px;
  }

  .sb-modal::-webkit-scrollbar-thumb:hover {
    background: var(--sb-border-2);
  }
`;

/* =========================
   MAIN PAGE
========================= */

export default function SonicScalper() {
  const dispatch = useDispatch();
  const loading = useSelector(productLoading);
  const activeProductsData = useSelector(activeProducts);
  const [activeTab, setActiveTab] = useState('bots');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    livePrice,
    priceChange,
    chartData,
    wsConnected,
    lastUpdate,
    marketPrices
  } = useLiveMarket();

  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [inv, setInv] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBot, setDetailBot] = useState(null);
  const [cssLoaded, setCssLoaded] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Map API data to bots structure
  const bots = mapApiDataToBots(activeProductsData);

  // Inject styles
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Mark CSS as loaded after a small delay to ensure it's applied
    setTimeout(() => {
      setCssLoaded(true);
    }, 100);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Check if all initial data is loaded
  useEffect(() => {
    if (
      cssLoaded &&
      !walletLoading &&
      marketPrices &&
      Object.keys(marketPrices).length > 0 &&
      chartData &&
      chartData.length > 0
    ) {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setInitialDataLoaded(true);
      }, 300);
    }
  }, [cssLoaded, walletLoading, marketPrices, chartData]);

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

  // Fetch active products
  useEffect(() => {
    dispatch(getActiveProducts());
  }, [dispatch]);

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setWalletLoading(true);
        const result = await dispatch(getFundRequestReport()).unwrap();
        if (result?.walletBalance?.[0]?.depositWallet !== undefined) {
          setWalletBalance(result.walletBalance[0].depositWallet);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      } finally {
        setWalletLoading(false);
      }
    };
    fetchWalletBalance();
  }, [dispatch]);

  // Handle invest button click
  const handleInvestClick = (bot) => {
    setSelectedBot(bot);
    setShowInvestModal(true);
  };

  // Handle view details button click
  const handleViewDetails = (bot) => {
    if (bot?.myfxbookLink) {
      window.open(
        bot.myfxbookLink,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = (invoiceData) => {
    const invoiceNo = invoiceData.id || `INV-${Date.now()}`;
    const userName = invoiceData.user || 'User';
    const userId = invoiceData.uid || 'N/A';
    const amount = invoiceData.amount || 0;
    const orderDate = invoiceData.date || new Date().toLocaleDateString();
    const status = 'Active';
    const roiValue = invoiceData.roi || '20';
    const d = {
      bot: invoiceData.bot,
      package: invoiceData.package,
      CategoryName: invoiceData.bot,
      PackageName: invoiceData.package
    };

    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>Roventar Invoice ${invoiceNo}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                background: #e8e8e8;
                padding: 10px;
                font-family: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }

            /* ===== MAIN CONTAINER ===== */
            .invoice {
                max-width: 780px;
                width: 100%;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                page-break-inside: avoid;
                break-inside: avoid;
            }

            /* ===== TOP BAR ===== */
            .top-bar {
                background: #1a1a1a;
                padding: 12px 28px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 3px solid #333333;
            }

            .top-bar .brand {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 2px;
            }

            .top-bar .brand .logo-img {
                width: 100%;
                max-width: 180px;
                height: auto;
                object-fit: contain;
                background: transparent;
                padding: 0;
                border-radius: 0;
                display: block;
            }

            .top-bar .brand .brand-text {
                display: none;
            }

            .top-bar .invoice-tag {
                text-align: right;
            }

            .top-bar .invoice-tag .label {
                font-size: 8px;
                color: rgba(255, 255, 255, 0.6);
                text-transform: uppercase;
                letter-spacing: 1.5px;
                font-weight: 600;
            }

            .top-bar .invoice-tag .number {
                font-size: 13px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: 0.3px;
            }

            /* ===== HEADER ===== */
            .header {
                background: #f5f5f5;
                padding: 16px 28px 14px;
                border-bottom: 1px solid #d0d0d0;
            }

            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
            }

            .header-left .greeting {
                font-size: 20px;
                font-weight: 700;
                color: #1a1a1a;
            }

            .header-left .greeting span {
                color: #444444;
            }

            .header-left .sub {
                font-size: 12px;
                color: #666666;
                font-weight: 400;
                margin-top: 1px;
            }

            .header-right {
                text-align: right;
            }

            .header-right .amount-label {
                font-size: 10px;
                color: #555555;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 700;
            }

            .header-right .amount-wrapper {
                display: flex;
                align-items: baseline;
                justify-content: flex-end;
                gap: 4px;
            }

            .header-right .amount {
                font-size: 28px;
                font-weight: 900;
                color: #1a1a1a;
                line-height: 1.1;
                letter-spacing: -0.5px;
            }

            .header-right .currency {
                font-size: 14px;
                font-weight: 600;
                color: #555555;
                letter-spacing: 0.5px;
            }

            /* ===== STATUS ROW ===== */
            .status-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 28px;
                background: #ffffff;
                border-bottom: 1px solid #d0d0d0;
                flex-wrap: wrap;
                gap: 6px;
            }

            .status-row .date {
                font-size: 12px;
                color: #666666;
                font-weight: 500;
            }

            .status-row .date strong {
                color: #1a1a1a;
                font-weight: 700;
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: #333333;
                padding: 0;
                background: transparent;
                border: none;
            }

            /* ===== BODY ===== */
            .body {
                padding: 14px 28px 10px;
                background: #ffffff;
            }

            /* ===== SECTIONS ===== */
            .section {
                margin-bottom: 18px;
            }

            .section:last-of-type {
                margin-bottom: 0;
            }

            .section-title {
                font-size: 10px;
                font-weight: 800;
                color: #1a1a1a;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                margin-bottom: 10px;
                padding-bottom: 6px;
                border-bottom: 2px solid #cccccc;
            }

            .section-title .icon {
                margin-right: 6px;
                font-size: 13px;
            }

            /* ===== GRID ===== */
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 8px;
            }

            .grid-3 {
                grid-template-columns: repeat(3, 1fr);
            }

            /* ===== CARD ===== */
            .card {
                background: #f5f5f5;
                border-radius: 10px;
                padding: 8px 14px;
                border: 1px solid #d0d0d0;
            }

            .card .label {
                font-size: 9px;
                font-weight: 700;
                color: #555555;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                margin-bottom: 2px;
            }

            .card .value {
                font-size: 14px;
                font-weight: 700;
                color: #1a1a1a;
                letter-spacing: -0.2px;
            }

            .card .value-sm {
                font-size: 13px;
                font-weight: 600;
                color: #1a1a1a;
            }

            /* ===== HIGHLIGHT BOX ===== */
            .highlight-box {
                background: #f0f0f0;
                border: 2px solid #aaaaaa;
                border-radius: 10px;
                padding: 10px 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 2px;
            }

            .highlight-box .left .label {
                font-size: 10px;
                font-weight: 700;
                color: #555555;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .highlight-box .left .value {
                font-size: 16px;
                font-weight: 800;
                color: #1a1a1a;
                margin-top: 1px;
                letter-spacing: -0.3px;
            }

            .highlight-box .right {
                text-align: right;
            }

            .highlight-box .right .label {
                font-size: 10px;
                font-weight: 700;
                color: #555555;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .highlight-box .right .value {
                font-size: 18px;
                font-weight: 900;
                color: #333333;
                margin-top: 1px;
                letter-spacing: -0.5px;
            }

            /* ===== COMPANY ADDRESS ===== */
            .company-address {
                background: #f5f5f5;
                padding: 8px 18px;
                border-radius: 10px;
                border: 1px solid #d0d0d0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 6px;
            }

            .company-address .address-text {
                font-size: 10px;
                color: #666666;
                line-height: 1.5;
            }

            .company-address .address-text strong {
                color: #1a1a1a;
            }

            /* ===== STAMP ONLY - RIGHT SIDE ===== */
            .stamp-section {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 2px dashed #cccccc;
            }

            .stamp-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }

            .stamp-box .stamp-label {
                font-size: 7px;
                color: #888888;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
            }

            .stamp-box .stamp-image {
                width: 120px;
                height: 120px;
                object-fit: contain;
                border-radius: 8px;
                background: #ffffff;
                padding: 4px;
            }

            /* ===== FOOTER ===== */
            .footer {
                background: #f5f5f5;
                padding: 10px 28px 8px;
                text-align: center;
                border-top: 2px solid #cccccc;
            }

            .footer .brand-name {
                font-size: 14px;
                font-weight: 800;
                color: #1a1a1a;
                letter-spacing: 1px;
            }

            .footer .brand-name span {
                color: #555555;
            }

            .footer .divider {
                width: 25px;
                height: 2px;
                background: #555555;
                margin: 4px auto;
                border-radius: 2px;
            }

            .footer p {
                font-size: 10px;
                color: #1a1a1a;
                font-weight: 500;
                line-height: 1.4;
            }

            .footer .note {
                font-size: 7px;
                color: #888888;
                font-weight: 500;
                margin-top: 3px;
                letter-spacing: 0.3px;
            }

            /* ===== RESPONSIVE ===== */
            @media (max-width: 700px) {
                .top-bar {
                    flex-direction: column;
                    gap: 6px;
                    padding: 10px 16px;
                    text-align: center;
                }
                .top-bar .brand {
                    align-items: center;
                    width: 100%;
                }
                .top-bar .brand .logo-img {
                    max-width: 150px;
                }
                .top-bar .invoice-tag {
                    text-align: center;
                }
                .header {
                    padding: 12px 16px;
                }
                .header-content {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .header-right {
                    text-align: left;
                    width: 100%;
                }
                .header-right .amount-wrapper {
                    justify-content: flex-start;
                }
                .header-right .amount {
                    font-size: 24px;
                }
                .body {
                    padding: 10px 16px;
                }
                .grid-3 {
                    grid-template-columns: 1fr 1fr;
                }
                .status-row {
                    padding: 6px 16px;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .footer {
                    padding: 8px 16px;
                }
                .stamp-section {
                    justify-content: center;
                }
                .company-address {
                    flex-direction: column;
                    text-align: center;
                }
                .stamp-box .stamp-image {
                    width: 100px;
                    height: 100px;
                }
            }

            @media (max-width: 480px) {
                .grid-3 {
                    grid-template-columns: 1fr;
                }
                .top-bar .brand .logo-img {
                    max-width: 120px;
                }
                .header-left .greeting {
                    font-size: 17px;
                }
            }

            /* ===== PRINT ===== */
            @media print {
                body {
                    background: #ffffff;
                    padding: 0;
                    margin: 0;
                }
                .invoice {
                    box-shadow: none;
                    border-radius: 0;
                    max-width: 100%;
                }
                .top-bar {
                    background: #1a1a1a !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .top-bar .brand .logo-img {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .status-badge {
                    color: #333333 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .highlight-box {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .card {
                    background: #f5f5f5 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .footer {
                    background: #f5f5f5 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .header {
                    background: #f5f5f5 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .company-address {
                    background: #f5f5f5 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .stamp-image {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .stamp-section {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            }
                .brand-logo-span {
                color: #fff;
                font-weight: 400;
                font-size: 12px;
                }
        </style>
    </head>

    <body>
        <div class="invoice">

            <!-- ===== TOP BAR ===== -->
            <div class="top-bar">
                <div class="brand">
                    <img src="/logo.png" alt="Roventar Logo" class="logo-img" />
                    <span class="brand-logo-span">Smart Trading · Better Future</span>
                </div>
                <div class="invoice-tag">
                    <div class="label">Invoice Number</div>
                    <div class="number">#${invoiceNo}</div>
                </div>
            </div>

            <!-- ===== HEADER ===== -->
            <div class="header">
                <div class="header-content">
                    <div class="header-left">
                        <div class="greeting">
                            Hello, <span>${userName}</span>
                        </div>
                        <div class="sub">Thank you for investing with Roventar</div>
                    </div>
                    <div class="header-right">
                        <div class="amount-label">Total Investment</div>
                        <div class="amount-wrapper">
                            <span class="amount">$${amount.toFixed(2)}</span>
                            <span class="currency">USD</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== STATUS ROW ===== -->
            <div class="status-row">
                <div class="date">
                    📅 <strong>Transaction Date:</strong> ${orderDate}
                </div>
                <div>
                    <span class="status-badge">${status}</span>
                </div>
            </div>

            <!-- ===== BODY ===== -->
            <div class="body">

                <!-- User Details -->
                <div class="section">
                    <div class="section-title">
                        <span class="icon">👤</span> User Details
                    </div>
                    <div class="grid">
                        <div class="card">
                            <div class="label">Username</div>
                            <div class="value">${userName}</div>
                        </div>
                        <div class="card">
                            <div class="label">User ID</div>
                            <div class="value value-sm">${userId}</div>
                        </div>
                    </div>
                </div>

                <!-- Package Details -->
                <div class="section">
                    <div class="section-title">
                        <span class="icon">🤖</span> Package Details
                    </div>
                    <div class="grid grid-3">
                        <div class="card">
                            <div class="label">Strategy</div>
                            <div class="value">${d.CategoryName || d.bot || "N/A"}</div>
                        </div>
                        <div class="card">
                            <div class="label">Package</div>
                            <div class="value">${d.PackageName || d.package || "N/A"}</div>
                        </div>
                        <div class="card">
                            <div class="label">APY</div>
                            <div class="value">${typeof roiValue === 'number' ? roiValue.toFixed(2) : roiValue}%</div>
                        </div>
                    </div>
                </div>

                <!-- Investment Summary -->
                <div class="section">
                    <div class="section-title">
                        <span class="icon">💰</span> Investment Summary
                    </div>
                    <div class="highlight-box">
                        <div class="left">
                            <div class="label">Package</div>
                            <div class="value">${d.PackageName || d.package || "N/A"}</div>
                        </div>
                        <div class="right">
                            <div class="label">Amount</div>
                            <div class="value">$${amount.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <!-- ===== COMPANY ADDRESS ===== -->
                <div class="section" style="margin-bottom: 4px;">
                    <div class="section-title">
                        <span class="icon">🏢</span> Company Details
                    </div>
                <div class="company-address">
    <div class="address-text">
        <strong>ROVENTAR TRADING LLC</strong><br />
        Registered Agent: As per Articles of Organization<br />
        State of Missouri, USA<br />
        Date Filed: 08/26/2026
    </div>

    <div class="address-text" style="text-align: right;">
        <strong>Email:</strong> support@roventar.com<br />
        <strong>Phone:</strong> +1 (800) 555-0199
    </div>
</div>
                </div>

                <!-- ===== STAMP ONLY - RIGHT SIDE ===== -->
                <div class="stamp-section">
                    <div class="stamp-box">
                        <span class="stamp-label">Company Stamp</span>
                        <img src="/stampbackremove.png" alt="Roventar CAPITAL MANAGEMENT LLC Stamp" class="stamp-image" />
                    </div>
                </div>

            </div>

            <!-- ===== FOOTER ===== -->
            <div class="footer">
                <div class="brand-name">✦ Rove<span>ntar</span></div>
                <div class="divider"></div>
                <p>
                    Thank you for trusting Roventar with your investment.<br />
                    Our AI-driven strategies are working to grow your wealth.
                </p>
                <div class="note">
                    © ${new Date().getFullYear()} Roventar · All Rights Reserved · Computer Generated Invoice
                </div>
            </div>

        </div>
    </body>
    </html>
    `;
    // Create a temporary div to hold the invoice
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = invoiceHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    // Generate PDF using html2pdf
    const element = tempDiv.querySelector('.invoice');
    const opt = {
      margin: 10,
      filename: `Roventar_Invoice_${invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Wait for html2pdf to load, then generate PDF
    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(tempDiv);
      });
    } else {
      // Fallback: load html2pdf dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        html2pdf().set(opt).from(element).save().then(() => {
          document.body.removeChild(tempDiv);
        });
      };
      document.head.appendChild(script);
    }
  };

  // Handle investment submission
  const handleInvestSubmit = async ({ uid, uname, userURID, amount, bot }) => {
    console.log("TTT",bot)
    setIsProcessing(true);

    try {
      const currentUserURID = getUserId();
      const productId = bot.id || bot.productId;

      const requestBody = {
        productId: productId,
        byLoginId: uid,
        rkprice: amount
      };

      const result = await dispatch(addRechargeTransactionUser(requestBody)).unwrap();

      let transactionData;
      if (Array.isArray(result) && result.length > 0) {
        transactionData = result[0];
      } else {
        transactionData = result;
      }

      // Package name function based on trading amount
      const getPackageNameByAmount = (amount) => {
        if (!amount || isNaN(amount)) return null;
        if (amount >= 100 && amount <= 999) return "Basic";
        else if (amount >= 1000 && amount <= 4999) return "Standard";
        else if (amount >= 5000 && amount <= 9999) return "Elite";
        else if (amount >= 10000 && amount <= 14999) return "Growth";
        return null;
      };

      const o = {
        id: `R-${Date.now()}`,
        bot: bot.name,
        logo: bot.icon || "🤖",
        user: uname,
        package: transactionData?.PackageName || getPackageNameByAmount(amount),
        uid: uid.toUpperCase(),
        amount: amount,
        date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        roi: bot.apr?.replace('%', '') || "20",
        status: "Active",
        color: bot.chartColor || "#6725cd",
        transactionId: transactionData?.RechargeId || transactionData?.transactionId || `TXN-${Date.now()}`
      };

      setInv(o);
      setShowInvestModal(false);
      setShowSuccess(true);
      setSelectedBot(null);

      // Refresh wallet balance
      const walletResult = await dispatch(getFundRequestReport()).unwrap();
      if (walletResult?.walletBalance?.[0]?.depositWallet !== undefined) {
        setWalletBalance(walletResult.walletBalance[0].depositWallet);
      }

    } catch (error) {
      console.error("Transaction failed:", error);
      alert(error?.message || "Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Detail Modal Component
  const DetailModal = ({ bot, onClose }) => {
    if (!bot) return null;

    return (
      <div className="sb-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="sb-modal" style={{ maxWidth: '500px' }}>
          <div className="sb-modal-header">
            <div>
              <h3 className="sb-modal-title">Bot Details</h3>
              <p className="sb-modal-subtitle">{bot.name} - {bot.subtitle}</p>
            </div>
            <button onClick={onClose} className="sb-modal-close">✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Bot Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--sb-bg-2)', borderRadius: 'var(--sb-radius-sm)', flexWrap: 'wrap' }}>
              <div className={`sb-card-icon ${bot.iconBg}`} style={{ width: '48px', height: '48px', fontSize: '24px', flexShrink: 0 }}>
                {bot.icon}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--sb-text-1)' }}>{bot.name}</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--sb-text-3)' }}>{bot.subtitle}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div className="sb-history-detail-row">
                <span className="sb-history-detail-label">Market</span>
                <span className="sb-history-detail-value">{bot.market}</span>
              </div>
              <div className="sb-history-detail-row">
                <span className="sb-history-detail-label">Timeframe</span>
                <span className="sb-history-detail-value">{bot.timeframe}</span>
              </div>
              <div className="sb-history-detail-row">
                <span className="sb-history-detail-label">Risk</span>
                <span className="sb-history-detail-value" style={{ color: 'var(--sb-amber)' }}>{bot.risk}</span>
              </div>
              <div className="sb-history-detail-row">
                <span className="sb-history-detail-label">Signal</span>
                <span className="sb-history-detail-value" style={{ color: bot.signal === 'BUY' ? 'var(--sb-green)' : 'var(--sb-red)' }}>
                  {bot.signal}
                </span>
              </div>
              <div className="sb-history-detail-row">
                <span className="sb-history-detail-label">Confidence</span>
                <span className="sb-history-detail-value">{bot.confidence}</span>
              </div>
              <div className="sb-history-detail-row">
                <span className="sb-history-detail-label">Symbol</span>
                <span className="sb-history-detail-value">{bot.signalSymbol}</span>
              </div>
            </div>

            {/* Performance Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <div style={{ textAlign: 'center', padding: '8px', background: 'var(--sb-bg-2)', borderRadius: 'var(--sb-radius-sm)' }}>
                <p style={{ fontSize: '9px', color: 'var(--sb-text-3)', margin: 0 }}>APR</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sb-green)', margin: '4px 0 0 0' }}>{bot.apr}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: 'var(--sb-bg-2)', borderRadius: 'var(--sb-radius-sm)' }}>
                <p style={{ fontSize: '9px', color: 'var(--sb-text-3)', margin: 0 }}>Win Rate</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sb-blue)', margin: '4px 0 0 0' }}>{bot.winRate}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: 'var(--sb-bg-2)', borderRadius: 'var(--sb-radius-sm)' }}>
                <p style={{ fontSize: '9px', color: 'var(--sb-text-3)', margin: 0 }}>Traders</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sb-amber)', margin: '4px 0 0 0' }}>{bot.traders}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="sb-modal-submit"
              onClick={() => {
                onClose();
                handleInvestClick(bot);
              }}
            >
              Invest Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading || !initialDataLoaded) {
    return (
      <div className="sb-loading">
        <div className="sb-loading-content">
          <div className="sb-loading-icon">🤖</div>
          <div className="sb-loading-text">Loading AI Bots...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-container">
      {/* Header with Tabs */}
      <div className="sb-header">
        <div className="sb-header-inner">
          <div>
            <div className="sb-header-left">
              <CircleDollarSign size={20} className="sb-header-icon" />
              <h1 className="sb-header-title">AI Trading Bots</h1>
            </div>
            <p className="sb-header-subtitle">Monitor your automated trading strategies</p>
          </div>
          <div className="sb-header-right">
            {/* Tabs */}
            <div className="sb-tabs">
              <button
                className={`sb-tab ${activeTab === 'bots' ? 'sb-tab-active' : ''}`}
                onClick={() => setActiveTab('bots')}
              >
                <Bot size={14} className="sb-tab-icon" />
                Bots
              </button>
              <button
                className={`sb-tab ${activeTab === 'history' ? 'sb-tab-active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <History size={14} className="sb-tab-icon" />
                History
              </button>
            </div>




            <div className="sb-header-wallet">
              <span className="sb-header-wallet-text">Wallet: ${walletBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="sb-tab-content">
        {activeTab === 'bots' ? (
          // Bots Section
          <div className="sb-section">
            <div className="sb-grid">
              {bots.map((bot) => (
                <BotCard
                  key={bot.name}
                  bot={bot}
                  marketPrices={marketPrices}
                  lastUpdate={lastUpdate}
                  chartData={chartData}
                  livePrice={livePrice}
                  wsConnected={wsConnected}
                  onInvest={handleInvestClick}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>


          </div>
        ) : (
          <InvestmentHistory />
        )}
      </div>

      {/* Invest Modal */}
      {showInvestModal && selectedBot && (
        <InvestModal
          bot={selectedBot}
          onClose={() => {
            setShowInvestModal(false);
            setSelectedBot(null);
          }}
          onSubmit={handleInvestSubmit}
          walletBalance={walletBalance}
          isLoading={isProcessing}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && detailBot && (
        <DetailModal
          bot={detailBot}
          onClose={() => {
            setShowDetailModal(false);
            setDetailBot(null);
          }}
        />
      )}

      {/* Success Modal */}
      {showSuccess && inv && (
        <div className="sb-modal-overlay" onClick={e => e.target === e.currentTarget && setShowSuccess(false)}>
          <div className="sb-success-modal">
            <div className="sb-success-icon">🎉</div>
            <h3 className="sb-success-title">Congratulations!</h3>
            <p className="sb-success-subtitle">Your AI bot investment is now live and running.</p>

            <div className="sb-success-details">
              {[
                { label: "Order ID", value: inv.id },
                { label: "Bot Strategy", value: inv.bot },
                { label: "User ID", value: inv.user },
                { label: "Package", value: inv.package },
                { label: "Amount", value: `$${inv.amount.toFixed(2)}`, highlight: true },
                { label: "Date", value: inv.date }
              ].map((item, i) => (
                <div key={i} className="sb-success-detail">
                  <span className="sb-success-detail-label">{item.label}</span>
                  <span className={item.highlight ? 'sb-success-detail-value-highlight' : 'sb-success-detail-value'}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                className="sb-success-btn"
                onClick={() => handleDownloadInvoice(inv)}
                style={{ background: 'var(--sb-text-2)', flex: 1 }}
              >
                <Download size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Download Invoice
              </button>
              <button
                className="sb-success-btn"
                onClick={() => setShowSuccess(false)}
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}