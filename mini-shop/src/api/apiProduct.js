import api from './axios'

function getProducts(skip = 0, limit = 12) {
    return api.get('/product'), {
        params: {
            limit,
            skip,
            select: 'title,price,thubnail,category,stock,rating'
        }
    }
}