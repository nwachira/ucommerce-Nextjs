"use client"
import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { IoMdSearch } from 'react-icons/io';
import { FaCartShopping } from 'react-icons/fa6';
import { FaCaretDown } from 'react-icons/fa';

import { Store } from '../lib/store';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { useRouter } from 'next/navigation'; // Import useRouter
import SearchInput from './search';


const Menu = [
  { id: 1, name: 'Home', link: '/#' },
  { id: 2, name: 'Shop', link: '/all-products' },
  { id: 3, name: 'Kids Wear', link: '/#' },
  { id: 4, name: 'Mens Wear', link: '/#' },
  { id: 5, name: 'Electronics', link: '/#' },
];

const DropdownLinks = [
  { id: 1, name: 'Trending Products', link: '/#' },
  { id: 2, name: 'Best Selling', link: '/#' },
  { id: 3, name: 'Top Rated', link: '/#' },
];

const Navbar = () => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [showCartPopup, setShowCartPopup] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleOrderPopup = () => {
    setShowCartPopup(!showCartPopup);
  };

  const handleCheckout = () => {
    router.push('/checkout'); // Redirect to checkout page
  };

  const renderCartItems = () => {
    if (cart.cartItems.length === 0) {
      return <p className="text-gray-500">Your cart is empty.</p>;
    }

    return (
      <ul className="space-y-2">
        {cart.cartItems.map((item) => (
          <li key={item.product.id} className="flex items-center gap-3">
            <Image
              src={item.product.image}
              alt={item.product.title}
              width={50}
              height={50}
              className="rounded-md"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.product.title}</p>
              <p>${item.product.price} x {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: { id: item.product.id },
                  })
                }
              >
                <AiOutlineMinus className="text-gray-500 cursor-pointer" />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({
                    type: 'ADD_TO_CART',
                    payload: {
                      id: item.product.id,
                      quantity: 1,
                      image: item.product.image,
                      title: item.product.title,
                      description: item.product.description,
                      price: item.product.price,
                      category: item.product.category,
                      rating: item.product.rating,
                    },
                  })
                }
              >
                <AiOutlinePlus className="text-gray-500 cursor-pointer" />
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'DELETE_FROM_CART',
                    payload: { id: item.product.id },
                  })
                }
              >
                <AiOutlineDelete className="text-red-500 cursor-pointer" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white shadow-md dark:bg-gray-800 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-yellow-400 py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <a href="#" className="text-2xl font-bold flex items-center gap-2">
            <Image src="" alt="Logo" className="w-10" width={40} height={40} />
            UCommerce
          </a>

          {/* Search bar */}
          <div className="relative hidden sm:block">
            <SearchInput/>
            <IoMdSearch className="text-gray-600 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
          </div>

          {/* Cart button */}
          <button
            className="relative bg-gray-100 text-gray-800 py-1 px-6 mr-10 rounded-full flex items-center gap-2 group"
            onClick={handleOrderPopup}
          >
            <FaCartShopping className="text-xl" />
            {cart.cartItems.length > 0 && (
              <span className="ml-2 text-sm font-bold">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Lower Navbar */}
      <div className="flex justify-center bg-gray-100">
        <ul className="sm:flex hidden items-center gap-6 py-2">
          {Menu.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                className="inline-block px-4 text-gray-700 hover:text-yellow-500 transition duration-300"
              >
                {item.name}
              </a>
            </li>
          ))}
          <li className="relative group cursor-pointer">
            <a href="#" className="flex items-center gap-1 py-2 text-gray-700 hover:text-yellow-500 transition duration-300">
              Trending Products
              <FaCaretDown className="transition-transform duration-300 group-hover:rotate-180" />
            </a>
            <div className="absolute z-[9999] hidden group-hover:block bg-white text-gray-700 shadow-md rounded-md w-48 mt-2">
              <ul>
                {DropdownLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.link}
                      className="block px-4 py-2 hover:bg-yellow-200 transition duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>

      {/* Cart Popup */}
      <div
        className={`absolute top-14 right-4  w-100 p-6  bg-white shadow-lg rounded-md  transition-transform duration-300 ${
          showCartPopup ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out' }}
      >
        {renderCartItems()}
        {/* Conditionally render the checkout button only if cart is not empty */}
        <div className=' flex justify-between items-center'>

      
        {cart.cartItems.length > 0 && (
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-full"
            onClick={handleCheckout}
          >
            Go to Checkout
          </button>
        )}
        <button
          className="mt-2 bg-red-500 text-white py-2 px-4 rounded-full"
          onClick={handleOrderPopup}
        >
          Close
        </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
