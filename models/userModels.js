const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const {isEmail} = require('validator')
const UserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required : [true, "Please enter a First name."],

    },
    last_name:{
        type:String,
        required : [true, "Please enter a Last name."],

    },
   
    
     email:{
            type:String,
            required : [true, "Please enter an email."],
            unique: true,
            validate:[isEmail, "Please Enter a valid email."]

        },
    
    password: {
        type: String,
        minlength: 8,
        maxlength: 32,
    },
   

}, {
    timestamps: true
})

// Hash the plain text password before saving the user
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) {
            return next(err)
        }
        this.password = hash
        next()
    })
})

// Compare the plain text password with the hashed password
UserSchema.methods.checkPassword = function (password) {
    console.log(this.password)
    return bcrypt.compare(password, this.password)
}

// UserSchema.methods.login = function() {
//     this.isLoggedIn = true
//     return this.save()
// }

// UserSchema.methods.logout = function() {
//     this.isLoggedIn = false
//     return this.save()
// }
 const User = mongoose.model('User', UserSchema);

exports.getModel = User
exports.getSchema = UserSchema

