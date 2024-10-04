import React, { useEffect, useState } from "react";
import { Button, Input, Space, Tooltip } from 'antd';
import { EditOutlined, } from '@ant-design/icons';
import { useNavigate, NavLink, useParams, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalTable, } from '@components';
import { ConfirmDelete } from "@confirmation";
import { SubCategoryModal } from '@modals'
import { subCategory, category } from '@service';


const Index = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    //========= get from query =========

    useEffect(() => {
        const params = new URLSearchParams(search)
        let page = Number(params.get("page")) || 1
        let limit = Number(params.get("limit")) || 2
        setParams((prev) => ({
            ...prev,
            limit: limit,
            page: page,
        }))
    }, [search])


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

    //  ============ Modal ===========
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleClose = () => {
        setIsModalOpen(false);
        setUpdate({})
    };

    // ============ get Data ============
    const getData = async () => {
        try {
            const res = await subCategory.get(id);
            if (res.status === 200) {
                setData(res?.data?.data?.subcategories);
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
        showModal()
    

    };


    // ======== delete Data ========= 
    const deleteData = async (id) => {
        const res = await subCategory.delete(id);
        if (res.status === 200) {
            getData();
            notify(res.data.message);
        }
    };

    //========= get categories ============
    const getCategories = async () => {
        try {
            const res = await category.get();
            const fetchedCategories = res?.data?.data?.categories;
            setCategories(fetchedCategories);
        } catch (error) {
        
        }
    };

    useEffect(() => {
        getCategories();
    }, [params]);




    const columns = [
        {
            title: '№',
            dataIndex: 'id',
        },
        {
            title: ' Category name',
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
                    <Tooltip title="edit"><Button onClick={() => editData(record)}><EditOutlined /></Button></Tooltip>
                    <ConfirmDelete
                        id={record.id}
                        onConfirm={deleteData}
                        onCancel={() => console.log('Cancelled')}
                        title={"Delete this Stock ?"}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <ToastContainer />
            <SubCategoryModal
                visible={isModalOpen}
                onOk={handleOk}
                handleClose={handleClose}
                getData={getData}
                update={update}
                categories={categories}
                notify={notify}
            />
            <div className="flex items-center justify-between py-4">
                <Input placeholder="Search Categories" size="large" style={{ maxWidth: 260, minWidth: 20 }} />
                <div className="flex gap-2 items-center ">
                    <Button type="primary" size="large" style={{ maxWidth: 160, minWidth: 20, backgroundColor: "orangered" }} onClick={showModal}>
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
                    pageSizeOptions: ['2', '3', '4', '6']
                }}
            />
            {/* <a href="/admin-panel/categories"> Back to Categories</a> */}
            <NavLink to={"/admin-panel/categories"} style={{ color: "orangered", width: "100px", padding: "9px", borderRadius: "10px", fontSize: "18px", textDecorationLine: "underline", marginTop: "20px" }} > Back to Categories</NavLink>
        </>
    );
};

export default Index;
