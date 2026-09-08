"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getRequestWithToken } from '@/app/api/auth';
import { getUserId } from '@/app/api/auth';
import TradingViewWidget from '@/app/user/components/Tradeview';

export default function ArbionEngine() {
  const pnlChartRef = useRef(null);
  const dailyChartRef = useRef(null);
  const chainChartRef = useRef(null);
  const chartInstances = useRef([]);

  const [tradeHistory, setTradeHistory] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [tradeError, setTradeError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Date formatter function - returns "2/9/26" format
  const formatChartDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Derive chart data from trade history
  const chartData = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      return {
        pnlData: Array.from({ length: 90 }, (_, i) => i * 91.57),
        pnlLabels: Array.from({ length: 90 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (89 - i));
          return formatChartDate(d);
        }),
        dailyData: Array.from({ length: 30 }, () => Math.floor(60 + Math.random() * 280)),
        dailyLabels: Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return formatChartDate(d);
        }),
        chainData: { solana: 52, ethereum: 31, bsc: 17 }
      };
    }

    // Sort trades by date (oldest to newest)
    const sortedTrades = [...tradeHistory].sort((a, b) => {
      return new Date(a.TradeDate) - new Date(b.TradeDate);
    });

    // Group trades by date for daily aggregation
    const dailyGroups = {};
    sortedTrades.forEach((trade) => {
      const date = new Date(trade.TradeDate);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailyGroups[dateKey]) {
        dailyGroups[dateKey] = {
          date: date,
          trades: [],
          totalProfit: 0,
          totalPnL: 0
        };
      }
      dailyGroups[dateKey].trades.push(trade);
      dailyGroups[dateKey].totalProfit += parseFloat(trade.Profit) || 0;
      dailyGroups[dateKey].totalPnL += parseFloat(trade.PNL) || 0;
    });

    // Get sorted dates
    const sortedDates = Object.keys(dailyGroups).sort();
    
    // PnL % data (cumulative sum of PnL %)
    const pnlData = [];
    const pnlLabels = [];
    let cumulativePnL = 0;
    
    // Get last 90 days of data
    const recentDates = sortedDates.slice(-90);
    recentDates.forEach((dateKey) => {
      const dayData = dailyGroups[dateKey];
      cumulativePnL += dayData.totalPnL;
      pnlData.push(cumulativePnL);
      pnlLabels.push(formatChartDate(dayData.date));
    });

    // If less than 90 days, pad with zeros at the beginning
    while (pnlData.length < 90) {
      const dummyDate = new Date();
      dummyDate.setDate(dummyDate.getDate() - (90 - pnlData.length));
      pnlData.unshift(pnlData[0] || 0);
      pnlLabels.unshift(formatChartDate(dummyDate));
    }

    // Daily Profits data (last 30 days)
    const dailyData = [];
    const dailyLabels = [];
    const last30Dates = sortedDates.slice(-30);
    
    last30Dates.forEach((dateKey) => {
      const dayData = dailyGroups[dateKey];
      dailyData.push(dayData.totalProfit);
      dailyLabels.push(formatChartDate(dayData.date));
    });

    // If less than 30 days, pad with zeros
    while (dailyData.length < 30) {
      const dummyDate = new Date();
      dummyDate.setDate(dummyDate.getDate() - (30 - dailyData.length));
      dailyData.unshift(0);
      dailyLabels.unshift(formatChartDate(dummyDate));
    }

    // Chain distribution (by profit)
    const chainDistribution = { Solana: 0, Ethereum: 0, BSC: 0 };
    sortedTrades.forEach((trade) => {
      const market = trade.Market || '';
      const profit = Math.abs(parseFloat(trade.Profit)) || 0;
      if (market.toLowerCase().includes('solana')) {
        chainDistribution.Solana += profit;
      } else if (market.toLowerCase().includes('ethereum') || market.toLowerCase().includes('eth')) {
        chainDistribution.Ethereum += profit;
      } else if (market.toLowerCase().includes('bsc') || market.toLowerCase().includes('binance')) {
        chainDistribution.BSC += profit;
      }
    });

    const totalChain = chainDistribution.Solana + chainDistribution.Ethereum + chainDistribution.BSC || 1;
    const chainPercentages = {
      solana: Math.round((chainDistribution.Solana / totalChain) * 100),
      ethereum: Math.round((chainDistribution.Ethereum / totalChain) * 100),
      bsc: Math.round((chainDistribution.BSC / totalChain) * 100)
    };

    // Ensure total is 100%
    const total = chainPercentages.solana + chainPercentages.ethereum + chainPercentages.bsc;
    if (total !== 100 && total > 0) {
      const diff = 100 - total;
      chainPercentages.solana += diff;
    }

    return {
      pnlData: pnlData.slice(-90),
      pnlLabels: pnlLabels.slice(-90),
      dailyData: dailyData.slice(-30),
      dailyLabels: dailyLabels.slice(-30),
      chainData: chainPercentages
    };
  }, [tradeHistory]);

  // Calculate dynamic metrics from trade history
  const metrics = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      return {
        totalProfit: 8241,
        realizedPnL: 6847,
        totalTrades: 12847,
        winLoss: { wins: 1190, losses: 107 },
        avgProfit: 0.64,
        profitChange: 0.08,
        winRate: 91.8
      };
    }

    // Total Profit - ALL trades (profit + loss)
    const totalProfit = tradeHistory.reduce((sum, trade) => {
      return sum + (parseFloat(trade.TotalProfit) || 0);
    }, 0);
   

    // Realized PnL = Only Profit (not Loss) - ONLY POSITIVE PROFITS
    const realizedPnL = tradeHistory.reduce((sum, trade) => {
      const profit = parseFloat(trade.Profit) || 0;
      if (profit > 0) {
        return sum + profit;
      }
      return sum;
    }, 0);


    // Total trades
    const totalTrades = tradeHistory.length;

    // Win/Loss count
    const wins = tradeHistory.filter(trade => parseFloat(trade.Profit) > 0).length;
    const losses = tradeHistory.filter(trade => parseFloat(trade.Profit) < 0).length;

    // Average profit per trade
    const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;

    // Calculate profit change (compare last trade vs first)
    const sortedByDate = [...tradeHistory].sort((a, b) => {
      return new Date(a.TradeDate) - new Date(b.TradeDate);
    });
    const firstProfit = sortedByDate.length > 0 ? parseFloat(sortedByDate[0].Profit) || 0 : 0;
    const lastProfit = sortedByDate.length > 0 ? parseFloat(sortedByDate[sortedByDate.length - 1].Profit) || 0 : 0;
    const profitChange = lastProfit - firstProfit;

    // Win rate
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    return {
      totalProfit: Math.round(totalProfit * 100) / 100,
      realizedPnL: Math.round(realizedPnL * 100) / 100,
      totalTrades,
      winLoss: { wins, losses },
      avgProfit: Math.round(avgProfit * 100) / 100,
      profitChange: Math.round(profitChange * 100) / 100,
      winRate: Math.round(winRate * 100) / 100
    };
  }, [tradeHistory]);

  // Total PnL for tag
  const totalPnL = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) return 8241;
    return tradeHistory.reduce((sum, trade) => {
      return sum + (parseFloat(trade.Profit) || 0);
    }, 0);
  }, [tradeHistory]);

  useEffect(() => {
    chartInstances.current.forEach(chart => chart.destroy());
    chartInstances.current = [];

    // PnL Curve Chart
    if (pnlChartRef.current && chartData.pnlData) {
      const chart = new Chart(pnlChartRef.current, {
        type: 'line',
        data: {
          labels: chartData.pnlLabels,
          datasets: [{
            label: 'Cumulative PnL %',
            data: chartData.pnlData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `PnL: ${context.parsed.y.toFixed(2)}%`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 10,
                font: { size: 9 }
              }
            },
            y: {
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
      chartInstances.current.push(chart);
    }

    // Daily Profits Chart
    if (dailyChartRef.current && chartData.dailyData) {
      const chart = new Chart(dailyChartRef.current, {
        type: 'bar',
        data: {
          labels: chartData.dailyLabels,
          datasets: [{
            label: 'Daily Profit ($)',
            data: chartData.dailyData,
            backgroundColor: chartData.dailyData.map(value => 
              value >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'
            ),
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Profit: $${context.parsed.y.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 10,
                font: { size: 9 }
              }
            },
            y: {
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      });
      chartInstances.current.push(chart);
    }

    // Chain Distribution Chart
    if (chainChartRef.current && chartData.chainData) {
      const chart = new Chart(chainChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Solana', 'Ethereum', 'BSC'],
          datasets: [{
            data: [chartData.chainData.solana, chartData.chainData.ethereum, chartData.chainData.bsc],
            backgroundColor: ['#9945ff', '#627eea', '#f3ba2f'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { 
              position: 'bottom', 
              labels: { 
                color: 'var(--t2)', 
                font: { size: 11 } 
              } 
            }
          }
        }
      });
      chartInstances.current.push(chart);
    }

    return () => {
      chartInstances.current.forEach(chart => chart.destroy());
      chartInstances.current = [];
    };
  }, [chartData]);

  const showToast = (title, message) => alert(`${title}: ${message}`);

  const urid = useMemo(() => {
    try { return getUserId(); } catch { return null; }
  }, []);

  // Updated date formatter for table - "2/9/26" format
  const formatDate = (value) => {
    if (!value) return { date: '-', time: '' };
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return { date: String(value), time: '' };
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return {
      date: `${day}/${month}/${year}`,
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    };
  };

  const marketClass = (market) => {
    const m = (market || '').toLowerCase();
    if (m.includes('forex')) return 'mkt-forex';
    if (m.includes('metal')) return 'mkt-metals';
    if (m.includes('crypto')) return 'mkt-crypto';
    if (m.includes('indic')) return 'mkt-indices';
    return 'mkt-default';
  };

  const downloadCSV = () => {
    const rows = tradeHistory || [];
    const headers = [
      'TradeDate', 'BotFollow', 'TradeAction', 'Market', 'AssetCode', 'AssetName',
      'AIAgent', 'EntryPrice', 'ExitPrice', 'Profit', 'Capital',
      'PortfolioValue', 'Status',
    ];
    const escapeCSV = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const csv = [
      headers.join(','),
      ...rows.map((t) => [
        t.TradeDate, t.BotFollow, t.TradeAction, t.Market, t.AssetCode, t.AssetName,
        t.AIAgent, t.EntryPrice, t.ExitPrice, t.Profit, t.Capital,
        t.PortfolioValue, t.Status,
      ].map(escapeCSV).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade_history.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchTrades = async () => {
      setLoadingTrades(true);
      setTradeError(null);
      try {
        const res = await getRequestWithToken(`/Authentication/getAgentAnalyticsUser`);
        if (cancelled) return;
        const candidates = [res?.data, res?.Data, res?.result, res?.Result, res?.trades, res?.tradeHistory, res];
        const list = candidates.find((x) => Array.isArray(x));
        setTradeHistory(list || []);
      } catch (e) {
        if (cancelled) return;
        setTradeError(e?.response?.data?.message || e?.message || 'Failed to load trade history');
      } finally {
        if (!cancelled) setLoadingTrades(false);
      }
    };
    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.max(1, Math.ceil((tradeHistory?.length || 0) / pageSize));
  const paginated = (tradeHistory || []).slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div id="p-analytics" className="page">

        {/* DYNAMIC METRICS CARDS */}
        <div className="g4">
          <div className="scard scc">
            <div className="ml">Total Profit</div>
            <div className="mv" style={{ color: metrics.totalProfit >= 0 ? "var(--t2)" : "#f87171" }}>
              ${metrics.totalProfit.toLocaleString()}
            </div>
            <div className="mc up">▲ +{metrics.winRate.toFixed(1)}%</div>
          </div>
          <div className="scard scc">
            <div className="ml">Realized PnL</div>
            <div className="mv" style={{ color: metrics.realizedPnL >= 0 ? "var(--t2)" : "#f87171" }}>
              ${metrics.realizedPnL.toLocaleString()}
            </div>
            <div className="mc up">▲ +${metrics.profitChange.toFixed(2)}</div>
          </div>
          <div className="scard scc">
            <div className="ml">Total Trades</div>
            <div className="mv">{metrics.totalTrades.toLocaleString()}</div>
            <div style={{ fontSize: "10px", color: "var(--t2)", marginTop: "6px", fontFamily: "var(--mono)" }}>
              {metrics.winLoss.wins}W · {metrics.winLoss.losses}L
            </div>
          </div>
          <div className="scard scc">
            <div className="ml">Avg Profit</div>
            <div className="mv" style={{ color: metrics.avgProfit >= 0 ? "var(--a)" : "#f87171" }}>
              ${metrics.avgProfit.toFixed(2)}
            </div>
            <div className="mc up">▲ +${metrics.profitChange.toFixed(2)}</div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="g2">
          <div className="scard scc">
            <div className="sh">
              <div className="st">PnL Curve · 90d</div>
              <span className="tag tg">+{Math.round(metrics.totalProfit).toLocaleString()}%</span>
            </div>
            <div className="cw" style={{ height: "210px" }}>
              <canvas ref={pnlChartRef} role="img" aria-label="90d PnL Percentage">
                Cumulative PnL percentage over 90 days.
              </canvas>
            </div>
          </div>

          <div className="scard scc">
            <div className="sh">
              <div className="st">Daily Profits · 30d</div>
            </div>
            <div className="cw" style={{ height: "210px" }}>
              <canvas ref={dailyChartRef} role="img" aria-label="Daily profits">
                Daily profit amounts over 30 days.
              </canvas>
            </div>
          </div>
        </div>

        {/* Trade History */}
        <div className="scard scc th-wrap">
          <div className="th-head">
            <div>
              <div className="th-title">Trade History</div>
              <div className="th-sub">Detailed record of all AI trading activities and performance</div>
            </div>
            <div className="th-actions">
              <button
                type="button"
                className="th-btn th-btn-primary"
                onClick={() => {
                  if (!tradeHistory || tradeHistory.length === 0) {
                    showToast('Export CSV', 'No data to export');
                    return;
                  }
                  downloadCSV();
                }}
              >
                Export CSV ↓
              </button>
            </div>
          </div>

          <div className="tw">
            <table className="th-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>AI Agent</th>
                  <th>Market</th>
                  <th>Asset / Pair</th>
                  <th>Action</th>
                  <th>PnL %</th>
                  <th>Yours Profit</th>
                  <th>Total Profit</th>
                  <th>Portfolio Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingTrades ? (
                  <tr><td colSpan={10} className="th-empty">Loading trade history…</td></tr>
                ) : tradeError ? (
                  <tr><td colSpan={10} className="th-empty th-error">{String(tradeError)}</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={10} className="th-empty">No trade history found.</td></tr>
                ) : (
                  paginated.map((t, idx) => {
                    const profit = t?.Profit ?? t?.profit ?? 0;
                    const isProfit = Number(profit) >= 0;
                    const action = (t?.TradeAction || '').toUpperCase();
                    const agentName = t?.AIAgent;
                    const botFollow = t?.BotFollow;
                    const capital = t?.Capital;
                    const { date } = formatDate(t?.TradeDate);

                    return (
                      <tr key={t?.TradeId || t?.TradeDate || idx}>
                        <td>
                          <div className="th-date">{date}</div>
                          <div className="th-time">${capital}</div>
                        </td>
                        <td>
                          <div className="th-agent">
                            <span className="th-avatar">{agentName?.charAt(0) || 'A'}</span>
                            <div>
                              <div className="th-agent-name">{agentName}</div>
                              <div className="th-agent-sub">{botFollow}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`th-pill ${marketClass(t?.Market)}`}>{t?.Market || '-'}</span>
                        </td>
                        <td>
                          <div className="th-asset-code">{t?.AssetCode || t?.Pair || '-'}</div>
                          <div className="th-asset-name">{t?.AssetName || ''}</div>
                        </td>
                        <td>
                          <span className={`th-action ${action === 'SELL' ? 'th-sell' : 'th-buy'}`}>
                            {action || '-'}
                          </span>
                        </td>
                        <td className="th-mono">{t?.PNL ?? '-'}%</td>
                        <td className={isProfit ? 'th-up' : 'th-down'}>
                          {isProfit ? '+' : ''}${profit}
                        </td>
                        <td className="th-mono">{t?.TotalProfit ?? '-'}</td>
                        <td className="th-mono">{t?.PortfolioValue ?? '-'}</td>
                        
                        <td>
                          <span className={`th-status ${(t?.Status || 'Closed').toLowerCase()}`}>
                            {t?.Status || 'Closed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="th-footer">
            <div className="th-count">
              Showing {(tradeHistory?.length || 0) === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, tradeHistory?.length || 0)} of {tradeHistory?.length || 0} trades
            </div>
            <div className="th-pagination">
              <button
                className="th-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 3)
                .map((n) => (
                  <button
                    key={n}
                    className={`th-page-btn ${page === n ? 'active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
              {totalPages > 3 && <span className="th-page-dots">…</span>}
              <button
                className="th-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .g4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .ml {
          font-size: 12px;
          color: var(--t2, #8a8f98);
          font-weight: 500;
        }
        .mv {
          font-size: 22px;
          font-weight: 700;
          margin: 4px 0;
          color: var(--t1, #e5e7eb);
        }
        .mc {
          font-size: 11px;
          font-weight: 500;
        }
        .up {
          color: #34d399;
        }
        .down {
          color: #f87171;
        }

        .th-full {
          display: block !important;
          width: 100%;
        }

        .th-wrap {
          width: 100%;
          box-sizing: border-box;
        }

        .tw {
          width: 100%;
          overflow-x: auto;
        }

        .th-table {
          width: 100%;
          table-layout: auto;
          border-radius: 12px;
        }
        .th-wrap {
          padding: 20px 22px 16px;
        }
        .th-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .th-title {
          font-size: 18px;
          font-weight: 600;
          color: #000000;
        }
        .th-sub {
          font-size: 12px;
          color: var(--t2, #8a8f98);
          margin-top: 2px;
        }
        .th-actions {
          display: flex;
          gap: 8px;
        }
        .th-btn {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: var(--t1, #fff);
          font-size: 12px;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .th-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .th-btn-primary {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
          color: #c4b5fd;
        }
        .tw {
          overflow-x: auto;
        }
        .th-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .th-table thead th {
          text-align: left;
          padding: 10px 12px;
          color: var(--t2, #8a8f98);
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          white-space: nowrap;
        }
        .th-table tbody td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: var(--t1, #e5e7eb);
          vertical-align: middle;
          white-space: nowrap;
        }
        .th-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .th-date {
          font-weight: 500;
          color: var(--t2, #8a8f98);
        }
        .th-time {
          font-size: 11px;
          color: var(--t2, #8a8f98);
          font-family: var(--mono, monospace);
        }
        .th-agent {
          display: flex;
          align-items: center;
          color: var(--t2, #8a8f98);
          gap: 8px;
        }
        .th-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #03bdad, #00BCD4);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .th-agent-name {
          font-weight: 500;
          font-size: 12.5px;
        }
        .th-agent-sub {
          font-size: 10.5px;
          color: var(--t2, #8a8f98);
        }
        .th-pill {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 6px;
          font-weight: 500;
        }
        .mkt-forex { background:#07dbc726; color: #3500ff; }
        .mkt-metals { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .mkt-crypto { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }
        .mkt-indices { background: rgba(20, 184, 166, 0.15); color: #5eead4; }
        .mkt-default { background: rgba(255, 255, 255, 0.06); color: var(--t2, #8a8f98); }
        .th-asset-code {
          font-weight: 500;
          color: var(--t2, #8a8f98);
        }
        .th-asset-name {
          font-size: 10.5px;
          color: var(--t2, #8a8f98);
        }
        .th-action {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .th-buy { background: rgba(16, 185, 129, 0.15); color: #34d399 !important; }
        .th-sell { background: rgba(239, 68, 68, 0.15); color: #f87171 !important; }
        .th-mono {
          font-family: var(--mono, monospace);
          color: var(--t2, rgb(2, 2, 2)) !important;
        }
        .th-up { color: #34d399 !important; }
        .th-down { color: #f87171 !important; }
        .th-status {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          text-transform: capitalize;
        }
        .th-empty {
          text-align: center;
          padding: 24px;
          color: var(--t2, #8a8f98);
        }
        .th-error {
          color: #f87171;
        }
        .th-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .th-count {
          font-size: 12px;
          color: var(--t2, #8a8f98);
        }
        .th-pagination {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .th-page-btn {
          min-width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: var(--t2, #8a8f98);
          font-size: 12px;
          cursor: pointer;
        }
        .th-page-btn.active {
          background: #07dbc7;
          border-color: #07dbc7;
        }
        .th-page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .th-page-dots {
          color: var(--t2, #8a8f98);
          font-size: 12px;
        }

        /* Chart styles */
        .g2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .scard {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px;
        }

        .scc {
          background: rgba(255, 255, 255, 0.03);
        }

        .sh {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .st {
          font-size: 14px;
          font-weight: 500;
          color: #000000;
        }

        .tag {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 500;
        }

        .tg {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .cw {
          position: relative;
          width: 100%;
        }

        @media (max-width: 768px) {
          .g4 {
            grid-template-columns: 1fr 1fr;
          }
          .g2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .g4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}