import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {postRequest,getRequest,postRequestWithToken,putRequestWithToken,getRequestWithToken} from "@/app/api/auth"
const API_ENDPOINTS = {
    GET_ALL_FUND_REQUEST_REPORT_ADMIN: "/AdminManageFund/getAllFundRequestReport_Admin",
    UPDATE_REQUEST_STATUS_ADMIN: "/AdminManageFund/updateFundRequestStatus_Admin",
    GET_RENT_WALLET: "/AdminManageUser/getRentWithdrawalWallet",
    GET_ALL_INCOME_REQUEST_ADMIN: "/AdminManageFund/getAllIncomeRequestReport_Admin",
    GET_ALL_USER_ROI_WITHDRAWAL_REQUEST_ADMIN: "/AdminManageFund/getAllROIWithdrawalReport_Admin",
    GET_ALL_SELF_DEPOSITE_ADMIN: "/Self/getAllSelfDepositeAdmin",
    ADD_TRANSFER_INCOME_TO_DEPOSIT_WALLET:"/FundManager/addTransferIncomeToDepositWallet",
    GET_TRANSFER_INCOME_TO_DEPOSIT_WALLET_REPORT:"/FundManager/getTransferIncomeToDepositWalletReport",
    ADD_USER_WITHDRWAL_REQUEST:"/FundManager/addUserWithdrawalRequest",
    UPDATE_INCOME_WITHDRAW_REQUEST_STATUS_ADMIN: "/AdminManageFund/UpIncomeWithdReqStatus_Admin",
    UP_WITH_REQ_STATUS_ADMIN:"/AdminManageFund/upROIWithdReqStatus_Admin",
    UPDATE_RENT_WITHDRAW_REQUEST_STATUS_ADMIN: "/FundManager/upRentWithdReqStatus_Admin",
    UPDATE_INCOME_WALLET_ADDRESS: "/AdminManageFund/updateIncomeWalletAdress",
    UPDATE_RENT_WALLET_ADDRESS: "/WalletReport/updateRentWalletAdress",
    ALL_WALLET_HISTORY:"/AdminManageFund/allWalletHistory",
    UPDATE_ROI_WALLET_ADDRESS:"/AdminManageFund/updateRoiWalletAdress",
    ADD_FUND_REQUEST:"/FundManager/addFundRequest",
    USERNAME_BY_LOGINID:"/AdminMaster/userNameByLoginId",
    GET_FUND_REQUEST_REPORT:"/FundManager/getFundRequestReport",
    GET_FUND_TRANSFER_DEPOSIT_TO_DEPOSIT_REPORT:"/FundManager/getfundTransferDepositToDepositReport",
    GET_LEFT_RIGHT_DOWNLINE:"/Community/getLeftRightdownline",
    GET_DIRECT_MEMBER:"/Community/getdirectMember",
    ADD_RECHARGE_TRANSACTION_USER:"/FundManager/addRechargeTransactionUser",
    GET_RECHARGE_TRANSACTION_HISTORY:"/FundManager/getRechargeTransactionURID",
    GENERATE_ROI_BOTCLICK:"/FundManager/genrateROI_BOTCLICK",
    FUND_TRANSFER_DEPOSIT_TO_DEPOSIT:"/FundManager/fundTransferDepositToDeposit",
    WITHDRAWAL_PRINCIPLE:"/WalletReport/withdrawalPrinciple"

};
export const getAllFundRequestReportAdmin = createAsyncThunk(
    "fundManager/getAllFundRequestReportAdmin",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.GET_ALL_FUND_REQUEST_REPORT_ADMIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getAllWalletHistory = createAsyncThunk(
    "fundManager/getAllWalletHistory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.ALL_WALLET_HISTORY,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const updateFundRequestStatusAdmin = createAsyncThunk(
    "fundManager/updateFundRequestStatusAdmin",
    async ({ authLoginId, rfstatus, remark, id }, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.UPDATE_REQUEST_STATUS_ADMIN,
                {
                    authLoginId,
                    id,
                    rfstatus,
                    remark
                }
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to update fund request status");
        }
    }
);

export const getRentWallet = createAsyncThunk(
    "fundManager/getRentWallet",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.GET_RENT_WALLET,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getAllIncomeRequestAdmin = createAsyncThunk(
    "fundManager/getAllIncomeRequestAdmin",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.GET_ALL_INCOME_REQUEST_ADMIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

//get self deposit
export const getAllSelfDepositeAdmin = createAsyncThunk(
    "Self/getAllSelfDepositeAdmin",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.GET_ALL_SELF_DEPOSITE_ADMIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getAllUserROIWithdrawalRequest= createAsyncThunk(
    "Self/ getAllUserROIWithdrawalReques",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.GET_ALL_USER_ROI_WITHDRAWAL_REQUEST_ADMIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);


export const UpIncomeWithdReqStatusAdmin = createAsyncThunk(
    "fundManager/updateIncomeWithdrawRequestStatusAdmin",
    async ({ authLoginId, rfstatus, remark, id }, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.UPDATE_INCOME_WITHDRAW_REQUEST_STATUS_ADMIN,
                {
                    authLoginId,
                    id,
                    rfstatus,
                    remark
                }
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);


export const upROIWithdReqStatusAdmin = createAsyncThunk(
    "fundManager/upROIWithdReqStatusAdmin",
    async ({ authLoginId, rfstatus, remark, id }, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.UP_WITH_REQ_STATUS_ADMIN,
                {
                    authLoginId,
                    id,
                    rfstatus,
                    remark
                }
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);



export const updateRentWithdrawRequestStatusAdmin = createAsyncThunk(
    "fundManager/updateRentWithdrawRequestStatusAdmin",
    async ({ authLoginId, rfstatus, remark, id }, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.UPDATE_RENT_WITHDRAW_REQUEST_STATUS_ADMIN,
                {
                    authLoginId,
                    id,
                    rfstatus,
                    remark
                }
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const updateIncomeWalletAdressUSDT = createAsyncThunk(
    "fundManager/updateIncomeWalletAdressUSDT",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.UPDATE_INCOME_WALLET_ADDRESS,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);
export const updateRentWalletAdressUSDT = createAsyncThunk(
    "fundManager/updateRentWalletAdressUSDT",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.UPDATE_RENT_WALLET_ADDRESS,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const updateROIWalletAdressUSDT = createAsyncThunk(
    "fundManager/updateROIWalletAdressUSDT",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.UPDATE_ROI_WALLET_ADDRESS,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const addFundRequest = createAsyncThunk(
    "fund/addFundRequest",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_FUND_REQUEST, data);
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const addTransferIncomeToDepositWallet = createAsyncThunk(
    "fund/addTransferIncomeToDepositWallet",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_TRANSFER_INCOME_TO_DEPOSIT_WALLET, data);
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);
export const addUserWithdrawalRequest= createAsyncThunk(
    "fund/addUserWithdrawalRequest",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_USER_WITHDRWAL_REQUEST, data);
            
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const fundTransferDepositToDeposit = createAsyncThunk(
    "fund/fundTransferDepositToDeposit",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.FUND_TRANSFER_DEPOSIT_TO_DEPOSIT, data);
            return response;
            
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const getTransferIncomeToDepositWalletReport = createAsyncThunk(
    "fund/getTransferIncomeToDepositWalletReport",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_TRANSFER_INCOME_TO_DEPOSIT_WALLET_REPORT}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);

export const getFundRequestReport = createAsyncThunk(
    "fund/getFundRequestReport", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_FUND_REQUEST_REPORT}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);

export const getfundTransferDepositToDepositReport = createAsyncThunk(
    "fund/getfundTransferDepositToDepositReport",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_FUND_TRANSFER_DEPOSIT_TO_DEPOSIT_REPORT}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch income to deposit wallet report");
        }
    }
);

export const usernameByLoginId = createAsyncThunk(
    'fund/usernameLoginId',
    async (authLogin, { rejectWithValue }) => {
        try {
          
            const response = await getRequestWithToken(`${API_ENDPOINTS.USERNAME_BY_LOGINID}?authLogin=${authLogin}`);
            if (!response) {
                throw new Error('Invalid user wallet details data received');
            }
           
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching user wallet details');
        }
    }
);

export const LeftRightDownline = createAsyncThunk(
    "fund/LeftRightDownline",
    async (data, { rejectWithValue }) => {
       
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.GET_LEFT_RIGHT_DOWNLINE, data);
            
            return response;
            
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const GetDirectMember = createAsyncThunk(
    "fund/GetDirectMember",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.GET_DIRECT_MEMBER, data);
            return response;
            
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const addRechargeTransactionUser = createAsyncThunk(
    "fundManager/addRechargeTransactionUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.ADD_RECHARGE_TRANSACTION_USER,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getRechargetransactionHIstory = createAsyncThunk(
    "fund/getRechargetransactionHIstory", 
    async (urid, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_RECHARGE_TRANSACTION_HISTORY}?URID=${urid}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);

export const botActivate = createAsyncThunk(
    "fund/botActivate", 
    async (urid, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(`${API_ENDPOINTS.GENERATE_ROI_BOTCLICK}?URID=${urid}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);

export const addWithdrawalPrinciple = createAsyncThunk(
    "fundManager/addWithdrawalPrinciple",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.WITHDRAWAL_PRINCIPLE,
                data
            );
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);
const fundManagerSlice = createSlice({
    name: "fundManager",
    initialState: {
        loading: false,
        error: null,
        fundRequestData: null,
        wallethistoryData:null,
        updateFundRequestData: null,
        rentWalletData: null,
        withdrawRequestData: null,
        updateIncomingRequestData: null,
        updateRentWithdrawRequestData: null,
        updateIncomingRequestUSDTData: null,
        updateRentRequestUSDTData: null,
        selfDepositData: null,
        roiRequestData:null,
        upROIWithdReqData:null,
        updateROIRequestUSDTData:null,
        addFundRequestData:null,
        getFundRequestReportData:null,
        addUserWithdrawalRequestData:null,
        fundTransferDepositToDepositData:null,
        getTransferIncomeToDepositWalletReportData:null,
        getIncomeToDepositWalletReportData:null,
        usernameData:null,
        LeftRightDownlineData:null,
        GetDirectMemberData:null,
        RechargeUserData:null,
        RechargeBotHistory:null,
        BotData:null,
        principleData:null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllFundRequestReportAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFundRequestReportAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.fundRequestData = action.payload;
            })
            .addCase(getAllFundRequestReportAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateFundRequestStatusAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFundRequestStatusAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.updateFundRequestData = action.payload;
            })
            .addCase(updateFundRequestStatusAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getRentWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRentWallet.fulfilled, (state, action) => {
                state.loading = false;
                state.rentWalletData = action.payload;
            })
            .addCase(getRentWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getAllIncomeRequestAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllIncomeRequestAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawRequestData = action.payload;
            })
            .addCase(getAllIncomeRequestAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllUserROIWithdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUserROIWithdrawalRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.roiRequestData = action.payload;
            })
            .addCase(getAllUserROIWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpIncomeWithdReqStatusAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpIncomeWithdReqStatusAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.updateIncomingRequestData = action.payload;
            })
            .addCase(UpIncomeWithdReqStatusAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(upROIWithdReqStatusAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(upROIWithdReqStatusAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.upROIWithdReqData = action.payload;
            })
            .addCase(upROIWithdReqStatusAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

           
            .addCase(updateRentWithdrawRequestStatusAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRentWithdrawRequestStatusAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.updateRentWithdrawRequestData = action.payload;
            })
            .addCase(updateRentWithdrawRequestStatusAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateIncomeWalletAdressUSDT.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIncomeWalletAdressUSDT.fulfilled, (state, action) => {
                state.loading = false;
                state.updateIncomingRequestUSDTData = action.payload;
            })
            .addCase(updateIncomeWalletAdressUSDT.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(updateRentWalletAdressUSDT.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRentWalletAdressUSDT.fulfilled, (state, action) => {
                state.loading = false;
                state.updateRentRequestUSDTData = action.payload;
            })
            .addCase(updateRentWalletAdressUSDT.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(getAllWalletHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllWalletHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.wallethistoryData = action.payload;
            })
            .addCase(getAllWalletHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllSelfDepositeAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSelfDepositeAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.selfDepositData = action.payload;
            })
            .addCase(getAllSelfDepositeAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateROIWalletAdressUSDT.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateROIWalletAdressUSDT.fulfilled, (state, action) => {
                state.loading = false;
                state.updateROIRequestUSDTData = action.payload;
            })
            .addCase(updateROIWalletAdressUSDT.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addFundRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFundRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.addFundRequestData = action.payload;
                state.error = null;
            })

             .addCase(addTransferIncomeToDepositWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTransferIncomeToDepositWallet.fulfilled, (state, action) => {
                state.loading = false;  
                state.getFundRequestReportData = action.payload;
                state.error = null;
            })
            .addCase(addTransferIncomeToDepositWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addUserWithdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( addUserWithdrawalRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.addUserWithdrawalRequestData = action.payload;
                state.error = null;
            })
            .addCase( addUserWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             .addCase(fundTransferDepositToDeposit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( fundTransferDepositToDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.fundTransferDepositToDepositData = action.payload;
                state.error = null;
            })
            .addCase(fundTransferDepositToDeposit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getFundRequestReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFundRequestReport.fulfilled, (state, action) => {
                state.loading = false;  
                state.getFundRequestReportData = action.payload;
                state.error = null;
            })
            .addCase(getFundRequestReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             .addCase( getTransferIncomeToDepositWalletReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( getTransferIncomeToDepositWalletReport.fulfilled, (state, action) => {
                state.loading = false;  
                state.getTransferIncomeToDepositWalletReportData = action.payload;
                state.error = null;
            })
            .addCase( getTransferIncomeToDepositWalletReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             .addCase(getfundTransferDepositToDepositReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getfundTransferDepositToDepositReport.fulfilled, (state, action) => {
                state.loading = false;
                state.getIncomeToDepositWalletReportData = action.payload;
                state.error = null;
            })
            .addCase(getfundTransferDepositToDepositReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             .addCase(usernameByLoginId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usernameByLoginId.fulfilled, (state, action) => {
                state.usernameData = action.payload;
                state.loading = false;
            })
            .addCase(usernameByLoginId.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

               .addCase(LeftRightDownline.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( LeftRightDownline.fulfilled, (state, action) => {
                state.loading = false;
                state.LeftRightDownlineData = action.payload;
                state.error = null;
            })
            .addCase(LeftRightDownline.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

               .addCase(GetDirectMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( GetDirectMember.fulfilled, (state, action) => {
                state.loading = false;
                state.GetDirectMemberData = action.payload;
                state.error = null;
            })
            .addCase(GetDirectMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             .addCase(addRechargeTransactionUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRechargeTransactionUser.fulfilled, (state, action) => {
                state.loading = false;
                state.RechargeUserData = action.payload;
            })
            .addCase(addRechargeTransactionUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
             .addCase(getRechargetransactionHIstory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRechargetransactionHIstory.fulfilled, (state, action) => {
                state.loading = false;
                state.RechargeBotHistory = action.payload;
            })
            .addCase(getRechargetransactionHIstory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(botActivate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(botActivate.fulfilled, (state, action) => {
                state.loading = false;
                state.BotData = action.payload;
            })
            .addCase(botActivate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                })

                .addCase(addWithdrawalPrinciple.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addWithdrawalPrinciple.fulfilled, (state, action) => {
                state.loading = false;
                state.principleData = action.payload;
            })
            .addCase(addWithdrawalPrinciple.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});
export default fundManagerSlice.reducer;