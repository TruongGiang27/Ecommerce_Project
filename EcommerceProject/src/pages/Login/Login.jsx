export default function Login() {
  return (
    <div className="container">
      <h2>Đăng nhập</h2>
      <form className="form">
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Mật khẩu" />
        <button type="submit" className="btn">Đăng nhập</button>
      </form>
    </div>
  );
}
