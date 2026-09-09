"use client";

import React, { useState, useMemo, useEffect } from "react";
import "./WalletStatement.css";  
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWalletTransType,
  getDepositWalletReport,
  getIncomeWalletReport,
  getRoiWalletReport,
} from "@/app/redux/slices/walletSlice";
import { getUserId } from "@/app/api/auth";
import { getWithdrawalHistory } from "@/app/redux/slices/walletSlice";

const WalletStatement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Deposit");
  const [selectedTransType, setSelectedTransType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawalType, setWithdrawalType] = useState(1);

  const { walletData, loading, DepositWalletReportData, getIncomeWalletReportdata, roiWalletData, WithdrawalHistoryData } =
    useSelector((state) => state.wallet);

  const userId = getUserId();

  const itemsPerPage = 5;

 
  useEffect(() => {
      dispatch(getAllWalletTransType());
  }, [dispatch]);

  // Reset type & fetch report when tab changes
  useEffect(() => {
    setSelectedTransType("");
    setCurrentPage(1);
    setSearchTerm("");
    fetchReportForTab(activeTab, "");
  }, [activeTab]);

  // Fetch report when selectedTransType changes
  useEffect(() => {
    if (activeTab) {
      fetchReportForTab(activeTab, selectedTransType);
    }
  }, [selectedTransType]);

  const fetchReportForTab = (tab, transtype) => {
    const payload = { transtype: transtype || "" };

    const withdrawalPayload = {
      transtype: "withdrawal",
      type: withdrawalType
    }
    switch (tab) {
      case "Deposit":
        dispatch(getDepositWalletReport(payload));
        break;
      case "Income":
        dispatch(getIncomeWalletReport(payload));
        break;
      case "Trading":
        dispatch(getRoiWalletReport(payload));
        break;
      case "Withdrawal":
        dispatch(getWithdrawalHistory(withdrawalPayload));
        break;
      default:
        break;
    }
  };

  // Get current report data based on active tab
  const currentReportData = useMemo(() => {
    switch (activeTab) {
      case "Deposit":
        return DepositWalletReportData;
      case "Income":
        return getIncomeWalletReportdata;
      case "Withdrawal":
        return WithdrawalHistoryData;
      case "Trading":
        return roiWalletData;
      default:
        return [];
    }
  }, [activeTab, DepositWalletReportData, getIncomeWalletReportdata, roiWalletData, WithdrawalHistoryData]);

  // Get available transaction types for dropdown
  const transTypeOptions = useMemo(() => {
    if (!walletData) return [];
    switch (activeTab) {
      case "Deposit":
        return walletData.depositTransTypes || [];
      case "Income":
        return walletData.incomeTransTypes || [];
      case "Trading":
        return walletData.roiTransTypes || [];
      case "Withdrawal":
        return [
          { label: "Income", value: 1 },
          { label: "Trading", value: 2 },
        ];
      default:
        return [];
    }
  }, [activeTab, walletData]);

  // Filter & paginate data
  const filteredData = useMemo(() => {
    if (!currentReportData?.length) return [];
    return currentReportData.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [currentReportData, searchTerm]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = ["Deposit", "Income", "Trading", "Withdrawal"];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleTransTypeChange = (e) => {
    const value = e.target.value;

    setSelectedTransType(value);

    if (activeTab === "Withdrawal") {
      setWithdrawalType(Number(value));
    }
  };

  // Calculate colSpan based on active tab
  const getColSpan = () => {
    return activeTab === "Withdrawal" ? 8 : 7;
  };

  return (
    <div className="">
      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

         
        <div className="wallet-actions">
          <select
            className="range-select"
            value={selectedTransType}
            onChange={handleTransTypeChange}
          >
           
            {activeTab === "Withdrawal"
              ? transTypeOptions.map((item, idx) => (
                <option key={idx} value={item.value}>
                  {item.label}
                </option>
              ))
              : transTypeOptions.map((item, idx) => (
                <option key={idx} value={item.transtype}>
                  {item.transtype}
                </option>
              ))}
          </select>
          <span className="select-arrow">
            <i className="fa-solid fa-angle-down"></i>
          </span>
        </div>
      </div>

      <div className="wallet-card">
        <div className="wallet-header">
          <h2>{activeTab} Statement</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              className="search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            /> 
          </div>
        </div>

    <div className="table-card">
        <div className="table-responsive">
          <table className="income-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Request</th>
                <th>Charges</th>
                <th>Release</th>
                {activeTab === "Withdrawal" && <th>TransHash</th>}  
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={getColSpan()} className="no-data">  {/* 👈 Dynamic colSpan */}
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
<td className="credit-positive">
  {item.CreatedDate || item.createdDate 
    ? (item.CreatedDate || item.createdDate).split('T')[0] 
    : "-"}
</td>
                    <td className="debit-negative">{item.TotWithdl ?? 0}</td>
                    <td className="remark-text">{item.AdminCharges ?? 0}</td>
                    <td>{item.debit || "-"}</td>
                    
                    {activeTab === "Withdrawal" && (
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            title={item.transHash || "-"}
                            style={{
                              maxWidth: "180px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "inline-block"
                            }}
                          >
                            {item.transHash || "-"}
                          </span>
                          {item.transHash && (
                            <button
                              type="button"
                              className="btn btn-sm p-0"
                              title="Copy Transaction Hash"
                              onClick={() => navigator.clipboard.writeText(item.transHash)}
                            >
                              <i className="fa fa-copy"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                    
                    
                    
                    <td className="status-badge pending-bg status-1">{item.status || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getColSpan()} className="no-data">  {/* 👈 Dynamic colSpan */}
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
</div>
        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="pagination">
            <p>
              Page <strong>{currentPage}</strong> of {totalPages || 1}
            </p>
            <div className="pagination-buttons">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletStatement;