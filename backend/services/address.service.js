const Address = require('../models/address.model');
const ApiError = require('../utils/ApiError');

const getUserAddresses = async (userId) =>
  Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 }).lean();

const addAddress = async (userId, data) => {
  const count = await Address.countDocuments({ user: userId });
  if (count >= 5) throw new ApiError(400, 'Maximum 5 addresses allowed per account.');

  return Address.create({ ...data, user: userId });
};

const updateAddress = async (id, userId, data) => {
  const address = await Address.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!address) throw new ApiError(404, 'Address not found.');
  return address;
};

const deleteAddress = async (id, userId) => {
  const address = await Address.findOneAndDelete({ _id: id, user: userId });
  if (!address) throw new ApiError(404, 'Address not found.');
};

const setDefaultAddress = async (id, userId) => {
  // findOne first to validate ownership, pre-save hook handles the default logic
  const address = await Address.findOne({ _id: id, user: userId });
  if (!address) throw new ApiError(404, 'Address not found.');

  address.isDefault = true;
  await address.save();

  return getUserAddresses(userId);
};

module.exports = { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
