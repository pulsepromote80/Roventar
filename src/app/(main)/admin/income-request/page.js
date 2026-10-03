'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllIncomeRequestAdmin,
  UpIncomeWithdReqStatusAdmin,
  updateIncomeWalletAdressUSDT,
} from '@/app/redux/slices/fundManagerSlice'
import { usernameLoginId } from '@/app/redux/slices/adminMasterSlice'
import { getEncryptedLocalData } from '@/app/api/auth'
import { toast } from 'react-toastify'
import { FaCopy, FaCalendarAlt, FaUser, FaIdBadge, FaSearch, FaFileExcel, FaSyncAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaWallet, FaExchangeAlt, FaHistory } from 'react-icons/fa'
import { RiUserSearchLine, RiRefreshLine, RiFileExcel2Line, RiWalletLine, RiBankCardLine, RiAlertLine } from "react-icons/ri"
import { ethers } from 'ethers'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const IncomeRequest = () => {
  const dispatch = useDispatch()
  const { withdrawRequestData, loading, error } = useSelector(
    (state) => state.fundManager,
  )

  // MetaMask state
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [usdBalance, setUsdBalance] = useState('0.00')
  const [isSending, setIsSending] = useState(false)
  const [balanceInUsdt, setBalanceInUsdt] = useState(0)

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(500)
  const [approvePopupOpen, setApprovePopupOpen] = useState(false)
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState({ authLoginId: null, id: null })
  const [remark, setRemark] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [userError, setUserError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [processedRequests, setProcessedRequests] = useState(new Set())

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  // BSC chain configuration
  const BSC_CHAIN_ID = '0x38'
  const BSC_CHAIN_NAME = 'BNB Smart Chain'
  const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/'
  const BSC_CURRENCY_SYMBOL = 'BNB'
  const BSC_BLOCK_EXPLORER_URL = 'https://bscscan.com'

  const ERC20_ABI = ['function balanceOf(address owner) view returns (uint256)']

  // USDT Contract Details
  const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'
  const USDT_DECIMALS = 18

  useEffect(() => {
    const AuthId = getEncryptedLocalData("AuthLogin")
    if (AuthId) {
      dispatch(usernameLoginId(AuthId))
    }
  }, [dispatch])

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId.trim()) {
        setUsername('')
        setUserError('')
        return
      }

      const result = await dispatch(usernameLoginId(userId))

      if (result?.payload && result.payload.name) {
        setUsername(result.payload.name)
        setUserError('')
      } else {
        setUsername('')
        setUserError('Invalid User ID')
      }
    }

    fetchUsername()
  }, [userId, dispatch])

  const handleSearch = () => {
    const payload = {
      authLogin: userId || '',
      fromDate: formatDate(fromDate) || '',
      toDate: formatDate(toDate) || '',
    }

    dispatch(getAllIncomeRequestAdmin(payload))
    setHasSearched(true)
  }

  const handleExport = () => {
    if (
      !withdrawRequestData?.unApWithIncome ||
      withdrawRequestData?.unApWithIncome?.length === 0
    ) {
      alert('No data available to export')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(
      withdrawRequestData?.unApWithIncome?.map((txn, index) => ({
        'Sr.No.': index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Email: txn.Email,
        Amount: `$${txn.TotWithdl}`,
        Release: `$${txn.Release}`,
        Charges: txn.AdminCharge ? `$${txn.AdminCharge}` : "$0",
        WalletAddress: txn.Wallet,
        Remark: txn.Remark,
        Status: txn.status,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, 'Transactions.xlsx')
    toast.success('Export successful!')
  }

  const handleRefresh = () => {
    setFromDate('')
    setToDate('')
    setUserId('')
    setUsername('')
    setUserError('')
    setCurrentPage(1)
    setHasSearched(false)

    dispatch(getAllIncomeRequestAdmin({
      authLogin: '',
      fromDate: '',
      toDate: ''
    }))
  }

  const fetchWalletBalances = async (accountAddress) => {
    try {
      const provider = new ethers.JsonRpcProvider(BSC_RPC_URL)

      const balanceWei = await provider.getBalance(accountAddress)
      const balanceInBnb = parseFloat(ethers.formatEther(balanceWei))

      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        ERC20_ABI,
        provider,
      )

      const usdtRaw = await usdtContract.balanceOf(accountAddress)
      const usdtBalance = parseFloat(ethers.formatUnits(usdtRaw, 18))

      setBalanceInUsdt(usdtBalance)

      const totalUsdValue = usdtBalance
      setUsdBalance(totalUsdValue.toFixed(2))

      return { usdt: usdtBalance }
    } catch (error) {
      console.error('Error fetching balances:', error)
      setUsdBalance('0.00')
      setBalanceInUsdt(0)
      return { bnb: 0, usdt: 0 }
    }
  }

  const totalRelease =
    hasSearched && withdrawRequestData?.unApWithIncome ? withdrawRequestData.unApWithIncome.reduce(
      (sum, txn) => sum + (Number(txn.Release) || 0),
      0
    )
      : 0

  const switchToBSCNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      })
      return true
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: BSC_CHAIN_NAME,
                rpcUrls: [BSC_RPC_URL],
                nativeCurrency: {
                  name: 'Binance Coin',
                  symbol: BSC_CURRENCY_SYMBOL,
                  decimals: 18,
                },
                blockExplorerUrls: [BSC_BLOCK_EXPLORER_URL],
              },
            ],
          })
          return true
        } catch (addError) {
          console.error('Error adding BSC network:', addError)
          toast.error('Failed to add BSC network to MetaMask')
          return false
        }
      }
      console.error('Error switching to BSC network:', switchError)
      toast.error('Failed to switch to BSC network')
      return false
    }
  }

  const sendUSDTTransaction = async (toAddress, amount) => {
    if (!window.ethereum || !account) {
      toast.error('MetaMask not connected')
      return null
    }

    try {
      setIsSending(true)
      const amountInWei = BigInt(
        Math.floor(amount * 10 ** USDT_DECIMALS),
      ).toString(16)

      const transactionParameters = {
        to: USDT_CONTRACT_ADDRESS,
        from: account,
        value: '0x0',
        data:
          '0xa9059cbb' +
          toAddress.toLowerCase().replace('0x', '').padStart(64, '0') +
          amountInWei.padStart(64, '0'),
        gasLimit: '0x' + (100000).toString(16),
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })

      toast.success('Transaction sent! Waiting for confirmation...')

      return txHash
    } catch (error) {
      console.error('Error sending USDT:', error)
      if (error.code === 4001) {
        toast.error('Transaction rejected by user')
      } else {
        toast.error('Failed to send transaction')
      }
      return null
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const { ethereum } = window

    if (ethereum && ethereum.isMetaMask) {
      setIsMetamaskInstalled(true)

      const handleAccountsChanged = async (accounts) => {
        if (!accounts || accounts.length === 0) {
          setAccount(null)
          setBalanceInUsdt(0)
          return
        }
        setAccount(accounts[0])
        await fetchWalletBalances(accounts[0])
      }

      const handleChainChanged = (chainIdHex) => {
        setChainId(chainIdHex)
        if (account) {
          fetchWalletBalances(account)
        }
      }

      ethereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
            await fetchWalletBalances(accounts[0])
          }
        })
        .catch((err) => console.error('Error fetching accounts:', err))

      ethereum
        .request({ method: 'eth_chainId' })
        .then((id) => setChainId(id))
        .catch((err) => console.error('Error fetching chainId:', err))

      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    } else {
      setIsMetamaskInstalled(false)
    }
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found!')
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      })

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        await fetchWalletBalances(accounts[0])
        toast.success('Wallet connected to BSC!')
      }
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BSC_CHAIN_ID,
              chainName: BSC_CHAIN_NAME,
              rpcUrls: [BSC_RPC_URL],
              nativeCurrency: {
                name: 'BNB',
                symbol: BSC_CURRENCY_SYMBOL,
                decimals: 18,
              },
              blockExplorerUrls: [BSC_BLOCK_EXPLORER_URL],
            },
          ],
        })
      } else if (err.code === 4001) {
        toast.error('User rejected connection request.')
      } else {
        console.error('Error connecting wallet:', err)
        toast.error('Failed to connect wallet.')
      }
    }
  }

  const disconnectLocal = () => {
    setAccount(null)
    setBalanceInUsdt(0)
    toast.info(
      'Disconnected locally. To fully disconnect, remove this site in MetaMask > Connected sites.',
    )
  }

  const formatAddress = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '-')

  const chainLabel = chainId === BSC_CHAIN_ID ? BSC_CHAIN_NAME : chainId || '-'

  const unApprovedRows = withdrawRequestData?.unApWithIncome || []

  const filteredRows = unApprovedRows.filter(
    (row) =>
      row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.TotWithdl?.toString().includes(searchTerm) ||
      row.debit?.toString().includes(searchTerm) ||
      row.TransType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Wallet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const rowsToDisplay = searchTerm ? filteredRows : unApprovedRows

  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage)
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length)

  const handleApproveClick = (authLoginId, id) => {
    setSelectedRequest({ authLoginId, id })
    setApprovePopupOpen(true)
  }

  const handleApproveUSDTClick = async (row) => {
    if (!account) {
      toast.error('Please connect your MetaMask wallet first')
      return
    }

    if (chainId !== BSC_CHAIN_ID) {
      toast.error(`Please switch to ${BSC_CHAIN_NAME} in your wallet`)
      return
    }

    const { usdt } = await fetchWalletBalances(account)

    if (usdt < row.Release) {
      toast.error(`Insufficient USDT Balance!`)
      return
    }

    try {
      setIsSending(true)
      toast.info('Please confirm the transaction in MetaMask...', {
        autoClose: 1000,
      })

      const txHash = await sendUSDTTransaction(row.Wallet, row.Release)

      if (txHash) {
        await dispatch(
          updateIncomeWalletAdressUSDT({
            authLoginId: row.AuthLogin,
            debit: row.Release,
            wallet: row.Wallet,
            transHash: txHash,
          }),
        )
        setProcessedRequests(prev => new Set([...prev, row.Id]));
        toast.success('USDT Transaction Approved Successfully!')
      }
    } catch (error) {
      console.error('Error approving USDT:', error)
      toast.error(
        error.code === 4001
          ? 'Transaction rejected by Admin'
          : 'Failed to approve USDT transaction',
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleRejectClick = (authLoginId, id) => {
    setSelectedRequest({ authLoginId, id });
    setRejectPopupOpen(true);
  };

  const handleApprove = async () => {
    if (selectedRequest.id) {
      try {
        await dispatch(
          UpIncomeWithdReqStatusAdmin({
            authLoginId: selectedRequest.authLoginId,
            id: selectedRequest.id,
            rfstatus: 1,
            remark: 'Approved by admin',
          }),
        )
        setProcessedRequests(prev => new Set([...prev, selectedRequest.id]));
        setApprovePopupOpen(false)
        setSelectedRequest({ authLoginId: null, id: null })
        toast.success('Approved Successfully!')
      } catch (error) {
        console.error('Approve error:', error)
        toast.error('Failed to approve request')
      }
    }
  }

  const handleReject = async () => {
    if (selectedRequest?.id && remark?.trim()) {
      try {
        await dispatch(
          UpIncomeWithdReqStatusAdmin({
            authLoginId: selectedRequest.authLoginId,
            id: selectedRequest.id,
            rfstatus: 2,
            remark: remark.trim(),
          }),
        );

        setProcessedRequests(prev => new Set([...prev, selectedRequest.id]));
        setRejectPopupOpen(false);
        setSelectedRequest({ authLoginId: null, id: null });
        setRemark('');

        toast.success('Rejected Successfully!');
      } catch (error) {
        console.error('Reject error:', error);
        toast.error('Failed to reject request');
      }
    } else {
      if (!selectedRequest?.id) {
        toast.error('No request selected. Please try again.');
      } else if (!remark?.trim()) {
        toast.error('Please enter a remark for rejection');
      }
    }
  };

  const handleCancel = () => {
    setApprovePopupOpen(false)
    setRejectPopupOpen(false)
    setSelectedRequest({ authLoginId: null, id: null })
    setRemark('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to Clipboard!')
  }

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '-'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

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
                Income Requests
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                <RiWalletLine className="text-emerald-500" />
                Manage and process income requests
              </p>
            </div>
          </div>
        </div>

        {/* MetaMask Wallet Connection Card */}
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaWallet className="text-xl" />
              Wallet Connection
            </h3>
          </div>
          <div className="p-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                {!isMetamaskInstalled ? (
                  <div className="flex items-center gap-2 text-amber-700">
                    <RiAlertLine className="text-lg" />
                    <span>MetaMask not detected.</span>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-orange-600 underline hover:text-orange-700"
                    >
                      Install MetaMask
                    </a>
                  </div>
                ) : account ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Connected:</span>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                        <span className="font-mono text-sm text-gray-800 dark:text-gray-200" title={account}>
                          {formatAddress(account)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(account)}
                          className="p-1 text-emerald-500 hover:text-emerald-700 transition"
                          title="Copy address"
                        >
                          <FaCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <FaDollarSign className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        💰 Wallet Balance: ${Number(balanceInUsdt).toFixed(2)} USDT
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">Wallet not connected.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isMetamaskInstalled ? (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all duration-200"
                  >
                    Install MetaMask
                  </a>
                ) : account ? (
                  <>
                    {chainId !== BSC_CHAIN_ID && (
                      <button
                        onClick={switchToBSCNetwork}
                        className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 transition-all duration-200"
                      >
                        Switch to BSC
                      </button>
                    )}
                    <button
                      onClick={disconnectLocal}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Release Amount</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">${Number(totalRelease.toFixed(2))}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
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
            <p className="text-emerald-100 text-sm mt-1">Filter income requests by date or user</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </div>

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
                Export
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="group px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                <RiRefreshLine className={`text-lg group-hover:rotate-180 transition-transform duration-500`} />
                Refresh
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
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading income requests...</p>
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
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <RiBankCardLine className="text-emerald-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Found <span className="text-emerald-600 font-bold">{rowsToDisplay.length}</span> pending requests
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total Pending Release: ${Number(totalRelease.toFixed(2))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 sticky top-0">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">USDT Action</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Action</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">User ID</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Request ($)</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Charges ($)</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Release ($)</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Wallet Address</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Remark</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <FaHistory className="text-3xl text-gray-400" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 font-medium">No income requests found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                              {startItem + idx}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <button
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${processedRequests.has(row.Id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md'
                                  }`}
                                onClick={() => handleApproveUSDTClick(row)}
                                disabled={
                                  processedRequests.has(row.Id) ||
                                  !account ||
                                  chainId !== BSC_CHAIN_ID ||
                                  isSending
                                }
                                title={
                                  processedRequests.has(row.Id)
                                    ? 'Already processed'
                                    : !account
                                      ? 'Connect wallet first'
                                      : chainId !== BSC_CHAIN_ID
                                        ? 'Switch to BSC network'
                                        : ''
                                }
                              >
                                {processedRequests.has(row.Id) ? 'Approved' : 'Approve USDT'}
                              </button>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <button
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${processedRequests.has(row.Id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md'
                                  }`}
                                onClick={() => handleApproveClick(row.AuthLogin, row.Id)}
                                disabled={processedRequests.has(row.Id)}
                                title={processedRequests.has(row.Id) ? 'Already processed' : ''}
                              >
                                {processedRequests.has(row.Id) ? 'Approved' : 'Approve'}
                              </button>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-mono font-medium text-gray-900 dark:text-white">
                              {row.AuthLogin || '-'}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {row.FullName || '-'}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.CreatedDate ? row.CreatedDate.split('T')[0] : '-'}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              ${row.TotWithdl}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              ${row.AdminCharge}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                              ${row.Release}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {row.Email || '-'}
                            </td>
                            <td className="px-3 py-3">
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
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                {row.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.Remark || '-'}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <button
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${processedRequests.has(row.Id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md'
                                  }`}
                                onClick={() => handleRejectClick(row.AuthLogin, row.Id)}
                                disabled={processedRequests.has(row.Id)}
                                title={processedRequests.has(row.Id) ? 'Already processed' : 'Reject request'}
                              >
                                {processedRequests.has(row.Id) ? 'Rejected' : 'Reject'}
                              </button>
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
                            setRowsPerPage(Number(e.target.value))
                            setCurrentPage(1)
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
                          className="min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200   bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
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
                <p className="text-gray-500 dark:text-gray-400 font-medium">No income requests found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Approve Popup Modal */}
      {approvePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-96 p-6 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Approval</h3>
            </div>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              Do you want to approve AuthLoginID{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedRequest.authLoginId}</span>?
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Popup Modal */}
      {rejectPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-96 p-6 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FaTimesCircle className="text-red-600 dark:text-red-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Rejection</h3>
            </div>
            <div className="mb-4 text-gray-600 dark:text-gray-300">
              Do you want to reject AuthLoginID{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedRequest?.authLoginId || 'N/A'}</span>?
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Remark <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter rejection reason..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className={`px-4 py-2 font-medium rounded-xl transition-all duration-200 shadow-md ${!remark.trim()
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
                  }`}
                disabled={!remark.trim()}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncomeRequest