const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }

})

// the callback function will run before a user's details are saved to the database 
userSchema.pre('save', function(next) {  //use function instead of arrow function because we want the value of 'this' to be the user we are operating on

    const user = this
    if (!user.isModified('password')) {
        return next() 
    }

    //10 represents how complex we would like the generated salt to be
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {

            if (err) {
                return next(err)
            }
            user.password = hash
            next()

        })
    })
})

userSchema.methods.comparePassword = function (candidatePassword) {
    
    const user = this
    
    return new Promise((resolve, reject) => {

        bcrypt.compare(candidatePassword,user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false)
            }
            resolve(true)
        })

    })
}


mongoose.model('User',userSchema)