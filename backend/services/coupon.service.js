const Coupon = require('../models/coupon.model');
const ApiError = require('../utils/ApiError');

const validateCoupon = async (code, userId, orderTotal) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) throw new ApiError(404, 'Invalid or expired coupon code.');
  if (new Date() > coupon.expiresAt) throw new ApiError(400, 'This coupon has expired.');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'This coupon has reached its usage limit.');
  }
  if (coupon.usedBy.includes(userId)) {
    throw new ApiError(400, 'You have already used this coupon.');
  }
  if (orderTotal < coupon.minOrderAmount) {
    throw new ApiError(
      400,
      `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`
    );
  }

  const discount = coupon.calculateDiscount(orderTotal);
  return {
    couponId: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount: parseFloat(discount.toFixed(2)),
  };
};

const applyCoupon = async (couponId, userId) => {
  await Coupon.findByIdAndUpdate(couponId, {
    $inc: { usedCount: 1 },
    $addToSet: { usedBy: userId },
  });
};

const getAllCoupons = async () => Coupon.find().sort({ createdAt: -1 }).lean();

const createCoupon = async (data) => Coupon.create(data);

const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!coupon) throw new ApiError(404, 'Coupon not found.');
  return coupon;
};

const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found.');
};

module.exports = { validateCoupon, applyCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
