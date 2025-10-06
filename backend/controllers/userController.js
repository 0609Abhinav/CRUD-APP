// const catchAsync = require("../utils/catchAsync");
// const httpStatus = require('http-status-codes')
// const ApiError = require("../utils/ApiError");
// const { Op, QueryTypes } = require("sequelize");
// const User = require("../models/User");
// const sequelize = require("../db");

// // CREATE USER
// exports.createUser = catchAsync(async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Name and email are required");
//   }

//   const existingUser = await User.findOne({ where: { email } });
//   if (existingUser) {
//     throw new ApiError(httpStatus.CONFLICT, "Email already exists");
//   }

//   const user = await User.create({ name, email });

//   res.status(httpStatus.CREATED).json({
//     status: "success",
//     data: user,
//   });
// });

// // // GET USERS (search, sort, pagination)
// // exports.getUsers = catchAsync(async (req, res) => {
// //   const {
// //     pageNumber = 1,
// //     pageSize = 10,
// //     searchTerm = "",
// //     sortField = "name",
// //     sortOrder = "DESC",
// //   } = req.query;

// //   const offset = (parseInt(pageNumber) - 1) * parseInt(pageSize);
// //   const limit = parseInt(pageSize);

// //   const where = searchTerm
// //     ? { name: { [Op.like]: `%${searchTerm}%` } }
// //     : {};

// //   const { count, rows } = await User.findAndCountAll({
// //     where,
// //     order: [[sortField, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
// //     offset,
// //     limit,
// //   });

// //   res.status(httpStatus.OK).json({
// //     status: "success",
// //     data: rows,
// //     totalRecords: count,
// //     totalPages: Math.ceil(count / limit),
// //   });
// // });
// // GET USERS using Stored Procedure
// exports.getUsers = catchAsync(async (req, res) => {
//   const {
//     pageNumber = 1,
//     pageSize = 10,
//     searchTerm = "",
//     sortField = "name",
//     sortOrder = "DESC",
//   } = req.query;

//   const users = await sequelize.query(
//     "CALL sp_get_users(:pageNumber, :pageSize, :searchTerm, :sortField, :sortOrder)",
//     {
//       replacements: {
//         pageNumber: parseInt(pageNumber),
//         pageSize: parseInt(pageSize),
//         searchTerm: searchTerm || "",
//         sortField: sortField || "id",
//         sortOrder: sortOrder || "DESC",
//       },
//       type: QueryTypes.RAW,
//     }
//   );

//   // Stored procedure returns two result sets:
//   // 1. User data (array)
//   // 2. Pagination info (totalRecords, totalPages)

//   // Depending on your MySQL driver, results may come as a flat array
//   // or nested result sets. We'll handle both cases:
//   const [userData, metaData] = Array.isArray(users[0]) ? users : [users, []];

//   const pagination = metaData && metaData.length > 0 ? metaData[0] : { totalRecords: 0, totalPages: 0 };

//   res.status(httpStatus.OK).json({
//     status: "success",
//     data: userData,
//     totalRecords: pagination.totalRecords || 0,
//     totalPages: pagination.totalPages || 0,
//   });
// });

// //  GET USER BY ID
// exports.getUserById = catchAsync(async (req, res) => {
//   const user = await User.findByPk(req.params.id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   res.status(httpStatus.OK).json({
//     status: "success",
//     data: user,
//   });
// });

// //  UPDATE USER
// exports.updateUser = catchAsync(async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Name and email are required");
//   }

//   const existingUser = await User.findOne({
//     where: { email, id: { [Op.ne]: req.params.id } },
//   });

//   if (existingUser) {
//     throw new ApiError(httpStatus.CONFLICT, "Email already exists");
//   }

//   const [updated] = await User.update(
//     { name, email },
//     { where: { id: req.params.id } }
//   );
//   if (!updated) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }

//   const updatedUser = await User.findByPk(req.params.id);
//   res.status(httpStatus.OK).json({
//     status: "success",
//     data: updatedUser,
//   });
// });

// //  SOFT DELETE USER
// exports.deleteUser = catchAsync(async (req, res) => {
//   const [deleted] = await User.update(
//     { is_deleted: true },
//     { where: { id: req.params.id } }
//   );

//   if (!deleted) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }

//   res.status(httpStatus.OK).json({
//     status: "success",
//     message: `User ${req.params.id} soft deleted`,
//   });
// });
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { Op, QueryTypes } = require("sequelize");
const User = require("../models/User");
const sequelize = require("../db");

// CREATE USER
exports.createUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Name and email are required");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  const user = await User.create({ name, email });

  res.status(httpStatus.CREATED).json({
    status: "success",
    data: user,
  });
});

// GET USERS using Stored Procedure (pagination, search, sort)
exports.getUsers = catchAsync(async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const searchTerm = req.query.searchTerm || "";
    const sortField = req.query.sortField || "id";
    const sortOrder = req.query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Calculate offset for pagination
    const offset = (pageNumber - 1) * pageSize;

    // 1️⃣ Call your stored procedure (GetAllUsersData)
    const usersResult = await sequelize.query(
      "CALL GetAllUsersData(:pageNumber, :pageSize, :searchTerm, :sortField, :sortOrder)",
      {
        replacements: {
          pageNumber,
          pageSize,
          searchTerm,
          sortField,
          sortOrder,
        },
      }
    );

    // The result may vary by MySQL driver version:
    // Usually "CALL" returns an array of rows.
    const userData = Array.isArray(usersResult) ? usersResult : [];

    // 2️⃣ Count total users manually (like in your student code)
    // Include filters (searchTerm)
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE is_deleted = 0
    `;
    const replacements = {};

    if (searchTerm) {
      countQuery += " AND (name LIKE :search OR email LIKE :search)";
      replacements.search = `%${searchTerm}%`;
    }

    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const totalRecords = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    // 3️⃣ Return JSON like your example
    res.status(httpStatus.OK).json({
      status: "success",
      data: userData,
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    });
  } catch (err) {
    console.error("❌ Error in getUsers:", err);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch users");
  }
});


// GET USER BY ID
exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id, is_deleted: false } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json({
    status: "success",
    data: user,
  });
});

// UPDATE USER
exports.updateUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Name and email are required");
  }

  const existingUser = await User.findOne({
    where: { email, id: { [Op.ne]: req.params.id } },
  });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  const [updated] = await User.update(
    { name, email },
    { where: { id: req.params.id, is_deleted: false } }
  );

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await User.findByPk(req.params.id);
  res.status(httpStatus.OK).json({
    status: "success",
    data: updatedUser,
  });
});

// SOFT DELETE USER
exports.deleteUser = catchAsync(async (req, res) => {
  const [deleted] = await User.update(
    { is_deleted: true },
    { where: { id: req.params.id, is_deleted: false } }
  );

  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found or already deleted");
  }

  res.status(httpStatus.OK).json({
    status: "success",
    message: `User ${req.params.id} soft deleted successfully`,
  });
});
