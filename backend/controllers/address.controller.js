const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const addressService = require('../services/address.service');

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressService.getUserAddresses(req.user._id);
  res.status(200).json(new ApiResponse(200, { addresses }, 'Addresses fetched.'));
});

const addAddress = asyncHandler(async (req, res) => {
  const address = await addressService.addAddress(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, { address }, 'Address added.'));
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { address }, 'Address updated.'));
});

const deleteAddress = asyncHandler(async (req, res) => {
  await addressService.deleteAddress(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, {}, 'Address deleted.'));
});

const setDefault = asyncHandler(async (req, res) => {
  const addresses = await addressService.setDefaultAddress(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, { addresses }, 'Default address updated.'));
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefault };
