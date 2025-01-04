import React from "react";
import { useSelector } from "react-redux";
import {
    Backdrop,
    Box,
    CircularProgress,
    Modal,
    Typography,
} from "@mui/material";
import {selectIsUpdating} from "@/app/store/slices/SimulationSlice";

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const UpdateModal: React.FC = () => {
    const isUpdating = useSelector(selectIsUpdating);

    return (
        <Modal
            open={isUpdating}
            aria-labelledby="updating-modal-title"
            aria-describedby="updating-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Box sx={style}>
                <CircularProgress />
                <Typography id="updating-modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
                    Updating Data...
                </Typography>
            </Box>
        </Modal>
    );
};

export default UpdateModal;
