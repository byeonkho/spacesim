import { AppDispatch } from "../store/store";
import {
  loadSimulation,
  SimulationParameters,
} from "@/app/store/slices/SimulationSlice";

// Load environment variables
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("Backend URL is not defined in environment variables.");
}

export const initializeCelestialBodies = async (
  dispatch: AppDispatch,
  requestBody: any,
) => {
  try {
    const response = await fetch(`${backendUrl}/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SimulationParameters = await response.json();

    // Dispatch the loadSimulationData action with the fetched data
    dispatch(loadSimulation(data));
  } catch (error) {
    console.error("Failed to load celestial objects data:", error);
  }
};
