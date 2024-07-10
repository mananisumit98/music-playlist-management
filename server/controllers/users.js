const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import Models
const User = require("../models/usersModal");
const AuthToken = require("../models/authToken");

const { NO_DATA, CATCH_ERROR, LOGIN_SUCCESS, INVALID_CREDENTIALS, USER_EXISTS, EMAIL_EXISTS, USER_NOT_CREATED, USER_CREATED } = require('../locale/messages');

const { JWT_TOKEN } = require("../utils/constants");

const login = async (req, res) => {
    console.log("controller@users/login");
    try {
        const { username, password } = req.body;
        const respObj = {};

        const validateUser = await User.findOne({ username: username });

        if (!validateUser) {
            return res.json({ message: NO_DATA, success: false });
        }

        if (!validateUser || !await bcrypt.compare(password, validateUser.password)) {
            return res.json({ message: INVALID_CREDENTIALS, success: false });
        }

        respObj.user = validateUser;

        const token = jwt.sign(
            { user_id: validateUser._id },
            JWT_TOKEN,
            {
                expiresIn: "2h",
            }
        );

        await AuthToken.create({
            user_id: validateUser._id,
            token: token
        });

        respObj.access_token = token;

        return res.json({ message: LOGIN_SUCCESS, success: true, data: respObj });
    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }
}

const register = async (req, res) => {
    console.log("controller@users/register");
    try {

        const respObj = {};

        const { email_id, password } = req.body;

        const checkEmail = await User.findOne({ email_id: email_id });

        if (checkEmail) {
            return res.json({ message: EMAIL_EXISTS, success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertedElement = await User.create({
            email_id,
            password: hashedPassword
        });

        const access_token = jwt.sign(
            { user_id: insertedElement._id },
            JWT_TOKEN,
            {
                expiresIn: "2h",
            }
        );


        await AuthToken.create({
            user_id: insertedElement._id,
            token: access_token
        });

        if (!insertedElement) {
            return res.json({ message: USER_NOT_CREATED, success: false });
        }

        respObj["user"] = insertedElement;
        respObj["access_token"] = access_token;

        return res.json({ message: USER_CREATED, success: true, data: respObj });


    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error });
    }

}

module.exports = { login, register };