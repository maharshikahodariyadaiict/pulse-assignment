import express from 'express';

import * as controller from '../controller/reviews.js';

const router = express.Router();

router.route('/reviews').get(controller.getReviews);
router.route('/listing').get(controller.getProductListing);

export default router;