// CsvUploader.js
import React, { useState } from "react";
import Papa from "papaparse";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./firebase";

// Helper function to chunk the data array
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Function to handle batch upload
const handleBatchUpload = async (dataArray) => {
  const batch = writeBatch(db); // Create a Firestore batch instance
  const dengueCollection = collection(db, "dengueData");

  for (const data of dataArray) {
    const docId = `${data.location}_${data.date}`;
    const docRef = doc(dengueCollection, docId);
    batch.set(docRef, data);
  }

  try {
    await batch.commit();
    alert("Batch upload successful!");
  } catch (err) {
    console.error("Error committing batch: ", err);
    throw new Error("Error uploading batch data: " + err.message);
  }
};

const CsvUploader = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: async (result) => {
          const csvData = result.data.slice(2).map((row, index) => {
            if (row.length < 5) return null;

            const formattedDate = new Date(row[3]).toISOString();
            return {
              location: row[0],
              cases: Number(row[1]),
              deaths: Number(row[2]),
              date: formattedDate,
              regions: row[4],
              csvOrder: index + 1,
            };
          }).filter(row => row !== null);

          setData(csvData);

          const dataChunks = chunkArray(csvData, 500);

          try {
            for (const chunk of dataChunks) {
              await handleBatchUpload(chunk);
            }
            alert("All data uploaded successfully!");
          } catch (uploadError) {
            setError("Error uploading data: " + uploadError.message);
          }
        },
        error: (parseError) => setError("Error parsing CSV file: " + parseError.message),
      });
    }
  };

  return (
    <div>
      <h2>Upload Dengue Data CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Cases</th>
              <th>Deaths</th>
              <th>Date</th>
              <th>Regions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.location}</td>
                <td>{row.cases}</td>
                <td>{row.deaths}</td>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>{row.regions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CsvUploader;
