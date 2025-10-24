import { useEffect, useState } from "react";
import styles from "./OrderHistory.module.css";
import { fetchOrders } from "../../services/api";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const customerToken = localStorage.getItem("medusa_auth_token");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchOrders(customerToken);
        setOrders(fetchedOrders);

        console.log("Đơn hàng đã tải:", fetchedOrders);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng của khách hàng:", err);
        setError("Không thể tải đơn hàng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    if (customerToken) {
      loadOrders();
    } else {
      setIsLoading(false);
      setError("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
    }
  }, [customerToken]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>Đang tải lịch sử đơn hàng...</div>
    );
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h2>Lịch sử Đơn hàng Của Tôi</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <h4>Đơn hàng #{order.display_id || order.id}</h4>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.created_at).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: order.currency_code || "VND",
              }).format(order.total)}
            </p>
            <div className={styles.orderItemsContainer}>
              <h3>Sản phẩm:</h3>
              <div className={styles.orderItems}>
                {order.items.map((item) => (
                  <Link to={`/products/${item.product_id}`} className={styles.orderItem}>
                    <p style={{ fontWeight: "bold" }}>{item.title}</p>
                    <span>
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: order.currency_code || "VND",
                      }).format(item.unit_price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
