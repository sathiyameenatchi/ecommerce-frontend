import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        image: null
    });

    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get("/products");

            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else if (Array.isArray(response.data.products)) {
                setProducts(response.data.products);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Products error:", error);
            setProducts([]);
        }
    };

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // HANDLE IMAGE
    // =========================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;

        setProduct({
            ...product,
            image: file
        });
    };

    // =========================
    // ADD / UPDATE PRODUCT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Basic validation
            if (!product.name.trim()) {
                alert("Please enter product name");
                return;
            }

            if (!product.price) {
                alert("Please enter price");
                return;
            }

            if (!product.quantity) {
                alert("Please enter quantity");
                return;
            }

            if (!editingId && !product.image) {
                alert("Please select product image");
                return;
            }

            const formData = new FormData();

            formData.append("name", product.name);
            formData.append("description", product.description);
            formData.append("price", String(product.price));

            // IMPORTANT:
            // Frontend field = quantity
            // Backend field = stock
            formData.append("stock", String(product.quantity));

            formData.append("category", product.category);

            if (product.image) {
                formData.append("image", product.image);
            }

            // DEBUG
            console.log("========== FORM DATA ==========");

            for (const [key, value] of formData.entries()) {
                console.log(key, "=", value);
            }

            console.log("===============================");

            // =========================
            // UPDATE
            // =========================

            if (editingId) {
                await api.put(
                    `/products/admin/${editingId}`,
                    formData
                );

                alert("Product updated successfully");
            }

            // =========================
            // ADD
            // =========================

            else {
                await api.post(
                    "/products/admin",
                    formData
                );

                alert("Product added successfully");
            }

            resetForm();
            await loadProducts();

        } catch (error) {
            console.error("Product save error:", error);
            console.error("Backend response:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Operation failed"
            );
        }
    };

    // =========================
    // EDIT PRODUCT
    // =========================

    const editProduct = (p) => {
        setProduct({
            name: p.name || "",
            description: p.description || "",
            price: p.price ?? "",
            quantity: p.stock ?? p.quantity ?? "",
            category: p.category || "",
            image: null
        });

        setEditingId(p.id || p._id);
        setShowForm(true);
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const deleteProduct = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/products/admin/${id}`
            );

            alert("Product deleted successfully");

            await loadProducts();

        } catch (error) {
            console.error("Delete error:", error);

            alert(
                error.response?.data?.message ||
                "Delete failed"
            );
        }
    };

    // =========================
    // SEARCH PRODUCTS
    // =========================

    const searchProducts = async () => {
        try {
            if (!search.trim()) {
                await loadProducts();
                return;
            }

            const response = await api.get(
                `/products/search?name=${encodeURIComponent(search)}`
            );

            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else if (
                Array.isArray(response.data.products)
            ) {
                setProducts(response.data.products);
            } else {
                setProducts([]);
            }

        } catch (error) {
            console.error("Search error:", error);
            alert("Search failed");
        }
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setProduct({
            name: "",
            description: "",
            price: "",
            quantity: "",
            category: "",
            image: null
        });

        setEditingId(null);
        setShowForm(false);
    };

    // =========================
    // UI
    // =========================

    return (
        <div className="admin-products-page">

            <div className="admin-products-header">

                <h2>
                    Admin Product Management
                </h2>

                <button
                    className="admin-add-product-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    + Add Product
                </button>

            </div>

            {/* SEARCH */}

            <div className="admin-product-search">

                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchProducts();
                        }
                    }}
                />

                <button onClick={searchProducts}>
                    Search
                </button>

            </div>

            {/* ADD / EDIT FORM */}

            {showForm && (
                <div className="admin-product-form">

                    <h4>
                        {editingId
                            ? "Edit Product"
                            : "Add Product"}
                    </h4>

                    <form onSubmit={handleSubmit}>

                        {/* NAME */}

                        <div className="admin-form-group">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* DESCRIPTION */}

                        <div className="admin-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* PRICE */}

                        <div className="admin-form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                min="0"
                                required
                            />

                        </div>

                        {/* QUANTITY */}

                        <div className="admin-form-group">

                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={product.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                            />

                        </div>

                        {/* CATEGORY */}

                        <div className="admin-form-group">

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* IMAGE */}

                        <div className="admin-form-group">

                            <label>
                                Product Image
                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageChange}
                                required={!editingId}
                            />

                            {editingId &&
                                product.image === null && (
                                    <p>
                                        Existing image will be kept
                                    </p>
                                )}

                            {product.image && (
                                <p>
                                    Selected:{" "}
                                    {product.image.name}
                                </p>
                            )}

                        </div>

                        {/* BUTTONS */}

                        <div className="admin-form-buttons">

                            <button
                                type="submit"
                                className="admin-save-btn"
                            >
                                {editingId
                                    ? "Update Product"
                                    : "Add Product"}
                            </button>

                            <button
                                type="button"
                                className="admin-cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* PRODUCT LIST */}

            <div className="admin-product-list">

                <h4>
                    Product List
                </h4>

                <div className="admin-product-table-wrapper">

                    <table className="admin-product-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.length > 0 ? (

                                products.map((p) => {

                                    const productId =
                                        p.id || p._id;

                                    const quantity =
                                        p.stock ??
                                        p.quantity ??
                                        0;

                                    return (
                                        <tr
                                            key={productId}
                                        >

                                            <td>
                                                {productId}
                                            </td>

                                            <td>
                                                {p.imageUrl ? (
                                                    <img
                                                        src={p.imageUrl}
                                                        alt={p.name}
                                                        width="80"
                                                        height="80"
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: "8px"
                                                        }}
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </td>

                                            <td>
                                                {p.name}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    p.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                {quantity}
                                            </td>

                                            <td>

                                                <button
                                                    className="admin-product-edit-btn"
                                                    onClick={() =>
                                                        editProduct(p)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="admin-product-delete-btn"
                                                    onClick={() =>
                                                        deleteProduct(
                                                            productId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    );
                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="no-products"
                                    >
                                        No products found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default AdminProducts;