import React, { useEffect, useState } from "react";
import { Button, Input, Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalTable, GlobalSearch } from '@components';
import { ProductsModal } from '@modals'
import { category, products } from '@service';
import { ConfirmDelete } from '@confirmation';

const Index = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState({});
    const [total, setTotal] = useState();
    const [categories, setCategories] = useState([]);
    const { search } = useLocation()
    const navigate = useNavigate()
    const notify = (message) => toast.success(message);
    const [params, setParams] = useState({
        search: "",
        limit: 2,
        page: 1
    })

    // ============ Drawer ==========
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    //========= get from query =========
    useEffect(() => {
        const params = new URLSearchParams(search)
        let page = Number(params.get("page")) || 1;
        let limit = Number(params.get("limit")) || 2;
        let search_value = params.get("search") || "";
        setParams((prev) => ({
            ...prev,
            limit: limit,
            page: page,
            search: search_value,
        }))
    }, [search])

    const updateParams = (newParams) => {
        setParams((prev) => ({
            ...prev,
            ...newParams
        }));
    };

    // ============ Table ==============
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination
        setParams((prev) => ({
            ...prev,
            limit: pageSize,
            page: current,
        })
        )
        const searchParams = new URLSearchParams(search)
        searchParams.set("page", `${current}`)
        searchParams.set('limit', `${pageSize}`)
        navigate(`?${searchParams}`)
    }

    // ============ get Data ============
    const getData = async () => {
        try {
            const res = await products.get(params);
            if (res.status === 200) {
                setData(res?.data?.data?.products);
                setTotal(res?.data?.data?.count)


            }
        } catch (error) {

        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    // =========== edit Data ===========
    const editData = (item) => {
        setUpdate(item);
        showDrawer()

    };

    // ======== delete Data ========= 
    const deleteData = async (id) => {
        const res = await products.delete(id);
        if (res.status === 200) {
            getData();
            notify(res.data.message);
        }
    };

    const handleView = (record) => {
        navigate(`product-details/${record.id}`);
    };

    // ============ search Data -===========
    const handleChange = (event) => {
        let newSearch = event.target.value
        setParams((prev) => ({
            ...prev,
            search: newSearch
        }))
    }

    //========= get categories  ============
    const getCategories = async () => {
        try {
            const res = await category.get();
            const fetchedData = res?.data?.data?.categories;
            setCategories(fetchedData);
        } catch (error) {
        }
    };

    useEffect(() => {
        getCategories();
    }, [params]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Product name',
            dataIndex: 'name',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.')
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="edit"> <Button onClick={() => editData(record)}><EditOutlined /></Button></Tooltip>
                    <ConfirmDelete
                        id={record.id}
                        onConfirm={deleteData}
                        onCancel={() => console.log('Cancelled')}
                        title={"Delete this Product ?"}
                    />
                    <Tooltip title="view">
                        <Button onClick={() => handleView(record)}><EyeOutlined /></Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <ToastContainer />
            <ProductsModal
                onClose={onClose}
                open={open}
                getData={getData}
                update={update}
                categories={categories}
                notify={notify}
            />
            <div className="flex items-center justify-between py-4">
                <GlobalSearch updateParams={updateParams} placeholder={"Search Products"} />
                <div className="flex gap-2 items-center ">
                    <Button type="primary" size="large" style={{ maxWidth: 160, minWidth: 20, backgroundColor: "orangered" }} onClick={showDrawer} >
                        Create
                    </Button>

                </div>
            </div>
            <GlobalTable
                data={data}
                columns={columns}
                handleChange={handleTableChange}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: total,
                    showSizeChanger: true,
                    pageSizeOptions: ['2', '3', '4', '6',]
                }}
            />
        </>
    );
};

export default Index;
