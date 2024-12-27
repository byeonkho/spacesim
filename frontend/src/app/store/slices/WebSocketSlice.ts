import {createSlice, PayloadAction} from '@reduxjs/toolkit';


interface WebSocketState {
    socket: WebSocket | null;
    isConnected: boolean;
    error: string | null;
}

const initialState: WebSocketState = {
    socket: null,
    isConnected: false,
    error: null,
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
        error: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

        notificationReceived: (state, action: PayloadAction<any>) => {
            // Handle notification logic
        },
    },
});


export const {
    connected,
    disconnected,
    error,
} = webSocketSlice.actions;

export default webSocketSlice.reducer;

// export const handleWebSocketMessage = (dispatch: AppDispatch, data: SimulationData) => {
//     dispatch(updateDataReceived(data)); // Dispatch to simulation slice
// };