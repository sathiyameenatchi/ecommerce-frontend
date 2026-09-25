import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";


const AdminSalesReport = () => {

    const [report, setReport] = useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        fetchSalesReport();

    }, []);


    const fetchSalesReport = async () => {

        try {

            const response =
                await api.get("/admin/sales/report");

            setReport(response.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load sales report");

        } finally {

            setLoading(false);

        }
    };


    if (loading) {

        return (
            <div>
                <h3>Loading Sales Report...</h3>
            </div>
        );

    }


    if (!report) {

        return (
            <div>
                <h3>No sales report available</h3>
            </div>
        );

    }


    return (

        <div className="sales-report">

            <h2>📊 Sales Report</h2>


            {/* SUMMARY CARDS */}

            <div className="sales-cards">

                <div className="sales-card">

                    <h4>Total Sales</h4>

                    <h2>
                        ₹{report.totalSales?.toFixed(2)}
                    </h2>

                </div>


                <div className="sales-card">

                    <h4>Total Orders</h4>

                    <h2>
                        {report.totalOrders}
                    </h2>

                </div>

            </div>


            {/* MONTHLY SALES */}

            <div className="chart-box">

                <h3>
                    📈 Monthly Sales
                </h3>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <BarChart
                        data={report.monthlySales}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="sales"
                            name="Sales"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>


            {/* ORDER STATUS */}

            <div className="chart-box">

                <h3>
                    📦 Order Status
                </h3>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <PieChart>

                        <Pie
                            data={report.orderStatus}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >

                            {report.orderStatus.map(
                                (entry, index) => (

                                    <Cell
                                        key={
                                            `cell-${index}`
                                        }
                                    />

                                )
                            )}

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>


            {/* STATUS TABLE */}

            <div className="chart-box">

                <h3>
                    📋 Order Status Summary
                </h3>

                <table>

                    <thead>

                        <tr>

                            <th>Status</th>

                            <th>Orders</th>

                        </tr>

                    </thead>


                    <tbody>

                        {report.orderStatus.map(
                            (item) => (

                                <tr key={item.status}>

                                    <td>
                                        {item.status}
                                    </td>

                                    <td>
                                        {item.count}
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>


        </div>

    );

};


export default AdminSalesReport;