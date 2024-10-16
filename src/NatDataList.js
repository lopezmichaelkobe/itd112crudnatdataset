import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./NatDataList.css"; // Import the CSS file for styling

const NatDataList = () => {
  const [natData, setNatData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    respondents: "",
    age: "",
    sex: "",
    ethnic: "",
    academic_performance: "",
    academic_description: "",
    iq: "", // Keep as text for categorical data
    type_school: "",
    socio_economic_status: "",
    study_habit: "",
    nat_results: "",
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const natCollection = collection(db, "natData");
      const natSnapshot = await getDocs(natCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched data:", dataList); // Debugging line

      dataList.sort((a, b) => a.respondents - b.respondents);
      setNatData(dataList);
      setDataLoaded(true);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const natDocRef = doc(db, "natData", id);
    try {
      await deleteDoc(natDocRef);
      setNatData(natData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      respondents: data.respondents,
      age: data.age,
      sex: data.sex,
      ethnic: data.ethnic,
      academic_performance: data.academic_performance,
      academic_description: data.academic_description,
      iq: data.iq, // Keep as text for categorical data
      type_school: data.type_school,
      socio_economic_status: data.socio_economic_status,
      study_habit: data.study_habit,
      nat_results: data.nat_results,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const natDocRef = doc(db, "natData", editingId);
    try {
      await updateDoc(natDocRef, {
        respondents: editForm.respondents,
        age: Number(editForm.age),
        sex: editForm.sex,
        ethnic: editForm.ethnic,
        academic_performance: editForm.academic_performance,
        academic_description: editForm.academic_description,
        iq: editForm.iq, // Keep as text for categorical data
        type_school: editForm.type_school,
        socio_economic_status: editForm.socio_economic_status,
        study_habit: editForm.study_habit,
        nat_results: editForm.nat_results,
      });
      setNatData(natData.map((data) =>
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
    <div className="nat-data-list-container">
      <h2>NAT Data List</h2>
      <button onClick={toggleTableVisibility} className="toggle-table-button">
        {tableVisible ? "Minimize Table" : "Maximize Table"}
      </button>
      {editingId ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            type="text"
            placeholder="Respondents"
            value={editForm.respondents}
            onChange={(e) => setEditForm({ ...editForm, respondents: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={editForm.age}
            onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Sex"
            value={editForm.sex}
            onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Ethnic"
            value={editForm.ethnic}
            onChange={(e) => setEditForm({ ...editForm, ethnic: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Academic Performance"
            value={editForm.academic_performance}
            onChange={(e) => setEditForm({ ...editForm, academic_performance: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Academic Description"
            value={editForm.academic_description}
            onChange={(e) => setEditForm({ ...editForm, academic_description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="IQ (High, Average, Low)"
            value={editForm.iq} // Keep as text for categorical data
            onChange={(e) => setEditForm({ ...editForm, iq: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Type of School"
            value={editForm.type_school}
            onChange={(e) => setEditForm({ ...editForm, type_school: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Socio-Economic Status"
            value={editForm.socio_economic_status}
            onChange={(e) => setEditForm({ ...editForm, socio_economic_status: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Study Habit"
            value={editForm.study_habit}
            onChange={(e) => setEditForm({ ...editForm, study_habit: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="NAT Results"
            value={editForm.nat_results}
            onChange={(e) => setEditForm({ ...editForm, nat_results: e.target.value })}
            required
          />
          <button type="submit">Update Data</button>
          <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        dataLoaded && tableVisible && (
          <div className="table-container">
            <table className="nat-data-table">
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
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {natData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.respondents}</td>
                    <td>{data.age}</td>
                    <td>{data.sex}</td>
                    <td>{data.ethnic}</td>
                    <td>{data.academic_performance}</td>
                    <td>{data.academic_description}</td>
                    <td>{data.iq}</td> {/* Keep as text for categorical data */}
                    <td>{data.type_school}</td>
                    <td>{data.socio_economic_status}</td>
                    <td>{data.study_habit}</td>
                    <td>{data.nat_results}</td>
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

export default NatDataList;
