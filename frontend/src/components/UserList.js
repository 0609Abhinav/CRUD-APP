import React, { useEffect, useState, useCallback, useRef } from "react";
import { getUsers, deleteUser } from "../api";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList = () => {
  // State
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [sortConfig, setSortConfig] = useState({ field: "id", order: "DESC" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const displayedCountRef = useRef(displayedCount);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(8);
  const [loading, setLoading] = useState(false);

  const pageSizeOptions = [5, 8, 10];

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage,
        pageSize: usersPerPage,
        searchTerm: debouncedSearch,
        sortField: sortConfig.field,
        sortOrder: sortConfig.order,
      };

      const res = await getUsers(params);
      const usersArray = Array.isArray(res.data.data)
        ? res.data.data
        : Object.values(res.data.data || {});
      setUsers(usersArray);
      setTotalRecords(res.data.totalRecords || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, usersPerPage, debouncedSearch, sortConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Animated counter
  useEffect(() => {
    let start = displayedCountRef.current;
    const end = totalRecords;
    if (start === end) return;

    const increment = end > start ? 1 : -1;
    const duration = 600;
    const stepTime = Math.abs(Math.floor(duration / (end - start || 1)));

    const timer = setInterval(() => {
      start += increment;
      displayedCountRef.current = start;
      setDisplayedCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalRecords]);

  // Handlers
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch {
        alert("Error deleting user.");
      }
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
    setCurrentPage(1);
  };

  const getSortArrow = (field) => {
    if (sortConfig.field !== field) return "↕";
    return sortConfig.order === "ASC" ? "▲" : "▼";
  };

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const openModal = (user = null) => {
    setEditingUser(user);
    setShowForm(true);
    setIsClosing(false);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setEditingUser(null);
      document.body.classList.remove("modal-open");
    }, 300);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-title">UserPanel</div>
          <ul>
            <li className="active">Dashboard</li>
            <li onClick={() => openModal()}>Add Member</li>
          </ul>
        </div>
        <div>
          <button className="btn secondary" onClick={() => alert("Logged out")}>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div className="header-left">
            <h1>User Management</h1>
            <div className="record-counter">
              <span className="record-label">Total Users</span>
              <span className="record-count">{displayedCount}</span>
            </div>
          </div>

          <div className="controls">
            <input
              className="search-input"
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn primary" onClick={() => openModal()}>
              + Add Member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>ID {getSortArrow("id")}</th>
                  <th onClick={() => handleSort("name")}>Name {getSortArrow("name")}</th>
                  <th onClick={() => handleSort("email")}>Email {getSortArrow("email")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button className="btn edit" onClick={() => openModal(user)}>
                          Edit
                        </button>
                        <button className="btn delete" onClick={() => handleDelete(user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-data">
                    <td colSpan="4" className="no-data">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              ← Prev
            </button>

            <span className="page-info">
              Page{" "}
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  let page = parseInt(e.target.value, 10);
                  if (isNaN(page)) page = 1;
                  if (page < 1) page = 1;
                  if (page > totalPages) page = totalPages;
                  setCurrentPage(page);
                }}
                style={{ width: "50px", textAlign: "center" }}
              />{" "}
              of {totalPages}
            </span>

            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next →
            </button>

            <select
              value={usersPerPage}
              onChange={(e) => {
                setUsersPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              style={{ marginLeft: "10px" }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className={`modal-overlay ${isClosing ? "fade-out" : "fade-in"}`}>
            <div className={`modal-content ${isClosing ? "slide-out" : "slide-in"}`}>
              <UserForm
                fetchUsers={fetchUsers}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                closeModal={closeModal}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserList;
