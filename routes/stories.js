const express = require ('express')
const router = express.Router()
const {ensuereAuth} = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    Show add page
// @rout GET /stories/add
router.get('/add', (req, res) => {
    res.render('stories/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensuereAuth, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

// @desc    Show all stories
// @rout GET /stories
router.get('/', async(req, res) => {
    try {
        const stories = await Story .find({status: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensuereAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate('user').lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user._id != req.user.id && story.status == 'private') {
        res.render('error/404')
      } else {
        res.render('stories/show', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
      res.render('error/404')
    }
  })


// @desc    Show edit page
// @rout GET /stories/edit/:id
router.get('/edit/:id', ensuereAuth, async(req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
        
        if(!story) {
            return res.render('error/404')
        }
    
        if(story.user != req.user.id){
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    Update stories
// @rout PUT /stories/:id
router.put('/:id', ensuereAuth, async(req, res) => {

        
    try {
        let story = await Story.findById(req.params.id).lean()  
            if (!story){
                return res.render('error/404')
            }
    
            if(story.user != req.user.id){
                res.redirect('/stories')
            } else {
                story = await Story.findOneAndUpdate({ _id: req.params.id}, req.body, {
                    new: true, 
                    runValidators: true
                })
                res.redirect('/dashboard')
            }
            
    } catch (err) {
        console.error(err)
            return res.render('error/500')
    }   
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensuereAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensuereAuth, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
})


module.exports = router