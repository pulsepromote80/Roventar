"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAdminManageUser, clearSearchData } from '@/app/redux/slices/adminMasterSlice';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { FaCopy } from 'react-icons/fa'
import {
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaFileExcel,
  FaSyncAlt,
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaWallet,
  FaRegCalendarAlt,
  FaChartLine,
  FaUserCircle,
  FaIdCard,
  FaMobileAlt,
  FaEnvelopeOpen,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaBox,
} from "react-icons/fa";
import { RiUserSearchLine, RiRefreshLine, RiFileExcel2Line, RiDashboardLine } from "react-icons/ri";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { loading, searchData } = useSelector((state) => state.adminMaster ?? {});
  
  const [form, setForm] = useState({
    fullname: '',
    authLogin: '',
    active: '',
    phoneNo: '',
    email: '',
    fromDate: '',
    toDate: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);

    const formatInputDate = (dateStr) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    };

    const formattedForm = {
      ...form,
      fromDate: formatInputDate(form.fromDate),
      toDate: formatInputDate(form.toDate),
    };

    try {
      await dispatch(addAdminManageUser(formattedForm));
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return dateString;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to Clipboard!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  let userDataArray = [];
  
  if (searchData) {
    if (searchData.data && Array.isArray(searchData.data)) {
      userDataArray = searchData.data;
    } 
    else if (Array.isArray(searchData)) {
      userDataArray = searchData;
    }
    else if (searchData.statusCode === 200 && Array.isArray(searchData.data)) {
      userDataArray = searchData.data;
    }
  }

  const filteredData = userDataArray.filter(item => {
    if (form.active === '') return true;
    const status = item.Status || (item.Active ? 'Active' : 'InActive');
    if (form.active === '1') return status === 'Active';
    if (form.active === '0') return status === 'InActive';
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(clearSearchData());
    const emptyForm = {
      fullname: "",
      authLogin: "",
      active: "",
      phoneNo: "",
      email: "",
      fromDate: "",
      toDate: "",
    };
    setForm(emptyForm);
    setHasSearched(false);
    setCurrentPage(1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    if (!userDataArray || userDataArray.length === 0) {
      toast.error("No data available to export", {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      userDataArray.map((item, index) => ({
        "Sr.No.": index + 1,
        "User ID": item.AuthLogin || "-",
        Name: item.Name || "-",
        Email: item.Email || "-",
        Mobile: item.Mobile || "-",
        "Wallet Address": item.WalletAddress || "-",
        Package: item.Package || "-",
        PackageStatus: item.PacakgateStatus || "-",
        "Reg Date": item.RegDate ? new Date(item.RegDate).toLocaleDateString() : "-",
        Status: item.Status || (item.Active ? "Active" : "InActive") || "-",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "AllUsers.xlsx");
    toast.success("Export successful!", {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const tableData = filteredData.map((item, idx) => ({
    srNo: idx + 1,
    AuthLogin: item.AuthLogin || '',
    Name: item.Name || '',
    SponsorID: item.SponsorID || '',
    Mobile: item.Mobile || '',
    Email: item.Email || '',
    WalletAddress: item.WalletAddress || '',
    Package: item.Package || '',
    RegDate: formatDate(item.RegDate),
    PacakgateStatus: item.PacakgateStatus || '',
    active: item.Status || (item.Active ? 'Active' : 'InActive'),
  }));

  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  // Statistics
  const activeUsers = tableData.filter(user => user.active === 'Active').length;
  const inactiveUsers = tableData.filter(user => user.active === 'InActive').length;
  const totalPackages = tableData.reduce((sum, user) => sum + (parseInt(user.Package) || 0), 0);

  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address || address === '-') return '-';
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                  <FaChartLine className="text-emerald-500" />
                  Manage and monitor all registered users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{tableData.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FaUsers className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaUserCircle className="text-emerald-500" />
                <span>Total registered users</span>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FaUserCheck className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-green-500" />
                <span>Currently active users</span>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Inactive Users</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{inactiveUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FaUserTimes className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaClock className="text-red-500" />
                <span>Currently inactive users</span>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${totalPackages.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FaBox className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaDollarSign className="text-blue-500" />
                <span>Total package investment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form Card */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <RiUserSearchLine className="text-xl" />
              Advanced Search Filters
            </h2>
            <p className="text-emerald-100 text-sm mt-1">Search and filter users by various criteria</p>
          </div>
          
          <form className="p-6" onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2 text-emerald-500" />
                  Full Name
                </label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter full name"
                />
              </div>
                 <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2 text-emerald-500" />
                  Login ID
                </label>
                <input
                  name="authLogin"
                  value={form.authLogin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter LoginID"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2 text-emerald-500" />
                  Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaPhoneAlt className="inline mr-2 text-emerald-500" />
                  Phone Number
                </label>
                <input
                  name="phoneNo"
                  value={form.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaUserCheck className="inline mr-2 text-emerald-500" />
                  Account Status
                </label>
                <select
                  name="active"
                  value={form.active}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-emerald-500" />
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaRegCalendarAlt className="inline mr-2 text-emerald-500" />
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
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
                    Search Users
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleExport}
                className="group px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-md"
              >
                <RiFileExcel2Line className="text-lg group-hover:scale-110 transition-transform" />
                Export to Excel
              </button>
              
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="group px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                <RiRefreshLine className={`text-lg ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {hasSearched && (
            loading && !isRefreshing ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading users data...</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {tableData.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <RiDashboardLine className="text-emerald-500 text-lg" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Found <span className="text-emerald-600 font-bold">{tableData.length}</span> users
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date().toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">User Login</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">SponsorId & Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Mobile</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Wallet Address</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Package ($)</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Package Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Reg Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <FaUsers className="text-3xl text-gray-400" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                              {startItem + idx}
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                                  <FaIdCard className="text-emerald-600 dark:text-emerald-400 text-xs" />
                                </div>
                                <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                                  {row.AuthLogin}
                                </span>
                              </div>
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FaUserCircle className="text-gray-400 text-sm" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{row.Name}</span>
                              </div>
                             </td>
                             <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FaUserCircle className="text-gray-400 text-sm" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{row.SponsorID}</span>
                              </div>
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FaMobileAlt className="text-gray-400 text-xs" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{row.Mobile}</span>
                              </div>
                             </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 max-w-[200px]">
                                <FaEnvelopeOpen className="text-gray-400 text-xs flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-400 truncate" title={row.Email}>
                                  {row.Email}
                                </span>
                              </div>
                             </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <FaWallet className="text-gray-400 text-xs" />
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                  {formatWalletAddress(row.WalletAddress)}
                                </span>
                                {row.WalletAddress && row.WalletAddress !== '-' && (
                                  <button
                                    onClick={() => copyToClipboard(row.WalletAddress)}
                                    className="p-1 text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Copy to Clipboard"
                                  >
                                    <FaCopy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <FaDollarSign className="text-emerald-500 text-sm" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.Package}</span>
                              </div>
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                row.PacakgateStatus === 'Active' || row.PacakgateStatus === 'IsActivePackage'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                {row.PacakgateStatus === 'IsActivePackage' ? 'Active Package' : row.PacakgateStatus}
                              </span>
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.RegDate}
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                row.active === 'Active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${row.active === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                {row.active}
                              </span>
                             </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {tableData.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                        <select
                          value={rowsPerPage}
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                          <option value="1500">1500</option>
                        </select>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{tableData.length}</span> entries
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
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
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;