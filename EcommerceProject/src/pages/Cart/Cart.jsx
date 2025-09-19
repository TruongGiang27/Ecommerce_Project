import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";


export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateItemQuantity, isLoggedIn, refreshCart } =
    useContext(CartContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        setLoading(true);
        await refreshCart();
        setLoading(false);
      })();
    }
  }, [isLoggedIn]);

  const handleQuantityChange = async (lineId, value) => {
    if (value < 1) return;
    await updateItemQuantity(lineId, value);
  };

  const handleRemove = async (lineId) => {
    await removeFromCart(lineId);
  };

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (!cartItems || cartItems.length === 0)
    return (
      <div style={styles.container}>
        <h2>Giỏ hàng</h2>
        <p>(Chưa có sản phẩm)</p>
      </div>
    );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={styles.container}>
      <h2>Giỏ hàng</h2>
      <table style={styles.table}>
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
              <td>{item.title}</td>
              <td>{(item.unit_price || 0).toLocaleString()} đ</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  style={styles.qtyInput}
                />
              </td>
              <td>{((item.unit_price || 0) * item.quantity).toLocaleString()} đ</td>
              <td>
                <button style={{ ...styles.btn, ...styles.btnRemove }} onClick={() => handleRemove(item.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={styles.total}>Tổng cộng: {total.toLocaleString()} đ</h3>
      <button style={{ ...styles.btn, ...styles.btnClear }} onClick={clearCart}>
        Xóa hết giỏ hàng
      </button>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "30px auto", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "center" },
  qtyInput: { width: "60px", padding: "4px", textAlign: "center" },
  btn: { padding: "6px 12px", fontSize: "0.85rem", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  btnRemove: { background: "#c0392b" },
  btnClear: { background: "#c0392b", marginTop: "10px" },
  total: { marginTop: "20px", textAlign: "right", fontWeight: "bold" },
};
