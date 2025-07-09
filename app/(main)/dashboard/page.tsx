"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

const COLORS = ["#f87171", "#60a5fa", "#34d399", "#facc15", "#c084fc"];

const Dashboard = () => {
    // const [loading, setLoading] = useState(true);
    const [spendingData, setSpendingData] = useState({
        totalSpent: 0,
        topCategory: "",
        topMethods: [] as string[],
        categoryWise: {} as Record<string, number>,
        trend: [] as { date: string; amount: number }[],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/expenses/dashboard", {
                    withCredentials: true
                });
                const data = await res.data;
                setSpendingData(data);
                console.log(data);


            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };

        setTimeout(() => {
            fetchData();

        }, 3000)
    }, []);

    const pieData = Object.entries(spendingData.categoryWise).map(([category, value]) => ({
        name: category,
        value,
    }));

    // if (loading) return <p className="p-6 text-center">Loading dashboard...</p>;

    return (
        <div className="p-6 w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h2 className="text-gray-600">Total Spent</h2>
                    <p className="text-2xl font-bold text-blue-600">₹{spendingData.totalSpent}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h2 className="text-gray-600">Top Category</h2>
                    <p className="text-2xl font-bold text-green-600">{spendingData.topCategory}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h2 className="text-gray-600">Top Payment Methods</h2>
                    <ul className="list-disc list-inside text-sm mt-1">
                        {spendingData.topMethods.map((method) => (
                            <li key={method}>{method}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-3">Category-wise Spending</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-3">Spending Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={spendingData.trend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-300 p-2 border rounded shadow text-sm">
                <p className="font-semibold text-gray-800">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-blue-600 font-extrabold">
                        {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: ₹{entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }

    return null;
};
