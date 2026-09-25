import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyOrders() {
    console.log("🔥🔥 MY ORDERS PAGE LOADED 🔥🔥");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const loadOrders = async () => {

            try {

                console.log("🔥 MY ORDERS COMPONENT RUNNING");

                console.log(
                    "🔥 TOKEN =",
                    localStorage.getItem("token")
                );

                const response = await api.get("/orders");

                console.log(
                    "🔥 MY ORDERS RESPONSE =",
                    response.data
                );

                console.log(
                    "🔥 IS ARRAY =",
                    Array.isArray(response.data)
                );

                console.log(
                    "🔥 COUNT =",
                    response.data?.length
                );

                setOrders(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "❌ MY ORDERS ERROR =",
                    error
                );

                console.log(
                    "STATUS =",
                    error.response?.status
                );

                console.log(
                    "MESSAGE =",
                    error.response?.data
                );

            } finally {

                setLoading(false);
            }
        };

        loadOrders();

    }, []);

    console.log(
        "🔥 RENDER ORDERS =",
        orders
    );

    console.log(
        "🔥 RENDER LENGTH =",
        orders.length
    );

    if (loading) {

        return (
            <div className="container">
                <h2>Loading orders...</h2>
            </div>
        );
    }

    return (

        <div className="container">

            <h1>My Orders</h1>

            <h2>
                Orders Found: {orders.length}
            </h2>

            {orders.length === 0 ? (

                <h3>
                    You have no orders
                </h3>

            ) : (

                orders.map((order) => {

                    const orderId =
                        order.orderId ?? order.id;

                    return (

                        <div
                            key={orderId}
                            className="order-card"
                        >

                            <h2>
                                Order #{orderId}
                            </h2>

                            <p>
                                Amount:
                                {" "}
                                ₹{order.totalAmount}
                            </p>

                            <p>
                                Status:
                                {" "}
                                <strong>
                                    {order.status}
                                </strong>
                            </p>

                            <p>
                                Payment ID:
                                {" "}
                                {order.paymentId}
                            </p>

                            <p>
                                Date:
                                {" "}
                                {order.createdAt}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/orders/${orderId}`
                                    )
                                }
                            >
                                View Details
                            </button>

                        </div>

                    );
                })

            )}

        </div>
    );
}

export default MyOrders;

