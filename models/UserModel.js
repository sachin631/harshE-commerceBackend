const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email address is invalid");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  passwordAgain: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  carts: Array,
});

//create hasing of password and cpassword
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordAgain = await bcrypt.hash(this.passwordAgain, 12);
  }
  next();
});

//generate token using jwt
userSchema.methods.generateAuthtoken = async function () {
  try {
    const secretKey = process.env.secretKey;
    const token = jwt.sign({ _id: this._id }, secretKey);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log("error usermodel", error);
    return "Error generating token";
  }
};

userSchema.methods.addcartdata = async function (cart) {
  try {
    this.carts = this.carts.concat(cart);
    await this.save();
    return this.carts;
  } catch(error) {
    console.log(error);
  }
};

const userModel = new mongoose.model("userRegister", userSchema);

module.exports = userModel;
