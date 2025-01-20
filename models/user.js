const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        password: { type: String },
        provider: { type: String },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    // Check if password is modified
    if (!user.isModified('password')) return next();

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Compare candidate password with hashed password
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
