"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type Budget = {
    category: string,
    spent: number,
    limit: number,
    percent: number,
    status: string,
    month: string
}

const BudgetManager = () => {
    const [budgets, setBudgets] = useState([]);
    const [Allbudgets, setAllBudgets] = useState([]);
    const [form, setForm] = useState({
        category: "Food",
        month: new Date().toISOString().slice(0, 7),
        limit: "",
    });

    const fetchBudgets = async () => {
        const res = await axios.get("/api/budget/alerts", { withCredentials: true });
        setBudgets(res.data);
        console.log("data", res.data)
        const resAll = await axios.get("/api/budget", { withCredentials: true });
        setAllBudgets(resAll.data);
        console.log("All data", resAll.data);

    };



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await axios.post("/api/budget", form, { withCredentials: true });
        setForm({ ...form, limit: "" });
        fetchBudgets();
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    return (
        <div className="w-4xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-4">Set Monthly Budgets</h1>

            <form onSubmit={handleSubmit} className="flex gap-3 mb-6 flex-wrap bg-gray-900 p-4 shadow rounded">
                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border p-2 rounded bg-gray-900 flex-1"
                >
                    <option>Food</option>
                    <option>Rent</option>
                    <option>Shopping</option>
                </select>
                <input
                    type="month"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    className="border p-2 rounded flex-1"
                />
                <input
                    type="number"
                    placeholder="Limit (₹)"
                    value={form.limit}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                    className="border py-2  rounded flex-1"
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded flex-1">Save</button>
            </form>

            <h2 className="text-lg font-medium mb-2">Budget Alerts</h2>
            <ul className="space-y-2">
                {budgets.map((b: Budget, idx) => (
                    <li
                        key={idx}
                        className={`p-3 rounded shadow text-sm flex justify-between items-center ${b.status === "over"
                            ? "bg-red-100 text-red-800"
                            : b.status === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                    >
                        <div>
                            <strong>{b.category}</strong>({dayjs(b.month).format("MMM YYYY")}): ₹{b.spent} of ₹{b.limit} used
                        </div>
                        <span className="text-xs">
                            {b.status === "over"
                                ? "🚨 Over budget"
                                : b.status === "warning"
                                    ? "⚠️ Nearing limit"
                                    : "✅ Within budget"}
                        </span>
                    </li>
                ))}
            </ul>

            <h2 className="text-lg font-medium my-2">All Budget</h2>
            <ul className="space-y-2">
                {Allbudgets.map((b: Budget, idx) => (
                    <li
                        key={idx}
                        className={`p-3 rounded shadow text-sm flex justify-between items-center ${b.status === "over"
                            ? "bg-red-100 text-red-800"
                            : b.status === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                    >
                        <div>
                            <strong>{b.category}</strong>({dayjs(b.month).format("MMM YYYY")}): ₹{b.spent} of ₹{b.limit} used
                        </div>
                        <span className="text-xs">
                            {b.status === "over"
                                ? "🚨 Over budget"
                                : b.status === "warning"
                                    ? "⚠️ Nearing limit"
                                    : "✅ Within budget"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BudgetManager;
