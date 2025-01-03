import {createSlice, PayloadAction} from '@reduxjs/toolkit';


interface WebSocketState {
    socket: WebSocket | null;
    isConnected: boolean;
    isRequestInProgress: boolean;
    errorMessage: string | null;
}

const initialState: WebSocketState = {
    socket: null,
    isConnected: false,
    isRequestInProgress: false,
    errorMessage: null,
};

export const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {
        connected: (state) => {
            state.isConnected = true;
            state.error = null;
        },
        disconnected: (state) => {
            state.isConnected = false;
            state.error = null;
        },
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        setRequestInProgress: (state, action: PayloadAction<boolean>) => {
            state.isRequestInProgress = action.payload;
        },

        notificationReceived: (state, action: PayloadAction<any>) => {
            // Handle notification logic
        },
    },
});


export const {
    connected,
    disconnected,
    setErrorMessage,
    setRequestInProgress
} = webSocketSlice.actions;

export default webSocketSlice.reducer;