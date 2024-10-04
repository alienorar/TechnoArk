import React from 'react';
import { notification } from 'antd';

const Notification = ({ message, description, type }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api[type]({
            message,
            description,
            type,
            style: { backgroundColor: 'white', color: "orangered", borderRadius: 40, height: 100, },
            pauseOnHover: true,
            showProgress: true,

        });
    };
    React.useEffect(() => {
        if (message && description) {
            openNotification();
        }
    }, [message, description,]);

    return <>{contextHolder}</>;
};

export default Notification;
