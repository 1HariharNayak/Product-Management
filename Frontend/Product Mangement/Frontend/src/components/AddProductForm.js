import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Box,
    Chip,
    Card,
    CardContent,
    Typography,
    Grid,
    InputAdornment
} from '@mui/material';
import {
    Person,
    Description,
    Inventory,
    Category,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import API from '../api';

const AddProductForm = ({ onAdd }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        quantity: '',
        categories: [],
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get('/products/categories')
            .then((res) => setCategories(res.data))
            .catch(() => toast.error('Failed to load categories'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await API.post('/products', form);
            toast.success('Product added successfully!');
            setForm({ name: '', description: '', quantity: '', categories: [] });
            onAdd();
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMap = err.response.data.errors.reduce(
                    (acc, e) => ({ ...acc, [e.param]: e.msg }),
                    {}
                );
                setErrors(errorMap);
            } else {
                toast.error(err.response?.data?.message || 'Error adding product');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
        >
            <CardContent sx={{ p: 4 }}>
                {/* LEFT aligned title */}
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 3, textAlign: 'left' }}
                >
                    Add New Product
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Product Name */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Product Name"
                                fullWidth
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                error={!!errors.name}
                                helperText={errors.name}
                                InputProps={{
                                    startAdornment: (
                                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Quantity */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Quantity"
                                type="number"
                                fullWidth
                                required
                                value={form.quantity}
                                onChange={(e) =>
                                    setForm({ ...form, quantity: e.target.value })
                                }
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                                InputProps={{
                                    startAdornment: (
                                        <Inventory sx={{ mr: 1, color: 'primary.main' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Description"
                                fullWidth
                                required
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                error={!!errors.description}
                                helperText={errors.description}
                                InputProps={{
                                    startAdornment: (
                                        <Description sx={{ mr: 1, color: 'primary.main' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Categories (same style as other inputs) */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                label="Categories"
                                fullWidth
                                value={form.categories}
                                onChange={(e) =>
                                    setForm({ ...form, categories: e.target.value })
                                }
                                error={!!errors.categories}
                                helperText={errors.categories}
                                SelectProps={{
                                    multiple: true,
                                    renderValue: (selected) => (
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {selected.map((id) => {
                                                const cat = categories.find((c) => c._id === id);
                                                return (
                                                    <Chip
                                                        key={id}
                                                        label={cat?.name}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                );
                                            })}
                                        </Box>
                                    ),
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Category color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {categories.map((c) => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                    </Grid>

                    {/* LEFT aligned small button */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={loading}
                            sx={{
                                px: 4,
                                py: 1,
                                fontSize: '0.85rem',
                                borderRadius: 2,
                            }}
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AddProductForm;
