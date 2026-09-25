import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {

        try {

            const response = await api.get("/orders");

            console.log("ORDERS API RESPONSE =", response.data);

            setOrders(response.data);

        } catch (error) {

            console.log("ORDERS ERROR =", error);
            console.log("STATUS =", error.response?.status);
            console.log("MESSAGE =", error.response?.data);

            if (error.response?.status === 403) {

                alert("Forbidden: You are not allowed to view orders");

            } else if (error.response?.status === 401) {

                alert("Please login first");

            }
        }
    };

    useEffect(() => {

        loadOrders();

    }, []);

    const cancelOrder = async (orderId) => {

        try {

            await api.put(
                `/orders/${orderId}/cancel`
            );

            alert("Order cancelled");

            loadOrders();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to cancel order"
            );
        }
    };

    return (

        <div className="container">

            <h1>My Orders</h1>

            {orders.length === 0 && (

                <h3>
                    No orders found
                </h3>

            )}

            {orders.map((order) => (

                <div
                    className="order-card"
                    key={order.orderId}
                >

                    <h3>
                        Order #{order.orderId}
                    </h3>

                    <p>
                        Amount:
                        ₹{order.totalAmount}
                    </p>

                    <p>
                        Status:
                        {order.status}
                    </p>

                    <p>
                        Date:
                        {order.createdAt}
                    </p>

                    <h4>
                        Products
                    </h4>

                    {order.items.map((item) => (

                        <div key={item.productId}>

                            {item.productName}
                            {" - "}
                            {item.quantity}
                            {" × "}
                            ₹{item.price}

                        </div>

                    ))}

                    {order.status === "CREATED" && (

                        <button
                            onClick={() =>
                                cancelOrder(
                                    order.orderId
                                )
                            }
                        >
                            Cancel Order
                        </button>

                    )}

                </div>

            ))}

        </div>
    );
}

export default Orders;

