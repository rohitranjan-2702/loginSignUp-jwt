const mongoose =require("mongoose");
const { isEmail} = require("validator");
const bcrypt= require("bcrypt");

const learnerSchema = new mongoose.Schema({
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
    updated_at: { type: Date }
});

// fire a function before doc saved todb
learnerSchema.pre('save', async function (next) {
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
      this.created_at = now;
    }

    this.role = 'LEARNER_' + this._id; 

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

learnerSchema.post('save', function(doc, next) {
    console.log('new user created & saved', doc);
    next();
})

const Learner = mongoose.model('learner', learnerSchema);

module.exports = Learner;