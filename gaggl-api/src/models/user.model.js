const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 8;

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,  // 8
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
        },
        age: {
            type: Number,
            required: true,
            min: [16, 'not a valid age'],
            max: [150, 'not a valid age']
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        profile: {
            description: {
                type: String,
                trim: true
            }
        },
        location: {
            lon: Number,
            lat: Number
        },
        tags: {
            type: Array,
            default: []
        }
    },
    {
      timestamps: true,
    }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};
  
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hashSync(user.password, SALT_ROUNDS);
    }
    next();
});

userSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete __v;
        return ret;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
