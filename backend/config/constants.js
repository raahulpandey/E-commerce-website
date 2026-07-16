// Application-wide constants

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const TOKEN = {
  ACCESS_EXPIRY: '15m',
  REFRESH_EXPIRY: '7d',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

module.exports = { ROLES, ORDER_STATUS, TOKEN, PAGINATION, SORT_ORDERS };
