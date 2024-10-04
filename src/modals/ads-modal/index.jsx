
import React from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { useState } from 'react';
import { ads } from '@service';

const AdsModal = ({ visible, onOk, handleClose, getData, update, notify }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState([]);
    const positions = [1, 2, 3]

    const handleChange = (e) => {
        let fileData = e.target.files[0]
        setFile(fileData);
    };
    const onFinish = async (values) => {
        let formData = new FormData();
        formData.append("position", values?.position);
        formData.append("file", file);
        try {
            const res = await ads.create(formData);
            if (res.status = 201) {
                notify(res.data.message)
                getData()
                handleClose()
            }

        } catch (error) {
    
        }
    };

    return (
        <Modal
            title="Add New Category"
            open={visible}
            onOk={onOk}
            onCancel={handleClose}
            update={update}
            footer={null}
        >
            <Form
                form={form}
                name="Ads_form"
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Position"
                    name="position"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px' }}
                    rules={[
                        {
                            required: true,
                            message: 'Enter position!',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select Position"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }>
                        {positions?.map((item, index) => (
                            <Option value={parseInt(item)} key={index}>
                                {item}
                            </Option>

                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="file"
                    label="File"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px' }}
                    rules={[
                        { required: true, message: 'Upload file!' },
                    ]}>
                    <input type="file" onChange={handleChange} />
                </Form.Item>

                <Form.Item>
                    <Button
                        block
                        type="submit"
                        htmlType="submit"
                        style={{
                            backgroundColor: "#e35112",
                            color: "white",
                            height: "40px",
                            fontSize: "18px",
                            marginTop: "10px",
                        }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AdsModal;