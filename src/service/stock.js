import https from "./config";
const stock = {
    create: (data) => https.post(`stock/create/`, data),
    get: (params) => https.get("/stock", { params }),
    update: (id, data) => https.patch(`/stock/update/${id}`, data),
    delete: (id) => https.delete(`/stock/delete/${id}`),
};

export default stock;
