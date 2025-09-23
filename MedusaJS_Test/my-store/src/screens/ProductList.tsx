import React, { useEffect, useState } from "react"

type Product = {
  id: string
  title: string
  description: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  fetch("http://localhost:9000/store/products", {
    headers: {
      "x-publishable-api-key": "pk_775398c8aeb21e3ef4cc1f139a164fdaa32be1be14985756c2dfac91757f66d9",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API response:", data)
      setProducts(data.products)
      setLoading(false)
    })
    .catch((err) => {
      console.error("Lỗi khi fetch products:", err)
      setLoading(false)
    })
}, [])

  if (loading) return <p>Đang tải sản phẩm...</p>

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
