export const customers = [
  { id: 1, name: "An", city: "Hà Nội" },
  { id: 2, name: "Bình", city: "Đà Nẵng" },
  { id: 3, name: "Chi", city: "Hà Nội" },
  { id: 4, name: "Dũng", city: "TP.HCM" },
];

export const products = [
  { id: "P1", name: "Áo thun", category: "Áo", price: 150000 },
  { id: "P2", name: "Quần jean", category: "Quần", price: 350000 },
  { id: "P3", name: "Giày thể thao", category: "Giày", price: 800000 },
  { id: "P4", name: "Mũ lưỡi trai", category: "Phụ kiện", price: 90000 },
  { id: "P5", name: "Áo khoác", category: "Áo", price: 500000 },
];

export const orders = [
  {
    id: "O1",
    customerId: 1,
    createdAt: "2026-08-03",
    status: "completed",
    items: [
      { productId: "P1", qty: 2 },
      { productId: "P4", qty: 1 },
    ],
  },
  {
    id: "O2",
    customerId: 2,
    createdAt: "2026-08-15",
    status: "completed",
    items: [{ productId: "P3", qty: 1 }],
    coupon: { code: "SALE10", percent: 10 },
  },
  {
    id: "O3",
    customerId: 1,
    createdAt: "2026-08-20",
    status: "cancelled",
    items: [{ productId: "P5", qty: 1 }],
  },
  {
    id: "O4",
    customerId: 3,
    createdAt: "2026-09-02",
    status: "completed",
    items: [
      { productId: "P2", qty: 2 },
      { productId: "P1", qty: 1 },
    ],
  },
  {
    id: "O5",
    customerId: 5,
    createdAt: "2026-09-10",
    status: "completed",
    items: [{ productId: "P4", qty: 3 }],
  },
  {
    id: "O6",
    customerId: 2,
    createdAt: "2026-09-18",
    status: "pending",
    items: [{ productId: "P1", qty: 1 }],
  },
  {
    id: "O4",
    customerId: 3,
    createdAt: "2026-09-02",
    status: "completed",
    items: [
      { productId: "P2", qty: 2 },
      { productId: "P1", qty: 1 },
    ],
  },
  {
    id: "O7",
    customerId: 1,
    createdAt: "2026-10-05",
    status: "completed",
    items: [
      { productId: "P5", qty: 1 },
      { productId: "P9", qty: 2 },
      { productId: "P1", qty: 3 },
    ],
    coupon: { code: "VIP20", percent: 20 },
  },
  {
    id: "O8",
    customerId: 4,
    createdAt: "2026-10-12",
    status: "completed",
    items: [
      { productId: "P3", qty: 1 },
      { productId: "P2", qty: 1 },
    ],
  },
  {
    id: "O9",
    customerId: 3,
    createdAt: "2026-10-25",
    status: "completed",
    items: [{ productId: "P4", qty: 2 }, { productId: "P1" }],
  },
];
