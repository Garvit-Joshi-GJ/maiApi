import express from 'express';
import { register, login } from '../controller/userController';


const router = express.Router();

router.route('/register')
    .post(
        register
    )

router.route('/login')
    .post(
        login
    )

module.exports = router;
