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
        <div className="sales-chart">
            <h3 className="sales-chart__title">Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: -10, left: -20, bottom: 10 }}
                >
                    <CartesianGrid vertical={false} stroke="var(--theme-border-color)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-blue-500)"
                        strokeWidth={strokeWidth}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#5fe385"
                        strokeWidth={strokeWidth}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="var(--color-warning-500)"
                        strokeWidth={strokeWidth}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
