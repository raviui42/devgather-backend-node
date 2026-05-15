const validator = require('validator')

const validateSignupdata = (req) => {
    const {firstName, password, email, lastName} = req.body;
    if(!firstName || !lastName){
        throw new Error('First and last name not valid')
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough')
    }else if(!validator.isEmail(email)){
        throw new Error(`Email is not valid`)
    }
}

const validationEditProfile = (req) =>{
    const editAccesList = ['firstName', "lastName", "age", "gender", "photoUrl", 'about', 'Skills']
    const isEditable= Object.keys(req.body).every(filed => editAccesList.includes(filed))
    if(!isEditable){
        throw new Error('Not updated value')
    }

    return isEditable
}

module.exports ={
    validateSignupdata,validationEditProfile
}