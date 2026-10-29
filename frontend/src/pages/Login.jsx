import React, { useState } from "react";
import loginImage from "../assets/student.png"; // Replace with your image path
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LoginPage = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async (email, password) => {
        try {
            const res = await axios.post(
                "https://smart-mess-backend.vercel.app/api/user/login",
                { emailId: email, password },
                { withCredentials: true } // 👈 this is mandatory for cookies
            );
            // console.log(res.data.data);
            dispatch(setUser(res.data.data));
            // console.log(res.data);
            // if (res.data.data.role === "admin") {
            //     navigate("/dashboard/admin");
            // } else {
            //     navigate("/dashboard/student");
            // }
        } catch (err) {
            console.error("Login failed", err.response?.data?.message);
        }
    };
    const handleSubmit = (e, email, password) => {
        e.preventDefault();
        handleLogin(email, password);
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex">
                {/* Left - Login Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
                    <div className="w-full max-w-md space-y-6 border px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-800">Login to SmartMess</h2>
                        <form className="space-y-4" onSubmit={(e) => handleSubmit(e, email, password)}>
                            <div>
                                <label className="block text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="********"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
                            >
                                Login
                            </button>
                            <p className="mt-6 text-center text-sm">
                                Don't have an account?{" "}
                                <Link to={`/register`} className="text-blue-500">
                                    Register Here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right - Image (Hidden on small screens) */}
                <div className="hidden md:flex w-1/2 h-screen">
                    <img
                        src={loginImage}
                        alt="Mess illustration"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </>
    );
};

export default LoginPage;
