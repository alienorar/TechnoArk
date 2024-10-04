
import React from 'react';
import { Modal, Form, Input, Button, Select, } from 'antd';
import { useState, useEffect } from 'react';
import { brands, stock } from '@service';

const CategoriesModal = ({ visible, onOk, handleClose, getData, categories, products, update, notify }) => {
    const [form] = Form.useForm();
    const [filteredBrands, setFilteredBrands] = useState([])
    useEffect(() => {
        if (update?.id) {
            form.setFieldsValue({
                category_id: update?.category_id,
                brand_id: update?.category_id,
                product_id: update?.category_id,
                quantity: Number(update?.quantity),
            });
        } else {
            form.resetFields();
        }
    }, [update, form]);

    // =========== Filter data ==========
    const handleChange = async (value, inputName) => {
        try {
            if (inputName === "category_id") {
                const res = await brands.getBrands(value)
                setFilteredBrands(res?.data?.data?.brands)
            }
        } catch (error) {
            console.log(error);

        }
    };



    const onFinish = async (values) => {
        values.quantity = Number(values.quantity)
        const dataSetter = {
            category_id: values?.category_id,
            brand_id: values?.brand_id,
            product_id: values?.product_id,
            quantity: Number(values?.quantity),
        }

        try {
            if (update?.id) {
                const res = await stock.update(update.id, dataSetter);
                if (res.status === 200) {
                    notify(res.data.message)
                    getData()
                    handleClose()
                }
            } else {
                const res = await stock.create(dataSetter);
                if (res.status === 201) {
                    notify(res.data.message)
                    getData()
                    handleClose()
                }
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
                    name="category_id"
                    label=" Select Category"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px', }}
                    rules={[
                        { required: true, message: 'Select category!' },
                    ]}

                >
                    <Select
                        showSearch
                        style={{ height: "40px" }}
                        onChange={(value) => handleChange(value, "category_id")}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {categories?.map((item, index) => (
                            <Option value={item.id} key={index}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="brand_id"
                    label="Select Brand"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px', }}
                    rules={[
                        { required: true, message: 'Select brand!' },
                    ]}
                >
                    <Select
                        style={{ height: "40px" }}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => handleChange(value, "brand_id")}
                    >
                        {filteredBrands?.map((item, index) => (
                            <Option value={item.id} key={index}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="product_id"
                    label="Select Product"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px', }}
                    rules={[
                        { required: true, message: 'Select product!' },
                    ]}
                >
                    <Select
                        style={{ height: "40px" }}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => handleChange(value, "brand_category_id")}
                    >
                        {products?.map((item, index) => (
                            <Option value={item.id} key={index}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="quantity"
                    label="Quantity"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: '8px', }}
                    rules={[
                        { required: true, message: 'Enter quantity!' },
                    ]}
                >
                    <Input style={{ height: "40px" }} />
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

export default CategoriesModal;

