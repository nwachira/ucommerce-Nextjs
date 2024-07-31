"use client";

import clsx from "clsx";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { searchProducts } from "@/app/(frontend)/lib/data";
import useProducts from "@/app/(frontend)/lib/data";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component
import Link from "next/link";
// Adjust the path if needed



const ITEMS_PER_PAGE = 10; // Adjust as needed

export default function SearchInput() {
  const router = useRouter();
  const products = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const updateFilteredProducts = () => {
      setFilteredProducts(searchProducts(products, searchTerm));
    };

    updateFilteredProducts();
  }, [products, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setShowSuggestions(event.target.value.trim() !== "");
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.title);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleOutsideClick = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target) &&
      !inputRef.current?.contains(event.target)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push(`?page=${page}`);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="relative group hidden sm:block">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
        />
        <FaSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
        {showSuggestions && (
  <div
    ref={suggestionsRef}
    className="absolute z-10 bg-white rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto"
  >
    {filteredProducts.slice(0, 5).map((product, index) => ( // Add index to map
      <div
        key={index} // Use index as key
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
        onClick={() => handleSuggestionClick(product)}
      >
        {/* Ensure the image URL is valid and accessible */}
        <Link href={`/products/${product.id}`}>
          <div className="flex items-center gap-2">
            {product.website_image && ( // Check if website_image exists
              <Image
                src={product.website_image} // Make sure this URL is correct
                alt={product.item_name}
                width={40}
                height={40}
                className="rounded-md"
                // Add placeholder for loading state
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
            )}
            <span>{product.item_name}</span>
          </div>
        </Link>
      </div>
    ))}
  </div>
)}

      </div>

      {/* Product Cards (hidden for now) */}
      {/* {searchTerm !== "" && (
        <div className="flex-grow overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <ul className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`rounded-md px-3 py-1 ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
}
