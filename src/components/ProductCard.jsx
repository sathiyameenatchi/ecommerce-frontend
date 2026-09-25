import api from "../services/api";

function ProductCard({ product }) {

    const addToCart = async () => {

        try {

            await api.post("/cart/add", {

                productId: product.id,

                quantity: 1

            });

            alert("Product added to cart");

        } catch (error) {

            if (error.response?.status === 401) {

                alert("Please login first");

            } else {

                alert(
                    error.response?.data?.message ||
                    "Unable to add product"
                );
            }
        }
    };

    return (

        <div className="product-card">

            <img
    src={product.imageUrl}
    alt={product.name}
    style={{
        width: "300px",
        height: "300px",
        objectFit: "fill",
        display: "block",
        margin: "0 auto",
    }}
/>

            <h3>
                {product.name}
            </h3>

            <p>
                {product.description}
            </p>

            <h4>
                ₹{product.price}
            </h4>

            <p>
                Stock: {product.stock}
            </p>

            <button
                onClick={addToCart}
                disabled={product.stock <= 0}
            >
                {product.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
            </button>

        </div>
    );
}

export default ProductCard;