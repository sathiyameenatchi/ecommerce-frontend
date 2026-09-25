
import { useEffect, useState } from "react";
import api from "../services/api";

console.log("🔥 ADMIN ORDERS FILE LOADED");

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD ALL ORDERS
    // =========================

    const loadOrders = async () => {

        try {

            console.log("🔥 CALLING ADMIN ORDERS API");

            const response =
                await api.get("/orders/admin/all");

            console.log(
                "🔥 ADMIN ORDERS RESPONSE =",
                response.data
            );

            console.log(
                "🔥 IS ARRAY =",
                Array.isArray(response.data)
            );

            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "❌ ADMIN ORDERS ERROR =",
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


    // =========================
    // LOAD ORDERS ON PAGE LOAD
    // =========================

    useEffect(() => {

        console.log(
            "🔥 ADMIN ORDERS USEEFFECT RUNNING"
        );

        loadOrders();

    }, []);


    // =========================
    // UPDATE ORDER STATUS
    // =========================

    const updateStatus = async (
        orderId,
        status
    ) => {

        try {

            console.log(
                "🔥 UPDATING ORDER:",
                orderId,
                status
            );

            const response = await api.put(
                `/orders/admin/${orderId}/status?status=${status}`
            );

            console.log(
                "🔥 STATUS UPDATE RESPONSE =",
                response.data
            );

            alert(
                `Order #${orderId} updated to ${status}`
            );

            // Reload orders
            await loadOrders();

        } catch (error) {

            console.error(
                "❌ UPDATE STATUS ERROR =",
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

            alert(
                error.response?.data?.message ||
                "Status update failed"
            );
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="container">

                <h1>Manage Orders</h1>

                <p>
                    Loading orders...
                </p>

            </div>
        );
    }


    // =========================
    // UI
    // =========================

    return (

        <div className="container">

            <h1>
                Manage Orders
            </h1>

            <h2>
                Orders Found: {orders.length}
            </h2>


            {orders.length === 0 ? (

                <h3>
                    No orders found
                </h3>

            ) : (

                orders.map((order) => {

                    // IMPORTANT:
                    // Backend response can use id
                    // or orderId

                    const orderId =
                        order.id ?? order.orderId;


                    return (

                        <div
                            key={orderId}
                            className="admin-order"
                        >

                            {/* ORDER ID */}

                            <h2>
                                Order #{orderId}
                            </h2>


                            {/* TOTAL */}

                            <p>
                                Total:
                                {" "}
                                ₹{order.totalAmount}
                            </p>


                            {/* STATUS */}

                            <p>
                                Status:
                                {" "}
                                <strong>
                                    {order.status}
                                </strong>
                            </p>


                            {/* DATE */}

                            <p>
                                Date:
                                {" "}
                                {order.createdAt}
                            </p>


                            {/* PRODUCTS */}

                            <h4>
                                Products
                            </h4>

                            {order.items?.map(
                                (item) => (

                                    <div
                                        key={item.id}
                                    >

                                        {item.productName}

                                        {" - "}

                                        {item.quantity}

                                        {" × "}

                                        ₹{item.price}

                                    </div>
                                )
                            )}


                            <br />


                            {/* =========================
                                STATUS BUTTONS
                            ========================= */}

                            <button
                                onClick={() =>
                                    updateStatus(
                                        orderId,
                                        "PAYMENT_PENDING"
                                    )
                                }
                            >
                                Payment Pending
                            </button>


                            <button
                                onClick={() =>
                                    updateStatus(
                                        orderId,
                                        "PAID"
                                    )
                                }
                            >
                                Paid
                            </button>


                            <button
                                onClick={() =>
                                    updateStatus(
                                        orderId,
                                        "PROCESSING"
                                    )
                                }
                            >
                                Processing
                            </button>


                            <button
                                onClick={() =>
                                    updateStatus(
                                        orderId,
                                        "SHIPPED"
                                    )
                                }
                            >
                                Shipped
                            </button>


                            <button
                                onClick={() =>
                                    updateStatus(
                                        orderId,
                                        "DELIVERED"
                                    )
                                }
                            >
                                Delivered
                            </button>


                            <button
                                onClick={() =>
                                    updateStatus(
                                        orderId,
                                        "CANCELLED"
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <hr />

                        </div>
                    );
                })
            )}

        </div>
    );
}

export default AdminOrders;

