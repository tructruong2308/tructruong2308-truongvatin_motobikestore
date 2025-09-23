export default function Cart({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div>
      <h2>Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - {item.qty} x {item.price.toLocaleString()} đ
              </li>
            ))}
          </ul>
          <h3>Tổng cộng: {total.toLocaleString()} đ</h3>
        </div>
      )}
    </div>
  )
}
