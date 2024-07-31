"use client"

import { useState, useEffect } from "react";
import getProductData from '../../api/product'; 

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductData(); // Fetch data from api/product
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return products;
}

export function filterProducts(products, selectedCategories) {
    if (selectedCategories.length === 0) {
      return products; // Return all products if no categories are selected
    }
    return products.filter((product) => selectedCategories.includes(product.category));
  }
  

export function searchProducts(products, searchTerm) {
    if (searchTerm.trim() === "") {
      return products; // Return all products if search term is empty
    }
  
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter((product) => {
      return (
        product.item_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.item_group.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
}

// lib/data.ts
export function getProductDetails(id, products) {
    const idAsNumber = Number(id); // Convert id from string to number
    return products.find((p) => p.id === idAsNumber);
  }
  export function getRelatedProducts(category, products) {
    return products.filter((product) => product.category === category);
  }
