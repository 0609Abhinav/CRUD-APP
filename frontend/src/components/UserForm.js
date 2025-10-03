import React, { useEffect, useState } from "react";
import { createUser, updateUser } from "../api";

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
        // alert(`User "${name}" updated successfully!`);
        alert(`User Record updated successfully!`);
        setEditingUser(null);
      } else {
        await createUser({ name, email });
        alert(`New user "${name}" added successfully!`);
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(" Error saving user. Please check console.");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    closeModal();
  };

  return (
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
        <button type="submit">{editingUser ? "Update" : "Add"}</button>
        <button
          type="button"
          onClick={handleCancel}
          style={{ backgroundColor: "#999" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
