"use client";

import type React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export type SalesData = {
    date: string;
    revenue: number;
    orders: number;
    profit: number;
};

type Props = {
    data: SalesData[];
    strokeWidth?: number;
};

const SalesChart: React.FC<Props> = ({ data, strokeWidth = 2 }) => {
    return (
        <div className="sales-chart bg-white rounded-lg shadow-md p-6" style={{ marginTop: '2rem'}}>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Sales Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: -10, left: -20, bottom: 10 }}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="#e0e0e0"
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={{ stroke: "#d1d5db" }}
                        tickLine={{ stroke: "#d1d5db" }}
                        interval="preserveStartEnd"
                        angle={-25}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={{ stroke: "#d1d5db" }}
                        tickLine={{ stroke: "#d1d5db" }}
                    >
                    </YAxis>
                    <Tooltip
                        cursor={{ stroke: "#374151", strokeWidth: 2 }}
                        contentStyle={{
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "4px",
                            padding: "8px",
                        }}
                        itemStyle={{ color: "#374151" }}
                    />
                    <Legend
                        wrapperStyle={{ padding: "10px", fontSize: "14px" }}
                        iconType="circle"
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-blue-500)"
                        strokeWidth={strokeWidth}
                        dot={false}
                        name="Revenue"
                    />
                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#5fe385"
                        strokeWidth={strokeWidth}
                        dot={false}
                        name="Orders"
                    />
                    <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#f59e0b" // Orange for Profit
                        strokeWidth={strokeWidth}
                        dot={false}
                        name="Profit"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
