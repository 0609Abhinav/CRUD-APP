// backend/utils/catchAsync.js

/**
 * Wraps async route handlers to catch errors and pass them to next()
 * @param {Function} fn - async function (req, res, next)
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
