import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Checkout = () => {
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    const shippingCharge = 50;

    // =====================================================
    // LOAD CHECKOUT DATA
    // =====================================================

    useEffect(() => {
        loadCheckoutData();
    }, []);

const loadCheckoutData = async () => {
    try {
        // ==============================
        // LOAD CART
        // ==============================

        const cartResponse = await api.get("/cart");

        const cartData = cartResponse.data;

        let items = [];

        if (Array.isArray(cartData?.items)) {
            items = cartData.items;
        } else if (Array.isArray(cartData)) {
            items = cartData;
        } else if (Array.isArray(cartData?.cartItems)) {
            items = cartData.cartItems;
        }

        setCartItems(items);

        // ==============================
        // LOAD ADDRESSES
        // ==============================

        if (!userId) {
            console.error("USER ID NOT FOUND");

            setAddresses([]);
            setSelectedAddress(null);

            return;
        }

        console.log(
            "CHECKOUT USER ID:",
            userId
        );

        const addressResponse = await api.get(
            `/addresses/user/${userId}`
        );

        console.log(
            "ADDRESS API STATUS:",
            addressResponse.status
        );

        console.log(
            "ADDRESS API RESPONSE:",
            addressResponse.data
        );

        const addressData = addressResponse.data;

        // ==============================
        // HANDLE ADDRESS RESPONSE
        // ==============================

        if (Array.isArray(addressData)) {

            setAddresses(addressData);

            setSelectedAddress(null);

        } else if (
            Array.isArray(addressData?.addresses)
        ) {

            setAddresses(
                addressData.addresses
            );

            if (addressData.length > 0) {
               setSelectedAddress(addressData[0]);
                  } else {
                 setSelectedAddress(null);
                      }

        } else {

            console.error(
                "ADDRESS RESPONSE IS NOT AN ARRAY:",
                addressData
            );

            setAddresses([]);
                    if (addressData.addresses.length > 0) {
                       setSelectedAddress(addressData.addresses[0]);
                             } else {
                                 setSelectedAddress(null);
                                   }
        }

    } catch (error) {

        console.error(
            "CHECKOUT LOAD ERROR:",
            error
        );

        console.error(
            "STATUS:",
            error.response?.status
        );

        console.error(
            "DATA:",
            error.response?.data
        );

        console.error(
            "URL:",
            error.config?.url
        );

        alert(
            error.response?.data?.message ||
            error.response?.data ||
            "Unable to load checkout"
        );

    } finally {

        setLoading(false);

    }
};


    // =====================================================
    // CALCULATE SUBTOTAL
    // =====================================================

    const getSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = Number(
                item.product?.price ??
                item.price ??
                0
            );

            const quantity = Number(
                item.quantity ?? 0
            );

            return total + price * quantity;
        }, 0);
    };

    const subtotal = getSubtotal();

    const totalAmount = subtotal + shippingCharge;

    // =====================================================
    // PAYMENT FAILED
    // =====================================================

    const handlePaymentFailed = async (
        orderId,
        response
    ) => {
        console.error(
            "========== RAZORPAY PAYMENT FAILED =========="
        );

        console.error(
            "ERROR CODE:",
            response?.error?.code
        );

        console.error(
            "DESCRIPTION:",
            response?.error?.description
        );

        console.error(
            "SOURCE:",
            response?.error?.source
        );

        console.error(
            "STEP:",
            response?.error?.step
        );

        console.error(
            "REASON:",
            response?.error?.reason
        );

        console.error(
            "FULL RESPONSE:",
            response
        );

        console.error(
            "============================================="
        );

        try {
            await api.put(
                `/payments/failed/${orderId}`
            );
        } catch (error) {
            console.error(
                "FAILED TO UPDATE PAYMENT STATUS:",
                error
            );
        }

        setProcessingPayment(false);

        alert(
            response?.error?.description ||
            "Payment failed. Please try again."
        );
    };

    // =====================================================
    // RAZORPAY PAYMENT SUCCESS
    // =====================================================

    const handlePaymentSuccess = async (
        paymentResult,
        orderId
    ) => {
        try {
            console.log(
                "========== RAZORPAY SUCCESS =========="
            );

            console.log(
                "PAYMENT ID:",
                paymentResult?.razorpay_payment_id
            );

            console.log(
                "RAZORPAY ORDER ID:",
                paymentResult?.razorpay_order_id
            );

            // Validate Razorpay response
            if (
                !paymentResult?.razorpay_payment_id ||
                !paymentResult?.razorpay_order_id ||
                !paymentResult?.razorpay_signature
            ) {
                throw new Error(
                    "Incomplete Razorpay payment response"
                );
            }

            // Verify payment with backend
            const verifyResponse = await api.post(
                "/payments/verify",
                {
                    razorpayOrderId:
                        paymentResult.razorpay_order_id,

                    razorpayPaymentId:
                        paymentResult.razorpay_payment_id,

                    razorpaySignature:
                        paymentResult.razorpay_signature,

                    orderId: orderId
                }
            );

            console.log(
                "PAYMENT VERIFIED:",
                verifyResponse.data
            );

            alert("Payment Successful!");

            setProcessingPayment(false);

            navigate("/orders");

        } catch (error) {
            console.error(
                "PAYMENT VERIFY ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            setProcessingPayment(false);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Payment verification failed"
            );
        }
    };

    // =====================================================
    // OPEN RAZORPAY
    // =====================================================

    const openRazorpay = async (order) => {
        try {
            console.log(
                "========== CREATING RAZORPAY ORDER =========="
            );

            // Create Razorpay order
            const paymentResponse = await api.post(
                `/payments/create/${order.orderId}`
            );

            const paymentData = paymentResponse.data;

            console.log(
                "RAZORPAY PAYMENT DATA:",
                paymentData
            );

            // Validate backend response
            if (
                !paymentData?.keyId ||
                !paymentData?.razorpayOrderId ||
                paymentData?.amount === undefined ||
                paymentData?.amount === null
            ) {
                throw new Error(
                    "Unable to create Razorpay payment."
                );
            }

            // Convert amount to number
            const razorpayAmount = Number(
                paymentData.amount
            );

            if (
                !Number.isFinite(razorpayAmount) ||
                !Number.isInteger(razorpayAmount) ||
                razorpayAmount <= 0
            ) {
                throw new Error(
                    "Invalid Razorpay amount received."
                );
            }

            // Backend order total in rupees
            const backendTotal = Number(
                order.totalAmount
            );

            if (
                !Number.isFinite(backendTotal) ||
                backendTotal <= 0
            ) {
                throw new Error(
                    "Invalid backend order total."
                );
            }

            // Convert rupees to paise
            const expectedAmountInPaise =
                Math.round(
                    backendTotal * 100
                );

            console.log(
                "========== AMOUNT CHECK =========="
            );

            console.log(
                "Backend Total:",
                backendTotal
            );

            console.log(
                "Expected Paise:",
                expectedAmountInPaise
            );

            console.log(
                "Razorpay Paise:",
                razorpayAmount
            );

            console.log(
                "=================================="
            );

            // Amount validation
            if (
                razorpayAmount !==
                expectedAmountInPaise
            ) {
                throw new Error(
                    "Payment amount mismatch. Please try again."
                );
            }

            // Check Razorpay SDK
            if (
                typeof window.Razorpay ===
                "undefined"
            ) {
                throw new Error(
                    "Razorpay SDK is not loaded."
                );
            }

            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {
                key: paymentData.keyId,

                amount: razorpayAmount,

                currency:
                    paymentData.currency ||
                    "INR",

                name: "My Ecommerce",

                description:
                    `Order #${order.orderId}`,

                order_id:
                    paymentData.razorpayOrderId,

                prefill: {
                    name:
                        selectedAddress?.fullName ||
                        "",

                    contact:
                        selectedAddress?.phone ||
                        ""
                },

                theme: {
                    color: "#3399cc"
                },

                handler:
                    async function (
                        paymentResult
                    ) {
                        await handlePaymentSuccess(
                            paymentResult,
                            order.orderId
                        );
                    }
            };

            console.log(
                "========== OPENING RAZORPAY =========="
            );

            console.log(
                "KEY:",
                options.key
            );

            console.log(
                "AMOUNT:",
                options.amount
            );

            console.log(
                "AMOUNT RUPEES:",
                options.amount / 100
            );

            console.log(
                "ORDER ID:",
                options.order_id
            );

            console.log(
                "======================================"
            );

            // Create Razorpay instance
            const razorpay =
                new window.Razorpay(
                    options
                );

            // Payment failed event
            razorpay.on(
                "payment.failed",
                function (response) {
                    handlePaymentFailed(
                        order.orderId,
                        response
                    );
                }
            );

            // Open Razorpay
            razorpay.open();

        } catch (error) {
            console.error(
                "========== RAZORPAY ERROR =========="
            );

            console.error(error);

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "===================================="
            );

            setProcessingPayment(false);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to start Razorpay payment"
            );
        }
    };

    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async () => {
        // Prevent double click
        if (processingPayment) {
            return;
        }

        // Address validation
        if (!selectedAddress?.id) {
            alert("Please select an address");
            return;
        }

        // Cart validation
        if (
            !cartItems ||
            cartItems.length === 0
        ) {
            alert("Cart is empty");
            return;
        }

        // Total validation
        if (
            !Number.isFinite(totalAmount) ||
            totalAmount <= 0
        ) {
            alert("Invalid order amount");
            return;
        }

        setProcessingPayment(true);

        try {
            // =================================================
            // STEP 1: CREATE OUR ORDER
            // =================================================

            const orderData = {
                addressId:
                    selectedAddress.id
            };

            console.log(
                "========== CREATE ORDER =========="
            );

            console.log(
                "ORDER DATA:",
                orderData
            );

            console.log(
                "TOTAL:",
                totalAmount
            );

            console.log(
                "=================================="
            );

            const orderResponse =
                await api.post(
                    "/orders/create",
                    orderData
                );

            const order =
                orderResponse.data;

            console.log(
                "========== ORDER CREATED =========="
            );

            console.log(order);

            console.log(
                "ORDER ID:",
                order?.orderId
            );

            console.log(
                "ORDER TOTAL:",
                order?.totalAmount
            );

            console.log(
                "ORDER STATUS:",
                order?.status
            );

            console.log(
                "==================================="
            );

            // Check order ID
            if (!order?.orderId) {
                throw new Error(
                    "Order created, but order ID is missing."
                );
            }

            // Check backend total
            const backendTotal =
                Number(
                    order.totalAmount
                );

            if (
                !Number.isFinite(
                    backendTotal
                ) ||
                backendTotal <= 0
            ) {
                throw new Error(
                    "Invalid order total received from backend."
                );
            }

            // =================================================
            // STEP 2: OPEN RAZORPAY
            // =================================================

            await openRazorpay(order);

        } catch (error) {
            console.error(
                "========== PLACE ORDER ERROR =========="
            );

            console.error(error);

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "URL:",
                error.config?.url
            );

            console.error(
                "======================================="
            );

            setProcessingPayment(false);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to place order"
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="container mt-4">
                <h3>Loading Checkout...</h3>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Checkout
            </h2>

            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div className="card p-4 mb-4">

                <h3 className="mb-4">
                    📍 Delivery Address
                </h3>

                {addresses.length === 0 ? (
                    <div>

                        <p>
                            No saved address found.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            Add Address
                        </button>

                    </div>
                ) : (
                    addresses.map(
                        (address) => (
                            <div
                                key={address.id}
                                className="card p-3 mb-3"
                            >

                                <div className="mb-2">

                                    <input
                                        type="radio"
                                        name="address"
                                        checked={
                                            selectedAddress?.id ===
                                            address.id
                                        }
                                        onChange={() =>
                                            setSelectedAddress(
                                                address
                                            )
                                        }
                                    />

                                    <strong className="ms-2">
                                        {
                                            address.fullName
                                        }
                                    </strong>

                                </div>

                                <p className="mb-2">
                                    📞{" "}
                                    {
                                        address.phone
                                    }
                                </p>

                                <p className="mb-2">
                                    {
                                        address.addressLine
                                    }
                                </p>

                                <p className="mb-0">
                                    {
                                        address.city
                                    }
                                    {", "}
                                    {
                                        address.state
                                    }
                                    {" - "}
                                    {
                                        address.pincode
                                    }
                                </p>

                            </div>
                        )
                    )
                )}

            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <div
                className="card p-4 mt-4"
                style={{
                    maxWidth: "700px"
                }}
            >

                <h3 className="mb-4">
                    🛒 Order Summary
                </h3>

                {/* CART ITEMS */}

                {cartItems.length === 0 ? (

                    <p className="text-danger">
                        Your cart is empty.
                    </p>

                ) : (

                    cartItems.map(
                        (item) => {

                            const price =
                                Number(
                                    item.product?.price ??
                                    item.price ??
                                    0
                                );

                            const quantity =
                                Number(
                                    item.quantity ?? 0
                                );

                            const productName =
                                item.product?.name ??
                                item.productName ??
                                "Product";

                            const itemTotal =
                                price * quantity;

                            return (
                                <div
                                    key={
                                        item.id ??
                                        item.itemId
                                    }
                                    className="border rounded p-3 mb-3"
                                >

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "130px 1fr",
                                            columnGap: "50px",
                                            marginBottom: "14px"
                                        }}
                                    >

                                        <span>
                                            Product
                                        </span>

                                        <strong>
                                            {productName}
                                        </strong>

                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "130px 1fr",
                                            columnGap: "50px",
                                            marginBottom: "14px"
                                        }}
                                    >

                                        <span>
                                            Price
                                        </span>

                                        <span>
                                            ₹
                                            {price.toFixed(2)}
                                        </span>

                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "130px 1fr",
                                            columnGap: "50px",
                                            marginBottom: "14px"
                                        }}
                                    >

                                        <span>
                                            Quantity
                                        </span>

                                        <span>
                                            {quantity}
                                        </span>

                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "130px 1fr",
                                            columnGap: "50px"
                                        }}
                                    >

                                        <span>
                                            Item Total
                                        </span>

                                        <strong>
                                            ₹
                                            {itemTotal.toFixed(2)}
                                        </strong>

                                    </div>

                                </div>
                            );
                        }
                    )
                )}

                <hr
                    style={{
                        margin: "20px 0"
                    }}
                />

                {/* SUBTOTAL */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "130px 1fr",
                        columnGap: "50px",
                        marginBottom: "14px"
                    }}
                >

                    <strong>
                        Subtotal
                    </strong>

                    <strong>
                        ₹
                        {subtotal.toFixed(2)}
                    </strong>

                </div>

                {/* SHIPPING */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "130px 1fr",
                        columnGap: "50px",
                        marginBottom: "14px"
                    }}
                >

                    <span>
                        Shipping
                    </span>

                    <span>
                        ₹
                        {shippingCharge.toFixed(2)}
                    </span>

                </div>

                <hr
                    style={{
                        margin: "20px 0"
                    }}
                />

                {/* TOTAL */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "130px 1fr",
                        columnGap: "50px",
                        marginBottom: "18px"
                    }}
                >

                    <strong>
                        Total
                    </strong>

                    <strong>
                        ₹
                        {totalAmount.toFixed(2)}
                    </strong>

                </div>

                {/* =================================================
                    RAZORPAY PAYMENT BUTTON
                ================================================= */}

                <button
                    className="btn btn-success w-100"
                    onClick={handlePlaceOrder}
                    disabled={
                        addresses.length === 0 ||
                        cartItems.length === 0 ||
                        processingPayment
                    }
                >

                    {processingPayment
                        ? "Processing Payment..."
                        : "💳 Place Order & Pay"
                    }

                </button>

            </div>

        </div>
    );
};

export default Checkout;

