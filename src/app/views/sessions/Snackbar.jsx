import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomizedSnackbars = () => {
   const snackbar = useSelector(
    (state) => state.snackbar
  );

  useEffect(() => {
    const notify = () => {
      if (snackbar.snackbarType === "success") {
        toast.success(snackbar.snackbarMessage, {
          style: { backgroundColor: "#43A047", color: "#fff" },
        });
      } else if (snackbar.snackbarType === "error") {
        toast.error(snackbar.snackbarMessage, {
          style: { backgroundColor: "#EF5350", color: "#fff" },
        });
      }
    };
    snackbar.snackbarOpen && notify();
  }, [snackbar]);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="colored"
      pauseOnHover
    />
  );
};

export default CustomizedSnackbars;
