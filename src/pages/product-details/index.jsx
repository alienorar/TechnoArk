
// ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Typography, Spin,Button } from 'antd';
import { products } from '@service'; 

const { Title, Text } = Typography;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await products.getById(id); 
                if (res.status === 200) {
                    setProduct(res?.data?.data?.product);
                }
            } catch (error) {
             
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <Spin size="large" />;

    return (
        <Row gutter={16}>
        <Col span={12}>
            {/* <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 8 }} /> */}
        </Col>
        <Col span={12}>
            <Card>
                <div className='flex flex-col  mt-4'>
                    <Title level={2}>{product.name}</Title>
                    <Text strong>Price: ${product.price}</Text>

                    <Button style={{ maxWidth: 200, marginTop: 10, backgroundColor: "orangered" }} className='text-white'>Add details</Button>

                </div>

            </Card>
        </Col>
    </Row>
    );
};

export default ProductDetail;

