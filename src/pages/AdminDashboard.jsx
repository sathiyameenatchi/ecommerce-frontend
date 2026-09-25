import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../services/api";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        alert("Logout successful");

        navigate("/login");
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadDashboard();
        loadOrders();

    }, []);


    // =========================
    // LOAD DASHBOARD
    // =========================

    const loadDashboard = async () => {

        try {

            const response =
                await api.get("/admin/dashboard");

            console.log(
                "Dashboard API:",
                response.data
            );

            setDashboard(response.data);

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // LOAD ORDERS
    // =========================

    const loadOrders = async () => {

        try {

            const response =
                await api.get("/orders/admin/all");

            console.log(
                "Orders API:",
                response.data
            );


            if (Array.isArray(response.data)) {

                setOrders(response.data);

            } else if (
                Array.isArray(response.data.orders)
            ) {

                setOrders(
                    response.data.orders
                );

            } else {

                setOrders([]);
            }

        } catch (error) {

            console.error(
                "Orders error:",
                error
            );

            setOrders([]);
        }
    };


    // =========================
    // REFRESH
    // =========================

    const refreshDashboard = () => {

        setLoading(true);

        loadDashboard();
        loadOrders();
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="container mt-5">

                <h3>
                    Loading Dashboard...
                </h3>

            </div>
        );
    }


    // =========================
    // DASHBOARD ERROR
    // =========================

    if (!dashboard) {

        return (
            <div className="container mt-5">

                <h3>
                    Unable to load dashboard
                </h3>

                <button
                    className="btn btn-primary mt-3"
                    onClick={refreshDashboard}
                >
                    Try Again
                </button>

            </div>
        );
    }


    // =========================
    // MAIN UI
    // =========================

    return (

        <div className="container mt-4">


            {/* ================= HEADER ================= */}

            <div
                className="d-flex justify-content-between align-items-center mb-4"
            >

                <h2>
                    Admin Dashboard
                </h2>


                <div className="d-flex gap-2">


                    {/* MANAGE PRODUCTS */}

                    <Link
                        to="/admin/products"
                        className="btn btn-primary"
                    >
                        Manage Products
                    </Link>


                    {/* SALES REPORT */}

                    <Link
                        to="/admin/sales-report"
                        className="btn btn-info"
                    >
                        📊 Sales Report
                    </Link>


                    {/* REFRESH */}

                    <button
                        className="btn btn-secondary"
                        onClick={refreshDashboard}
                    >
                        🔄 Refresh
                    </button>


                    {/* LOGOUT */}

                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className="dashboard-stats">


                {/* TOTAL USERS */}

                <div className="dashboard-card">

                    <h5>
                        👥 Total Users
                    </h5>

                    <h2>
                        {dashboard.totalUsers}
                    </h2>

                </div>


                {/* TOTAL PRODUCTS */}

                <div className="dashboard-card">

                    <h5>
                        📦 Total Products
                    </h5>

                    <h2>
                        {dashboard.totalProducts}
                    </h2>

                </div>


                {/* TOTAL ORDERS */}

                <div className="dashboard-card">

                    <h5>
                        🛒 Total Orders
                    </h5>

                    <h2>
                        {dashboard.totalOrders}
                    </h2>

                </div>


                {/* TOTAL SALES */}

                <div className="dashboard-card">

                    <h5>
                        💰 Total Sales
                    </h5>

                    <h2>

                        ₹
                        {Number(
                            dashboard.totalSales || 0
                        ).toLocaleString("en-IN")}

                    </h2>

                </div>

            </div>


            {/* ================= ORDER STATUS ================= */}

            <div className="order-status-section">

                <h4 className="order-status-title">
                    ORDER STATUS
                </h4>


                <div className="status-grid">


                    {/* CREATED */}

                    <div className="status-item">

                        <div className="status-label">
                            Created
                        </div>

                        <div className="status-count">
                            {dashboard.createdOrders || 0}
                        </div>

                    </div>


                    {/* PAID */}

                    <div className="status-item">

                        <div className="status-label">
                            Paid
                        </div>

                        <div className="status-count">
                            {dashboard.paidOrders || 0}
                        </div>

                    </div>


                    {/* PROCESSING */}

                    <div className="status-item">

                        <div className="status-label">
                            Processing
                        </div>

                        <div className="status-count">
                            {dashboard.processingOrders || 0}
                        </div>

                    </div>


                    {/* SHIPPED */}

                    <div className="status-item">

                        <div className="status-label">
                            Shipped
                        </div>

                        <div className="status-count">
                            {dashboard.shippedOrders || 0}
                        </div>

                    </div>


                    {/* DELIVERED */}

                    <div className="status-item">

                        <div className="status-label">
                            Delivered
                        </div>

                        <div className="status-count">
                            {dashboard.deliveredOrders || 0}
                        </div>

                    </div>


                    {/* CANCELLED */}

                    <div className="status-item">

                        <div className="status-label">
                            Cancelled
                        </div>

                        <div className="status-count">
                            {dashboard.cancelledOrders || 0}
                        </div>

                    </div>

                </div>

            </div>


            {/* ================= RECENT ORDERS ================= */}

            <div className="recent-orders-card">


                {/* RECENT ORDERS HEADER */}

                <div className="recent-orders-header">

                    <h4>
                        Recent Orders
                    </h4>


                    <Link to="/admin/orders">
                        View All
                    </Link>

                </div>


                {/* TABLE */}

                <div className="recent-orders-scroll">

                    <table className="admin-orders-table">


                        <thead>

                            <tr>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {orders.length > 0 ? (

                                orders
                                    .slice(0, 5)
                                    .map((order) => {


                                        const orderId =
                                            order.id ||
                                            order._id ||
                                            order.orderId;


                                        const totalAmount =
                                            order.totalAmount ||
                                            order.total ||
                                            order.amount ||
                                            0;


                                        const status =
                                            order.status ||
                                            "-";


                                        return (

                                            <tr
                                                key={orderId}
                                            >


                                                {/* ORDER ID */}

                                                <td>

                                                    #
                                                    {orderId || "-"}

                                                </td>


                                                {/* TOTAL */}

                                                <td>

                                                    ₹
                                                    {Number(
                                                        totalAmount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            `admin-order-status ${
                                                                status !== "-"
                                                                    ? status.toLowerCase()
                                                                    : ""
                                                            }`
                                                        }
                                                    >
                                                        {status}
                                                    </span>

                                                </td>


                                                {/* DATE */}

                                                <td>

                                                    {order.createdAt

                                                        ? new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )

                                                        : "-"

                                                    }

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    {orderId ? (

                                                        <Link
                                                            to={`/admin/orders/${orderId}`}
                                                            className="admin-view-btn"
                                                        >
                                                            View
                                                        </Link>

                                                    ) : (

                                                        "-"

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >
                                        No orders found
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


export default AdminDashboard;

