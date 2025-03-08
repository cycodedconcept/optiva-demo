import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSalesChart } from '../../features/reportSlice';
import { getDashData } from '../../features/dashboardSlice';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

// Register necessary components for both bar and line charts
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export const MixedChart = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");

    const { item } = useSelector((state) => state.dashboard);

    useEffect(() => {
        if (token) {
            dispatch(getDashData({ token, shop_id: getId }));
        }
    }, [dispatch, token]);

    // Ensure there is data before mapping
    const labels = item?.barChartData?.map((item) => item.date) || [];
    const barDataValues = item?.barChartData?.map((item) => item.Unpaid) || [];
    const barDataValues2 = item?.barChartData?.map((item) => item.Paid) || [];


    const data = {
        labels,
        datasets: [
              {
                type: 'bar',
                label: 'Paid Sales',
                data: barDataValues2,
                borderColor: '#840a9c',
                backgroundColor: "#840a9c",
                fill: true,
                tension: 0.4,
            },
            {
                type: 'bar',
                label: 'Unpaid Sales',
                data: barDataValues,
                backgroundColor: '#5965F9',
                borderColor: '#5965F9',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "top" },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "400px" }}>
            <Chart type="bar" data={data} options={options} />
        </div>
    );
};

export const LineChart = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");
    const { salesCard } = useSelector((state) => state.report);

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    useEffect(() => {
        if (token) {
            dispatch(getSalesChart({ token, shop_id: getId, month: month, year: year }))
        }
    }, [token, dispatch]);

    const labels = salesCard?.yearlySales?.map((item) => item.monthName) || [];
    const data = salesCard?.yearlySales?.map((item) => item.totalSales) || [];

    if (labels.length === 0 || data.length === 0) {
        return <p>No data available for the chart.</p>;
    }

    const lineData = {
        labels,
        datasets: [
            {
                label: "Total Purchases",
                data,
                borderColor: "#34C759",
                backgroundColor: "rgba(52, 199, 89, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "top" },
        },
    };

    return (
        <div style={{ width: "100%", height: "400px" }}>
            <Line data={lineData} options={options} />
        </div>
    );
};
