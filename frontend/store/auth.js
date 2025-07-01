import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storedToken = JSON.parse(sessionStorage.getItem("token"));

const initialState = {
  isAuthenticated: !!storedToken,
  isLoading: false,
  UsersList: [],
  user: null,
  token: storedToken || null,
};


const getAuthHeader = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SOCKET_URL}/users/register`, formData, {
       headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SOCKET_URL}/users/login`, formData, {
       headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);





export const getAllUsers = createAsyncThunk(
  'users/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/users/get-user`, {
        headers: getAuthHeader(),
      });
    
      return response.data; 
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue('Something went wrong');
      }
    }
  }
);


export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SOCKET_URL}/users/logout`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  }
);
export const checkAuth = createAsyncThunk(
  'auth/checkauth',
  async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/users/check-auth`,  {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          
        }

      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);



const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
        setUser: (state,action)=>{},
        resetTokenAndCredentials: (state) => {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }

      },
      extraReducers: (builder) => {
        builder
          .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
          })
          .addCase(registerUser.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
          })
          .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user =action.payload.success ?   action.payload.user : null ;
            state.isAuthenticated =action.payload.success ? true : false;
            state.token=  action.payload.token || null ;
            sessionStorage.setItem('token', JSON.stringify(action.payload.token))
          })
          .addCase(loginUser.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
          })
          .addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user =action.payload.success ?   action.payload.user : null ;
            state.isAuthenticated =action.payload.success ? true : false;
          })
          .addCase(checkAuth.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
          }).addCase(logoutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
          }).addCase(getAllUsers.pending,(state)=>{
                  state.isLoading = true;
          
              }).addCase(getAllUsers.fulfilled,(state,action)=>{
                  console.log(action?.payload?.data, "ye data h");
                  console.log(action?.payload, "without data");
                  state.isLoading = false;
                  state.UsersList = action?.payload?.data;

              }).addCase(getAllUsers.rejected,(state,action)=>{
                  state.isLoading = false;
                  state.UsersList = [];
              })

        }


})



export const {setUser, resetTokenAndCredentials} = authSlice.actions;
export default authSlice.reducer;