import express from 'express';
import { getQueries } from '../controller/getQueryController';


const router = express.Router();

router.route('/queries')
    .get(
        getQueries
    )

module.exports = router;
