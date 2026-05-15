const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type:  mongoose.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        require: true,
         ref: 'User'
    },
    status: {
        type: String,
        require: true,
        enum: {
           values: ["ignore","interested", "accepted", "rejected"],
           message: `{VALUE } in correction type`
        }
    }
},
{
    timestamps: true
}
)

connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre('save', async function(){
    const connectionReq = this;
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error('both are same userid')
    }
})

const ConnectionRequestModel= new mongoose.model('ConnectionRequest', connectionRequestSchema);
 module.exports = ConnectionRequestModel