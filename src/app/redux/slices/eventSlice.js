import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postformRequest, getRequest, postRequest, postRequestWithToken } from '@/app/api/auth';
import { API_ENDPOINTS } from '@/app/constants/menu-constant';


export const getevent = createAsyncThunk(
  "event/getevent",
  async (id, { rejectWithValue }) => {
    try {
      const endpoint = id
        ? `${API_ENDPOINTS.GET_ALL_EVENT_MASTER}/${id}`
        : API_ENDPOINTS.GET_ALL_EVENT_MASTER;

      const response = await getRequest(endpoint);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch events"
      );
    }
  }
);


export const getBindAdminKit = createAsyncThunk(
  "event/getBindAdminKit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.BIND_ADMIN_KIT);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch events"
      );
    }
  }
);

export const addevent = createAsyncThunk(
  'event/addevent',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postformRequest(API_ENDPOINTS.ADD_EVENT_MASTER, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
export const updateevent = createAsyncThunk(
  'event/updateevent',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postformRequest(API_ENDPOINTS.UPDATE_EVENT, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const eventSchedule = createAsyncThunk(
  'event/eventSchedule',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_EVENT_SCHEDULE, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getEventById = createAsyncThunk(
  "event/getEventById",
  async (EventMasterID, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.GET_SCHEDULE_BY_EID}?EventMasterID=${EventMasterID}`;
      const response = await getRequest(endpoint);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch event details"
      );
    }
  }
);
export const getAllUserEventbookingMaster = createAsyncThunk(
  'sellers/getAllUserEventbookingMaster',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_USER_EVENT_BOOKING_MASTER)
      if (!response || !response.data) {
        throw new Error('Invalid Booking Details received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching sellers')
    }
  },
)

export const closeEventMaster = createAsyncThunk(
  'event/closeEventMaster',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.CLOSE_EVENT_MASTER);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to close event'
      );
    }
  }
);

export const getClosedEventMaster = createAsyncThunk(
  'event/getClosedEventMaster',
  async ({ fromDate, toDate, loginId }, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.GET_CLOSED_EVENT_MASTER, { fromDate, toDate, loginId });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch closed events'
      );
    }
  }
);

export const addEventPreImages = createAsyncThunk(
  'event/addEventPreImages',
  async ({ EventMasterID, formData }, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.ADD_EVENT_PRE_IMAGES}?EventMasterID=${EventMasterID}`;
      const response = await postformRequest(endpoint, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add pre-images'
      );
    }
  }
);

export const deleteEventImages = createAsyncThunk(
  'event/deleteEventImages',
  async (Id, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.DELETE_EVENT_IMAGES}?Id=${Id}`;
      const response = await getRequest(endpoint);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete event images'
      );
    }
  }
);

export const getEventImagesByEMID = createAsyncThunk(
  'event/getEventImagesByEMID',
  async (EventMasterID, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.GET_EVENT_IMAGES_BY_EMID}?EventMasterID=${EventMasterID}`;
      const response = await getRequest(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch event images'
      );
    }
  }
);
export const editScheduleById = createAsyncThunk(
  "event/editScheduleById",
  async (Id, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.EDIT_SCHEDULE_BY_ID}?Id=${Id}`;
      const response = await getRequest(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch schedule"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    loading: false,
    error: null,
    success: null,
    data: [],
    selectedEvent: null,
    Bookingdetails: null,
    eventImages: [],
    selectedSchedule: null,
    closedEvents: [],
    getKit: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {

    builder
      .addCase(getevent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getevent.fulfilled, (state, action) => {
        state.loading = false;
        // Debug log

        // Multiple ways to extract the data - try each one
        const eventsData = action.payload?.data?.event ||
          action.payload?.event ||
          action.payload ||
          [];

        state.data = Array.isArray(eventsData) ? eventsData : [];
      })
      .addCase(getevent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBindAdminKit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getBindAdminKit.fulfilled, (state, action) => {
        state.loading = false;
        state.getKit = action.payload;
      })
      .addCase(getBindAdminKit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addevent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addevent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addevent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateevent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateevent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.data.findIndex(
          (item) => item.EventMasterID === action.payload.EventMasterID
        );
        if (updatedIndex !== -1) {
          state.data[updatedIndex] = action.payload;
        }
      })
      .addCase(updateevent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(eventSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(eventSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(eventSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload?.data || action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUserEventbookingMaster.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllUserEventbookingMaster.fulfilled, (state, action) => {
        state.Bookingdetails = action.payload || []
        state.loading = false
      })
      .addCase(getAllUserEventbookingMaster.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(closeEventMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(closeEventMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Event closed successfully';
        state.closeData = action.payload;
      })
      .addCase(closeEventMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEventPreImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addEventPreImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Pre-images added successfully';
      })
      .addCase(addEventPreImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEventImagesByEMID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventImagesByEMID.fulfilled, (state, action) => {
        state.loading = false;
        state.eventImages = action.payload || [];
      })
      .addCase(getEventImagesByEMID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSchedule = action.payload || null;
      })
      .addCase(editScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getClosedEventMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClosedEventMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.closedEvents = action.payload?.data || action.payload || [];
      })
      .addCase(getClosedEventMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { clearError, clearSuccess } = eventSlice.actions;
export default eventSlice.reducer;