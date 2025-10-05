const catchAsync = require("../utils/catchAsync");
const httpStatus = require('http-status-codes')
const ApiError = require("../utils/ApiError");
const { Op, QueryTypes } = require("sequelize");
const User = require("../models/User");
const sequelize = require("../db");

// ✅ CREATE USER
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

// // ✅ GET USERS (search, sort, pagination)
// exports.getUsers = catchAsync(async (req, res) => {
//   const {
//     pageNumber = 1,
//     pageSize = 10,
//     searchTerm = "",
//     sortField = "name",
//     sortOrder = "DESC",
//   } = req.query;

//   const offset = (parseInt(pageNumber) - 1) * parseInt(pageSize);
//   const limit = parseInt(pageSize);

//   const where = searchTerm
//     ? { name: { [Op.like]: `%${searchTerm}%` } }
//     : {};

//   const { count, rows } = await User.findAndCountAll({
//     where,
//     order: [[sortField, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
//     offset,
//     limit,
//   });

//   res.status(httpStatus.OK).json({
//     status: "success",
//     data: rows,
//     totalRecords: count,
//     totalPages: Math.ceil(count / limit),
//   });
// });
// ✅ GET USERS using Stored Procedure
exports.getUsers = catchAsync(async (req, res) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    searchTerm = "",
    sortField = "name",
    sortOrder = "DESC",
  } = req.query;

  const users = await sequelize.query(
    "CALL sp_get_users(:pageNumber, :pageSize, :searchTerm, :sortField, :sortOrder)",
    {
      replacements: {
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        searchTerm: searchTerm || "",
        sortField: sortField || "id",
        sortOrder: sortOrder || "DESC",
      },
      type: QueryTypes.RAW,
    }
  );

  // Stored procedure returns two result sets:
  // 1. User data (array)
  // 2. Pagination info (totalRecords, totalPages)

  // Depending on your MySQL driver, results may come as a flat array
  // or nested result sets. We'll handle both cases:
  const [userData, metaData] = Array.isArray(users[0]) ? users : [users, []];

  const pagination = metaData && metaData.length > 0 ? metaData[0] : { totalRecords: 0, totalPages: 0 };

  res.status(httpStatus.OK).json({
    status: "success",
    data: userData,
    totalRecords: pagination.totalRecords || 0,
    totalPages: pagination.totalPages || 0,
  });
});

// ✅ GET USER BY ID
exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.status(httpStatus.OK).json({
    status: "success",
    data: user,
  });
});

// ✅ UPDATE USER
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
    { where: { id: req.params.id } }
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

// ✅ SOFT DELETE USER
exports.deleteUser = catchAsync(async (req, res) => {
  const [deleted] = await User.update(
    { is_deleted: true },
    { where: { id: req.params.id } }
  );

  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json({
    status: "success",
    message: `User ${req.params.id} soft deleted`,
  });
});