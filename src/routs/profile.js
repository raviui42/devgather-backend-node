const express= require('express')
const profileRouts = express.Router()
const {validationEditProfile} = require('../Utils/validation')

const { userAuth} = require('../middleware/auth')

profileRouts.get('/profile', userAuth, async(req,res) => {
    try{
        res.send(req.userDetails)

    }catch(err){
        res.status(400).send(`Update fail ${err.message}`)
    }
})

profileRouts.get('/profile/view', userAuth, async(req,res) => {
    try{
        res.send(req.userDetails)

    }catch(err){
        res.status(400).send(`Update fail ${err.message}`)
    }
})


profileRouts.patch('/profile/edit', userAuth,  async(req,res)=>{
    try{
        validationEditProfile(req)
        const loginInUser = req.userDetails;
        Object.keys(req.body).forEach(key => loginInUser[key] = req.body[key])
        await loginInUser.save();
        res.json({message: `Succefuly update ${loginInUser.firstName} profile`, data: loginInUser})
    }catch(err){
        res.status(400).send(`Update fail ${err.message}`)
    }
   
})

module.exports = profileRouts
