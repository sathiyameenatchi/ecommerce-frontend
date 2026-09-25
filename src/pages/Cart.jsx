import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);

    const loadCart = async () => {
        try {
            const response = await api.get("/cart");
            setCart(response.data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                navigate("/login");
            } else {
                alert(
                    error.response?.data?.message ||
                    "Unable to load cart"
                );
            }
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await api.put(
                `/cart/item/${itemId}?quantity=${quantity}`
            );

            setCart(response.data);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to update quantity"
            );
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await api.delete(
                `/cart/item/${itemId}`
            );

            setCart(response.data);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to remove item"
            );
        }
    };

    if (!cart) {
        return (
            <div className="container mt-4">
                <h2>Loading cart...</h2>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h1>My Cart</h1>

            {cart.items.length === 0 ? (
                <div>
                    <h3>Your cart is empty</h3>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    {/* CART ITEMS */}

                    {cart.items.map((item) => (
                        <div
                            className="cart-item card p-3 mb-3"
                            key={item.itemId}
                        >

                            <h3>
                                {item.productName}
                            </h3>

                            <p>
                                Price: ₹{item.price}
                            </p>

                            <p>
                                Subtotal: ₹{item.subtotal}
                            </p>

                            {/* QUANTITY */}

                            <div className="mb-3">

                                <button
                                    className="btn btn-secondary me-2"
                                    disabled={item.quantity <= 1}
                                    onClick={() =>
                                        updateQuantity(
                                            item.itemId,
                                            item.quantity - 1
                                        )
                                    }
                                >
                                    -
                                </button>

                                <span className="me-2">
                                    {item.quantity}
                                </span>

                                <button
                                    className="btn btn-secondary me-3"
                                    onClick={() =>
                                        updateQuantity(
                                            item.itemId,
                                            item.quantity + 1
                                        )
                                    }
                                >
                                    +
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        removeItem(item.itemId)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    ))}

                    {/* TOTAL */}

                    <h2>
                        Total: ₹{cart.totalAmount}
                    </h2>

                    {/* CHECKOUT */}

                    <button
                        onClick={() => navigate("/checkout")}
                        className="btn btn-success me-2"
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        onClick={() => navigate("/products")}
                        className="btn btn-primary"
                    >
                        Continue Shopping
                    </button>

                </>
            )}

        </div>
    );
}

export default Cart;