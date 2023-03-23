const express = require("express");
const router = new express.Router();
const productModel = require("../models/ProductModel");
const userModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const athenticate = require("../middleware/authenticate");

//get  ALL  product api
router.get("/getProduct", async (req, res) => {
  try {
    const getproduct = await productModel.find();
    console.log("we get product data", getproduct);
    // res.send(getproduct);
    res.status(201).json({ message: getproduct });
  } catch (error) {
    console.log("router error", error.message);
  }
});

//get praticular user api
router.get("/getParticular/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getParticularData = await productModel.findOne({ id: id });
    res.status(201).json({ message: getParticularData });
  } catch (error) {
    res.status(201).json(error.message);
  }
});

//userRegister
router.post("/userRegister", async (req, res) => {
  const { name, email, mobile, password, passwordAgain } = req.body;
  if (!name || !email || !mobile || !password || !passwordAgain) {
    res.status(422).json({ message: "fill all data" });
    console.log("fill all data");
  }
  try {
    const preUser = await userModel.findOne({ email: email });
    if (preUser) {
      res.status(422).json({ message: "user already Present try to login" });
      console.log("user already Present try to login");
    } else if (password !== passwordAgain) {
      res.status(422).json({ message: "Password Not Match" });
      console.log("Password Not Match");
    } else {
      const user = new userModel({
        name,
        email,
        mobile,
        password,
        passwordAgain,
      });
      //here bcryptjs hasing work
      const finalData = await user.save();
      res.status(201).json({ message: user });
    }
  } catch (error) {}
});

//userLogin API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "please enter data in all fields" });
  }
  try {
    const data = await userModel.findOne({ email: email });
    if (data) {
      const isUser = await bcrypt.compare(password, data.password);
      // //generation of token
      // const token = await data.generateAuthtoken();
      // //create/generate cookies
      // res.cookie("AmazoneWeb", token, {
      //   expires: new Date(Date.now() + 9000000),
      //   httpOnly: true,
      // });

      // console.log(token);
      if (isUser) {
        //generation of token
        const token = await data.generateAuthtoken();
        //create/generate cookies
        res.cookie("AmazoneWeb", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });
        res.status(200).json({ message: "userFound" });
      } else {
        res.status(400).json({ message: "please enter valid details" });
      }
    } else {
      res.status(400).json({ message: "please enter valid details" });
    }
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
});
//13:24

//add cart api
router.post("/addToCart/:id", athenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await productModel.findOne({ id: id });
    console.log(cart + "cart");

    const userContact = await userModel.findOne({ _id: req.userId });
    console.log(userContact);

    if (userContact) {
      const cartData = await userContact.addcartdata(cart);
      await userContact.save();
      console.log(cartData);
      res.status(201).json(userContact);
    } else {
      res.status(401).json({ error: "invalid user" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid user" });
  }
});


//get cart data api
router.get("/cartdetails", athenticate, async (req, res) => {
  try {
    const byUser = await userModel.findOne({ _id: req.userId });
    res.status(201).json(byUser);
  } catch (error) {
    console.log("error is at router get cart api data" + error);
  }
});

//get valid user

router.get("/validuser", athenticate, async (req, res) => {
  try {
    const validuserone = await userModel.findOne({ _id: req.userId });
    res.status(201).json(validuserone);
  } catch (error) {
    console.log("error is at router valid userdata data" + error);
  }
});

router.delete("/remove/:id", athenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootuser.carts = req.rootuser.carts.filter((curelem) => {
      return curelem.id != id;
    });
    await req.rootuser.save();
    res.status(201).json(req.rootuser);
    console.log("item remove");
  } catch (error) {
    res.status(201).json(error);
  }
});

//logout api
router.get("/logout",athenticate,async(req,res)=>{
  try{

    req.rootuser.tokens=req.rootuser.tokens.filter((curelem)=>{
        return curelem.token!=req.token
    });

    res.clearCookie("AmazoneWeb",{path:"/"});

   await req.rootuser.save();
    res.status(201).json(req.rootuser.tokens);
    console.log("user logout");

  }catch(error){

    console.log("error for user logout",error.message);

  }
});






module.exports = router;
