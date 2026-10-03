"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncomeRequestAdmin } from '@/app/redux/slices/fundManagerSlice';
import { usernameLoginId } from '@/app/redux/slices/adminMasterSlice'
import { FaCopy, FaCalendarAlt, FaUser, FaIdBadge, FaSearch, FaFileExcel, FaSyncAlt, FaFilter, FaHistory, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RiUserSearchLine, RiRefreshLine, RiFileExcel2Line, RiWalletLine, RiBankCardLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

const IncomeHistory = () => {
  const dispatch = useDispatch();
  const { withdrawRequestData, loading, error } = useSelector((state) => state.fundManager);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userError, setUserError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [statusFilter, setStatusFilter] = useState("")
  const [refreshLoading, setRefreshLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId.trim()) {
        setUsername("");
        setUserError("");
        return;
      }

      const result = await dispatch(usernameLoginId(userId));

      if (result?.payload && result.payload.name) {
        setUsername(result.payload.name);
        setUserError("");
      } else {
        setUsername("");
        setUserError("Invalid User ID");
      }
    };

    fetchUsername();
  }, [userId, dispatch]);

  const handleSearch = () => {
    const payload = {
      authLogin: userId || "",
      fromDate: formatDate(fromDate) || "",
      toDate: formatDate(toDate) || "",
    };

    dispatch(getAllIncomeRequestAdmin(payload));
    setHasSearched(true);
  };

  const handleExport = () => {
    if (!withdrawRequestData?.unApWithIncome || withdrawRequestData?.unApWithIncome?.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      withdrawRequestData?.unApWithIncome?.map((txn, index) => ({
        "Sr.No.": index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Email: txn.Email,
        Amount: `$${txn.TotWithdl}`,
        Release: `$${txn.Release}`,
        Charges: txn.AdminCharges ? `$${txn.AdminCharges}` : "$0",
        WalletAddress: txn.Wallet,
        CreatedDate: txn.CreatedDate ? txn.CreatedDate.split("T")[0] : "-",
        ApprovalDate: txn.ApprovalDate ? txn.ApprovalDate.split("T")[0] : "-",
        TransactionHash: txn.Transhash,
        Remark: txn.Remark,
        Status: txn.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Transactions.xlsx");
    toast.success("Export successful!");
  };

  const handleRefresh = () => {
    setRefreshLoading(true);
    setFromDate('')
    setToDate('')
    setUserId('')
    setUsername('')
    setUserError('')
    setStatusFilter('')
    setCurrentPage(1)
    setHasSearched(false)
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }

  const allRows = withdrawRequestData?.aprWithIncome || [];

  const filteredByStatus = statusFilter
    ? allRows.filter(row => row.status === statusFilter)
    : allRows;

  const filteredRows = filteredByStatus.filter(row =>
  (row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.TotWithdl?.toString().includes(searchTerm)) ||
    (row.debit?.toString().includes(searchTerm)) ||
    row.TransHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.CreatedDate?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const rowsToDisplay = filteredRows;
  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length);

  // Calculate statistics
  const totalApproved = rowsToDisplay.filter(row => row.status === 'Approved').length;
  const totalRejected = rowsToDisplay.filter(row => row.status === 'Rejected').length;
  const totalAmount = rowsToDisplay.reduce((sum, row) => sum + (parseFloat(row.TotWithdl) || 0), 0);
  const totalRelease = rowsToDisplay.reduce((sum, row) => sum + (parseFloat(row.Release) || 0), 0);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const truncateText = (text, maxLength = 15) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div>
      <div>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
              <FaHistory className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Income History
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                <RiWalletLine className="text-emerald-500" />
                View and manage all income requests
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Only show when data is available */}
        {hasSearched && rowsToDisplay.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{rowsToDisplay.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <FaHistory className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Approved</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalApproved}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalRejected}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <FaTimesCircle className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <FaDollarSign className="text-white text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Form Card */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <RiUserSearchLine className="text-xl" />
              Search Filters
            </h2>
            <p className="text-emerald-100 text-sm mt-1">Filter income history by date, user, or status</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* From Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-emerald-500" />
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-emerald-500" />
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaIdBadge className="inline mr-2 text-emerald-500" />
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  placeholder="Enter user ID"
                />
                {userError && (
                  <p className="mt-2 text-sm text-red-500">{userError}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2 text-emerald-500" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Username will appear here"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaFilter className="inline mr-2 text-emerald-500" />
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="group px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="text-sm group-hover:scale-110 transition-transform" />
                    Search
                  </>
                )}
              </button>

              <button
                onClick={handleExport}
                className="group px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-md"
              >
                <RiFileExcel2Line className="text-lg group-hover:scale-110 transition-transform" />
                Export Excel
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="group px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                <RiRefreshLine className={`text-lg ${refreshLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {refreshLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading income history...</p>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FaTimesCircle className="text-3xl text-red-500" />
                </div>
                <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
              </div>
            ) : rowsToDisplay.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Results Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <RiBankCardLine className="text-emerald-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Found <span className="text-emerald-600 font-bold">{rowsToDisplay.length}</span> transactions
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total Amount: ${totalAmount.toLocaleString()} | Total Release: ${totalRelease.toLocaleString()}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">User ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Charges</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Release</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Wallet Address</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Transaction Hash</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Created Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Approval Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Remark</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan="13" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <FaHistory className="text-3xl text-gray-400" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search criteria</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                              {startItem + idx}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-gray-900 dark:text-white">
                              {row.AuthLogin || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {row.FullName || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.Email || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              ${row.TotWithdl}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              ${row.AdminCharges || 0}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                              ${row.Release}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                  {truncateText(row.Wallet, 12)}
                                </span>
                                {row.Wallet && (
                                  <button
                                    onClick={() => copyToClipboard(row.Wallet)}
                                    className="p-1 text-emerald-500 hover:text-emerald-700 transition-colors"
                                    title="Copy to clipboard"
                                  >
                                    <FaCopy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                  {truncateText(row.TransHash, 12)}
                                </span>
                                {row.TransHash && (
                                  <button
                                    onClick={() => copyToClipboard(row.TransHash)}
                                    className="p-1 text-emerald-500 hover:text-emerald-700 transition-colors"
                                    title="Copy to clipboard"
                                  >
                                    <FaCopy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.CreatedDate ? row.CreatedDate.split("T")[0] : "-"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.ApprovalDate ? row.ApprovalDate.split("T")[0] : "-"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.Remark || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${row.status === 'Approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : row.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Approved' ? 'bg-green-500' :
                                  row.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                  }`}></span>
                                {row.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {rowsToDisplay.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                        <select
                          value={rowsPerPage}
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200
                                  bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        >
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                          <option value="1500">1500</option>
                        </select>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{rowsToDisplay.length}</span> entries
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200
                                  bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200
                                  ${currentPage === pageNum
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200
                                  bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <FaHistory className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No income history found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeHistory;