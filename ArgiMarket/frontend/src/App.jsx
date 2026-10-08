import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ForFarmers from "./pages/ForFarmers";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Products from "./pages/products/Products";
import ProductDetails from "./pages/products/ProductDetails";
import PublicFarmers from "./pages/farmers/Farmers";
import FarmerDetails from "./pages/farmers/FarmerDetails";

import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import AddProduct from "./pages/farmer/AddProduct";
import MyProducts from "./pages/farmer/MyProducts";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerSupportRequests from "./pages/farmer/FarmerSupportRequests";

import Cart from "./pages/consumer/Cart";
import Checkout from "./pages/consumer/Checkout";
import Orders from "./pages/consumer/Orders";
import OrderDetails from "./pages/consumer/OrderDetails";
import HelpCenter from "./pages/consumer/HelpCenter";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFarmers from "./pages/admin/Farmers";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import Analytics from "./pages/admin/Analytics";
import SupportRequests from "./pages/admin/SupportRequests";
import Chat from "./pages/Chat";

const NotFound = () => (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-green-600">
                404
            </h1>

            <p className="text-gray-500 mt-3">
                Page not found.
            </p>
        </div>
    </div>
);

function App() {

    return (
        <div className="min-h-screen flex flex-col">

            <Navbar />

            <main className="flex-1">

                <Routes>

                    {/* =================================
                        LAYER 1 - PUBLIC
                    ================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/farmers"
                        element={<PublicFarmers />}
                    />

                    <Route
                        path="/farmers/:id"
                        element={<FarmerDetails />}
                    />

                    <Route
                        path="/contact"
                        element={<Contact />}
                    />

                    <Route
                        path="/for-farmers"
                        element={<ForFarmers />}
                    />

                    {/* =================================
                        LAYER 2 - AUTHENTICATION
                    ================================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* =================================
                        LAYER 3 - CONSUMER
                    ================================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            element={
                                <RoleRoute
                                    roles={["consumer"]}
                                />
                            }
                        >

                            <Route
                                path="/cart"
                                element={<Cart />}
                            />

                            <Route
                                path="/checkout"
                                element={<Checkout />}
                            />

                            <Route
                                path="/orders"
                                element={<Orders />}
                            />

                            <Route
                                path="/orders/:id"
                                element={<OrderDetails />}
                            />

                            <Route
                                path="/help"
                                element={<HelpCenter />}
                            />

                        </Route>

                    </Route>

                    <Route element={<ProtectedRoute />}>

                        <Route
                            element={
                                <RoleRoute
                                    roles={["consumer", "farmer"]}
                                />
                            }
                        >
                            <Route
                                path="/chats"
                                element={<Chat />}
                            />
                            <Route
                                path="/chats/:conversationId"
                                element={<Chat />}
                            />
                        </Route>

                    </Route>

                    {/* =================================
                        LAYER 3 - FARMER
                    ================================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            element={
                                <RoleRoute
                                    roles={["farmer"]}
                                />
                            }
                        >

                            <Route
                                path="/farmer/dashboard"
                                element={<FarmerDashboard />}
                            />

                            <Route
                                path="/farmer/profile"
                                element={<FarmerProfile />}
                            />

                            <Route
                                path="/farmer/products/add"
                                element={<AddProduct />}
                            />

                            <Route
                                path="/farmer/products"
                                element={<MyProducts />}
                            />

                            <Route
                                path="/farmer/orders"
                                element={<FarmerOrders />}
                            />

                            <Route
                                path="/farmer/support"
                                element={<FarmerSupportRequests />}
                            />

                        </Route>

                    </Route>

                    {/* =================================
                        LAYER 4 - ADMIN
                    ================================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            element={
                                <RoleRoute
                                    roles={["admin"]}
                                />
                            }
                        >

                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />

                            <Route
                                path="/admin/farmers"
                                element={<AdminFarmers />}
                            />

                            <Route
                                path="/admin/products"
                                element={<AdminProducts />}
                            />

                            <Route
                                path="/admin/orders"
                                element={<AdminOrders />}
                            />

                            <Route
                                path="/admin/categories"
                                element={<Categories />}
                            />

                            <Route
                                path="/admin/analytics"
                                element={<Analytics />}
                            />

                            <Route
                                path="/admin/support"
                                element={<SupportRequests />}
                            />

                        </Route>

                    </Route>

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>

            </main>

            <Footer />

        </div>
    );
}

export default App;