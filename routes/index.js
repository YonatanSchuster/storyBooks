const express = require ('express')
const router = express.Router()
const {ensuereAuth, ensureGuest} = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    Login/Landing page
// @rout GET/
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc    Dashboard
// @rout GET/dashboard
router.get('/dashboard', ensuereAuth, async (req, res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }

    
})

module.exports = router