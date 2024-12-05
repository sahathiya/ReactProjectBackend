const Users = require('../../model/userSchema')
const customError = require('../../utils/customError')


//TO VIEW ALL USERS
const AllUsers = async (req, res, next) => {
    const users = await Users.find({ admin: false })
    if (!users) {

        return next(new customError('users not found', 404))
    }
    res.status(200).json({ status: 'success', users })
}
//TO VIEW ONE USER
const userById = async (req, res) => {
    const userid = req.params.id
    console.log(userid);

    const user = await Users.findById(userid)
    console.log(user);

    if (!user) {

        return next(new customError('user with this id not found', 404))
    }

    res.status(200).json({ status: 'success', user })
}

//TO DELETE USER
const removeUser = async (req, res) => {
    const user = await Users.findByIdAndDelete(req.params.id)
    if (!user) {

        return next(new customError('user with this id not found', 404))
    }
    res.status(200).json({ status: 'success', message: 'user deleted ' })
}


const blockUser = async (req, res) => {
    const userid = req.params.id
    const user = await Users.findById(userid)
    console.log(user);

    if (user.block === true) {
        user.block = false
        await user.save()
        return res.status(200).json({ status: 'success', message: 'user is unblocked by admin' })
    } else {
        user.block = true
        await user.save()
        return res.status(200).json({ status: 'success', message: 'user is blocked by admin' })
    }
}


module.exports = { AllUsers, userById, removeUser, blockUser }