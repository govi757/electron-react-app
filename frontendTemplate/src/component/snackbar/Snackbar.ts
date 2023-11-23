import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "src/redux/store/store";
import { SnackbarType, addSnackbar, removeLastSnackbar, } from "src/redux/store/snackbar/snackbarSlice";

export default class SnackbarOperation {
    
    static success(message: string, dispatch: AppDispatch) {
        dispatch(addSnackbar({
            message: message,
            type:SnackbarType.Success,
            timing: 2000
        }))

    }

    static error(message: string, dispatch: AppDispatch) {
        dispatch(addSnackbar({
            message: message,
            type:SnackbarType.Error,
            timing: 2000
        }))
    }
}