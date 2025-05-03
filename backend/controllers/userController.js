import asyncHandler from "../middleware/asyncHandler.js"
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// @desc Auth user & get token 
// @route POST /api/users/login
// @access public
const authUser = asyncHandler (async (req,res) => {
    const { email, password } = req.body;

    const user  = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        // Set JWT as HTTP-Only Cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin:  user.isAdmin
        })
    } else {
        res.status(401);
        throw new Error('Invalid email or password')
    }
})


// @desc Register user 
// @route POST /api/users
// @access public

const registerUser = asyncHandler (async (req,res) => {
    res.send('register user');
})

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access private

const logoutUser = asyncHandler (async (req,res) => {
   res.cookie('jwt', '', {
    httpOnly: true, 
    expires: new Date(0)
   })

   res.status(200).json({ message: 'Logged out successfully' })
})

// @desc Get user profile
// @route GET /api/users/profile
// @access public

const getUserProfile = asyncHandler (async (req,res) => {
    res.send('get user profile');
})

// @desc Update user profile
// @route PUT /api/users/profile
// @access private

const updateUserProfile = asyncHandler (async (req,res) => {
    res.send(' Update user profile');
})

// @desc Get all users
// @route GET /api/users
// @access private/admin

const getUsers = asyncHandler (async (req,res) => {
    res.send('Get all users');
})

// @desc Get user by id
// @route GET /api/users/:id
// @access private/admin

const getUserById = asyncHandler (async (req,res) => {
    res.send('Get user by id');
})

// @desc Delete user
// @route DELETE /api/users/:id
// @access private/admin

const deleteUser = asyncHandler (async (req,res) => {
    res.send('Delete user');
})


// @desc Update user 
// @route PUT /api/users/:id
// @access private/admin

const updateUser= asyncHandler (async (req,res) => {
    res.send('Update user');
})

export { 
    authUser, 
    registerUser,
    logoutUser,
    getUserProfile,
    getUsers,
    getUserById,
    updateUserProfile,
    updateUser,
    deleteUser
};

