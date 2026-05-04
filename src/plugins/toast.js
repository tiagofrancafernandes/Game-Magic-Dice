import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    install(app, options = {}) {
        app.config.globalProperties.$toastSuccess = (message, override = {}) => {
            toast.success(message, {
                ...options,
                ...override,
            });
        };

        app.config.globalProperties.$toastError = (message, override = {}) => {
            toast.error(message, {
                ...options,
                ...override,
            });
        };

        app.config.globalProperties.$toastInfo = (message, override = {}) => {
            toast.info(message, {
                ...options,
                ...override,
            });
        };

        app.config.globalProperties.$toastDark = (message, override = {}) => {
            toast.dark(message, {
                ...options,
                ...override,
            });
        };

        app.config.globalProperties.$toastWarning = (message, override = {}) => {
            toast.warning(message, {
                ...options,
                ...override,
            });
        };
    },
};
