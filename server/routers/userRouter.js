const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middlewares/authenticate");
const sendMail = require("./sendMail");

/*
    @usage : to Register a User
    @url : /api/users/register
    @fields : name , email , password
    @method : POST
    @access : PUBLIC
*/
router.post(
  "/register",
  async (request, response) => {
    try {
      let { name, email, password } = request.body;
      // check if the user exits
      let user = await User.findOne({ email: email });

      if (user) {
        return response.status(201).json({ msg: "User already Exists" });
      }

      /* This code is generating a salt using `bcrypt.genSalt()` method with a cost factor of 10, and
        then using that salt to hash the password using `bcrypt.hash()` method. Salting and hashing
        the password is a common technique used to securely store passwords in a database. The salt
        is a random string that is added to the password before hashing, which makes it more
        difficult for attackers to crack the password using techniques like rainbow tables. The
        resulting hash is then stored in the database instead of the plain text password. */

      let salt = await bcrypt.genSalt(10); // salt is actually encrypted password
      password = await bcrypt.hash(password, salt); //password=salt

      let avatar =
        "https://drive.google.com/uc?id=1G9yZcEun9-DZsq36spxipaog3odMmGZ1";

      user = new User({ name, email, password, avatar });
      await user.save();
      response.status(200).json({ msg: "Registration is Successful" });
    } catch (error) {
      // // // console.error(error);
      response.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);





function generateOTP() {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  const currentTime = new Date();
  const validityPeriodInMinutes = 10;
  const expiryTime = new Date(currentTime.getTime() + validityPeriodInMinutes * 60000);

  return { otp, expiryTime };
}

function isOTPValid(otpObj) {
  const currentTime = new Date();
  return currentTime <= otpObj.expiryTime;
}






router.post("/verify", async (request, response) => {
  try {

    const { otp } = request.body;
    // console.log(otp);
    // console.log(otpData.otp);
    if (otpData.otp == otp && isOTPValid(otpData)) {
      // console.log("ffcccr")

      response.status(200).json({
        data: "OTP confirmed"
      });
    }
    else {
      // console.log("ffr")
      response.status(201).json({
        data: "not correct otp"
      });
    }
  } catch (error) {
    // // console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});
var otpData = "";

router.post("/sendEmail", async (request, response) => {
  try {
    otpData = generateOTP();
    const randomOTP = otpData.otp;
    // console.log('Generated OTP:', randomOTP);
    const { email } = request.body;
    // // console.log(randomOTP);

    sendMail({ recipient_email: email, OTP: randomOTP });

    response.status(200).json({
      data: randomOTP
    });
  } catch (error) {
    // // console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage : to Login a User
    @url : /api/users/login
    @fields : email , password
    @method : POST
    @access : PUBLIC
 */
router.post(
  "/login",

  async (request, response) => {
    try {
      let { email, password } = request.body;

      // check if the correct email
      let user = await User.findOne({ email: email });

      if (!user) {
        return response
          .status(201)
          .json({ errors: [{ msg: "Email is not registered" }] });
      }

      //   check the passwords
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response
          .status(201)
          .json({ errors: [{ msg: "Invalid Password" }] });
      }

      // create a token and send to Client
      /* This code is creating a JSON Web Token (JWT) for the authenticated user and sending it back to the
      client as a response to the login request. */
      let payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      /* This code is creating a JSON Web Token (JWT) for the authenticated user and sending it back to the client as a response to the login request. The `jwt.sign()` method takes in a payload
      object, a secret key, and a callback function. The payload object contains the user
      information that will be encoded in the token. The secret key is used to sign the token and
      verify its authenticity. The callback function is called with an error object and the token
      string. If there is an error, it will be thrown, otherwise, the token will be sent back to the
      client as a response to the login request. */
      jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
        if (error) throw error;
        response.status(200).json({
          msg: "Login is Success",
          token: token,
        });
      });
    } catch (error) {
      // // // console.error(error);
      response.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);

/*
    @usage :  to get user Info
    @url : /api/users/me
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
router.get("/me", authenticate, async (request, response) => {
  try {
    let user = await User.findById(request.user.id).select("-password");
    // // console.log(user);
    response.status(200).json({
      user: user
    });
  } catch (error) {
    // // console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});






/*
@usage : Update Profile
    @url : /api/users/
    @fields : name , address , avatar 
    @method : PUT
    @access : PRIVATE
 */
router.put("/:userId", authenticate, async (request, response) => {
  try {

    let userId = request.params.userId;
    // check if profile exists
    let user = User.findById(userId);
    if (!user) {
      return response
        .status(401)
        .json({ errors: [{ msg: "No User Found" }] });
    }

    let { localUser } = request.body;

    let profileObj = {};
    //   profileObj.user = request.user.id; // id gets from Token
    if (localUser.name) profileObj.name = localUser.name;
    else profileObj.name = user.name;

    if (localUser.avatar) profileObj.avatar = localUser.avatar;
    else profileObj.avatar = user.avatar;

    if (localUser.address) profileObj.address = localUser.address;
    else profileObj.address = user.address;

    if (localUser.contact) profileObj.contact = localUser.contact;
    else profileObj.contact = user.contact;
    // console.log(profileObj);

    // update to db
    user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: profileObj,
      },
      { new: true }
    );



    response.status(200).json({
      msg: "Profile is Updated Successfully",
      user: user,
    });
  } catch (error) {
    // // // console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});


module.exports = router;