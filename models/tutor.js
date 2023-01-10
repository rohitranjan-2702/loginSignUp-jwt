const mongoose =require("mongoose");
const { isEmail} = require("validator");
const bcrypt= require("bcrypt");

const tutorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email address'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    role: {type: String},
    created_at: { type: Date },
    updated_at: { type: Date },
    techstack: {type: String, uppercase: true},
});

// fire a function before doc saved todb
tutorSchema.pre('save', async function (next) {
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
      this.created_at = now;
    }
    this.role = 'TUTOR_' + this._id; 
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// fire a function after doc saved to db
tutorSchema.post('save', function(doc, next) {
    
    console.log('new user created & saved', doc);
    next();
});

// static method to login user
tutorSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('incorrect email address');
}

const Tutor = mongoose.model('tutor', tutorSchema);

module.exports = Tutor;