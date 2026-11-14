export function removeDuplicates(orders) {
    const check = new Set();

    return orders.filter((order) => {
        if (check.has(order.id)) {
            return false;
        }

        check.add(order.id);
        return true;
    });
}

export function enrichOrders(orders = [], customers = [], products = []) {
    const customerMap = new Map(
        customers.map((customer) => [customer.id, customer]),
    );

    const productMap = new Map(
        products.map((product) => [product.id, product]),
    );
    const warnings = [];

    const result = orders.map((order) => {
        const customer = customerMap.get(order.customerId);
        const items = (order.items || [])
            .filter((item) => {
                const product = productMap.get(item.productId);
                if (!product) {
                    warnings.push(
                        `${order.id} Khong tim thay san pham ${item.productId}`,
                    );
                    return false;
                }
                return true;
            })
            .map((item) => {
                const product = productMap.get(item.productId);
                const qty = item.qty ?? 1;

                const lineTotal = qty * product.price;

                return {
                    productId: item.productId,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    qty,
                    lineTotal,
                };
            });

        const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

        const discount = order.coupon?.percent
            ? Math.round((subtotal * order.coupon.percent) / 100)
            : 0;

        const total = subtotal - discount;
        return {
            id: order.id,
            createdAt: order.createdAt,
            status: order.status,
            customerId: order.customerId,
            customerName: customer?.name ?? "Khach vang lai",
            items,
            subtotal,
            discount,
            total,
        };
    });

    return { orders: result, warnings };
}

export function revenueByMonth(orders = []) {
    return orders
        .filter((order) => order.status === "completed")
        .reduce((acc, order) => {
            const month = order.createdAt.slice(0, 7);
            acc[month] = (acc[month] ?? 0) + order.total;
            return acc;
        }, {});
}

export function topProducts(orders, n) {}

export function customerSummary(orders) {}

export function filterOrders(orders, filters) {}

export function formatReport(orders) {}
