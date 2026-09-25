import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav
            className="navbar"
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                minHeight: "60px"
            }}
        >

            {/* My Ecommerce - Center */}
           
<h2
    style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        margin: 0,
        fontSize: "32px"
    }}
>
    My Ecommerce
</h2>
            {/* Navigation Links */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px"
                }}
            >
                <Link to="/">
                    Products
                </Link>

                <Link to="/cart">
                    Cart
                </Link>

                <Link to="/orders">
                    Orders
                </Link>

                <Link to="/admin">
                    Admin
                </Link>

                {!token && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {token && (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}
            </div>

        </nav>
    );
}

export default Navbar;