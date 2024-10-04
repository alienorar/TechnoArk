import React, { useEffect, useState } from "react";
import { Button, Space, Tooltip } from 'antd';
import { EditOutlined, } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalTable, GlobalSearch } from '@components';
import { BrandsModal } from '@modals';
import { brands, category } from '@service';
import { ConfirmDelete } from '@confirmation';

const Index = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState({});
  const [total, setTotal] = useState();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [categories, setCategories] = useState([]);
  const notify = (message) => toast.success(message);
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    let page = Number(params.get("page")) || 1;
    let limit = Number(params.get("limit")) || 2;
    let search_value = params.get("search") || "";
    setParams((prev) => ({
      ...prev,
      limit: limit,
      page: page,
      search: search_value,
    }));
  }, [search]);

  // ============ Table ==============
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: current,
    }));

    const searchParams = new URLSearchParams(search);
    searchParams.set("page", `${current}`);
    searchParams.set('limit', `${pageSize}`);
    navigate(`?${searchParams}`);
  };

  const updateParams = (newParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams
    }));
  };

  // ============ Modal ===========
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate({});
  };

  // ============ get Data ============
  const getData = async () => {
    try {
      const res = await brands.get(params);
      if (res.status === 200) {
        const dataSetter = res?.data?.data?.brands;
        setData(dataSetter);
        setTotal(res?.data?.data?.count);
      }
    } catch (error) { }
  };

  useEffect(() => {
    getData();
  }, [params]);

  // =========== edit Data ===========
  const editData = (item) => {
    setUpdate(item);
    showModal();
  };

  // ======== delete Data ========= 
  const deleteData = async (id) => {
    const res = await brands.delete(id);
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
    } catch (error) { }
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
      title: 'Brand name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
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
            title={"Delete this Brands ?"}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <BrandsModal
        visible={isModalOpen}
        onOk={handleOk}
        handleClose={handleClose}
        getData={getData}
        update={update}
        categories={categories}
        notify={notify}
      />
      <div className="flex items-center justify-between py-4">
        <GlobalSearch updateParams={updateParams} placeholder={"Search Brands"} />
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
    </>
  );
};

export default Index;
