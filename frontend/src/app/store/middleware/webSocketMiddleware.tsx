import {Middleware, MiddlewareAPI, Dispatch, Action} from 'redux';
import {updateDataReceived} from "@/app/store/slices/SimulationSlice";
import {useDispatch} from "react-redux";

interface ConnectAction {
    type: 'webSocket/connect';
    payload: string; // The WebSocket URL
}

interface DisconnectAction {
    type: 'webSocket/disconnect';
}

interface RequestRunSimulationAction {
    type: 'webSocket/requestRunSimulation';
    payload: any; // The message to send (consider typing this more specifically)
}

export const connect = (url: string) => ({
    type: 'webSocket/connect',
    payload: url,
});

export const disconnect = () => ({
    type: 'webSocket/disconnect',
});

export const sendMessage = (message: any) => ({
    type: 'webSocket/sendMessage',
    payload: message,
});

export const requestRunSimulation = (message: any) => ({
    type: 'webSocket/requestRunSimulation',
    payload: message,
});

type WebSocketAction = ConnectAction | DisconnectAction | RequestRunSimulationAction;

// the socket instance is housed in this class as Redux only allows for serializable objects to exist in store
let socket: WebSocket | null = null;


export const webSocketMiddleware: Middleware =
    (store: MiddlewareAPI) =>
        (next: Dispatch<Action>) =>
            (action: WebSocketAction) => {
                switch (action.type) {
                    case 'webSocket/connect':
                        if (socket !== null) {
                            // Close the existing connection if there is one
                            socket.close();
                        }
                        socket = new WebSocket(action.payload); // payload is the backend ws url;
                        // defined in .env

                        socket.onmessage = (event: MessageEvent) => {
                            try {
                                const messageData = JSON.parse(event.data);

                                switch (messageData.messageType) {
                                    case 'SIM_DATA':
                                        store.dispatch(updateDataReceived(messageData)); // store.dispatch used here
                                        // instead of useDispatch() because middleware is not part of the React
                                        // component tree; useDispatch() only works within components
                                        break;

                                    // case 'NOTIFICATION':
                                    //     store.dispatch(notificationReceived(messageData.payload));
                                    //     break;
                                    //
                                    // case 'ERROR':
                                    //     store.dispatch(error(messageData.payload));
                                    //     break;

                                    default:
                                        console.warn(`Unhandled message type: ${messageData.messageType}`);
                                }
                            } catch (err) {
                                console.error("Failed to parse WebSocket message:", err);
                            }
                        };
                        socket.onerror = (error: Event) =>
                            store.dispatch({type: 'webSocket/error', payload: error});
                        socket.onclose = () => {
                            store.dispatch({type: 'webSocket/disconnected'});
                            socket = null; // Ensure socket is set to null when it's closed
                        };
                        break;

                    case 'webSocket/disconnect':
                        if (socket !== null) {
                            socket.close();
                            socket = null; // Set socket to null after closing
                        }
                        break;

                    case 'webSocket/requestRunSimulation':
                        if (socket !== null && socket.readyState === WebSocket.OPEN) {
                            console.log("debug", action.payload)
                            socket!.send(JSON.stringify(action.payload)); // Non-null assertion
                        } else {
                            console.warn('Cannot send message: WebSocket is not open.');
                        }
                        break;

                    default:
                        break;
                }

                return next(action);
            };