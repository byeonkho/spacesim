// src/components/CelestialDataFetcher.tsx

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {fetchCelestialBodies} from "@/app/utils/fetchCelestialBodies";

const CelestialDataTest: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            await fetchCelestialBodies(dispatch);
        };
        fetchData();
    }, [dispatch]);

    const celestialBodies = useSelector((state: RootState) => state.simulation.simulationData);

    useEffect(() => {
        console.log('Celestial Bodies State:', celestialBodies);
    }, [celestialBodies]);

    return (
        <></>
    );
};

export default CelestialDataTest;