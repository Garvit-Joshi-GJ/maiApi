import express from 'express';
import { mail } from '../controller/mailController';


const router = express.Router();

router.route('/mail')
    .post(
        mail
    )

module.exports = router;
