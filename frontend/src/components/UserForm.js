import React, { useEffect, useState } from "react";
import { createUser, updateUser } from "../api";
import "./UserForm.css"; // Add custom styles

const UserForm = ({ fetchUsers, editingUser, setEditingUser, closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { name, email });
        alert(`User record updated successfully!`);
        setEditingUser(null);
      } else {
        await createUser({ name, email });
        alert(`New user "${name}" added successfully!`);
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error saving user. Please check console.");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    closeModal();
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="user-form">
        <h3>{editingUser ? "Edit User" : "Add User"}</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="form-buttons">
          <button type="submit" className="btn primary">
            {editingUser ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
