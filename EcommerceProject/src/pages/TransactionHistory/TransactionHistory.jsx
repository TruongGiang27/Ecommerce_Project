import { useEffect, useState } from "react";
import styles from "./TransactionHistory.module.css";
import { fetchTransactions } from "../../services/api";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const customerToken = localStorage.getItem("medusa_auth_token");

  function formatPaymentMethod(method) {
    if (method === "N/A" || !method) return "Thanh toán mặc định";
    if (method === "stripe") return "Thẻ tín dụng (Stripe)";
    if (method === "manual") return "Thanh toán khi nhận hàng (COD)";
    if (method === "momo") return "Ví MoMo";
    if (method === "vnpay") return "VNPay";
    return method;
  }

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchTransactions(customerToken);
        setTransactions(fetchedOrders);

        console.log("Giao dịch đã tải:", fetchedOrders);
      } catch (err) {
        console.error("Lỗi khi tải giao dịch của khách hàng:", err);
        setError("Không thể tải giao dịch. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    if (customerToken) {
      loadOrders();
    } else {
      setIsLoading(false);
      setError("Vui lòng đăng nhập để xem lịch sử giao dịch.");
    }
  }, [customerToken]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>Đang tải lịch sử giao dịch...</div>
    );
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.transactionContainer}>
      <h1>Lịch sử giao dịch</h1>
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Ngày</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Phương thức</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>#{t.order_id.slice(-7)}</td>
              <td>{t.created_at.slice(0, 10)}</td>
              <td>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: t.currency_code || "VND",
                }).format(t.amount)}
              </td>
              <td>
                <span
                  className={`${styles.status} ${
                    t.status === "completed"
                      ? styles.statusSuccess
                      : t.status === "pending"
                      ? styles.statusPending
                      : styles.statusFailed
                  }`}
                >
                  {t.status}
                </span>
              </td>
              <td>{formatPaymentMethod(t.method)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
