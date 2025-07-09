"use client";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import SidebarItem from "./SideBarItem";

const items = [
    {
        activelogo: "/assets/dashboard/sidebar/dashboard_blue.svg",
        text: "Dashboard",
        inactivelogo: "/assets/dashboard/sidebar/dashboard.svg",
        path: "/dashboard",
    },
    {
        activelogo: "/assets/dashboard/sidebar/allemployees_blue.svg",
        text: "Expenses",
        inactivelogo: "/assets/dashboard/sidebar/allemployees.svg",
        path: "/expenses",
    },
    {
        activelogo: "/assets/dashboard/sidebar/allleads_blue.svg",
        text: "Budget",
        inactivelogo: "/assets/dashboard/sidebar/allleads.svg",
        path: "/budget",
    }
];

export default function Sidebar({ className = "" }: { className?: string }) {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3001/hr/logout", {}, { withCredentials: true });
            localStorage.removeItem("authToken");
            alert("Logged out successfully!");
            router.push("/signin");
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>
            alert(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className={`top-0 left-0 w-96 ${className}`}>
            <div className="m-4 rounded-xl border border-slate-700 bg-gray-700">
                <div className="flex p-6 items-center gap-3">
                    {/* <img src="/assets/Logo.svg" alt="Logo" className="w-8 h-8" /> */}
                    <p className="text-3xl font-bold tracking-wide">HRMS</p>
                </div>

                <div className="h-screen p-6">
                    {items.map(item => (
                        <SidebarItem
                            key={item.text}
                            text={item.text}
                            activeicon={item.activelogo}
                            inactiveicon={item.inactivelogo}
                            path={item.path}
                        />
                    ))}

                    <div
                        className="flex w-full items-center border-l-2 text-gray-500 px-5 py-2 mb-4 gap-4 hover:bg-gray-200 cursor-pointer"
                        onClick={handleLogout}
                    >
                        {/* <img src="/assets/dashboard/sidebar/setting.svg" alt="Logout" className="w-5 h-5" /> */}
                        <span className="text-md">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
