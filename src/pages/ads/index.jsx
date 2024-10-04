import React, { useEffect, useState } from "react";
import { Button, Input, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalTable, GlobalSearch } from '@components';
import { AdsModal } from '@modals';
import { ads } from '@service';
import { ConfirmDelete } from '@confirmation';


const Index = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState();
  const navigate = useNavigate()
  const { search } = useLocation()
  const notify = (message) => toast.success(message);
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1
  })


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
      const res = await ads.get(params);
      if (res.status === 200) {
        setData(res?.data?.data);
        setTotal(res?.data?.data?.count)


      }
    } catch (error) {

    }
  };

  useEffect(() => {
    getData();
  }, [params]);


  // ======== delete Data ========= 
  const deleteData = async (id) => {
    const res = await ads.delete(id);
    if (res.status === 200) {
      getData();
      notify(res.data.message);
    }
  };


  // ============ search Data -===========
  const handleChange = (event) => {
    setParams((prev) => ({
      ...prev,
      search: event.target.value
    }))

  }
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.')
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ConfirmDelete
            id={record.id}
            onConfirm={deleteData}
            onCancel={() => console.log('Cancelled')}
            title={"Delete this Ad?"}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <AdsModal
        visible={isModalOpen}
        onOk={handleOk}
        handleClose={handleClose}
        getData={getData}
        notify={notify}
      />
      <div className="flex items-center justify-between py-4">
        <GlobalSearch updateParams={updateParams} placeholder={"Search Ads"} />
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
