import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddProductForm from './components/AddProductForm';
import ProductList from './components/ProductList';
import API from './api';

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    categories: [],
  });

  // 🔁 Fetch products with filters
  const fetchProducts = async () => {
    try {
      const res = await API.get('/products', {
        params: {
          page,
          search: filters.search,
          categories: filters.categories.join(','), // IMPORTANT
        },
      });

      setProducts(res.data.products);
      setPages(res.data.pages);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  // Fetch when page or filters change
  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Product Inventory System
      </Typography>

      {/* ADD PRODUCT */}
      <AddProductForm onAdd={fetchProducts} />

      {/* PRODUCT LIST + SEARCH + FILTER */}
      <ProductList
        products={products}
        onDelete={fetchProducts}
        onPageChange={setPage}
        page={page}
        pages={pages}
        onFilter={(newFilters) => {
          setPage(1);        // ✅ reset page when searching/filtering
          setFilters(newFilters);
        }}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default App;
