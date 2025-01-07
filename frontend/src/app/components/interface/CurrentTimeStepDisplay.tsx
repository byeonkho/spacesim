import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentTimeStepKey} from "@/app/store/slices/SimulationSlice";

const CurrentTimestepDisplay: React.FC = () => {
    const currentTimeStepKey = useSelector(selectCurrentTimeStepKey);

    // Get the current timestep key

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "300px" }}>
            <h3>Current Timestep</h3>
            <p>{currentTimeStepKey}</p>
        </div>
    );
};

export default CurrentTimestepDisplay;
