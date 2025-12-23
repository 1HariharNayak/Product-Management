import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import { Search, Category } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDebounce } from '../hooks/useDebounce';
import API from '../api';

const ProductList = ({
  products = [],
  onDelete,
  onPageChange,
  page = 1,
  pages = 1,
  onFilter,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    API.get('/products/categories')
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);


  useEffect(() => {
    if (typeof onFilter === 'function') {
      onFilter({
        search: debouncedSearch,
        categories: selectedCategories,
      });
    }
  }, [debouncedSearch, selectedCategories, onFilter]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted!');
      onDelete();
    } catch {
      toast.error('Error deleting product');
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product List
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                label="Categories"
                value={selectedCategories}
                onChange={(e) => setSelectedCategories(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map((id) => {
                      const cat = categories.find((c) => c._id === id);
                      return (
                        <Chip
                          key={id}
                          label={cat?.name}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
                startAdornment={
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>


        {products.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            No products found.
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Categories</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Added On</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.name}</TableCell>

                    <TableCell>
                      {p.categories.map((c) => (
                        <Chip
                          key={c._id}
                          label={c.name}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </TableCell>

                    <TableCell>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={() => handleDelete(p._id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {Array.from({ length: pages }, (_, i) => (
            <Button
              key={i + 1}
              size="small"
              onClick={() => onPageChange(i + 1)}
              variant={page === i + 1 ? 'contained' : 'outlined'}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductList;
