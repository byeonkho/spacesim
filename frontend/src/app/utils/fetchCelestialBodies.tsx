// src/utils/loadCelestialObjects.ts

import { AppDispatch } from '../store/store';
import {loadSimulationData, SimulationData} from '../store/simulationSlice';


export const fetchCelestialBodies = async (dispatch: AppDispatch) => {
    try {
        const response = await fetch('/testJson.json');
        const data: SimulationData = await response.json();

        // Dispatch the loadSimulationData action with the fetched data
        dispatch(loadSimulationData(data));
    } catch (error) {
        console.error('Failed to load celestial objects data:', error);
    }
};