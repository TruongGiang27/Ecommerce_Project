import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  if (cartItems.length === 0)
    return (
      <div className="container">
        <h2>Giỏ hàng</h2>
        <p>(Chưa có sản phẩm)</p>
      </div>
    );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <h2>Giỏ hàng</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr
              key={item.id}
              style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}
            >
              <td>{item.name}</td>
              <td>{item.price.toLocaleString()} đ</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toLocaleString()} đ</td>
              <td>
                <button className="btn" onClick={() => removeFromCart(item.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Tổng cộng: {total.toLocaleString()} đ</h3>
      <button className="btn" onClick={clearCart}>
        Xóa hết giỏ hàng
      </button>
    </div>
  );
}
