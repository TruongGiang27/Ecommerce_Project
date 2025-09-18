import products from "../data/products";

// Mock function
export function fetchProducts() {
  return Promise.resolve(products); // hiện tại trả mock
}

// Mock function chi tiết sản phẩm
export function fetchProductById(id) {
  const product = products.find(p => p.id === parseInt(id));
  return Promise.resolve(product);
}

/* 
 khi có Medusa backend, chỉ cần thay:
import axios from "axios";
const API_URL = "http://localhost:9000/store";

export async function fetchProducts() {
  const res = await axios.get(`${API_URL}/products`);
  return res.data.products;
}

export async function fetchProductById(id) {
  const res = await axios.get(`${API_URL}/products/${id}`);
  return res.data.product;
}
*/