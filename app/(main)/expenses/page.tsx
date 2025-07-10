"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Suggestion from "@/components/Suggestion";
interface Expense {
    _id: string;
    amount: number;
    category: string;
    date: string;
    paymentMethod: string;
    notes?: string;
}
const ExpenseManager = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [form, setForm] = useState({
        amount: "",
        category: "Food",
        date: dayjs().format("YYYY-MM-DD"),
        paymentMethod: "UPI",
        notes: "",
    });
    const [filter, setFilter] = useState({ category: "", paymentMethod: "", startDate: "", q: "" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<string[]>();
    const reFetch = async () => {
        const res = await axios.get("/api/expenses/filter", {
            params: filter,
            withCredentials: true,
        });
        setExpenses(res.data);
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            const res = await axios.get("/api/expenses/filter", {
                params: filter,
                withCredentials: true,
            });
            setExpenses(res.data);
        };
        fetchExpenses();
    }, [filter]);

    useEffect(() => {
        console.log("Running");

        if (expenses.length > 0) {
            const FetchingSuggest = async () => {
                const suggestions = await sendExpensesToFlask(expenses);
                setSuggestion(suggestions);
            };
            FetchingSuggest();
        }
    }, [expenses]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingId) {
            await axios.patch(`/api/expenses/${editingId}`, form, { withCredentials: true });
        } else {
            await axios.post("/api/expenses", form, { withCredentials: true });
        }
        setForm({ amount: "", category: "Food", date: dayjs().format("YYYY-MM-DD"), paymentMethod: "UPI", notes: "" });
        setEditingId(null);





        reFetch();
    };

    const handleDelete = async (id: string) => {
        await axios.delete(`/api/expenses`, {
            withCredentials: true,
            data: {
                expenseId: id
            }
        });
        reFetch();
    };

    const handleEdit = (exp: Expense) => {
        setForm({
            amount: exp.amount.toString(),
            category: exp.category,
            date: dayjs(exp.date).format("YYYY-MM-DD"),
            paymentMethod: exp.paymentMethod,
            notes: exp.notes || "",
        });
        setEditingId(exp._id);
    };

    return (
        <div className="w-5xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-4">Manage Expenses</h1>
            {suggestion && <Suggestion suggestions={suggestion} />}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-4 shadow rounded mb-6">
                <input type="number" required placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border p-2 rounded" />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border p-2 rounded bg-gray-800">
                    <option>Food</option>
                    <option>Rent</option>
                    <option>Shopping</option>
                </select>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="border p-2 rounded" />
                <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="border p-2 rounded">
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                </select>
                <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="md:col-span-2 border p-2 rounded" />
                <button className="md:col-span-2 bg-blue-600 text-white p-2 rounded">{editingId ? "Update" : "Add"} Expense</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input placeholder="Search notes..." value={filter.q} onChange={e => setFilter({ ...filter, q: e.target.value })} className="border p-2 rounded" />
                <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} className="border p-2 rounded">
                    <option value="">All Categories</option>
                    <option>Food</option>
                    <option>Rent</option>
                    <option>Shopping</option>
                </select>
                <select value={filter.paymentMethod} onChange={e => setFilter({ ...filter, paymentMethod: e.target.value })} className="border p-2 rounded">
                    <option value="">All Methods</option>
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                </select>
                <input type="date" value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })} className="border p-2 rounded" />
            </div>

            <div className="bg-gray-950 shadow rounded p-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="p-2">Amount</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Method</th>
                            <th className="p-2">Notes</th>
                            <th className="p-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((exp: Expense) => (
                            <tr key={exp._id} className="border-b hover:bg-gray-800">
                                <td className="p-2">₹{exp.amount}</td>
                                <td className="p-2">{exp.category}</td>
                                <td className="p-2">{dayjs(exp.date).format("DD MMM YYYY")}</td>
                                <td className="p-2">{exp.paymentMethod}</td>
                                <td className="p-2">{exp.notes}</td>
                                <td className="p-2 text-right">
                                    <button onClick={() => handleEdit(exp)} className="text-blue-600 hover:underline mr-3">Edit</button>
                                    <button onClick={() => handleDelete(exp._id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseManager;

const sendExpensesToFlask = async (data: Expense[]) => {
    const expenses = data;
    console.log(data);

    try {
        const res = await axios.post("http://localhost:5000/suggestions", {
            expenses,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Suggestions:", res.data.suggestions);
        return res.data.suggestions;
    } catch (err) {
        console.error("Error getting suggestions:", err);
        return undefined;
    }
};
