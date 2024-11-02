import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BasicToast = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .Toastify__toast {
                font-family: 'IranYekan'
            }
        `;
        document.head.appendChild(style);

        // Cleanup the style tag on component unmount
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const showToast = (type, message, duration = 5000) => {
        switch (type) {
            case 'info':
                toast.info(message, { autoClose: duration });
                break;
            case 'success':
                toast.success(message, { autoClose: duration });
                break;
            case 'error':
                toast.error(message, { autoClose: duration });
                break;
            case 'warning':
                toast.warning(message, { autoClose: duration });
                break;
            default:
                toast(message, { autoClose: duration });
        }
    };

    window.showToast = showToast;

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
};

export default BasicToast;
