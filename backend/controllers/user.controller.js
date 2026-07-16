const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const { PAGINATION } = require('../config/constants');

/**
 * GET /api/v1/users
 * Admin: Get all users with pagination
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit,
      },
    }, 'Users fetched successfully.')
  );
});

/**
 * GET /api/v1/users/:id
 * Admin: Get a specific user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken -__v')
    .lean();

  if (!user) throw new ApiError(404, 'User not found.');

  res.status(200).json(new ApiResponse(200, { user }, 'User fetched successfully.'));
});

/**
 * PATCH /api/v1/users/:id
 * Admin: Update user role or active status
 */
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const updateData = {};

  if (role !== undefined) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .select('-password -refreshToken -__v')
    .lean();

  if (!user) throw new ApiError(404, 'User not found.');

  res.status(200).json(new ApiResponse(200, { user }, 'User updated successfully.'));
});

/**
 * DELETE /api/v1/users/:id
 * Admin: Deactivate (soft delete) a user
 */
const deleteUser = asyncHandler(async (req, res) => {
  // Prevent deleting self
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account via this endpoint.');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  ).lean();

  if (!user) throw new ApiError(404, 'User not found.');

  res.status(200).json(new ApiResponse(200, {}, 'User deactivated successfully.'));
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
