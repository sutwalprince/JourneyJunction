const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middlewares/authenticate");
const { MongoClient, ObjectId } = require('mongodb');

/*
    @usage : to Register a User as affiliate user
    @url : /api/affiliate/register/:userId
    @fields : email , password , contact , address  
    @method : POST
    @access : private
*/
router.post("/register/:userId", authenticate, async (request, response) => {
    try {
        let userId = request.params.userId;
        let { contact, email, address, password } = request.body;

        // check if the user exits
        let user = await User.findOne({ email: email });

        if (!user) {
            return response.status(204).json({ msg: "Use a registered email." });
        }

        let profile = await User.findOne({ _id: new ObjectId(userId) });
        if (!profile) {
            // console.log(profile);
            return response
                .status(202)
                .json({ errors: [{ msg: "No User Found" }] });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response
                .status(201)
                .json({ errors: [{ msg: "Invalid Password" }] });
        }


        await User.findOneAndUpdate({ _id: userId },
            { $set: { "isAffiliate": true } },
            { new: true });

        await User.findOneAndUpdate({ _id: userId },
            { $set: { "address": address } },
            { new: true });

        await User.findOneAndUpdate({ _id: userId },
            { $set: { "contact": contact } },
            { new: true });

        response.status(200).json({ msg: "User deatils updated successfully" });

    } catch (error) {
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});



module.exports = router;
