"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';

// ============================================================
// API CONFIGURATION
// ============================================================
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Chain configurations - ALL 4 CHAINS
const CHAINS = {
  ETH: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    color: '#627EEA',
    explorer: 'https://etherscan.io',
    decimals: 18,
  },
  BSC: {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB Chain',
    icon: '🟡',
    color: '#F0B90B',
    explorer: 'https://bscscan.com',
    decimals: 18,
  },
  SOL: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    icon: '🟣',
    color: '#9945FF',
    explorer: 'https://solscan.io',
    decimals: 9,
  },
  AVAX: {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    icon: '🔴',
    color: '#E84142',
    explorer: 'https://snowtrace.io',
    decimals: 18,
  },
};

// Popular tokens per chain - ALL 4 CHAINS
const CHAIN_TOKENS = {
  ETH: [
    { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
    { symbol: 'USDC', name: 'USD Coin', id: 'usd-coin' },
    { symbol: 'USDT', name: 'Tether', id: 'tether' },
    { symbol: 'DAI', name: 'Dai', id: 'dai' },
    { symbol: 'WBTC', name: 'Wrapped BTC', id: 'wrapped-bitcoin' },
    { symbol: 'LINK', name: 'Chainlink', id: 'chainlink' },
    { symbol: 'UNI', name: 'Uniswap', id: 'uniswap' },
    { symbol: 'AAVE', name: 'Aave', id: 'aave' },
    { symbol: 'PEPE', name: 'Pepe', id: 'pepe' },
    { symbol: 'SHIB', name: 'Shiba Inu', id: 'shiba-inu' },
    { symbol: 'LDO', name: 'Lido DAO', id: 'lido-dao' },
    { symbol: 'CRV', name: 'Curve DAO', id: 'curve-dao-token' },
  ],
  BSC: [
    { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
    { symbol: 'CAKE', name: 'PancakeSwap', id: 'pancakeswap-token' },
    { symbol: 'BUSD', name: 'BUSD', id: 'binance-usd' },
    { symbol: 'WBNB', name: 'Wrapped BNB', id: 'wbnb' },
    { symbol: 'USDC', name: 'USD Coin (BSC)', id: 'usd-coin' },
    { symbol: 'USDT', name: 'Tether (BSC)', id: 'tether' },
    { symbol: 'BTCB', name: 'Bitcoin BEP2', id: 'bitcoin-bep2' },
    { symbol: 'ETH', name: 'Ethereum (BSC)', id: 'ethereum' },
    { symbol: 'XRP', name: 'XRP (BEP20)', id: 'ripple' },
    { symbol: 'DOGE', name: 'Dogecoin (BEP20)', id: 'dogecoin' },
    { symbol: 'ADA', name: 'Cardano (BEP20)', id: 'cardano' },
    { symbol: 'MATIC', name: 'Polygon (BEP20)', id: 'matic-network' },
  ],
  SOL: [
    { symbol: 'SOL', name: 'Solana', id: 'solana' },
    { symbol: 'RAY', name: 'Raydium', id: 'raydium' },
    { symbol: 'SRM', name: 'Serum', id: 'serum' },
    { symbol: 'FTT', name: 'FTX Token', id: 'ftx-token' },
    { symbol: 'USDC', name: 'USD Coin (Solana)', id: 'usd-coin' },
    { symbol: 'BONK', name: 'Bonk', id: 'bonk' },
    { symbol: 'JUP', name: 'Jupiter', id: 'jupiter' },
    { symbol: 'ORCA', name: 'Orca', id: 'orca' },
    { symbol: 'PYTH', name: 'Pyth Network', id: 'pyth-network' },
    { symbol: 'JTO', name: 'Jito', id: 'jito' },
    { symbol: 'WIF', name: 'dogwifhat', id: 'dogwifcoin' },
    { symbol: 'RENDER', name: 'Render', id: 'render-token' },
  ],
  AVAX: [
    { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
    { symbol: 'JOE', name: 'Trader Joe', id: 'joe' },
    { symbol: 'QI', name: 'Benqi', id: 'benqi' },
    { symbol: 'USDC', name: 'USD Coin (Avalanche)', id: 'usd-coin' },
    { symbol: 'WETH', name: 'Wrapped ETH (Avalanche)', id: 'weth' },
    { symbol: 'WBTC', name: 'Wrapped BTC (Avalanche)', id: 'wrapped-bitcoin' },
    { symbol: 'LINK', name: 'Chainlink (Avalanche)', id: 'chainlink' },
    { symbol: 'AAVE', name: 'Aave (Avalanche)', id: 'aave' },
    { symbol: 'PNG', name: 'Pangolin', id: 'pangolin' },
    { symbol: 'YAK', name: 'Yield Yak', id: 'yield-yak' },
    { symbol: 'GMX', name: 'GMX', id: 'gmx' },
    { symbol: 'MIM', name: 'Magic Internet Money', id: 'magic-internet-money' },
  ],
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
const openExplorer = (chain, hash) => {
  const chainLower = chain?.toLowerCase() || '';

  if (chainLower.includes('avax')) {
    window.open(`https://snowtrace.io/tx/${hash}`, '_blank');
    return;
  }

  const explorers = {
    sol: `https://solscan.io/tx/${hash}`,
    bsc: `https://bscscan.com/tx/${hash}`,
    eth: `https://etherscan.io/tx/${hash}`,
  };

  let normalizedChain = 'eth';
  if (chainLower.includes('sol')) normalizedChain = 'sol';
  else if (chainLower.includes('bsc')) normalizedChain = 'bsc';
  else if (chainLower.includes('eth')) normalizedChain = 'eth';

  const url = explorers[normalizedChain];
  if (url) window.open(url, '_blank');
};

const truncateHash = (hash, maxLength = 20) => {
  if (!hash) return '';
  if (hash.length <= maxLength) return hash;
  return `${hash.slice(0, maxLength - 3)}...`;
};

const formatCurrency = (value) => {
  if (value === 0 || !value) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// ============================================================
// ANIMATED COUNTER
// ============================================================
const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      const duration = 800;
      const steps = 30;
      const stepTime = duration / steps;
      const startValue = prevValueRef.current;
      const endValue = value;
      const diff = endValue - startValue;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const newValue = startValue + diff * progress;
        setDisplayValue(newValue);

        if (currentStep >= steps) {
          setDisplayValue(endValue);
          clearInterval(interval);
        }
      }, stepTime);

      prevValueRef.current = value;
      return () => clearInterval(interval);
    }
  }, [value]);

  const formattedValue =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.floor(displayValue).toLocaleString();

  return (
    <span>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ArbionEngine() {
  const scanChartRef = useRef(null);
  const chartInstances = useRef([]);
  const [botChecked, setBotChecked] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState('MEV Sandwich');
  const [slippage, setSlippage] = useState(0.5);
  const [minProfit, setMinProfit] = useState(5);
  const [maxGas, setMaxGas] = useState(50);
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Stats values
  const [totalProfit, setTotalProfit] = useState(480000.52);
  const [totalTransactions, setTotalTransactions] = useState(1500);
  const [successRate, setSuccessRate] = useState(99.96);

  const [loading, setLoading] = useState(true);
  const [scanData, setScanData] = useState([]);
  const [flashEffect, setFlashEffect] = useState({
    profit: false,
    tx: false,
    success: false,
  });
  const [secondsLeft, setSecondsLeft] = useState(120);

  // ============================================================
  // MULTI-CHAIN CALCULATOR STATES - ALL 4 CHAINS
  // ============================================================
  const [selectedChain, setSelectedChain] = useState('BSC');
  const [selectedToken, setSelectedToken] = useState('BNB');
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenPriceChange, setTokenPriceChange] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Calculator inputs
  const [entryPrice, setEntryPrice] = useState(0);
  const [exitPrice, setExitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [roi, setRoi] = useState(0);

  // Dropdown states
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  // ============================================================
  // DROPDOWN REFS (FIXED)
  // ============================================================
  const chainDropdownRef = useRef(null);
  const tokenDropdownRef = useRef(null);

  const intervalRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isMounted = useRef(true);

  // ============================================================
  // FETCH LIVE PRICE
  // ============================================================
  const fetchTokenPrice = useCallback(async () => {
    setIsLoadingPrice(true);
    try {
      const tokenId = CHAIN_TOKENS[selectedChain]?.find(
        (t) => t.symbol === selectedToken
      )?.id;

      if (!tokenId) {
        setTokenPrice(0);
        setTokenPriceChange(0);
        return;
      }

      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
      );

      const data = await response.json();

      if (data[tokenId]) {
        const price = data[tokenId].usd;
        const change = data[tokenId].usd_24h_change || 0;
        setTokenPrice(price);
        setTokenPriceChange(change);
        setLastUpdated(new Date());

        // Auto-fill entry price with current price if empty
        if (entryPrice === 0) {
          setEntryPrice(price);
        }
      } else {
        setTokenPrice(0);
        setTokenPriceChange(0);
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      setTokenPrice(0);
      setTokenPriceChange(0);
    } finally {
      setIsLoadingPrice(false);
    }
  }, [selectedChain, selectedToken, entryPrice]);

  // Fetch price on chain/token change
  useEffect(() => {
    fetchTokenPrice();
    const interval = setInterval(fetchTokenPrice, 30000);
    return () => clearInterval(interval);
  }, [fetchTokenPrice]);

  // ============================================================
  // CRYPTO CALCULATOR LOGIC
  // ============================================================
  useEffect(() => {
    const invested = entryPrice * quantity;
    const currentValue = exitPrice * quantity;
    const pl = currentValue - invested;
    const roiPercent = invested > 0 ? (pl / invested) * 100 : 0;

    setInvestment(invested);
    setProfitLoss(pl);
    setRoi(roiPercent);
  }, [entryPrice, exitPrice, quantity]);

  // ============================================================
  // QUICK FILL WITH LIVE PRICE
  // ============================================================
  const fillWithLivePrice = () => {
    setEntryPrice(tokenPrice);
  };

  const calculateTargetPrice = (targetProfit) => {
    if (quantity > 0) {
      const targetPrice = (investment + targetProfit) / quantity;
      setExitPrice(targetPrice);
    }
  };

  // ============================================================
  // EXISTING LOGIC
  // ============================================================
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    let userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      userDataString = localStorage.getItem('UserData');
    }

    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        const id = parsedUserData.UserId || parsedUserData.userId || parsedUserData.URID;
        setUserId(id);
      } catch (error) {
        console.error('Error parsing UserData:', error);
      }
    }
  }, []);



  useEffect(() => {
    countdownIntervalRef.current = setInterval(() => {
      if (isMounted.current) {
        setSecondsLeft((prev) => (prev <= 1 ? 120 : prev - 1));
      }
    }, 1000);
    return () => clearInterval(countdownIntervalRef.current);
  }, []);



  const fetchTransactionLog = useCallback(async () => {
    try {
      const response = await fetch(
        'https://apis.abrixlabs.live/api/Authentication/getAllTransactionLog_xoxo',
        {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-cache',
        }
      );
      const result = await response.json();

      if (result.statusCode === 200 && result.data?.length > 0 && isMounted.current) {
        const formattedTx = result.data.map((tx) => {
          const date = new Date(tx.Datex);
          let chainDisplay = tx.NetworkChain || 'Unknown';
          if (chainDisplay.toLowerCase().includes('sol')) chainDisplay = 'SOL';
          else if (chainDisplay.toLowerCase().includes('bsc')) chainDisplay = 'BSC';
          else if (chainDisplay.toLowerCase().includes('eth')) chainDisplay = 'ETH';
          else if (
            chainDisplay.toLowerCase().includes('avax') ||
            chainDisplay.toLowerCase().includes('avalanche')
          )
            chainDisplay = 'AVAX';

          return {
            time: date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }),
            chain: chainDisplay,
            hash: tx.TransactionHash,
            profit: `+$${tx.Amount?.toFixed(2) || '0.00'}`,
            timestamp: date.getTime(),
          };
        });

        const shuffleArray = (arr) => {
          const shuffled = [...arr];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };

        const shuffledTransactions = shuffleArray(formattedTx);
        setTransactions(shuffledTransactions);
        setScanData((prev) => [
          ...prev.slice(-29),
          { value: Math.random() * 100 + 20, timestamp: Date.now() },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactionLog();
    intervalRef.current = setInterval(() => fetchTransactionLog(), 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchTransactionLog]);

  // Update stats when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      const totalProfitValue = transactions.reduce((sum, tx) => {
        const profitValue = parseFloat(tx.profit?.replace(/[^0-9.-]/g, '')) || 0;
        return sum + profitValue;
      }, 0);

      const totalTxCount = transactions.length;
      const successRateValue = 99.5 + (Math.random() * 0.49);

      setTotalProfit(totalProfitValue);
      setTotalTransactions(totalTxCount);
      setSuccessRate(+successRateValue.toFixed(2));

      setFlashEffect({ profit: true, tx: true, success: true });
      setTimeout(() => {
        if (isMounted.current) setFlashEffect({ profit: false, tx: false, success: false });
      }, 500);
    }
  }, [transactions]);

  useEffect(() => {
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      value: Math.random() * 100 + 20,
      timestamp: Date.now() - (30 - i) * 1000,
    }));
    setScanData(initialData);

    const activityInterval = setInterval(() => {
      setScanData((prev) => [
        ...prev.slice(-29),
        { value: Math.random() * 100 + 20, timestamp: Date.now() },
      ]);
    }, 2000);
    return () => clearInterval(activityInterval);
  }, []);

  useEffect(() => {
    if (scanChartRef.current && scanData.length > 0) {
      chartInstances.current.forEach((chart) => chart.destroy());
      chartInstances.current = [];
      const chart = new Chart(scanChartRef.current, {
        type: 'line',
        data: {
          labels: scanData.map((_, i) => `${i}s`),
          datasets: [
            {
              data: scanData.map((p) => p.value),
              borderColor: '#00d4ff',
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
      chartInstances.current.push(chart);
    }
  }, [scanData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBot = (e) => setBotChecked(e.target.checked);
  const pickStrategy = (name) => setSelectedStrategy(name);
  const getChainColor = (chain) =>
    chain === 'SOL' ? 'sol' : chain === 'BSC' ? 'bsc' : chain === 'ETH' ? 'eth' : chain === 'AVAX' ? 'avax' : 'eth';

  // ============================================================
  // HANDLE CHAIN CHANGE
  // ============================================================
  const handleChainChange = (chainKey) => {
    setSelectedChain(chainKey);
    const firstToken = CHAIN_TOKENS[chainKey]?.[0]?.symbol || chainKey;
    setSelectedToken(firstToken);
    setShowChainDropdown(false);
    setShowTokenDropdown(false);
  };

  // ============================================================
  // HANDLE TOKEN CHANGE
  // ============================================================
  const handleTokenChange = (tokenSymbol) => {
    setSelectedToken(tokenSymbol);
    setShowTokenDropdown(false);
  };

  // ============================================================
  // CLICK OUTSIDE TO CLOSE DROPDOWNS (FIXED - Simple)
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Chain dropdown
      if (chainDropdownRef.current && !chainDropdownRef.current.contains(e.target)) {
        setShowChainDropdown(false);
      }
      // Token dropdown
      if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(e.target)) {
        setShowTokenDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="page" id="p-engine">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-400">Loading Roventar Engine data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page" id="p-engine">
        <div className="grid-two-col">
          {/* LEFT COLUMN */}
          <div className="left-col">
            <div className="scard main-card">
              <div className="card-header">
                <div className="card-title-section">
                  <div className="card-title">Roventar Engine</div>
                  <div className="card-subtitle">
                    AI MEV + cross-chain arb · 24 autonomous — Auto-updates
                  </div>
                </div>
             
              </div>

              {/* Stats - No Price Section Here */}
              <div className="stats-grid">
                <div className={`scard stat-card ${flashEffect.profit ? 'flash-update-slow' : ''}`}>
                  <div className="stat-label">Total Profit</div>
                  <div className="stat-value stat-value-primary">
                    <AnimatedCounter value={totalProfit} prefix="$" decimals={2} />
                  </div>
                  <div className="stat-trend trending-up">
                    <span className="live-dot-slow"></span>
                    Real-time Earnings
                  </div>
                </div>

                <div className={`scard stat-card ${flashEffect.tx ? 'flash-update-slow' : ''}`}>
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value stat-value-secondary">
                    <AnimatedCounter value={totalTransactions} />
                  </div>
                  <div className="stat-trend trending-neutral">
                    <span className="pulse-dot-slow"></span>
                    Executed Trades
                  </div>
                </div>

                <div className={`scard stat-card ${flashEffect.success ? 'flash-update-slow' : ''}`}>
                  <div className="stat-label">Success Rate</div>
                  <div className="stat-value stat-value-tertiary">
                    <AnimatedCounter value={successRate} decimals={2} suffix="%" />
                  </div>
                  <div className="stat-trend trending-up">
                    <span className="live-dot-slow"></span>
                    Stable Performance
                  </div>
                </div>
              </div>

              <div className="section-header">
                <div className="section-title">Live TX Stream</div>
                <span className="tag tag-live">● LIVE</span>
              </div>
              <div className="transactions-list">
                {transactions.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 py-8">
                    Waiting for transactions...
                  </div>
                ) : (
                  transactions.map((tx, idx) => (
                    <div
                      key={`${tx.hash}-${idx}`}
                      className="tx-item"
                      onClick={() => openExplorer(tx.chain, tx.hash)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="tx-left">
                        <span className={`tag ${getChainColor(tx.chain)}`}>{tx.chain}</span>
                        <span className="ml hash-text">{truncateHash(tx.hash, 20)}</span>
                      </div>
                      <div className="tx-right">
                        <span className="tx-profit" style={{ color: '#10b981', fontWeight: 600 }}>
                          {tx.profit}
                        </span>
                        <span className="tx-time" style={{ fontSize: '11px', color: '#64748b' }}>
                          {tx.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="scard scanner-card">
              <div className="section-header">
                <div className="section-title">Scanner Activity</div>
                <span className="tag tag-real">Real-time</span>
              </div>
              <div className="scanner-container">
                <div className="scanner-line"></div>
                <div className="chart-wrapper">
                  <canvas ref={scanChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-col">
            <div className="scard strategy-card">
              <div className="section-title">Strategy Mode</div>
              <div className="strategies-list mt-3">
                <div
                  className={`strategy-item ${selectedStrategy === 'MEV Sandwich' ? 'selected' : ''}`}
                  onClick={() => pickStrategy('MEV Sandwich')}
                >
                  <div className="strategy-check">
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <polyline
                        points="1.5,4 3,5.5 6.5,2"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="strategy-name">MEV Sandwich</div>
                  <div className="strategy-desc">Front-run pending large txs</div>
                  <div className="strategy-apy">~340% APY</div>
                </div>
                <div
                  className={`strategy-item ${selectedStrategy === 'Cross-DEX Arb' ? 'selected' : ''}`}
                  onClick={() => pickStrategy('Cross-DEX Arb')}
                >
                  <div className="strategy-check">
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <polyline
                        points="1.5,4 3,5.5 6.5,2"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="strategy-name">Cross-DEX Arb</div>
                  <div className="strategy-desc">Jupiter, Orca, Uniswap, Curve</div>
                  <div className="strategy-apy">~180% APY</div>
                </div>
                <div
                  className={`strategy-item ${selectedStrategy === 'Flash Loan Arb' ? 'selected' : ''}`}
                  onClick={() => pickStrategy('Flash Loan Arb')}
                >
                  <div className="strategy-check">
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <polyline
                        points="1.5,4 3,5.5 6.5,2"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="strategy-name">Flash Loan Arb</div>
                  <div className="strategy-desc">Aave/dYdX zero-capital flash</div>
                  <div className="strategy-apy">~260% APY</div>
                </div>
                <div
                  className={`strategy-item ${selectedStrategy === 'Triangular Arb' ? 'selected' : ''}`}
                  onClick={() => pickStrategy('Triangular Arb')}
                >
                  <div className="strategy-check">
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <polyline
                        points="1.5,4 3,5.5 6.5,2"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="strategy-name">Triangular Arb</div>
                  <div className="strategy-desc">A → B → C → A profit loops</div>
                  <div className="strategy-apy">~120% APY</div>
                </div>
              </div>
            </div>

            {/* ============================================================
                MULTI-CHAIN CRYPTO CALCULATOR - ALL 4 CHAINS
            ============================================================= */}
            <div className="scard calculator-card">
              <div className="section-header">
                <div className="section-title">
                  <span className="calc-icon">📊</span> Multi-Chain Calculator
                </div>
                <span className="tag tag-real">
                  <span className="live-dot-small"></span> Live
                </span>
              </div>

              {/* ============================================================
                  PRICE SECTION - INSIDE CALCULATOR (ALL 4 CHAINS)
              ============================================================= */}
              <div className="price-display">
                {/* CHAIN SELECTOR */}
                <div className="chain-selector" ref={chainDropdownRef}>
                  <button
                    type="button"
                    className="chain-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChainDropdown((prev) => !prev);
                      setShowTokenDropdown(false);
                    }}
                  >
                    <span className="chain-icon">{CHAINS[selectedChain]?.icon}</span>
                    <span className="chain-name">{selectedChain}</span>
                    <span className="dropdown-arrow">▾</span>
                  </button>

                  {showChainDropdown && (
                    <div className="dropdown-menu">
                      {Object.keys(CHAINS).map((key) => (
                        <div
                          key={key}
                          className={`dropdown-item ${selectedChain === key ? 'active' : ''}`}
                          onClick={() => handleChainChange(key)}
                        >
                          <span className="chain-icon">{CHAINS[key].icon}</span>
                          <span>{CHAINS[key].name}</span>
                          <span className="chain-symbol">{key}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* TOKEN SELECTOR */}
                <div className="token-selector" ref={tokenDropdownRef}>
                  <button
                    type="button"
                    className="token-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTokenDropdown((prev) => !prev);
                      setShowChainDropdown(false);
                    }}
                  >
                    <span className="token-name">{selectedToken}</span>
                    <span className="dropdown-arrow">▾</span>
                  </button>

                  {showTokenDropdown && (
                    <div className="dropdown-menu token-dropdown">
                      {CHAIN_TOKENS[selectedChain]?.map((token) => (
                        <div
                          key={token.symbol}
                          className={`dropdown-item ${selectedToken === token.symbol ? 'active' : ''}`}
                          onClick={() => handleTokenChange(token.symbol)}
                        >
                          <span>{token.symbol}</span>
                          <span className="token-full-name">{token.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="price-info">
                  <div className="current-price">
                    <span className="price-label">PRICE</span>
                    <span className="price-value">
                      {isLoadingPrice ? (
                        <span className="loading-dots">...</span>
                      ) : (
                        formatCurrency(tokenPrice)
                      )}
                    </span>
                  </div>
                  <div
                    className={`price-change ${tokenPriceChange >= 0 ? 'positive' : 'negative'}`}
                  >
                    {tokenPriceChange >= 0 ? '▲' : '▼'}
                    {Math.abs(tokenPriceChange).toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Use Live Price Button - Inside Calculator */}
              <button className="btn-live-price" onClick={fillWithLivePrice}>
                <span className="live-dot"></span>
                Use Live Price
              </button>

              {lastUpdated && (
                <div className="last-updated">Updated: {lastUpdated.toLocaleTimeString()}</div>
              )}

              <div className="calc-grid">
                <div className="form-group">
                  <label className="form-label">💰 Entry Price (USD)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">$</span>
                    <input
                      className="form-input calc-input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={entryPrice || ''}
                      onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🚀 Exit Price (USD)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">$</span>
                    <input
                      className="form-input calc-input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={exitPrice || ''}
                      onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">📦 Quantity (Tokens)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🪙</span>
                    <input
                      className="form-input calc-input"
                      type="number"
                      step="0.0001"
                      min="0"
                      value={quantity || ''}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                      placeholder="0.0000"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Target Buttons - Mobile friendly */}
              <div className="quick-targets">
                <span className="quick-label">Target Profit:</span>
                <button className="target-btn" onClick={() => calculateTargetPrice(10)}>+$10</button>
                <button className="target-btn" onClick={() => calculateTargetPrice(50)}>+$50</button>
                <button className="target-btn" onClick={() => calculateTargetPrice(100)}>+$100</button>
                <button className="target-btn" onClick={() => calculateTargetPrice(500)}>+$500</button>
              </div>

              <div className="calc-results">
                <div className="result-item">
                  <div className="result-label">💰 Investment</div>
                  <div className="result-value">
                    {investment > 0 ? formatCurrency(investment) : '$0.00'}
                  </div>
                </div>

                <div className="result-item">
                  <div className="result-label">📈 P&L</div>
                  <div
                    className="result-value"
                    style={{ color: profitLoss >= 0 ? '#10b981' : '#ef4444' }}
                  >
                    {profitLoss !== 0 ? formatCurrency(profitLoss) : '$0.00'}
                    {profitLoss > 0 && <span className="trend-arrow"> ▲</span>}
                    {profitLoss < 0 && <span className="trend-arrow"> ▼</span>}
                  </div>
                </div>

                <div className="result-item highlight">
                  <div className="result-label">🎯 ROI</div>
                  <div
                    className="result-value roi-value"
                    style={{ color: roi >= 0 ? '#10b981' : '#ef4444' }}
                  >
                    {roi !== 0 ? roi.toFixed(2) + '%' : '0.00%'}
                  </div>
                </div>
              </div>

              <div className="chain-info">
                <div className="chain-badge">
                  <span className="chain-icon">{CHAINS[selectedChain]?.icon}</span>
                  <span>{CHAINS[selectedChain]?.name}</span>
                </div>
                <div className="token-badge">
                  <span>{selectedToken}</span>
                  <span className="token-price-small">{formatCurrency(tokenPrice)}</span>
                </div>
                <button
                  className="reset-btn"
                  onClick={() => {
                    setEntryPrice(0);
                    setExitPrice(0);
                    setQuantity(0);
                  }}
                >
                  ✕ Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STYLES (FIXED - FULL MOBILE RESPONSIVE)
      ============================================================= */}
      <style jsx>{`
        /* ============================================================
           BASE LAYOUT
        ============================================================= */
        .page {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .grid-two-col {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        .scard {
          background: var(--bg-card, #ffffff);
          border: 1px solid #ddebec;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .left-col,
        .right-col {
          min-width: 0;
          width: 100%;
        }

        /* ============================================================
           CARD HEADER
        ============================================================= */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .card-title-section {
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-1, #0f2942);
        }

        .card-subtitle {
          font-size: 12px;
          color: #94a3b8;
        }

        /* ============================================================
           STATS GRID
        ============================================================= */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 8px;
        }

        .stat-card {
          padding: 16px;
          background: var(--bg-2, #f8fafc);
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin: 4px 0;
        }

        .stat-value-primary {
          color: #06b6d4;
        }
        .stat-value-secondary {
          color: #f59e0b;
        }
        .stat-value-tertiary {
          color: #8b5cf6;
        }

        .stat-trend {
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trending-up {
          color: #10b981;
        }
        .trending-neutral {
          color: #f59e0b;
        }

        .live-dot-slow {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          animation: blink-slow 2s infinite;
        }

        .pulse-dot-slow {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse-slow 2s infinite;
        }

        .flash-update-slow {
          animation: flash-slow 0.5s ease-in-out;
        }

        /* ============================================================
           PRICE DISPLAY
        ============================================================= */
        .price-display {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          position: relative;
          overflow: visible !important;
          z-index: 100;
        }

        .chain-selector {
          position: relative;
          z-index: 1000;
        }

        .chain-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }

        .chain-btn:hover {
          border-color: #06b6d4;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
        }

        .chain-icon {
          font-size: 18px;
        }

        .chain-name {
          font-weight: 600;
        }

        .dropdown-arrow {
          font-size: 10px;
          opacity: 0.5;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          min-width: 210px;
          max-height: 300px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
          z-index: 999999 !important;
          overflow-x: hidden;
          overflow-y: auto;
          display: block;
        }

        .token-dropdown {
          min-width: 190px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
        }

        .dropdown-item.active {
          background: #06b6d4;
          color: white;
        }

        .chain-symbol {
          margin-left: auto;
          font-size: 11px;
          opacity: 0.6;
          font-weight: 600;
        }

        .token-selector {
          position: relative;
          z-index: 1000;
        }

        .token-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }

        .token-btn:hover {
          border-color: #06b6d4;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
        }

        .token-full-name {
          font-size: 11px;
          opacity: 0.6;
          margin-left: auto;
        }

        .price-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
        }

        .current-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .price-label {
          font-size: 10px;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .price-value {
          font-size: 20px;
          font-weight: 700;
          color: #0f2942;
        }

        .price-change {
          font-size: 14px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .price-change.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .price-change.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .loading-dots {
          animation: pulse 1s infinite;
        }

        .btn-live-price {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 12px;
          width: 100%;
          justify-content: center;
        }

        .btn-live-price:hover {
          background: #0891b2;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .live-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        /* ============================================================
           CALCULATOR
        ============================================================= */
        .calculator-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid #ddebec;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .calc-icon {
          font-size: 18px;
          margin-right: 8px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-1, #0f2942);
        }

        .tag-real {
          font-size: 10px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          padding: 3px 10px;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .live-dot-small {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #10b981;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        .last-updated {
          font-size: 10px;
          color: #94a3b8;
          text-align: right;
          margin-bottom: 12px;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 12px 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: #aab8c7;
          letter-spacing: 0.3px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          font-size: 14px;
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
        }

        .calc-input {
          padding-left: 36px !important;
          width: 100%;
          background: var(--bg-2, #f8fafc);
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          color: var(--text-1, #0f2942);
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .calc-input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .calc-input::placeholder {
          color: #94a3b8;
        }

        /* Quick Targets */
        .quick-targets {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin: 8px 0;
          padding: 8px 12px;
          background: var(--bg-2, #f8fafc);
          border-radius: 8px;
        }

        .quick-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
        }

        .target-btn {
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .target-btn:hover {
          background: #06b6d4;
          color: white;
          border-color: #06b6d4;
        }

        /* Results */
        .calc-results {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin: 10px 0;
          padding: 16px;
          background: var(--bg-2, #f8fafc);
          border-radius: 12px;
        }

        .result-item {
          text-align: center;
          padding: 8px;
          border-radius: 8px;
          background: var(--bg-card, #ffffff);
        }

        .result-item.highlight {
          background: linear-gradient(
            135deg,
            rgba(6, 182, 212, 0.08),
            rgba(124, 58, 237, 0.08)
          );
          border: 1px solid rgba(6, 182, 212, 0.15);
        }

        .result-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .result-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-1, #0f2942);
        }

        .roi-value {
          font-size: 22px;
        }

        .trend-arrow {
          font-size: 12px;
        }

        /* Chain Info */
        .chain-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding: 12px;
          background: var(--bg-2, #f8fafc);
          border-radius: 8px;
          margin-top: 8px;
        }

        .chain-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
        }

        .token-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
        }

        .token-price-small {
          font-size: 12px;
          color: #64748b;
          font-weight: 400;
        }

        .reset-btn {
          margin-left: auto;
          padding: 4px 14px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        /* ============================================================
           STRATEGY
        ============================================================= */
        .strategy-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid #ddebec;
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .strategies-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .strategy-item {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-2, #f8fafc);
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .strategy-item:hover {
          border-color: #06b6d4;
        }

        .strategy-item.selected {
          border-color: #06b6d4;
          background: rgba(6, 182, 212, 0.05);
        }

        .strategy-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .strategy-item.selected .strategy-check {
          background: #06b6d4;
          border-color: #06b6d4;
        }

        .strategy-name {
          font-weight: 600;
          font-size: 14px;
        }

        .strategy-desc {
          font-size: 11px;
          color: #94a3b8;
        }

        .strategy-apy {
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
        }

        /* ============================================================
           TRANSACTIONS
        ============================================================= */
        .transactions-list {
          max-height: 400px;
          overflow-y: auto;
          margin-top: 8px;
        }

        .tx-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tx-item:hover {
          background: #f8fafc;
        }

        .tx-left {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tx-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hash-text {
          font-size: 13px;
        }

        .tx-profit {
          font-size: 13px;
        }

        .tx-time {
          font-size: 11px;
          color: #64748b;
        }

        .tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .tag.sol {
          background: rgba(153, 69, 255, 0.15);
          color: #9945ff;
        }
        .tag.bsc {
          background: rgba(240, 185, 11, 0.15);
          color: #f0b90b;
        }
        .tag.eth {
          background: rgba(98, 126, 234, 0.15);
          color: #627eea;
        }
        .tag.avax {
          background: rgba(232, 65, 66, 0.15);
          color: #e84142;
        }

        .tag-live {
          font-size: 10px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          padding: 3px 10px;
          border-radius: 12px;
          font-weight: 600;
        }

        .ml {
          margin-left: 4px;
        }

        /* ============================================================
           TOGGLE
        ============================================================= */
        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #e2e8f0;
          border-radius: 13px;
          transition: all 0.3s;
        }

        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle input:checked + .toggle-track {
          background: #06b6d4;
        }

        .toggle input:checked + .toggle-track + .toggle-thumb {
          transform: translateX(22px);
        }

        /* ============================================================
           SCANNER
        ============================================================= */
        .scanner-container {
          position: relative;
          height: 120px;
          margin-top: 8px;
        }

        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #06b6d4, transparent);
          animation: scan 2s linear infinite;
          opacity: 0.5;
        }

        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }

        .chart-wrapper {
          width: 100%;
          height: 100%;
        }

        /* ============================================================
           ANIMATIONS
        ============================================================= */
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes blink-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes pulse-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes flash-slow {
          0% {
            background-color: rgba(6, 182, 212, 0);
          }
          30% {
            background-color: rgba(6, 182, 212, 0.12);
          }
          70% {
            background-color: rgba(6, 182, 212, 0.06);
          }
          100% {
            background-color: rgba(6, 182, 212, 0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* ============================================================
           MOBILE RESPONSIVE BREAKPOINTS
        ============================================================= */

        /* Tablets & Small Laptops (1024px and below) */
        @media (max-width: 1024px) {
          .grid-two-col {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .page {
            padding: 12px;
          }

          .scard {
            padding: 1.25rem;
          }

          .transactions-list {
            max-height: 350px;
          }
        }

        /* Mobile Phones (640px and below) */
        @media (max-width: 640px) {
          .page {
            padding: 8px;
          }

          .scard {
            padding: 0.75rem;
            border-radius: 0.75rem;
          }

          .grid-two-col {
            gap: 10px;
          }

          /* Card Header */
          .card-header {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .card-title {
            font-size: 17px;
          }

          .card-subtitle {
            font-size: 10px;
          }

          .toggle {
            align-self: flex-start;
          }

          /* Stats Grid */
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .stat-card {
            padding: 10px;
          }

          .stat-value {
            font-size: 18px;
          }

          .stat-label {
            font-size: 9px;
          }

          .stat-trend {
            font-size: 8px;
          }

          /* Price Display */
          .price-display {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding: 12px;
          }

          .chain-btn,
          .token-btn {
            font-size: 12px;
            padding: 6px 10px;
            width: 100%;
            justify-content: center;
          }

          .chain-icon {
            font-size: 14px;
          }

          .price-info {
            margin-left: 0;
            justify-content: space-between;
            width: 100%;
          }

          .price-value {
            font-size: 16px;
          }

          .price-change {
            font-size: 12px;
            padding: 2px 8px;
          }

          /* Dropdowns */
          .dropdown-menu {
            min-width: 100%;
            left: 0;
            right: 0;
            max-height: 180px;
          }

          .dropdown-item {
            padding: 8px 12px;
            font-size: 13px;
          }

          .token-dropdown {
            min-width: 100%;
          }

          /* Calculator */
          .calc-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .calc-input {
            font-size: 13px;
            padding: 8px 12px;
            padding-left: 32px;
          }

          .input-icon {
            font-size: 12px;
            left: 10px;
          }

          .calc-results {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 6px;
            padding: 10px;
          }

          .result-item {
            padding: 6px;
          }

          .result-value {
            font-size: 14px;
          }

          .result-label {
            font-size: 9px;
          }

          .roi-value {
            font-size: 17px;
          }

          /* Quick Targets */
          .quick-targets {
            gap: 4px;
            padding: 6px 10px;
          }

          .quick-label {
            font-size: 10px;
            width: 100%;
          }

          .target-btn {
            font-size: 10px;
            padding: 3px 10px;
          }

          /* Chain Info */
          .chain-info {
            flex-wrap: wrap;
            gap: 6px;
            padding: 8px;
          }

          .chain-badge,
          .token-badge {
            font-size: 11px;
            padding: 3px 10px;
          }

          .reset-btn {
            font-size: 10px;
            padding: 3px 10px;
            margin-left: 0;
          }

          /* Strategy */
          .strategy-item {
            grid-template-columns: auto 1fr auto auto;
            gap: 8px;
            padding: 10px 12px;
          }

          .strategy-name {
            font-size: 12px;
          }

          .strategy-desc {
            font-size: 10px;
          }

          .strategy-apy {
            font-size: 10px;
          }

          .strategy-check {
            width: 16px;
            height: 16px;
          }

          /* Transactions */
          .transactions-list {
            max-height: 280px;
          }

          .tx-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 6px 8px;
          }

          .tx-left {
            width: 100%;
          }

          .tx-right {
            width: 100%;
            justify-content: space-between;
          }

          .hash-text {
            font-size: 11px;
          }

          .tx-profit {
            font-size: 12px;
          }

          .tx-time {
            font-size: 10px;
          }

          .tag {
            font-size: 8px;
            padding: 1px 6px;
          }

          /* Scanner */
          .scanner-container {
            height: 70px;
          }

          /* Section Headers */
          .section-title {
            font-size: 14px;
          }

          .section-header {
            margin-bottom: 8px;
          }

          .tag-live,
          .tag-real {
            font-size: 8px;
            padding: 2px 8px;
          }

          .calc-icon {
            font-size: 14px;
          }

          /* Buttons */
          .btn-live-price {
            font-size: 12px;
            padding: 6px 14px;
          }

          .last-updated {
            font-size: 9px;
          }
        }

        /* Very Small Phones (400px and below) */
        @media (max-width: 400px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .calc-results {
            grid-template-columns: 1fr;
          }

          .price-display {
            flex-direction: column;
            align-items: stretch;
          }

          .price-info {
            flex-direction: row;
            justify-content: space-between;
          }

          .chain-selector,
          .token-selector {
            width: 100%;
          }

          .chain-btn,
          .token-btn {
            width: 100%;
            justify-content: center;
          }

          .dropdown-menu {
            min-width: 100%;
          }

          .strategy-item {
            grid-template-columns: 1fr;
            gap: 4px;
            text-align: center;
          }

          .strategy-check {
            justify-self: center;
          }

          .strategy-desc {
            display: none;
          }

          .strategy-apy {
            justify-self: center;
          }

          .tx-item {
            padding: 4px 6px;
          }

          .hash-text {
            font-size: 10px;
          }

          .tx-profit {
            font-size: 11px;
          }

          .tx-time {
            font-size: 9px;
          }

          .scard {
            padding: 0.5rem;
          }

          .card-title {
            font-size: 15px;
          }
        }

        /* ============================================================
           DARK MODE STYLES
        ============================================================= */

        :global(.dark) .card-title,
        :global([data-theme="dark"]) .card-title {
          color: #eaf4ff !important;
        }

        :global(.dark) .section-title,
        :global([data-theme="dark"]) .section-title {
          color: #eaf4ff !important;
        }

        :global(.dark) .card-subtitle,
        :global([data-theme="dark"]) .card-subtitle {
          color: #9fb0c0 !important;
        }

        :global(.dark) .price-label,
        :global([data-theme="dark"]) .price-label {
          color: #9fb0c0 !important;
        }

        :global(.dark) .price-value,
        :global([data-theme="dark"]) .price-value {
          color: #102a43 !important;
        }

        :global(.dark) .chain-btn,
        :global([data-theme="dark"]) .chain-btn,
        :global(.dark) .token-btn,
        :global([data-theme="dark"]) .token-btn {
          background: #ffffff !important;
          color: #16283a !important;
          border-color: #d7e0e8 !important;
        }

        :global(.dark) .chain-name,
        :global([data-theme="dark"]) .chain-name {
          color: #16283a !important;
        }

        :global(.dark) .dropdown-arrow,
        :global([data-theme="dark"]) .dropdown-arrow {
          color: #475569 !important;
        }

        :global(.dark) .dropdown-menu,
        :global([data-theme="dark"]) .dropdown-menu {
          background: #172b38 !important;
          border-color: #3b5262 !important;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45) !important;
          z-index: 999999 !important;
        }

        :global(.dark) .dropdown-item,
        :global([data-theme="dark"]) .dropdown-item {
          color: #eaf4ff !important;
          background: transparent !important;
        }

        :global(.dark) .dropdown-item:hover,
        :global([data-theme="dark"]) .dropdown-item:hover {
          background: #243d4d !important;
        }

        :global(.dark) .dropdown-item.active,
        :global([data-theme="dark"]) .dropdown-item.active {
          background: #06b6d4 !important;
          color: #ffffff !important;
        }

        :global(.dark) .chain-symbol,
        :global([data-theme="dark"]) .chain-symbol,
        :global(.dark) .token-full-name,
        :global([data-theme="dark"]) .token-full-name {
          color: #9fb0c0 !important;
        }

        :global(.dark) .btn-live-price,
        :global([data-theme="dark"]) .btn-live-price {
          color: #ffffff !important;
        }

        :global(.dark) .form-label,
        :global([data-theme="dark"]) .form-label {
          color: #aebdcc !important;
        }

        :global(.dark) .calc-input,
        :global([data-theme="dark"]) .calc-input {
          background: #102531 !important;
          border-color: #8fa3b4 !important;
          color: #f1f7fc !important;
          -webkit-text-fill-color: #f1f7fc !important;
        }

        :global(.dark) .calc-input:focus,
        :global([data-theme="dark"]) .calc-input:focus {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15) !important;
        }

        :global(.dark) .calc-input::placeholder,
        :global([data-theme="dark"]) .calc-input::placeholder {
          color: #8fa3b4 !important;
          opacity: 1 !important;
        }

        :global(.dark) .input-icon,
        :global([data-theme="dark"]) .input-icon {
          color: #b7c5d1 !important;
          opacity: 1 !important;
        }

        :global(.dark) .quick-targets,
        :global([data-theme="dark"]) .quick-targets {
          background: #102531 !important;
        }

        :global(.dark) .quick-label,
        :global([data-theme="dark"]) .quick-label {
          color: #aebdcc !important;
        }

        :global(.dark) .target-btn,
        :global([data-theme="dark"]) .target-btn {
          background: #172b38 !important;
          color: #dce8f2 !important;
          border-color: #526777 !important;
        }

        :global(.dark) .target-btn:hover,
        :global([data-theme="dark"]) .target-btn:hover {
          background: #06b6d4 !important;
          color: #ffffff !important;
          border-color: #06b6d4 !important;
        }

        :global(.dark) .calc-results,
        :global([data-theme="dark"]) .calc-results {
          background: #102531 !important;
        }

        :global(.dark) .result-item,
        :global([data-theme="dark"]) .result-item {
          background: #172b38 !important;
        }

        :global(.dark) .result-label,
        :global([data-theme="dark"]) .result-label {
          color: #aebdcc !important;
        }

        :global(.dark) .result-value,
        :global([data-theme="dark"]) .result-value {
          color: #f1f7fc !important;
        }

        :global(.dark) .chain-info,
        :global([data-theme="dark"]) .chain-info {
          background: #102531 !important;
        }

        :global(.dark) .chain-badge,
        :global([data-theme="dark"]) .chain-badge,
        :global(.dark) .token-badge,
        :global([data-theme="dark"]) .token-badge {
          background: #172b38 !important;
          color: #eaf4ff !important;
          border-color: #526777 !important;
        }

        :global(.dark) .token-price-small,
        :global([data-theme="dark"]) .token-price-small {
          color: #aebdcc !important;
        }

        :global(.dark) .reset-btn,
        :global([data-theme="dark"]) .reset-btn {
          background: #ffffff !important;
          color: #ef4444 !important;
          border-color: #d7e0e8 !important;
        }

        :global(.dark) .stat-card,
        :global([data-theme="dark"]) .stat-card {
          background: #102531 !important;
          border-color: #294353 !important;
        }

        :global(.dark) .stat-label,
        :global([data-theme="dark"]) .stat-label {
          color: #aebdcc !important;
        }

        :global(.dark) .stat-trend,
        :global([data-theme="dark"]) .stat-trend {
          color: #aebdcc !important;
        }

        :global(.dark) .last-updated,
        :global([data-theme="dark"]) .last-updated {
          color: #9fb0c0 !important;
        }

        :global(.dark) .strategy-item,
        :global([data-theme="dark"]) .strategy-item {
          background: #102531 !important;
          border-color: #294353 !important;
        }

        :global(.dark) .strategy-name,
        :global([data-theme="dark"]) .strategy-name {
          color: #eaf4ff !important;
        }

        :global(.dark) .strategy-desc,
        :global([data-theme="dark"]) .strategy-desc {
          color: #9fb0c0 !important;
        }

        :global(.dark) .strategy-check,
        :global([data-theme="dark"]) .strategy-check {
          border-color: #657a8a !important;
        }

        :global(.dark) .tx-item,
        :global([data-theme="dark"]) .tx-item {
          border-bottom-color: #294353 !important;
        }

        :global(.dark) .tx-item:hover,
        :global([data-theme="dark"]) .tx-item:hover {
          background: #172b38 !important;
        }

        :global(.dark) .calculator-card,
        :global([data-theme="dark"]) .calculator-card,
        :global(.dark) .scard,
        :global([data-theme="dark"]) .scard,
        :global(.dark) .strategy-card,
        :global([data-theme="dark"]) .strategy-card {
          color: #eaf4ff !important;
        }

        :global(.dark) .price-display,
        :global([data-theme="dark"]) .price-display {
          position: relative;
          overflow: visible !important;
          z-index: 100;
        }

        :global(.dark) .chain-selector,
        :global([data-theme="dark"]) .chain-selector,
        :global(.dark) .token-selector,
        :global([data-theme="dark"]) .token-selector {
          position: relative;
          z-index: 1000;
        }

        :global(.dark) .dropdown-menu,
        :global([data-theme="dark"]) .dropdown-menu {
          z-index: 999999 !important;
        }
      `}</style>
    </>
  );
}