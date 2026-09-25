import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

function EditProduct() {

    const { id } = useParams();

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

    useEffect(() => {

        loadProduct();

    }, []);

    const loadProduct = async () => {

        try {

            const response =
                await api.get(
                    `/products/${id}`
                );

            setProduct(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

const updateProduct = async (e) => {
    e.preventDefault();

    try {
        console.log("PRODUCT BEFORE UPDATE =", product);
        console.log("STOCK VALUE =", product.stock);

        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", Number(product.price));
        formData.append("quantity", Number(product.stock));

        console.log("========== FORM DATA ==========");

        for (const [key, value] of formData.entries()) {
            console.log(key, "=", value);
        }

        console.log("===============================");

        const response = await api.put(
            `/products/admin/${id}`,
            formData
        );

        console.log(
            "UPDATE RESPONSE =",
            response.data
        );

        alert("Product updated successfully");

        navigate("/admin/products");

    } catch (error) {
        console.error(
            "UPDATE PRODUCT ERROR =",
            error
        );

        console.error(
            "STATUS =",
            error.response?.status
        );

        console.error(
            "DATA =",
            error.response?.data
        );

        alert(
            error.response?.data?.message ||
            "Update failed"
        );
    }
};

    return (

        <div className="form-container">

            <h2>Edit Product</h2>

            <form onSubmit={updateProduct}>

                <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                />

                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />

                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />

                <input
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    required
                />

                <input
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />

                <input
                    name="imageUrl"
                    value={product.imageUrl || ""}
                    onChange={handleChange}
                    placeholder="Image URL"
                />

                <button type="submit">
                    Update Product
                </button>

            </form>

        </div>
    );
}

export default EditProduct;