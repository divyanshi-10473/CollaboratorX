import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  invites: [],
  inviteProject:[],
};


const getAuthHeader = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const inviteCollaborator = createAsyncThunk(
  'projects/inviteCollaborator',
  async ({ projectId, invitedUserId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SOCKET_URL}/projectInvites/send`,
        { projectId, invitedUserId },
        { headers: getAuthHeader() }
      );

      return response?.data;
    } catch (err) {
      if (err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue('Failed to send invite');
    }
  }
);



export const fetchInvitesByProjectId = createAsyncThunk(
  'projectInvites/fetchInvitesByProjectId',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/projectInvites/get/${projectId}`, {
        headers: getAuthHeader(),
      });
      return response.data.invites; 
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue('Failed to fetch project invites');
      }
    }
  }
);


export const fetchUserInvites = createAsyncThunk(
  'projectinvites/fetchUserInvites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/projectInvites/fetch`, {
       headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch invites');
    }
  }
);

export const acceptInvite = createAsyncThunk(
  'invites/acceptInvite',
  async (inviteId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SOCKET_URL}/projectInvites/accept/${inviteId}`,
        {},
        { headers: getAuthHeader() } 
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectInvite = createAsyncThunk(
  'invites/rejectInvite',
  async (inviteId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SOCKET_URL}/projectInvites/reject/${inviteId}`,
        {},
        { headers: getAuthHeader()}
      );
      return response.data; // ✅ You missed returning this
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reject invite');
    }
  }
);

export const deleteInvite = createAsyncThunk(
  'projectInvites/deleteInvite',
  async (inviteId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_SOCKET_URL}/projectInvites/delete/${inviteId}`,{
      headers: getAuthHeader(),
      })
      return { inviteId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete invite');
    }
  }
);

const inviteSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {
  },
  extraReducers: (builder)=>{
    builder
      .addCase(fetchInvitesByProjectId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvitesByProjectId.fulfilled, (state, action) => {
        state.isLoading = false;
       
        state.invites = action?.payload;
      })
      .addCase(fetchInvitesByProjectId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';
      })  .addCase(fetchUserInvites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInvites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inviteProject = action.payload;
      })
      .addCase(fetchUserInvites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
}

});


export default inviteSlice.reducer;