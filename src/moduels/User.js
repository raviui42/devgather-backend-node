const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true,
        validate:{
            validator(val){
                return validator.isStrongPassword(val)
            },
            message: 'Password is not strong enough'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error(`Invlalid Emil ${val}`)
            }
        }
    },
     age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error('Geder data not valid')
            }
        }
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: 'this is default value'
    },
    Skills: {
        type: [String]
    }
},
{
    timestamps: true
}
)

userSchema.methods.getJwt = function(){
    const user = this;
   const jwtSign = jwt.sign({userId: user._id}, 'Devgather@4444', {expiresIn: "1d"} )
   return jwtSign
}

userSchema.methods.paswordValide = async function(passwordHash){
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordHash, user.password)
    return isPasswordValid
}

module.exports = mongoose.model('User', userSchema )

