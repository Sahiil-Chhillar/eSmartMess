import React, { useState } from "react";
import registerImage from "../assets/student2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        studentRollNo: "",
        role: "student" // default role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "https://smart-mess-backend.vercel.app/api/user/register",
                formData,
                { withCredentials: true }
            );
            console.log("Registration successful", res.data);
            navigate("/login");
        } catch (err) {
            console.error("Registration failed", err.response?.data?.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                {/* Left - Register Form */}
                <div className="flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md space-y-6 border px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-gray-700 mb-1">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Roll Number</label>
                                <input
                                    name="studentRollNo"
                                    value={formData.studentRollNo}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="12212026"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Password</label>
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="********"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
                            >
                                Register
                            </button>
                            <p className="mt-6 text-center text-sm">
                                Already have an account?{" "}
                                <Link to={`/login`} className="text-blue-500">
                                    Login Here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right - Image (Hidden on small screens) */}
                <div className="hidden md:block">
                    <img
                        src={registerImage}
                        alt="Student Register"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
