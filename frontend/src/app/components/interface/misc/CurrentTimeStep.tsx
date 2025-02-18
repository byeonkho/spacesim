import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentTimeStepKey } from "@/app/store/slices/SimulationSlice";
import Box from "@mui/material/Box";

const CurrentTimeStep = () => {
  const currentTimeStepKey: string = useSelector(selectCurrentTimeStepKey);
  const [datePart, timePart] = currentTimeStepKey.split("T");
  const formattedTimeStepKey: string = `${datePart}  ${timePart || ""}`;

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          whiteSpace: "pre",
          fontVariantNumeric: "tabular-nums", // monospace numerals
        }}
      >
        {formattedTimeStepKey}
      </Typography>
    </Box>
  );
};

export default CurrentTimeStep;
