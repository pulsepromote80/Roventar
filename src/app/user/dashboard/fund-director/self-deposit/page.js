"use client";

import { useState, useMemo, useEffect } from "react";
import Loader from "@/app/user/components/Loader";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaRegCopy } from "react-icons/fa";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { getUsdtBalance, getSelfDepsiteDetailsByURID, sendUSDTDepositRequest } from "@/app/redux/slices/selfSlice";
import { getUserId } from "@/app/api/auth";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";

export default function SelfDeposit() {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { usdtBalanceData, selfDepsiteDetailsData } = useSelector((state) => state.self);
  const usdtBalance = usdtBalanceData?.data?.usdtBalance || 0.0;
  const walletAddress = usdtBalanceData?.data?.walletAddress || "";
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = (value, rowId) => {
    try {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          toast.success("Copied to clipboard!");
          setCopiedRowId(rowId);
          setTimeout(() => setCopiedRowId(null), 1000);
        })
        .catch(() => {
          toast.error("Failed to copy!");
        });
    } catch (err) {
      toast.error("Copy not supported!");
    }
  };

  useEffect(() => {
    dispatch(getUsdtBalance());
    dispatch(getSelfDepsiteDetailsByURID());
  }, [dispatch]);

  useEffect(() => {
    if (selfDepsiteDetailsData?.data && Array.isArray(selfDepsiteDetailsData.data)) {
      const formattedData = selfDepsiteDetailsData.data.map((item, index) => ({
        sno: index + 1,
        amount: item.usdAmount,
        status: item.status,
        date: item.creadtedDate,
        hash: item.transHash,
      }));
      setData(formattedData);
    } else {
    }
  }, [selfDepsiteDetailsData]);

  const fnCopy = () => {
    toast.success("Wallet address copied to clipboard!");
    navigator.clipboard.writeText(walletAddress);
  };

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // const urid = getUserId();
      // if (!urid) {
      //   toast.error("User ID is missing. Please log in and try again.");
      //   return;
      // }

      if (usdtBalance < 10) {
        toast.error("Sorry, the minimum required deposit is $10. Please adjust your amount to continue.");
        return;
      }

      const result = await dispatch(
        sendUSDTDepositRequest()
      ).unwrap();

      if (result.statusCode === 200) {
        toast.success(result.message || "Deposit request sent successfully!");
      } else {
        toast.error(result.message || "An error occurred while processing your deposit request.");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error(error.message || "An error occurred while processing your deposit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "sno", header: "#" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "amount", header: "Amount($)" },
      { accessorKey: "hash", header: "TransHash" },
      { accessorKey: "status", header: "Status" },
    ],
    []
  );

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Pending":
        return "status-pending";
      case "UnApproved":
        return "status-unapproved";
      default:
        return "";
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination: { pageSize, pageIndex: 0 } },
    onPaginationChange: () => { },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="self-deposit-card">
        <div className="deposit-content-wrapper">
          <div className="qr-section">
            <div className="qr-wrapper">
              <div className="qr-code-container">
                <QRCode
                  value={walletAddress}
                  size={120}
                  className="qr-code-image"
                />
                <p className="qr-code-text">
                  Scan QR code to get wallet address
                </p>
              </div>
              <div className="balance-container">
                <p className="balance-label">
                  Deposit Balance: ${Number(usdtBalance || 0).toFixed(2)}
                </p>
              </div>
              <div className="deposit-button-wrapper">
                <button
                  className="deposit-btn"
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="loader-icon" />
                      Processing
                    </>
                  ) : (
                    "Deposit"
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="info-section">
            <div>
              <h1 className="info-label">Network</h1>
              <span className="network-badge">Binance Smart Chain</span>
            </div>
            <div className="wallet-section">
              <p className="info-label">Wallet Address</p>

              <div className="wallet-address-wrapper">
                <span
                  className="wallet-address-text"
                  title={walletAddress}
                >
                  {walletAddress}
                </span>

                <button
                  type="button"
                  onClick={fnCopy}
                  className="ann-badge copy-icon"
                >
                  <FaRegCopy />
                </button>
              </div>
            </div>
            <div className="important-notes">
              <p className="notes-title">Important Notes:</p>
              <ul className="notes-list">
                <li>Only send BEP20 to this address</li>
                <li>Make sure you are using the correct network</li>
                <li>Minimum deposit: $10 USD equivalent</li>
                <li>Deposits will be credited after network confirmation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      <div className="deposit-records-container">
        <div className="deposit-records-wrapper">
          <h1 className="records-title">Fund Deposit Records</h1>
          <div className="table-controls">
            <div className="page-size-wrapper">
              <select
                id="pageSize"
                className="page-size-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-wrapper">
              <label htmlFor="search" className="search-label">
                Search:
              </label>
              <input
                id="search"
                type="search"
                className="search-input"
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead className="table-header">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="table-header-cell">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="table-row">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="table-cell">
                          {cell.column.id === "status" ? (
                            <span
                              className={`status-badge ${getStatusClasses(cell.getValue())}`}
                            >
                              {cell.getValue()}
                            </span>
                          ) : cell.column.id === "hash" ? (
                            <div className="hash-container">
                              <span className="hash-text">
                                {cell.getValue()?.slice(0, 15) + "..."}
                              </span>
                              <Copy
                                size={14}
                                className="h-12 w-10"
                                onClick={() => handleCopy(cell.getValue(), row.id)}
                                title={copiedRowId === row.id ? "Copied!" : "Copy"}
                              />
                              <span className="hash-tooltip">
                                {copiedRowId === row.id ? "Copied!" : cell.getValue()}
                              </span>
                            </div>
                          ) : cell.column.id === "amount" ? (
                            `$${cell.getValue()}`
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="no-data-cell">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            <div className="entries-info">
              Showing {table.getRowModel().rows.length} of {data.length} entries
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                «
              </button>
              <button
                className="pagination-btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ‹
              </button>
              <button
                className="pagination-btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                ›
              </button>
              <button
                className="pagination-btn"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}