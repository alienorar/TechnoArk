import https from "./config";
const Ads = {
    create: (data) => https.post("/ads/create", data),
    get: (params) => https.get(`/ads`, { params }),
    delete: (id) => https.delete(`/ads/delete/${id}`),
};

export default Ads;
