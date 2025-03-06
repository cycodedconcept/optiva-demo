
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSalesChart } from '../../features/reportSlice'
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
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const { loading, error, salesCard } = useSelector((state) => state.report);

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  useEffect(() => {
      if (token) {
          dispatch(getSalesChart({token, shop_id: getId, month: month, year: year}))
      }
  }, [token, dispatch])

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];


  const labels = salesCard.yearlySales?.map((item) => item.monthName);
  const data = salesCard.yearlySales?.map((item) => item.totalSales);


  if (labels?.length === 0 || data?.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  // Chart configuration
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
}
