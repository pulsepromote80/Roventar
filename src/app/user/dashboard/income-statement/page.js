"use client";

import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionHistory } from '@/app/redux/slices/walletSlice';
import "./incomeStatement.css";
import { useSearchParams } from 'next/navigation';
import { getUserId } from '@/app/api/auth';


const TABS = [
  'Trading Profit',
  'Direct Income',
  'Tier Reward',
  'Growth Reward',
];

const KEY_TO_LABEL = {
  GrowthReward: 'Growth Reward',
  TradingProfit: 'Trading Profit',
  TierReward: 'Tier Reward',
  DirectIncome: 'Direct Income' 
};

export default function IncomeStatement() {
  const userId = getUserId();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { transactionhistorydata, loading: isLoading } = useSelector(state => state.wallet || {});

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Activate tab from ?tab=Key or ?tab=Label
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (!tabParam) return;
    if (KEY_TO_LABEL[tabParam]) {
      setActiveTab(KEY_TO_LABEL[tabParam]);
      return;
    }

    if (TABS.includes(tabParam)) setActiveTab(tabParam);
  }, [searchParams]);


  const transactions = useMemo(() => {
    if (!Array.isArray(transactionhistorydata)) return [];

    return transactionhistorydata.map(item => ({
      id: item.ID,
      urid: item.URID,
      date: item.CreatedDate,
      credit: Number(item.credit || 0),
      transType: item.transType,
      remark: item.Remark || '',
      statusCode: item.statusCode,
      message: item.message,
      rawDate: new Date(item.CreatedDate)
    })).sort((a, b) => b.rawDate - a.rawDate);
  }, [transactionhistorydata]);

  // Fetch transactions when tab changes
  useEffect(() => {
    const urid = userId; // Get from auth context if needed
    dispatch(getTransactionHistory({ transtype: activeTab }));
  }, [activeTab, dispatch, userId]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return transactions;

    const term = searchTerm.toLowerCase();
    return transactions.filter(item =>
      item.remark.toLowerCase().includes(term) ||
      item.credit.toString().includes(term) ||
      item.date.includes(term) ||
      item.id.toString().includes(term)
    );
  }, [transactions, searchTerm]);

  // Pagination logic
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalFiltered);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset page when search or tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate total visible sum for current filter
  const visibleTotal = filteredData.reduce((sum, t) => sum + (t.credit || 0), 0).toFixed(4);

  return (
    <div className="app-container">
      <div className="">

        {/* Tabs Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className='search-tab'>
          {/* Summary Card */}
          <div className="summary-card">
            <span className="summary-label">📊 Current Filter Total • {activeTab}</span>
            <span className="summary-value">${visibleTotal} USD</span>
          </div>

          {/* Search & Summary */}
          <div className="search-wrapper">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search transactions (ID, amount, remark...)"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="income-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Credit (USD)</th>
                  <th>Remarks / Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <span>Loading transactions...</span>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{startIndex + idx + 1}</td>
                      <td>{item.date}</td>
                      <td className="credit-positive">${Number(item.credit).toFixed(4)}</td>
                      <td className="remark-text" title={item.remark}>{item.remark}</td>
                      <td>
                        <span className={`status-badge status-${item.statusCode}`}>
                          {item.message}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state" style={{ textAlign: 'center' }}>
                      <span className=''>📭 No transactions found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalFiltered > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {startIndex + 1} to {endIndex} of {totalFiltered} transactions
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>
                <span className="page-number">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}