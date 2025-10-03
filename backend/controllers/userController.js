// const User = require("../models/User");

// // CREATE user
// exports.createUser = async (req, res, next) => {
//   try {
//     const { name, email } = req.body;
//     const user = await User.create({ name, email });
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// // READ all active users
// exports.getUsers = async (req, res, next) => {
//   try {
//     const users = await User.findAll({ where: { is_deleted: false } });
//     res.json(users);
//   } catch (err) {
//     next(err);
//   }
// };

// // READ single user
// exports.getUserById = async (req, res, next) => {
//   try {
//     const user = await User.findOne({
//       where: { id: req.params.id, is_deleted: false },
//     });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// // UPDATE user
// exports.updateUser = async (req, res, next) => {
//   try {
//     const { name, email } = req.body;
//     const [updated] = await User.update(
//       { name, email },
//       { where: { id: req.params.id, is_deleted: false } }
//     );
//     if (!updated) return res.status(404).json({ message: "User not found" });
//     const updatedUser = await User.findByPk(req.params.id);
//     res.json(updatedUser);
//   } catch (err) {
//     next(err);
//   }
// };

// // SOFT DELETE user
// exports.deleteUser = async (req, res, next) => {
//   try {
//     const [deleted] = await User.update(
//       { is_deleted: true },
//       { where: { id: req.params.id } }
//     );
//     if (!deleted) return res.status(404).json({ message: "User not found" });
//     res.json({ message: `User ${req.params.id} soft deleted` });
//   } catch (err) {
//     next(err);
//   }
// };
const User = require("../models/User");

// CREATE
exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// READ (all or last 10)
exports.getUsers = async (req, res, next) => {
  try {
    const fetchAll = req.query.all === "true";
    const users = await User.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
      ...(fetchAll ? {} : { limit: 10 }),
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// READ single
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, is_deleted: false },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const [updated] = await User.update(
      { name, email },
      { where: { id: req.params.id, is_deleted: false } }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// SOFT DELETE
exports.deleteUser = async (req, res, next) => {
  try {
    const [deleted] = await User.update(
      { is_deleted: true },
      { where: { id: req.params.id } }
    );
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${req.params.id} soft deleted` });
  } catch (err) {
    next(err);
  }
};
