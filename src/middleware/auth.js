const User = require('../moduels/User')
const jwt = require('jsonwebtoken');

const userAuth = async(req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send('Plase login again')
        }

        const verifyTokeen = await jwt.verify(token, 'Devgather@4444')

        const {userId} = verifyTokeen;
        if(!userId){
            throw new Error('Invalid User')
        }

        const userDetails = await User.findById(userId);
        req.userDetails = userDetails
        next()
    
    }catch(err){
        res.status(400).send(`Update fail ${err.message}`)
    }
}


module.exports ={ userAuth}