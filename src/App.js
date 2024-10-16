// App.js
import React from "react";
import AddNatData from "./AddNatData";
import NatDataList from "./NatDataList";
import CsvUploader from "./CsvUploader";
import NatCharts from "./NatCharts"; // Import the new charts component
import "./AppStyles.css"; // Import the CSS file for styling

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Nat Data CRUD App</h1>
      </header>
      <main className="app-main">
        <div className="card">
          <AddNatData />
        </div>
        <div className="card">
          <CsvUploader />
        </div>
        <div className="card">
          <NatDataList />
        </div>
        <div className="card">
          <NatCharts /> {/* Include the charts component */}
        </div>
      </main>
    </div>
  );
}

export default App;
