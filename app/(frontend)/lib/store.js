"use client"

import React, { createContext, useReducer } from 'react';

// Define your context and reducer
export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { id, quantity, image, title, description, price, category, rating } = action.payload;
      const existItem = state.cart.cartItems.find(item => item.product.id === id);

      // Update cart items
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item.product.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...state.cart.cartItems, { 
            product: { id, quantity, image, title, description, price, category, rating },
            quantity: 1
          }];

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'REMOVE_FROM_CART': {
      const { id } = action.payload;
      const item = state.cart.cartItems.find(item => item.product.id === id);

      // Decrement item quantity or remove if quantity is zero
      const cartItems = item && item.quantity > 1
        ? state.cart.cartItems.map(cartItem =>
            cartItem.product.id === id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
        : state.cart.cartItems.filter(cartItem => cartItem.product.id !== id);

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'DELETE_FROM_CART': {
      const { id } = action.payload;
      
      // Remove item completely from cart items
      const cartItems = state.cart.cartItems.filter(item => item.product.id !== id);

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    default:
      return state;
  }
}

// Create the StoreProvider component
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  );
};