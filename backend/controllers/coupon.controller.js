const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const couponService = require('../services/coupon.service');

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  const result = await couponService.validateCoupon(code, req.user._id, orderTotal);
  res.status(200).json(new ApiResponse(200, result, 'Coupon is valid.'));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getAllCoupons();
  res.status(200).json(new ApiResponse(200, { coupons }, 'Coupons fetched.'));
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created.'));
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon updated.'));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, 'Coupon deleted.'));
});

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
