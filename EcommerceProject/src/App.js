import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Footer from "./components/Footer/Footer";
import Policy from "./pages/Policy/Policy";
import "./App.css";
import FAQs from "./components/FAQs/FAQs";
import Profile from "./pages/Profile/Profile";
import VnpayReturn from "./pages/Checkout/VnpayReturn";
import "./App.css";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory";
// import CartProvider from "./context/CartContext";

function App() {
  console.log("Profile:", Profile);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders-history" element={<OrderHistory />} />
            {/* <Route path="/orders-history-detail/:id" element={<OrderHistoryDetail />} /> */}
            <Route path="/transaction-history" element={<TransactionHistory />} />
            {/* <Route path="/transaction-history-detail/:id" element={<TransactionHistoryDetail />} /> */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            <Route path="/vnpay-return" element={<VnpayReturn />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
