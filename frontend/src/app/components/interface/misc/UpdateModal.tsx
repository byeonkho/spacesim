import React from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { selectIsUpdating } from "@/app/store/slices/SimulationSlice";

const UpdateText: React.FC = () => {
  const isUpdating = useSelector(selectIsUpdating);

  return (
    <>
      {isUpdating && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
            color: "#fff", // White text
            padding: 3,
            borderRadius: 2,
            textAlign: "center",
            display: "flex", // Align spinner and text side by side
            alignItems: "center",
            gap: 2, // Space between spinner and text
            zIndex: 1000, // Ensure it's on top of other elements
          }}
        >
          <CircularProgress size={24} color="inherit" />
          <Typography variant="h6">Fetching data...</Typography>
        </Box>
      )}
    </>
  );
};

export default UpdateText;
