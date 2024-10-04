import https from "./config";
const settings = {
    get: (id) => https.get(`/admin/${id}`),
};

export default settings;
