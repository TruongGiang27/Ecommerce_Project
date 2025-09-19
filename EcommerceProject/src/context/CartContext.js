import { createContext, useState, useEffect } from "react";
import {
  createCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem,
  fetchCartDetail,
} from "../services/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartApi, setCartApi] = useState(null); // Medusa cart
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Guest cart lưu localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      const stored = localStorage.getItem("cartItems");
      setCartItems(stored ? JSON.parse(stored) : []);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // Medusa cart
  useEffect(() => {
    const initCart = async () => {
      if (isLoggedIn) {
        let cart;
        if (!cartApi) {
          cart = await createCart();
        } else {
          cart = await fetchCartDetail(cartApi.id);
        }
        setCartApi(cart);
      }
    };
    initCart();
  }, [isLoggedIn]);

  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn && cartApi) {
      const variantId = product.variants[0].id;
      const updatedCart = await apiAddToCart(cartApi.id, variantId, quantity);
      setCartApi(updatedCart);
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          return [...prev, { ...product, quantity }];
        }
      });
    }
  };

  const updateItemQuantity = async (lineId, quantity) => {
    if (isLoggedIn && cartApi) {
      const lineItem = cartApi.items.find((item) => item.id === lineId);
      if (lineItem) {
        const updatedCart = await apiUpdateCartItem(cartApi.id, lineItem.id, quantity);
        setCartApi(updatedCart);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === lineId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (lineId) => {
    if (isLoggedIn && cartApi) {
      const updatedCart = await removeCartItem(cartApi.id, lineId);
      setCartApi(updatedCart);
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== lineId));
    }
  };

  const clearCart = async () => {
    if (isLoggedIn && cartApi) {
      for (let item of cartApi.items) {
        await removeCartItem(cartApi.id, item.id);
      }
      setCartApi({ ...cartApi, items: [] });
    } else {
      setCartItems([]);
    }
  };

  const refreshCart = async () => {
    if (isLoggedIn && cartApi) {
      const latestCart = await fetchCartDetail(cartApi.id);
      setCartApi(latestCart);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: isLoggedIn ? cartApi?.items || [] : cartItems,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
