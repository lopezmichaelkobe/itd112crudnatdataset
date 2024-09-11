import React, { useEffect, useState } from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './AppStyles.css'; // Ensure your styles are imported

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const DengueCharts = () => {
  const [chartData, setChartData] = useState({
    bar: {
      labels: [],
      datasets: [
        {
          label: 'Number of Cases',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Number of Deaths',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    scatter: {
      datasets: [
        {
          label: 'Cases vs Deaths',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
  });

  const [deathsMin, setDeathsMin] = useState(0);
  const [deathsMax, setDeathsMax] = useState(0);
  const [casesMin, setCasesMin] = useState(0);
  const [casesMax, setCasesMax] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, 'dengueData');
      const dengueSnapshot = await getDocs(dengueCollection);
      const data = dengueSnapshot.docs.map((doc) => doc.data());

      // Process data for bar chart
      const locations = data.map(d => d.location);
      const cases = data.map(d => d.cases);
      const deaths = data.map(d => d.deaths);

      // Create data for scatter plot
      const scatterData = data.map(d => ({
        x: d.deaths, // X-axis: number of deaths
        y: d.cases, // Y-axis: number of cases
      }));

      // Calculate min and max for axis scaling
      const deathsValues = scatterData.map(d => d.x);
      const casesValues = scatterData.map(d => d.y);

      const newDeathsMin = Math.min(...deathsValues) -5; // Add padding
      const newDeathsMax = Math.max(...deathsValues) + 6; // Add padding
      const newCasesMin = Math.min(...casesValues) - 0; // Add padding
      const newCasesMax = Math.max(...casesValues) + 10; // Add padding

      setDeathsMin(newDeathsMin);
      setDeathsMax(newDeathsMax);
      setCasesMin(newCasesMin);
      setCasesMax(newCasesMax);

      setChartData({
        bar: {
          labels: locations,
          datasets: [
            {
              label: 'Number of Cases',
              data: cases,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Number of Deaths',
              data: deaths,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        scatter: {
          datasets: [
            {
              label: 'Cases vs Deaths',
              data: scatterData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dengue Data Visualization</h2>
      <div className="chart-container">
        <h3>Bar Chart: Cases and Deaths by Location</h3>
        <Bar
          data={chartData.bar}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Number of Cases and Deaths by Location' },
            },
          }}
        />
      </div>
      <div className="chart-container">
        <h3>Scatter Plot: Cases vs Deaths</h3>
        <Scatter
          data={chartData.scatter}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Cases vs Deaths' },
            },
            scales: {
              x: {
                title: { display: true, text: 'Number of Deaths' },
                min: deathsMin,
                max: deathsMax,
              },
              y: {
                title: { display: true, text: 'Number of Cases' },
                min: casesMin,
                max: casesMax,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DengueCharts;
