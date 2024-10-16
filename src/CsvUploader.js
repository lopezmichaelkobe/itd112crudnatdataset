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
  const natCollection = collection(db, "natData");

  for (const data of dataArray) {
    const docId = `${data.respondents}_${data.age}`; // Adjust docId to fit the new structure
    const docRef = doc(natCollection, docId);
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
            if (row.length < 11) return null; // Adjust based on number of columns

            const iqValue = row[6];
            const validIqValues = ["High", "Average", "Low"]; // Define valid IQ categories
            if (!validIqValues.includes(iqValue)) {
              setError(`Invalid IQ value "${iqValue}" at row ${index + 3}. Please use "High", "Average", or "Low".`);
              return null; // Skip this row
            }

            return {
              respondents: row[0],
              age: Number(row[1]),
              sex: row[2],
              ethnic: row[3],
              academic_performance: row[4],
              academic_description: row[5],
              iq: iqValue, // Use the categorical IQ value
              type_school: row[7],
              socio_economic_status: row[8],
              study_habit: row[9],
              nat_results: row[10],
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
      <h2>Upload NAT Data CSV</h2>
      <h3>Make sure to refresh the site after all of the necessary data have been successfully uploaded.</h3>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Respondents</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Ethnic</th>
              <th>Academic Performance</th>
              <th>Academic Description</th>
              <th>IQ</th>
              <th>Type of School</th>
              <th>Socio-Economic Status</th>
              <th>Study Habit</th>
              <th>NAT Results</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.respondents}</td>
                <td>{row.age}</td>
                <td>{row.sex}</td>
                <td>{row.ethnic}</td>
                <td>{row.academic_performance}</td>
                <td>{row.academic_description}</td>
                <td>{row.iq}</td>
                <td>{row.type_school}</td>
                <td>{row.socio_economic_status}</td>
                <td>{row.study_habit}</td>
                <td>{row.nat_results}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CsvUploader;
