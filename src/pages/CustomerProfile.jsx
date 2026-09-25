import React, { useEffect, useState } from "react";
import api from "../services/api";

const CustomerProfile = () => {
    const userId = localStorage.getItem("userId");

    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: ""
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    // Load saved addresses
    const loadAddresses = async () => {
        try {
            if (!userId) {
                console.error("User ID not found");
                return;
            }

            const response = await api.get(
                `/addresses/user/${userId}`
            );

            setAddresses(response.data);
        } catch (error) {
            console.error("Load address error:", error);

            if (error.response) {
                console.error(
                    "Backend response:",
                    error.response.data
                );
            }
        }
    };

    // Input change
    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    // Address validation
    const validateAddress = () => {
        if (!address.fullName.trim()) {
            alert("Please enter full name");
            return false;
        }

        if (!/^[0-9]{10}$/.test(address.phone.trim())) {
            alert("Please enter a valid 10 digit phone number");
            return false;
        }

        if (!address.addressLine.trim()) {
            alert("Please enter address");
            return false;
        }

        if (!address.city.trim()) {
            alert("Please enter city");
            return false;
        }

        if (!address.state.trim()) {
            alert("Please enter state");
            return false;
        }

        if (!/^[0-9]{6}$/.test(address.pincode.trim())) {
            alert("Please enter a valid 6 digit pincode");
            return false;
        }

        return true;
    };

    // Save / Update address
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAddress()) {
            return;
        }

        if (!userId) {
            alert("User not logged in");
            return;
        }

        try {
            if (editingId) {
                await api.put(
                    `/addresses/${editingId}`,
                    address
                );

                alert("Address updated successfully");
            } else {
                await api.post(
                    `/addresses/user/${userId}`,
                    address
                );

                alert("Address added successfully");
            }

            resetForm();
            await loadAddresses();

        } catch (error) {
            console.error("Address operation error:", error);

            if (error.response) {
                console.error(
                    "Status:",
                    error.response.status
                );

                console.error(
                    "Backend message:",
                    error.response.data
                );
            }

            alert("Address operation failed");
        }
    };

    // Edit address
    const editAddress = (item) => {
        setAddress({
            fullName: item.fullName || "",
            phone: item.phone || "",
            addressLine: item.addressLine || "",
            city: item.city || "",
            state: item.state || "",
            pincode: item.pincode || ""
        });

        setEditingId(item.id);
        setShowForm(true);
    };

    // Delete address
    const deleteAddress = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this address?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`/addresses/${id}`);

            alert("Address deleted");

            await loadAddresses();

        } catch (error) {
            console.error("Delete error:", error);

            if (error.response) {
                console.error(
                    "Backend response:",
                    error.response.data
                );
            }

            alert("Delete failed");
        }
    };

    // Reset form
    const resetForm = () => {
        setAddress({
            fullName: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pincode: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                My Profile & Address
            </h2>

            <button
                className="btn btn-primary mb-4"
                onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}
            >
                + Add Address
            </button>

            {showForm && (
                <div className="card shadow p-4 mb-4">

                    <h4>
                        {editingId
                            ? "Edit Address"
                            : "Add New Address"}
                    </h4>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label>Full Name</label>

                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                value={address.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={address.phone}
                                onChange={handleChange}
                                maxLength="10"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Address</label>

                            <textarea
                                name="addressLine"
                                className="form-control"
                                value={address.addressLine}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row">

                            <div className="col-md-4 mb-3">
                                <label>City</label>

                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={address.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>State</label>

                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    value={address.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Pincode</label>

                                <input
                                    type="text"
                                    name="pincode"
                                    className="form-control"
                                    value={address.pincode}
                                    onChange={handleChange}
                                    maxLength="6"
                                    required
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success me-2"
                        >
                            {editingId
                                ? "Update Address"
                                : "Save Address"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            )}

            {/* Address List */}

            <div className="row">

                {addresses.map((item) => (

                    <div
                        className="col-md-6 mb-3"
                        key={item.id}
                    >

                        <div className="card shadow p-3">

                            <h5>
                                {item.fullName}
                            </h5>

                            <p>
                                📞 {item.phone}
                            </p>

                            <p>
                                {item.addressLine}
                            </p>

                            <p>
                                {item.city}, {item.state}
                            </p>

                            <p>
                                Pincode: {item.pincode}
                            </p>

                            <div>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() =>
                                        editAddress(item)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        deleteAddress(item.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default CustomerProfile;

