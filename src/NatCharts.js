import React, { useEffect, useState } from 'react';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './AppStyles.css';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement, // Ensure ArcElement is registered for pie charts
  PointElement
);

const NatCharts = () => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Average Academic Performance by IQ',
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
    }],
  });
  const [scatterChartData, setScatterChartData] = useState({
    datasets: [{
      label: 'NAT Results by Academic Performance',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 1)',
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const natCollection = collection(db, 'natData');
      const natSnapshot = await getDocs(natCollection);
      const data = natSnapshot.docs.map((doc) => doc.data());

      // Prepare data for the bar chart: average academic performance by ethnic group
      const performanceByEthnic = data.reduce((acc, curr) => {
        const ethnic = curr.ethnic;
        const performance = parseFloat(curr.academic_performance);

        if (!acc[ethnic]) {
          acc[ethnic] = { totalPerformance: 0, count: 0 };
        }

        acc[ethnic].totalPerformance += performance;
        acc[ethnic].count += 1;

        return acc;
      }, {});

      const labels = Object.keys(performanceByEthnic);
      const averages = labels.map((label) => (
        performanceByEthnic[label].totalPerformance / performanceByEthnic[label].count
      ));

      setBarChartData({
        labels,
        datasets: [{
          label: 'Average Academic Performance by Ethnic Group',
          data: averages,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      });

      // Prepare data for average academic performance by IQ category
      const performanceByIq = data.reduce((acc, curr) => {
        const iq = curr.iq; // Categorical (e.g., High, Average, Low)
        const performance = parseFloat(curr.academic_performance);

        if (!acc[iq]) {
          acc[iq] = { totalPerformance: 0, count: 0 };
        }

        acc[iq].totalPerformance += performance;
        acc[iq].count += 1;

        return acc;
      }, {});

      const iqLabels = Object.keys(performanceByIq);
      const iqAverages = iqLabels.map((label) => (
        performanceByIq[label].totalPerformance / performanceByIq[label].count
      ));

      // Set up pie chart data
      setPieChartData({
        labels: iqLabels,
        datasets: [{
          label: 'Average Academic Performance by IQ',
          data: iqAverages,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
        }],
      });

      // Prepare data for scatter plot (NAT Results by Academic Performance)
      const natResultsByPerformance = data.map((curr) => ({
        x: parseFloat(curr.academic_performance), // Academic Performance
        y: parseFloat(curr.nat_results),          // NAT Results
      }));

      // Set up scatter plot data
      setScatterChartData({
        datasets: [{
          label: 'NAT Results by Academic Performance',
          data: natResultsByPerformance,
          backgroundColor: 'rgba(54, 162, 235, 1)',
        }],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Academic Performance Analysis</h2>
      <div className="chart-container">
        <h3>Average Academic Performance by Ethnic Group</h3>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Average Academic Performance by Ethnic Group' },
            },
            scales: {
              y: {
                title: { display: true, text: 'Average Performance' },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <div className="chart-container">
        <br></br>
        <h3>Average Academic Performance by IQ</h3>
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Average Academic Performance by IQ' },
            },
          }}
        />
      </div>
      <div className="chart-container">
        <br></br>
        <br></br>
        <br></br>
        <h4>NAT Results by Academic Performance</h4>
        <Scatter
          data={scatterChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'NAT Results by Academic Performance' },
            },
            scales: {
              y: {
                title: { display: true, text: 'NAT Results' },
                beginAtZero: true,
              },
              x: {
                title: { display: true, text: 'Academic Performance' },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default NatCharts;
