import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./DengueDataList.css"; // Import the CSS file for styling

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [dataLoaded, setDataLoaded] = useState(false); // New state to track data loading
  const [tableVisible, setTableVisible] = useState(true); // State to toggle table visibility

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched data:", dataList); // Debugging line

      // Sort data based on csvOrder
      dataList.sort((a, b) => a.csvOrder - b.csvOrder);
      setDengueData(dataList);
      setDataLoaded(true); // Set dataLoaded to true once data is fetched
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      setDengueData(dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const toggleTableVisibility = () => {
    setTableVisible(!tableVisible);
  };

  return (
    <div className="dengue-data-list-container">
      <h2>Dengue Data List</h2>
      <button onClick={toggleTableVisibility} className="toggle-table-button">
        {tableVisible ? "Minimize Table" : "Maximize Table"}
      </button>
      {editingId ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            type="text"
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={editForm.cases}
            onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={editForm.deaths}
            onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={editForm.regions}
            onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
            required
          />
          <button type="submit">Update Data</button>
          <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        dataLoaded && tableVisible && (
          <div className="table-container">
            <table className="dengue-data-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Cases</th>
                  <th>Deaths</th>
                  <th>Date</th>
                  <th>Regions</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dengueData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.location}</td>
                    <td>{data.cases}</td>
                    <td>{data.deaths}</td>
                    <td>{new Date(data.date).toLocaleDateString()}</td>
                    <td>{data.regions}</td>
                    <td>
                      <button onClick={() => handleEdit(data)}>Edit</button>
                      <button onClick={() => handleDelete(data.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default DengueDataList;
