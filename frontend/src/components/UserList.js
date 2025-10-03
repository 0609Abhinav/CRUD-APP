// import React, { useEffect, useState } from "react";
// import { getUsers, deleteUser } from "../api";
// import UserForm from "./UserForm";
// import "./UserList.css";

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);

//   // Modal state
//   const [showForm, setShowForm] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);

//   // Filter state
//   const [filterField, setFilterField] = useState("name");
//   const [filterValue, setFilterValue] = useState("");

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 8;

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await getUsers();
//       const sortedUsers = [...res.data].sort((a, b) => b.id - a.id); // show recent first
//       setUsers(sortedUsers);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching users.");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   //  Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await deleteUser(id);
//         fetchUsers();
//       } catch (err) {
//         console.error(err);
//         alert("Error deleting user.");
//       }
//     }
//   };

//   // Filter logic
//   const filteredUsers = users.filter((user) => {
//     if (!filterValue) return true;
//     const value = user[filterField]?.toString().toLowerCase();
//     return value.includes(filterValue.toLowerCase());
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
//   const startIndex = (currentPage - 1) * usersPerPage;
//   const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

//   const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
//   const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

//   // Reset pagination on filter change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterValue]);

//   // Modal controls
//   const openModal = (user = null) => {
//     setEditingUser(user);
//     setShowForm(true);
//     setIsClosing(false);
//     document.body.classList.add("modal-open"); // prevent background scroll
//   };

//   const closeModal = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setShowForm(false);
//       setEditingUser(null);
//       document.body.classList.remove("modal-open");
//     }, 300); 
//   };

//   return (
//     <div>
//       <h1>User Management</h1>

//       {/* Add New Member */}
  
//       <button  className="add-user-btn" style={{float: 'right',}}onClick={() => openModal()}> + Add New Member
// </button>

//       {/*  Filter */}
//       <div className="filter-container">
//         <label>Filter by:</label>
//         <select
//           value={filterField}
//           onChange={(e) => setFilterField(e.target.value)}
//         >
//           <option value="id">ID</option>
//           <option value="name">Name</option>
//           <option value="email">Email</option>
//         </select>
//         <input
//           type="text"
//           placeholder={`Search by ${filterField}`}
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//         />
//         {filterValue && (
//           <button
//             type="button"
//             className="clear-btn"
//             onClick={() => setFilterValue("")}
//           >
//             ✕
//           </button>
//         )}
//       </div>

//       {/* User Table */}
//       <table border="1" cellPadding="6" style={{ marginTop: "10px", width: "100%" }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentUsers.length > 0 ? (
//             currentUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>
//                   <button className="edit" onClick={() => openModal(user)}>
//                     Edit
//                   </button>
//                   <button className="delete" onClick={() => handleDelete(user.id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" style={{ textAlign: "center" }}>
//                 No users found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {filteredUsers.length > usersPerPage && (
//         <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
//           <button onClick={goToPreviousPage} disabled={currentPage === 1}>
//             ← Previous
//           </button>
//           <span style={{ margin: "0 10px" }}>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button onClick={goToNextPage} disabled={currentPage === totalPages}>
//             Next → 
//           </button>
//         </div>
//       )}

//       {/* Modal */}
//       {showForm && (
//         <div className={`modal-overlay ${isClosing ? "fade-out" : "fade-in"}`}>
//           <div className={`modal-content ${isClosing ? "slide-out" : "slide-in"}`}>
//             <UserForm
//               fetchUsers={fetchUsers} 
//               editingUser={editingUser}
//               setEditingUser={setEditingUser}
//               closeModal={closeModal}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;


// import React, { useEffect, useState } from "react";
// import { getUsers, deleteUser } from "../api";
// import UserForm from "./UserForm";
// import "./UserList.css";

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);

//   // Modal state
//   const [showForm, setShowForm] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);

//   // Filter state
//   const [filterField, setFilterField] = useState("name");
//   const [filterValue, setFilterValue] = useState("");

//   // Search state (box on right side)
//   const [searchTerm, setSearchTerm] = useState("");

//   // Sorting state
//   const [sortConfig, setSortConfig] = useState({ key: null, mode: null }); 
//   // mode: "alphabetical" | "original" | null

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 8;

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await getUsers();
//       const sortedUsers = [...res.data].sort((a, b) => b.id - a.id); // default: latest first
//       setUsers(sortedUsers);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching users.");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await deleteUser(id);
//         fetchUsers();
//       } catch (err) {
//         console.error(err);
//         alert("Error deleting user.");
//       }
//     }
//   };

//   //  Filter logic (based on dropdown)
//   const filteredUsers = users.filter((user) => {
//     if (!filterValue) return true;
//     const value = user[filterField]?.toString().toLowerCase();
//     return value.includes(filterValue.toLowerCase());
//   });

//   // Search logic (box on right, searches all fields)
//   const searchedUsers = filteredUsers.filter((user) => {
//     if (!searchTerm) return true;
//     const term = searchTerm.toLowerCase();
//     return (
//       user.id.toString().includes(term) ||
//       user.name?.toLowerCase().includes(term) ||
//       user.email?.toLowerCase().includes(term)
//     );
//   });

//   // Sorting Logic
//   const sortedUsers = [...searchedUsers].sort((a, b) => {
//     if (!sortConfig.key) return 0;

//     const { key, mode } = sortConfig;

//     if (mode === "alphabetical") {
//       const aVal = a[key]?.toString().toLowerCase();
//       const bVal = b[key]?.toString().toLowerCase();
//       if (aVal < bVal) return -1;
//       if (aVal > bVal) return 1;
//       return 0;
//     }

//     if (mode === "original") {
//       // Sort by date entered → assuming higher ID = later
//       return b.id - a.id;
//     }

//     return 0;
//   });

//   // Sorting toggle: Alphabetical → Original → Alphabetical ...
//   const handleSort = (key) => {
//     setSortConfig((prev) => {
//       if (prev.key === key) {
//         // Toggle between alphabetical and original
//         if (prev.mode === "alphabetical") return { key, mode: "original" };
//         else return { key, mode: "alphabetical" };
//       } else {
//         return { key, mode: "alphabetical" };
//       }
//     });
//   };

//   const getSortArrow = (key) => {
//     if (sortConfig.key !== key) return "↕";
//     if (sortConfig.mode === "alphabetical") return "▲";
//     if (sortConfig.mode === "original") return "▼";
//     return "↕";
//   };

//   // Pagination
//   const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
//   const startIndex = (currentPage - 1) * usersPerPage;
//   const currentUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

//   const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
//   const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterValue, searchTerm]);

//   // Modal controls
//   const openModal = (user = null) => {
//     setEditingUser(user);
//     setShowForm(true);
//     setIsClosing(false);
//     document.body.classList.add("modal-open");
//   };

//   const closeModal = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setShowForm(false);
//       setEditingUser(null);
//       document.body.classList.remove("modal-open");
//     }, 300);
//   };

//   return (
//     <div>
//       <h1>User Management</h1>

//       {/* 🔸 Top Bar (Filter + Search + Add) */}
//       <div
//         className="top-bar"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "10px",
//           gap: "10px",
//         }}
//       >
//         {/* Filter */}
//         <div className="filter-container" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//           <label>Filter by:</label>
//           <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//             <option value="id">ID</option>
//             <option value="name">Name</option>
//             <option value="email">Email</option>
//           </select>
//           <input
//             type="text"
//             placeholder={`Search by ${filterField}`}
//             value={filterValue}
//             onChange={(e) => setFilterValue(e.target.value)}
//           />
//           {filterValue && (
//             <button type="button" className="clear-btn" onClick={() => setFilterValue("")}>
//               ✕
//             </button>
//           )}
//         </div>

//         {/* Search box on right side */}
//         <div className="right-controls" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <input
//             type="text"
//             placeholder="Search all fields..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ padding: "8px", fontSize: "14px" }}
//           />
//           <button className="add-user-btn" onClick={() => openModal()}>
//             + Add New Member
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <table border="1" cellPadding="6" style={{ width: "100%", marginTop: "10px" }}>
//         <thead>
//           <tr>
//             <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
//               ID {getSortArrow("id")}
//             </th>
//             <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
//               Name {getSortArrow("name")}
//             </th>
//             <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
//               Email {getSortArrow("email")}
//             </th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentUsers.length > 0 ? (
//             currentUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>
//                   <button className="edit" onClick={() => openModal(user)}>
//                     Edit
//                   </button>
//                   <button className="delete" onClick={() => handleDelete(user.id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" style={{ textAlign: "center" }}>
//                 No users found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {sortedUsers.length > usersPerPage && (
//         <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
//           <button onClick={goToPreviousPage} disabled={currentPage === 1}>
//             ← Previous
//           </button>
//           <span style={{ margin: "0 10px" }}>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button onClick={goToNextPage} disabled={currentPage === totalPages}>
//             Next →
//           </button>
//         </div>
//       )}

//       {/* Modal */}
//       {showForm && (
//         <div className={`modal-overlay ${isClosing ? "fade-out" : "fade-in"}`}>
//           <div className={`modal-content ${isClosing ? "slide-out" : "slide-in"}`}>
//             <UserForm
//               fetchUsers={fetchUsers}
//               editingUser={editingUser}
//               setEditingUser={setEditingUser}
//               closeModal={closeModal}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Filter state
  const [filterField, setFilterField] = useState("name");
  const [filterValue, setFilterValue] = useState("");

  // Search state (box on right side)
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, mode: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

 
  const [fetchAll, setFetchAll] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await getUsers(fetchAll); // pass flag to API
      const sortedUsers = [...res.data].sort((a, b) => b.id - a.id);
      setUsers(sortedUsers);
    } catch (err) {
      console.error(err);
      alert("Error fetching users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchAll]);

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Error deleting user.");
      }
    }
  };

  // Filter logic
  const filteredUsers = users.filter((user) => {
    if (!filterValue) return true;
    const value = user[filterField]?.toString().toLowerCase();
    return value.includes(filterValue.toLowerCase());
  });

  // Search logic
  const searchedUsers = filteredUsers.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.id.toString().includes(term) ||
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  // Sorting Logic
  const sortedUsers = [...searchedUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const { key, mode } = sortConfig;

    if (mode === "alphabetical") {
      const aVal = a[key]?.toString().toLowerCase();
      const bVal = b[key]?.toString().toLowerCase();
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    }

    if (mode === "original") {
      return b.id - a.id;
    }

    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.mode === "alphabetical") return { key, mode: "original" };
        else return { key, mode: "alphabetical" };
      } else {
        return { key, mode: "alphabetical" };
      }
    });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    if (sortConfig.mode === "alphabetical") return "▲";
    if (sortConfig.mode === "original") return "▼";
    return "↕";
  };

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValue, searchTerm]);

  // Modal controls
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
    <div>
      <h1>User Management</h1>

      {/* 🔸 Top Bar */}
      <div
        className="top-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          gap: "10px",
        }}
      >
        {/* Filter */}
        <div className="filter-container" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <label>Filter by:</label>
          <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${filterField}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          {filterValue && (
            <button type="button" className="clear-btn" onClick={() => setFilterValue("")}>
              ✕
            </button>
          )}
        </div>

        {/* Search + Add + Load toggle */}
        <div className="right-controls" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", fontSize: "14px" }}
          />
          <button className="add-user-btn" onClick={() => openModal()}>
            + Add New Member
          </button>
          <button
            className="load-btn"
            onClick={() => setFetchAll((prev) => !prev)}
          >
            {fetchAll ? "Show Last 10" : "Load All"}
          </button>
        </div>
      </div>

      {/* Table */}
      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID {getSortArrow("id")}
            </th>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {getSortArrow("name")}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {getSortArrow("email")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="edit" onClick={() => openModal(user)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {sortedUsers.length > usersPerPage && (
        <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            ← Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next →
          </button>
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
    </div>
  );
};

export default UserList;
