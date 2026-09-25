import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function AddProduct() {

    const navigate = useNavigate();

    const [product, setProduct] =
        useState({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            imageUrl: ""
        });

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const addProduct = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/products",
                {
                    ...product,
                    price: Number(product.price),
                    stock: Number(product.stock)
                }
            );

            alert(
                "Product added successfully"
            );

            navigate("/admin/products");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to add product"
            );
        }
    };

    return (

        <div className="form-container">

            <h2>Add Product</h2>

            <form onSubmit={addProduct}>

                <input
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={product.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={product.stock}
                    onChange={handleChange}
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={product.category}
                    onChange={handleChange}
                    required
                />

                <input
                    name="imageUrl"
                    placeholder="Image URL"
                    value={product.imageUrl}
                    onChange={handleChange}
                />

                <button type="submit">
                    Add Product
                </button>

            </form>

        </div>
    );
}

export default AddProduct;