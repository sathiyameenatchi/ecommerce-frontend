import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================
    // TRACKING STEP CLASS
    // =========================

    const getStepClass = (currentStatus, step) => {

        const steps = [
            "CREATED",
            "PAYMENT_PENDING",
            "PAID",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED"
        ];

        const currentIndex =
            steps.indexOf(currentStatus);

        const stepIndex =
            steps.indexOf(step);

        if (
            currentIndex === -1 ||
            stepIndex === -1
        ) {
            return "tracking-step";
        }

        if (stepIndex <= currentIndex) {
            return "tracking-step completed";
        }

        return "tracking-step";
    };


    // =========================
    // LOAD ORDER
    // =========================

    useEffect(() => {

        const loadOrder = async () => {

            try {

                console.log(
                    "🔥 Loading order ID:",
                    id
                );

                const response =
                    await api.get(`/orders/${id}`);

                console.log(
                    "🔥 ORDER DETAILS:",
                    response.data
                );

                console.log(
                    "🔥 ACTUAL STATUS =",
                    response.data.status
                );

                setOrder(response.data);

            } catch (error) {

                console.error(
                    "❌ ORDER DETAILS ERROR:",
                    error
                );

                console.log(
                    "STATUS:",
                    error.response?.status
                );

                console.log(
                    "MESSAGE:",
                    error.response?.data
                );

            } finally {

                setLoading(false);
            }
        };

        loadOrder();

    }, [id]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );
    }


    // =========================
    // ORDER NOT FOUND
    // =========================

    if (!order) {

        return (
            <div className="container">
                <h2>Order not found</h2>
            </div>
        );
    }


    // =========================
    // UI
    // =========================

    return (

        <div className="container">

<h1>
    Order #{order.orderId ?? order.id}
</h1>



            {/* =========================
                ORDER SUMMARY
            ========================= */}

            <div className="order-summary">

                <h2>
                    Order Summary
                </h2>

                <p>
                    Total Amount:
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
                    Order Date:
                    {" "}
                    {order.createdAt}
                </p>

            </div>

                    
{/* =========================
    ORDER TRACKING
========================= */}

{order.status === "CANCELLED" ? (

    <div className="cancelled-order">

        <h2>
            Order Cancelled
        </h2>

        <p>
            This order has been cancelled.
        </p>

    </div>

) : (

    <div className="tracking">

        <h2>
            Order Tracking
        </h2>

        <div className="tracking-container">

            <div
                className={getStepClass(
                    order.status,
                    "CREATED"
                )}
            >
                <span>✓</span>
                <p>Order Created</p>
            </div>


            <div
                className={getStepClass(
                    order.status,
                    "PAYMENT_PENDING"
                )}
            >
                <span>✓</span>
                <p>Payment Pending</p>
            </div>


            <div
                className={getStepClass(
                    order.status,
                    "PAID"
                )}
            >
                <span>✓</span>
                <p>Payment Paid</p>
            </div>


            <div
                className={getStepClass(
                    order.status,
                    "PROCESSING"
                )}
            >
                <span>✓</span>
                <p>Processing</p>
            </div>


            <div
                className={getStepClass(
                    order.status,
                    "SHIPPED"
                )}
            >
                <span>✓</span>
                <p>Shipped</p>
            </div>


            <div
                className={getStepClass(
                    order.status,
                    "DELIVERED"
                )}
            >
                <span>✓</span>
                <p>Delivered</p>
            </div>

        </div>

    </div>

)}



            {/* =========================
                ORDER ITEMS
            ========================= */}

            <h2>
                Order Items
            </h2>

            {order.items?.map((item) => (

                <div
                    key={item.id}
                    className="order-item"
                >

                    <p>
                        Product:
                        {" "}
                        {item.productName}
                    </p>

                    <p>
                        Quantity:
                        {" "}
                        {item.quantity}
                    </p>

                    <p>
                        Price:
                        {" "}
                        ₹{item.price}
                    </p>

                    <p>
                        Subtotal:
                        {" "}
                        ₹{item.subtotal}
                    </p>

                </div>

            ))}

        </div>
    );
}

export default OrderDetails;

