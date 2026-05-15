const express= require('express')

const authRouts = express.Router()
const {validateSignupdata} = require('../Utils/validation')
const bcrypt = require('bcrypt');
const User = require('../moduels/User');



authRouts.post('/signup', async (req,res) => {
    try{
        validateSignupdata(req)
        const {firstName, lastName, email, password, Skills, age, gender, photoUrl,about} = req.body
        const passwordEncript = await bcrypt.hash(password, 10)


         const user = new User({
            firstName, lastName, email, password: passwordEncript, Skills, age, gender, photoUrl, about
         })
        await user.save();
        const token = user.getJwt()
        res.cookie('token', token, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)})
        res.json({message: 'user data succefully submit', data: user})
    }catch(err){
        res.status(400).send(err.message)
    }
})

authRouts.post('/login', async(req,res) => {
    try{
        const {email, password} = req.body
        const checkUser = await User.findOne({email})
        if(!checkUser){
            throw new Error('emial not in DB')
        }

        const passwordDetails = await checkUser.paswordValide(password)
        if(passwordDetails){

            const token = checkUser.getJwt()
            res.cookie('token', token, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)})
            res.send(checkUser)
        }else{
            throw new Error('Password not match')
        }
    }catch(err){
        res.status(400).send(err.message)
    }
})

authRouts.post('/logout', async(req,res) => {
    res.cookie('token', null, {expires: new Date(Date.now())})
    res.send('Logout Succesfull')
})


module.exports = authRouts