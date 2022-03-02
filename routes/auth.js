const { profile } = require('console')
const express = require ('express')
const passport = require('passport')
const router = express.Router()

// @desc    Auth with google
// @rout GET /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}) )

// @desc    GoogleAuthCallback
// @rout GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), 
(req, res) => {
    res.redirect('/dashboard')
})

// @desc    Logout user
// @rout GET /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router