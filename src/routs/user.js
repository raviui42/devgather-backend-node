const express = require('express');
const userRouter = express.Router();
const { userAuth} = require('../middleware/auth')
const ConnectionRequest = require('../moduels/ConnectRequest')
const User = require('../moduels/User');

userRouter.get('/user/request/recived', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.userDetails;

        const recivedData = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName age gender photoUrl Skills')

        return res.json({message: 'Recived request' ,data: recivedData})

    }catch(err){
        res.status(400).send(err.message)
    }
})

userRouter.get('/user/connections', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.userDetails;
        const connectionsData = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'},
            ]
        }).populate('fromUserId', 'firstName lastName age gender photoUrl Skills').populate('toUserId', 'firstName lastName age gender photoUrl Skills')

        const data = connectionsData.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        return res.json({data})
    }catch(err){
        res.status(400).send(err.message)
    }
})

userRouter.get('/feed', userAuth, async(req,res) => {
    try{
        const loggedInUser = req.userDetails;
        let limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        limit =  limit > 50 ? 50 : limit;
        const skip = (page -1) * limit;


        const connectionData = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId, toUserId")

        const hideConnection = new Set();
        connectionData.forEach((val) => {
            hideConnection.add(val.fromUserId);
            hideConnection.add(val.toUserId)
        })

        const feedData = await User.find({
            $and: [
                {_id: {$nin : Array.from(hideConnection)}},
                { _id: {$ne : loggedInUser._id}}
                
            ]
        }).select( 'firstName lastName age gender photoUrl Skills').skip(skip).limit(limit)

        return res.json({data: feedData})
    }catch(err){
        res.status(400).json({message: err.message})
    }
   

})


module.exports= userRouter