const router = require('express').Router();
const {
  getSkills, getMyProfile, updateMyProfile, updateMySkills, getFreelancer
} = require('../controllers/profileController');
const { protect, allowRoles } = require('../middleware/auth');

router.get('/skills', protect, getSkills);
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.put('/profile/skills', protect, allowRoles('freelancer'), updateMySkills);
router.get('/freelancers/:id', protect, getFreelancer);

module.exports = router;