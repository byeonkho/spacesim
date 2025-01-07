import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface CelestialBodyDetailsProps {
    selectedBody: {
        name: string;
        radius: number;
        position: { x: number; y: number; z: number };
        velocity: { x: number; y: number; z: number };
    } | null;
    onClose: () => void;
}

const CelestialBodyDetails: React.FC<CelestialBodyDetailsProps> = ({ selectedBody, onClose }) => {
    if (!selectedBody) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                padding: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                borderRadius: 4,
                boxShadow: 3,
                zIndex: 10, // Ensure it appears above other elements
                width: 300,
            }}
        >
            <Typography variant="h6">{selectedBody.name}</Typography>
            <Typography variant="body2">
                <strong>Radius:</strong> {selectedBody.radius}
            </Typography>
            <Typography variant="body2">
                <strong>Position:</strong> (
                {selectedBody.position.x.toFixed(2)}, {selectedBody.position.y.toFixed(2)}, {selectedBody.position.z.toFixed(2)}
                )
            </Typography>
            <Typography variant="body2">
                <strong>Velocity:</strong> (
                {selectedBody.velocity.x.toFixed(2)}, {selectedBody.velocity.y.toFixed(2)}, {selectedBody.velocity.z.toFixed(2)}
                )
            </Typography>
            <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{ mt: 1 }}
                onClick={onClose}
            >
                Close
            </Button>
        </Box>
    );
};

export default CelestialBodyDetails;
