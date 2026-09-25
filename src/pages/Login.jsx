import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("LOGIN RESPONSE =", response.data);
            console.log(
                "USER ID FROM RESPONSE =",
                response.data.userId
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "userId",
                response.data.userId
            );

            console.log(
                "USER ID SAVED =",
                localStorage.getItem("userId")
            );

            alert("Login successful");

            navigate("/");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    return (
        <div className="login-page">

            <h2>Login</h2>

            <form onSubmit={login}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;