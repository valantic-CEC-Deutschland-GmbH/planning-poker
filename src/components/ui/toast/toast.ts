import { Bounce, toast, ToastOptions } from "react-toastify";

export enum ToastType {
    SUCCESS = 0,
    ERROR = 1,
    INFO = 2
}

export let toastDefaultOptions: ToastOptions<unknown> = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
}

export function addToast(type: ToastType, message: string|undefined, options?: ToastOptions) {
    switch (type) {
        case ToastType.SUCCESS:
            toast.success(message, options ?? toastDefaultOptions);
            break;
        case ToastType.ERROR:
            toast.error(message, options ?? toastDefaultOptions);
            break;
        case ToastType.INFO:
            toast.info(message, options ?? toastDefaultOptions);
            break;
    }
}