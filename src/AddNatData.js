import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const AddNatData = () => {
  const [formData, setFormData] = useState({
    respondents: "",
    age: "",
    sex: "",
    ethnic: "",
    academic_performance: "", // Adjusted to match your other files
    academic_description: "",   // Adjusted to match your other files
    iq: "", // Categorical text
    type_school: "",            // Adjusted to match your other files
    socio_economic_status: "",  // Adjusted to match your other files
    study_habit: "",
    nat_results: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    const allFieldsFilled = Object.values(formData).every(field => field.trim() !== "");
    if (!allFieldsFilled) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "natData"), {
        ...formData,
        age: Number(formData.age), // Keep age as number
        // iq is now a string, so no need to convert it
      });

      // Reset form after successful submission
      setFormData({
        respondents: "",
        age: "",
        sex: "",
        ethnic: "",
        academic_performance: "", // Reset to empty string
        academic_description: "",   // Reset to empty string
        iq: "",                     // Reset to empty string
        type_school: "",            // Reset to empty string
        socio_economic_status: "",  // Reset to empty string
        study_habit: "",            // Reset to empty string
        nat_results: ""             // Reset to empty string
      });

      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add data. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="respondents"
        placeholder="Respondents"
        value={formData.respondents}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="sex"
        placeholder="Sex"
        value={formData.sex}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ethnic"
        placeholder="Ethnicity"
        value={formData.ethnic}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="academic_performance"
        placeholder="Academic Performance"
        value={formData.academic_performance}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="academic_description"
        placeholder="Academic Description"
        value={formData.academic_description}
        onChange={handleChange}
        required
      />
      <input
        type="text" // Change to text for categorical input
        name="iq"
        placeholder="IQ (High, Average, Low)"
        value={formData.iq}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="type_school"
        placeholder="Type of School"
        value={formData.type_school}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="socio_economic_status"
        placeholder="Socio-Economic Status"
        value={formData.socio_economic_status}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="study_habit"
        placeholder="Study Habit"
        value={formData.study_habit}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="nat_results"
        placeholder="NAT Results"
        value={formData.nat_results}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Data</button>
    </form>
  );
};

export default AddNatData;
