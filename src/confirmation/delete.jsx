import React, { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const PopconfirmDelete = ({ onConfirm, onCancel, id, title }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showDeleteModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            onConfirm(id);
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        onCancel();
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="delete">
                <Button danger onClick={showDeleteModal}>
                    <DeleteOutlined />
                </Button>
            </Tooltip>

            <Modal
                title={title}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okButtonProps={{
                    style: { backgroundColor: 'orangered', borderColor: 'orangered' },
                }}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>
        </>
    );
};

export default PopconfirmDelete;
