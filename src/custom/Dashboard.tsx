import { BasePayload, getPayload, type AdminViewServerProps } from "payload";
import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "./card";
import config from "@payload-config";
import SalesChart from "./sales-chart";
import { Order } from "@/payload-types";

const baseClass = "dashboard";

// Helper: Format currency
const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

// Helper: Calculate percentage change
const calculatePercentageChange = (
    current: number,
    previous: number
): string => {
    if (previous === 0) return current > 0 ? "+100%" : "N/A";
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
};

// Helper: Fetch orders within a date range
const fetchOrders = async (
    payload: BasePayload,
    startDate: Date,
    endDate: Date
) => {
    const result = await payload.find({
        collection: "orders",
        where: {
            createdAt: {
                greater_than: startDate.toISOString(),
                less_than: endDate.toISOString(),
            },
        },
        sort: "createdAt",
        pagination: false,
    });
    return result.docs;
};

const Dashboard = async (props: AdminViewServerProps) => {
    const payload = await getPayload({ config });

    const now = new Date();
    const getMonthRange = (monthOffset: number) => {
        const start = new Date(
            now.getFullYear(),
            now.getMonth() + monthOffset,
            1
        );
        const end = new Date(
            now.getFullYear(),
            now.getMonth() + monthOffset + 1,
            0,
            23,
            59,
            59,
            999
        );
        return { start, end };
    };

    const { start: currentStart, end: currentEnd } = getMonthRange(0);
    const { start: lastStart, end: lastEnd } = getMonthRange(-1);

    // Fetch current & last month orders
    const [currentOrders, lastOrders] = await Promise.all([
        fetchOrders(payload, currentStart, currentEnd),
        fetchOrders(payload, lastStart, lastEnd),
    ]);

    // Compute metrics
    const computeMetrics = (orders: any[]) => {
        const totalOrders = orders.length;
        const totalAmount = orders.reduce(
            (acc, order) => acc + order.totalAmount,
            0
        );
        const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
        const totalProfit = totalAmount * 0.05; // Assume 5% profit margin
        const lifetimeValue = avgOrderValue * 10; // Assume avg. customer orders 10 times

        return {
            totalOrders,
            totalAmount,
            avgOrderValue,
            totalProfit,
            lifetimeValue,
        };
    };

    const currentMetrics = computeMetrics(currentOrders);
    const lastMetrics = computeMetrics(lastOrders);

    // Generate chart data from real order history
    const salesData = currentOrders.map((order: Order) => ({
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        revenue: order.totalAmount,
        orders: 1,
        profit: +(order.totalAmount * 0.05).toFixed(2),
    }));

    return (
        <>
            <h2 className={`${baseClass}__label`}>ShopNex</h2>
            <ul
                className={`${baseClass}__card-list`}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                }}
            >
                <li>
                    <Card>
                        <CardHeader>Total Profit</CardHeader>
                        <CardBody>
                            {formatCurrency(currentMetrics.totalProfit)}
                        </CardBody>
                        <CardFooter>
                            {calculatePercentageChange(
                                currentMetrics.totalProfit,
                                lastMetrics.totalProfit
                            )}
                        </CardFooter>
                    </Card>
                </li>
                <li>
                    <Card>
                        <CardHeader>Avg. Order Value</CardHeader>
                        <CardBody>
                            {formatCurrency(currentMetrics.avgOrderValue)}
                        </CardBody>
                        <CardFooter>
                            {calculatePercentageChange(
                                currentMetrics.avgOrderValue,
                                lastMetrics.avgOrderValue
                            )}
                        </CardFooter>
                    </Card>
                </li>
                <li>
                    <Card>
                        <CardHeader>Total Orders</CardHeader>
                        <CardBody>
                            {currentMetrics.totalOrders.toString()}
                        </CardBody>
                        <CardFooter>
                            {calculatePercentageChange(
                                currentMetrics.totalOrders,
                                lastMetrics.totalOrders
                            )}
                        </CardFooter>
                    </Card>
                </li>
                <li>
                    <Card>
                        <CardHeader>Lifetime Value</CardHeader>
                        <CardBody>
                            {formatCurrency(currentMetrics.lifetimeValue)}
                        </CardBody>
                        <CardFooter>
                            {calculatePercentageChange(
                                currentMetrics.lifetimeValue,
                                lastMetrics.lifetimeValue
                            )}
                        </CardFooter>
                    </Card>
                </li>
            </ul>
            <SalesChart data={salesData} />
        </>
    );
};

export default Dashboard;
