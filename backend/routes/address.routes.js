const express = require('express');
const router = express.Router();
const { getAddresses, addAddress, updateAddress, deleteAddress, setDefault } = require('../controllers/address.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefault);

module.exports = router;
