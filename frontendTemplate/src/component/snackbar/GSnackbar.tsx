import { Alert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  SnackbarRequest,
  removeLastSnackbar,
} from "src/redux/store/snackbar/snackbarSlice";

const GSnackBar = () => {
  const dispatch = useAppDispatch();
  const snackbarRequestList: SnackbarRequest[] = useAppSelector(
    (state) => state.snackbar.snackbarRequestList
  );
  const handleClose = () => {
    dispatch(removeLastSnackbar());
  };
  return (
    <div>
      {snackbarRequestList.map((item, index) => (
        <Snackbar
          open={true}
          autoHideDuration={item.timing}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          key={index}
        >
          <Alert
            onClose={handleClose}
            severity={item.type}
            sx={{ width: "100%" }}
          >
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};


export default GSnackBar;