"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRechargeTransactionAdmin } from '@/app/redux/slices/adminMasterSlice';
import Spinner from '@/app/common/spinner';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getBindAdminKit } from '@/app/redux/slices/eventSlice';
import { usernameLoginId, clearUsernameData } from '@/app/redux/slices/adminMasterSlice';

const LeaseAgentPage = () => {
  const dispatch = useDispatch();
  const { error: usernameError, rechargeTransactionData, usernameData: usernameData } = useSelector((state) => state.adminMaster ?? {});

  const { getKit } = useSelector((state) => state.event);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Form states
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [durationHr, setDurationHr] = useState(null);
  const [userid, setUserid] = useState('');
  const [packageType, setPackageType] = useState(null);
  const [useridError, setUseridError] = useState('');
  const [submittedUserid, setSubmittedUserid] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  // ROI amount state
  const [roiAmount, setRoiAmount] = useState('');
  const [roiAmountError, setRoiAmountError] = useState('');

  // Fetch kit data when usernameData changes
  useEffect(() => {
    const fetchKitData = async () => {
     {
        await dispatch(getBindAdminKit());
      }
    };

    fetchKitData();
  }, [usernameData, dispatch]);


  // Userid verification effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (userid && userid.trim()) {
        const result = await dispatch(usernameLoginId(userid));
        if (result.payload === null) {
          setUseridError("User ID doesn't exist");
        } else {
          setUseridError('');
        }
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [userid, dispatch]);

  // ROI amount validation
  useEffect(() => {
    if (roiAmount && roiAmount.trim()) {
      const amount = parseFloat(roiAmount);
      if (isNaN(amount) || amount <= 0) {
        setRoiAmountError('Please enter a valid amount');
      } else {
        setRoiAmountError('');
      }
    } else {
      setRoiAmountError('');
    }
  }, [roiAmount]);

  // Handle username error
  useEffect(() => {
    if (usernameError) {
      toast.error(usernameError.message || 'Invalid User ID');
      setUseridError("User ID doesn't exist");
    }
  }, [usernameError]);

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
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  const tableData = Array.isArray(rechargeTransactionData?.data)
    ? rechargeTransactionData?.data?.map((item, idx) => ({
      srNo: idx + 1,
      ...item,
    }))
    : rechargeTransactionData?.data && typeof rechargeTransactionData?.data === 'object'
      ? [{ srNo: 1, ...rechargeTransactionData?.data }]
      : [];

  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  // Updated packageOptions based on your API response
  const packageOptions = getKit?.bindBuyPackage?.map((kit) => {
    return {
      value: kit.Id,
      label: `${kit.Remark}`,
      originalData: kit
    };
  }) || [];


  // Form handlers
  const handleUseridChange = (e) => {
    setUserid(e.target.value);
  };

  const handleRoiAmountChange = (e) => {
    setRoiAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userid.trim()) {
      toast.error('Please enter User ID');
      return;
    }
    if (useridError) {
      toast.error('Please enter a valid User ID');
      return;
    }
    if (!packageType) {
      toast.error('Please select package type');
      return;
    }
    if (!roiAmount.trim()) {
      toast.error('Please enter amount');
      return;
    }
    if (roiAmountError) {
      toast.error('Please enter a valid amount');
      return;
    }

   
    setLoading(true);

    // Call addRechargeTransactionAdmin API
    const rechargePayload = {
      authlogin: userid,
      packageType: packageType.value,
      usdtValue: parseFloat(roiAmount),
    };


    try {
      const result = await dispatch(addRechargeTransactionAdmin(rechargePayload));
      if (result.payload) {
        toast.success('Recharge transaction fetched successfully!');
      } else {
        toast.error('Failed to fetch recharge transaction data');
      }
    } catch (error) {
      toast.error('Error fetching recharge transaction data');
      console.error('Error:', error);
    }

    // Set submitted userid and name for display
    setSubmittedUserid(userid);
    setSubmittedName(usernameData?.name || '');
    // Reset form
    setUserid('');
    setPackageType(null);
    setRoiAmount('');
    setUseridError('');
    setRoiAmountError('');
    dispatch(clearUsernameData());
    setLoading(false);
  };

  return (
    <div className="p-8 mx-auto mt-0 mb-12 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">

      <h6
        className="heading"
        style={{
          borderBottom: "1px solid #daebed",
          marginBottom: "15px",
        }}
      >
        Topup User
      </h6>

      {/* Form Section */}
      <div className="p-6 mb-8 bg-white border border-blue-100 shadow-lg rounded-xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Enter Userid */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Enter Userid</label>
            <input
              type="text"
              className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${useridError
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-blue-300"
                }`}
              value={userid}
              onChange={handleUseridChange}
              placeholder="Enter User ID"
            />
            {useridError && (
              <div className="mt-2 text-xs text-red-500">{useridError}</div>
            )}
            {usernameData && usernameData.name && (
              <div className="mt-2 text-xs text-green-600">{usernameData.name}</div>
            )}
          </div>

          {/* Enter ROI Amount */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Enter Amount</label>
            <input
              type="number"
              className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${roiAmountError
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-blue-300"
                }`}
              value={roiAmount}
              onChange={handleRoiAmountChange}
              placeholder="Enter Amount"
              min="0"
              step="0.01"
            />
            {roiAmountError && (
              <div className="mt-2 text-xs text-red-500">{roiAmountError}</div>
            )}
          </div>

          {/* Package Type DDL */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Package Type</label>
            <Select
              options={packageOptions}
              value={packageType}
              onChange={setPackageType}
              placeholder="Select Package"
              classNamePrefix="select"
              className="select-drop-dwon"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "47px",
                  height: "47px",
                  borderRadius: "0.75rem",
                  borderWidth: "1px",
                  borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                  boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                  backgroundColor: "#f9fafb",
                  "&:hover": {
                    borderColor: "#3b82f6",
                  },
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  height: "48px",
                  padding: "0 8px",
                  display: "flex",
                  alignItems: "center",
                }),
                input: (provided) => ({
                  ...provided,
                  margin: "0px",
                  padding: "0px",
                  color: "#000",
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  height: "48px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                  color: "#000",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#9ca3af",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.75rem",
                  zIndex: 20,
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#f3f4f6"
                      : "transparent",
                  color: state.isSelected ? "#fff" : "#374151",
                  "&:active": {
                    backgroundColor: "#e5e7eb",
                  },
                }),
              }}
              isSearchable
              isDisabled={!usernameData?.email || packageOptions.length === 0}
            />
            {!usernameData?.email && (
              <div className="mt-2 text-xs text-blue-500">
                Please verify User ID first to Package Availabe
              </div>
            )}
            {usernameData?.email && packageOptions.length === 0 && (
              <div className="mt-2 text-xs text-yellow-500">
                No packages available for this user
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={loading || !usernameData?.email || !packageType}
              className="px-6 py-3 text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <div className="flex items-center justify-center gap-2">
                <Spinner size={4} color="text-white" />
                <span>Loading...</span>
              </div> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaseAgentPage;