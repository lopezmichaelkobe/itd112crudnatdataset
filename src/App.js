// App.js
import React from "react";
import AddDengueData from "./AddDengueData";
import DengueDataList from "./DengueDataList";
import CsvUploader from "./CsvUploader";
import DengueCharts from "./DengueCharts"; // Import the new charts component
import "./AppStyles.css"; // Import the CSS file for styling

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dengue Data CRUD App</h1>
      </header>
      <main className="app-main">
        <div className="card">
          <AddDengueData />
        </div>
        <div className="card">
          <CsvUploader />
        </div>
        <div className="card">
          <DengueDataList />
        </div>
        <div className="card">
          <DengueCharts /> {/* Include the charts component */}
        </div>
      </main>
    </div>
  );
}

export default App;
