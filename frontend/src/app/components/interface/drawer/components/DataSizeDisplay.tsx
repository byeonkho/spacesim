import React from "react";
import { useSelector } from "react-redux";
import { selectSimulationDataSize } from "@/app/store/slices/SimulationSlice";
import theme from "@/muiTheme";

const DataSizeDisplay: React.FC = () => {
  const dataSize = useSelector(selectSimulationDataSize);

  // Convert bytes to a human-readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: theme.palette.background.default,
        border: "1px solid" + " #ccc",
      }}
    >
      <h4>State Size</h4>
      <p>{formatBytes(dataSize)}</p>
    </div>
  );
};

export default DataSizeDisplay;
