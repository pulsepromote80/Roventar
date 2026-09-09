import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  postRequest,
  getRequestLoginId,
  postRequestLoginId,
  getRequest,
  postRequestWithToken,
  postRequestNoDataInBody,
  postRequestWithData,
  getRequestWithToken,
} from "@/app/api/auth";

const API_ENDPOINTS = {
  CHANGE_ADMIN_PASSWORD: "/AdminMaster/chanegAdminPassword",
  USERNAME_BY_LOGINID: "/AdminMaster/userNameByLoginIdAdmin",
  BLOCK_USER_BY_ADMIN: "/AdminMaster/blockUserByAdmin",
  CHANGE_ADMIN_SPONSOR_ID: "/AdminMaster/chanegAdminSponsorID",
  DOWNLOAD_EXCEL: "/AdminMaster/downloadExcel",
  GET_NEWS: "/AdminMaster/getNews",
  UPDATE_NEWS: "/AdminMaster/updateNews",
  GET_LEASE_AGENT: "/AdminMaster/getLeaseAgent",
  GET_ALL_CONTACT_US: "/Geography/getAllContacUs",
  GET_ACC_STATEMENT: "/AdminMaster/getAccStatemtnt",
  GET_LEASE_STATEMENT: "/AdminMaster/getGetLeaseStatement",
  ADD_RECHARGE_TRANSACTION_ADMIN: "/WalletReport/addRechargeTransactionAdmin",
  ADD_CREDIT_DEBIT_FUND: "/AdminMaster/addCreditAndDebitFund",
  GET_USER_WALLET_DETAILS: "/AdminMaster/getUserWalletDetails",
  GET_TRANS_TYPE: "/AdminMaster/getTransType",
  BULKREGISTRATION: "/AdminAuthentication/addBulkRegsitration",
  SEARCH_ALL_USERS: "/AdminManage/SearchAllUsers",
  ADMIN_USER_LOGIN: "/Authentication/adminUserLogin",
  UPDATE_ADMIN_LVL_OPEN: "/AdminMaster/updatelvlAdmin",
  GENERATE_WALLET_ADDRESS: "/Self/GenerateWalletAddress",
  GET_ALL_WALLET_ADDRESS: "/Self/getAllWalletAddress",
  CHANGE_ADMIN_USER_PASSWORD: "/Authentication/changePassword",
};

export const ChangePasswordAdminUserMaster = createAsyncThunk(
  "adminMaster/ChangePasswordAdminUserMaster",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.CHANGE_ADMIN_USER_PASSWORD,
        data,
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const ChangePasswordAdminMaster = createAsyncThunk(
  "adminMaster/changePasswordAdminMaster",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.CHANGE_ADMIN_PASSWORD,
        data,
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const adminuserLogin = createAsyncThunk(
  "adminMaster/adminuserLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.ADMIN_USER_LOGIN,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Admin login failed",
      );
    }
  },
);
export const usernameLoginId = createAsyncThunk(
  "adminMaster/usernameLoginId",
  async (authLogin, { rejectWithValue }) => {
    try {
      const response = await getRequestLoginId(
        `${API_ENDPOINTS.USERNAME_BY_LOGINID}?authLogin=${authLogin}`,
      );

      if (!response) {
        throw new Error("Invalid user wallet details data received");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching user wallet details",
      );
    }
  },
);

export const LvlOpen = createAsyncThunk(
  "adminMaster/LvlOpen",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithData(
        API_ENDPOINTS.UPDATE_ADMIN_LVL_OPEN,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error changing sponsor");
    }
  },
);

export const blockUserByAdmin = createAsyncThunk(
  "adminMaster/blockUserByAdmin",
  async (authLogin, { rejectWithValue }) => {
    try {
      const response = await postRequestLoginId(
        `${API_ENDPOINTS.BLOCK_USER_BY_ADMIN}?authLogin=${authLogin}`,
      );

      if (!response) {
        throw new Error("Invalid user wallet details data received");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching user wallet details",
      );
    }
  },
);

export const ChangeAdminSponser = createAsyncThunk(
  "adminMaster/ChangeAdminSponser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.CHANGE_ADMIN_SPONSOR_ID,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error changing sponsor");
    }
  },
);

export const downloadExcel = createAsyncThunk(
  "adminMaster/downloadExcel",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.DOWNLOAD_EXCEL,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error downloading Excel");
    }
  },
);

export const getNews = createAsyncThunk(
  "adminMaster/getNews",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.GET_NEWS, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching news");
    }
  },
);

export const updateNews = createAsyncThunk(
  "adminMaster/updateNews",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.UPDATE_NEWS, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching news");
    }
  },
);

export const getLeaseAgent = createAsyncThunk(
  "adminMaster/getLeaseAgent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_LEASE_AGENT, data);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community data",
      );
    }
  },
);

export const getAllContactUs = createAsyncThunk(
  "adminMaster/getAllContactUs",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.GET_ALL_CONTACT_US,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching contact us data",
      );
    }
  },
);

export const getAccStatemtnt = createAsyncThunk(
  "adminMaster/getAccStatemtnt",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_ACC_STATEMENT,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching contact us data",
      );
    }
  },
);

export const getLeaseStatemtnt = createAsyncThunk(
  "adminMaster/getLeaseStatemtnt",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_LEASE_STATEMENT,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching contact us data",
      );
    }
  },
);

export const addRechargeTransactionAdmin = createAsyncThunk(
  "adminMaster/addRechargeTransactionAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.ADD_RECHARGE_TRANSACTION_ADMIN,
        data,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching recharge transaction data",
      );
    }
  },
);

export const addFund = createAsyncThunk(
  "adminMaster/addFund",
  async (fundData, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.ADD_CREDIT_DEBIT_FUND,
        fundData,
      );
      if (!response) {
        throw new Error("Invalid add fund response");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding fund");
    }
  },
);

export const getUserWalletDetails = createAsyncThunk(
  "adminMaster",
  async (loginId, { rejectWithValue }) => {
    try {
      const response = await getRequestLoginId(
        `${API_ENDPOINTS.GET_USER_WALLET_DETAILS}?LoginId=${loginId}`,
      );

      if (!response) {
        throw new Error("Invalid user wallet details data received");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching user wallet details",
      );
    }
  },
);

export const getTransType = createAsyncThunk(
  "adminMaster/getTransType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestNoDataInBody(
        `${API_ENDPOINTS.GET_TRANS_TYPE}?Type=${data}`,
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const bulkRegistration = createAsyncThunk(
  "adminMaster/bulkRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.BULKREGISTRATION,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Bulk Registration API Error:",
        error.response?.data || error.message,
      );
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  },
);

export const addAdminManageUser = createAsyncThunk(
  "adminMaster/addAdminManageUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.SEARCH_ALL_USERS,
        data,
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  },
);
export const generateWalletAddress = createAsyncThunk(
  "adminMaster/generateWalletAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GENERATE_WALLET_ADDRESS,
        data,
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  },
);

export const getAllWalletAddress = createAsyncThunk(
  "adminMaster/getAllWalletAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(
        API_ENDPOINTS.GET_ALL_WALLET_ADDRESS,
        data,
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  },
);
const adminMasterSlice = createSlice({
  name: "adminMaster",
  initialState: {
    status: null,
    loading: false,
    error: null,
    ChangePasswordData: null,
    updateNewsData: null,
    newsData: null,
    usernameData: null,
    blockUserData: null,
    sponserData: null,
    excelData: null,
    leaseAgentData: null,
    contactUsData: null,
    accStatementData: null,
    LeaseStatementData: null,
    rechargeTransactionData: null,
    addFundSuccess: null,
    data: null,
    transTypeData: null,
    bulkRegistrationData: null,
    levelOpenData: null,
    searchData: null,
    adminUserLoginData: null,
    walletAddressData: null,
    allWalletData: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearChangePasswordData: (state) => {
      state.ChangePasswordData = null;
    },
    clearUsernameData: (state) => {
      state.usernameData = null;
    },
    clearSearchData: (state) => {
      state.searchData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminuserLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminuserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserLoginData = action.payload;
        state.error = null;
      })
      .addCase(adminuserLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(ChangePasswordAdminMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ChangePasswordAdminMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.ChangePasswordData = action.payload;
        state.error = null;
      })
      .addCase(ChangePasswordAdminMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(usernameLoginId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usernameLoginId.fulfilled, (state, action) => {
        state.usernameData = action.payload;
        state.loading = false;
      })
      .addCase(usernameLoginId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(blockUserByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUserByAdmin.fulfilled, (state, action) => {
        state.blockUserData = action.payload;
        state.loading = false;
      })
      .addCase(blockUserByAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(ChangeAdminSponser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ChangeAdminSponser.fulfilled, (state, action) => {
        state.sponserData = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(ChangeAdminSponser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(downloadExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadExcel.fulfilled, (state, action) => {
        state.excelData = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(downloadExcel.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsData = action.payload;
        state.error = null;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(LvlOpen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LvlOpen.fulfilled, (state, action) => {
        state.loading = false;
        state.levelOpenData = action.payload;
        state.error = null;
      })
      .addCase(LvlOpen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        state.updateNewsData = action.payload;
        state.error = null;
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeaseAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaseAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.leaseAgentData = action.payload.data;
      })
      .addCase(getLeaseAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contactUsData = action.payload;
        state.error = null;
      })
      .addCase(getAllContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAccStatemtnt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccStatemtnt.fulfilled, (state, action) => {
        state.loading = false;
        state.accStatementData = action.payload;
        state.error = null;
      })
      .addCase(getAccStatemtnt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLeaseStatemtnt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaseStatemtnt.fulfilled, (state, action) => {
        state.loading = false;
        state.LeaseStatementData = action.payload;
        state.error = null;
      })
      .addCase(getLeaseStatemtnt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRechargeTransactionAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRechargeTransactionAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.rechargeTransactionData = action.payload;
        state.error = null;
      })
      .addCase(addRechargeTransactionAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFund.fulfilled, (state, action) => {
        state.loading = false;
        state.addFundSuccess = action.payload;
      })
      .addCase(addFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserWalletDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWalletDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getUserWalletDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getTransType.pending, (state) => {
        state.transTypeLoading = true;
        state.transTypeError = null;
      })
      .addCase(getTransType.fulfilled, (state, action) => {
        state.transTypeLoading = false;
        state.transTypeData = action.payload;
        state.transTypeError = null;
      })
      .addCase(getTransType.rejected, (state, action) => {
        state.transTypeLoading = false;
        state.transTypeError = action.payload;
      })
      .addCase(bulkRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bulkRegistrationData = action.payload;
      })
      .addCase(bulkRegistration.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(addAdminManageUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminManageUser.fulfilled, (state, action) => {
        state.loading = false;
        state.searchData = action.payload;
        state.error = null;
      })
      .addCase(addAdminManageUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateWalletAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateWalletAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.walletAddressData = action.payload;
        state.error = null;
      })
      .addCase(generateWalletAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllWalletAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWalletAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.allWalletData = action.payload;
        state.error = null;
      })
      .addCase(getAllWalletAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearChangePasswordData,
  clearUsernameData,
  clearSearchData,
} = adminMasterSlice.actions;
export default adminMasterSlice.reducer;
