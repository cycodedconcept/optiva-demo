// Chart.js
import React from 'react';
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
import { Bar, Line } from 'react-chartjs-2';

// Register necessary components for both charts
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// Bar Chart Component
export const BarChart = () => {
    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Sales',
            data: [300, 500, 100, 200, 300, 400],
            backgroundColor: '#7A0091',
            borderColor: '#7A0091',
            borderWidth: 1,
          },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
    };

    return <Bar data={barData} options={options} />;
}

// Line Chart Component
export const LineChart = () => {
    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Revenue',
            data: [400, 600, 150, 250, 350, 450],
            borderColor: '#34C759',
            backgroundColor: 'rgba(255, 87, 51, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Expenses',
            data: [320, 580, 100, 320, 410, 300],
            borderColor: '#FC0',
            backgroundColor: 'rgba(255, 87, 51, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
    };

    return <Line data={lineData} options={options} />;
}
