const jwt = require('jsonwebtoken')
const customError = require('../../utils/customError')


const adminRefreshtoken = async (req, res, next) => {

    const AdminRefreshtoken = req.cookies.AdminRefreshtoken
    console.log("refresh", AdminRefreshtoken);
    if (!AdminRefreshtoken) {

        return next(new customError('admin refresh token is missing', 404))
    }
    jwt.verify(AdminRefreshtoken, process.env.JWT_SECRET, (err, user) => {
        if (err) {

            return next(new customError('Invalid  admin refresh token, please log in again', 404))
        }


        const AdminaccessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        )
        res.cookie('Admintoken', AdminaccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 60 * 1000,
            sameSite: 'lax',
        });

        res.status(200).json({ AdminaccessToken: AdminaccessToken });

    })
}






module.exports = { adminRefreshtoken }