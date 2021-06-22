const router = require('express').Router();
const { Model } = require('sequelize/types');
const {Post, Comment, User} = require('../models')


// route to get all post for home page
router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
       include: [User]
      });
      
      const posts = postData.map(post => post.get({plain: true}))
      res.render('all-posts', {posts})
    } catch (err) {
      res.status(500).json(err);
    }
  });
// routes to get single post
router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id,{
       include: [
           User,
            {
                model: Comment, 
                include: [User]
            }]
      });
      if (postData){
          const post = postData.get({plain: true})
          res.render('single-post', {post})
        }
        else {
            res.status(404).end()
        }
    } catch (err) {
      res.status(500).json(err);
    }
  });
// route to get into login page
  router.get('/login', (req, res) => {
      if (req.session.logged_in){
          res.redirect('/')
          return
      }
      res.render('login')
  })
// route to get sign up page
router.get('/signup', (req, res) => {
    if (req.session.logged_in){
        res.redirect('/')
        return
    }
    res.render('signup')
})


module.exports = router