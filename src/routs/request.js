const express= require('express')
const requestRouts = express.Router()
const { userAuth} = require('../middleware/auth')
const ConnectionRequest = require('../moduels/ConnectRequest')

requestRouts.post('/send/:status/:userId', userAuth, async(req,res) => {
    try{
        const fromUserId = req.userDetails._id;
        const toUserId  = req.params.userId;
        const status = req.params.status

        const allowStatus = ["ignore","interested"];
        if(!allowStatus.includes(status)){
            res.status(400).send('Invalid status')
        }

        const compareUserIds = await ConnectionRequest.findOne({
                $or:[
                    {fromUserId, toUserId},
                    {fromUserId: toUserId, toUserId: fromUserId}
                ]
        })

        if(compareUserIds){
            return res.status(400).send('User alredy send connection')
        }


        const connectionRequest =  new ConnectionRequest({
            fromUserId, toUserId, status
        })

        const data = await connectionRequest.save();
        res.json({
            message: 'Connection request send',
            data
        })

    }catch(err){
        res.status(400).send(`Update fail ${err.message}`)
    }
})

requestRouts.post('/request/review/:status/:userId', userAuth, async(req,res) => {
    try{
        const {status, userId} = req.params;
        const logiedInUser = req.userDetails
        const allowRequestStatus = ["accepted", "rejected"];
        if(!allowRequestStatus.includes(status)) {
            return res.status(400).json({message: 'Staus not accept'})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: userId,
            toUserId: logiedInUser._id,
            status: 'interested'
        })


        if(!connectionRequest){
            return res.status(400).json({message: 'Not found in Status',})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        return res.json({message: `Connection request ${status}`, data})

    }catch(err){
        return res.status(400).json({
        message: err.message
    });
    }
})

module.exports = requestRouts;