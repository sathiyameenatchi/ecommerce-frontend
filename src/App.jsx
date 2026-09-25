import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import CustomerProfile from "./pages/CustomerProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminSalesReport from "./pages/AdminSalesReport";
import OrderDetails from "./pages/OrderDetails.jsx";

function App() {

    
    return (

        <BrowserRouter>

            <Routes>

                {/* Customer */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/products"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                {/* My Orders */}

                <Route
                    path="/orders"
                    element={<MyOrders />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />


                {/* Admin */}

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

                <Route
                    path="/admin/products/add"
                    element={<AddProduct />}
                />

                <Route
                    path="/admin/products/edit/:id"
                    element={<EditProduct />}
                />

                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />
                         <Route
                          path="/profile"
                             element={<CustomerProfile />}
                               />

                               <Route
                                   path="/admin/sales-report"
                                          element={<AdminSalesReport />}
                                               />
            </Routes>

        </BrowserRouter>
    );
}

export default App;