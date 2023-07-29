const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const User = require("../models/User");
const Hotel = require("../models/Hotel");

/*
    @usage : add a new hotel
    @url : /api/hotel/
    @fields : name ,  email,contact, rooms , hotelimage , imagelinks , facilities , address
    @method : POST
    @access : PRIVATE
 */

router.post("/", authenticate, async (request, response) => {
    try {
        let {
            name,
            email,
            contact,
            city,
            hotelimage,
            imagelinks,
            facilities,
            address,
        } = request.body;
        
        let hotelObj = {};
        hotelObj.user = request.user.id; // id gets from Token
        
        if (name) hotelObj.name = name;
        else response.status(220).json({ msg: "Name is required" });

        if (email) hotelObj.email = email;
        else response.status(209).json({ msg: "email is required" });

        if (contact) hotelObj.contact = contact;
        else response.status(200).json({ msg: "contact is required" });


        if (hotelimage) hotelObj.hotelimage = hotelimage;
        else response.status(202).json({ msg: "hotelimage is required" });

        if (address) hotelObj.address = address;
        else response.status(200).json({ msg: "address is required" });
        
        if (city) hotelObj.city = city;
        else response.status(200).json({ msg: "city is required" });

        hotelObj.imagelinks = imagelinks;

        hotelObj.facilities = facilities;

        let hotel = new Hotel(hotelObj);
        hotel = await hotel.save();
        hotel.populate("user");

        await User.findOneAndUpdate({ _id: request.user.id },
            { $set: { "hotelown": true } },
            { new: true });

        await User.findOneAndUpdate({ _id: request.user.id },
            { $set: { "hotelId": hotel._id } },
            { new: true });


        response.status(200).json({
            msg: "Hotel is Created Successfully",
            hotel: hotel,
        });
    } catch (error) {
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

/*
 @usage : Get all hotels 
 @url : /api/hotel
 @fields : no-fields
 @method : GET
 @access : PRIVATE
*/

router.get("/", async (request, response) => {
    try {
        let hotels = await Hotel.find({
            $or: [
                  {'doubleroom.listed': true },
                  {'trippleroom.listed': true },
                  {'suite.listed': true },

                ]            
          }).populate("user", ["_id"]);
        if (!hotels) {
            return response
                .status(400)
                .json({ errors: [{ msg: "No hotels Found" }] });
        }
        response.status(200).json({ hotels: hotels });
    } catch (error) {
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

/*
 @usage : Get all hotels in city 
 @url : /api/hotel/search
 @fields : no-fields
 @method : GET
 @access : PRIVATE
*/

router.get("/search/:city", async (request, response) => {
    try {
        let city = request.params.city;
        const regex = new RegExp(city, 'i'); // 'i' flag for case-insensitive search
    const hotels = await Hotel.find({ city: { $regex: regex } });
        response.status(200).json({ hotel: hotels });
      } catch (error) {
        response.status(500).json({ errors: [{ msg: error.message }] }); 
      }
    
});

/*
    @usage : Get A hotel with hotelId
    @url : /api/hotel/:hotelId
    @fields : no-fields
    @method : GET
    @access : PRIVATE
*/
router.get("/:hotelId", authenticate, async (request, response) => {
    try {
        let hotelId = request.params.hotelId;
        let hotel = await Hotel.findById(hotelId).populate("user", ["_id"]);
        if (!hotel) {
            return response.status(400).json({ errors: [{ msg: "No Hotel Found" }] });
        }
        response.status(200).json({ hotel: hotel });
    } catch (error) {
        // // // console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

/*
    @usage : Delete A Hotel with HotelId
    @url : /api/hotel/:hotelId
    @fields : no-fields
    @method : DELETE
    @access : PRIVATE
*/
router.delete("/:hotelId", authenticate, async (request, response) => {
    try {
        let hotelId = request.params.hotelId;
        // check if hotel is exists
        let hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return response.status(400).json({ errors: [{ msg: "No hotel Found" }] });
        }
        hotel = await Hotel.findByIdAndRemove(hotelId);
        response.status(200).json({
            msg: "Hotel is Deleted",
            hotel: hotel,
        });
    } catch (error) {
        // // // console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});




/*
    @usage : add a room to a hotel
    @url : /api/hotel/room/:hotelId
    @fields : text
    @method : POST
    @access : PRIVATE
 */
router.post(
    "/doubleroom/:hotelId",
    authenticate,
    async (request, response) => {
        try {
            let hotelId = request.params.hotelId;
            // let user = await User.findOne({ _id: request.user.id });
            
            let hotel = await Hotel.findById(hotelId);
            
            // check if hotel is exists
            if (!hotel) {
                return response
                .status(400)
                .json({ errors: [{ msg: "No Hotel Found" }] });
            }
            
            let { roomlinks,
                facilities
                , price, description,
                totalrooms,
            } = request.body;
            
            
            
            
            let newRoom = {
                roomlinks,
                facilities,
                price,
                description,
                totalrooms,
                listed: true,
            };
            
            
            
            hotel.doubleroom = newRoom;
            // console.log("ed" + hotelId);
            // console.log("edjjs" + hotelId);
            hotel = await hotel.save();



            let HotelWithRoom = await Hotel.findById(hotelId).populate("user", [
                "_id"
            ]);

            response.status(200).json({ hotel: HotelWithRoom });
            // console.log(HotelWithRoom)
        } catch (error) {
            // // // console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    }
);





router.post(
    "/trippleroom/:hotelId",
    authenticate,
    async (request, response) => {
        try {
            let hotelId = request.params.hotelId;
            // let user = await User.findOne({ _id: request.user.id });
            
            let hotel = await Hotel.findById(hotelId);
            
            // check if hotel is exists
            if (!hotel) {
                return response
                .status(400)
                .json({ errors: [{ msg: "No Hotel Found" }] });
            }
            
            let { roomlinks,
                facilities
                , price, description,
                totalrooms,
            } = request.body;
            
            
            
            
            let newRoom = {
                roomlinks,
                facilities,
                price,
                description,
                totalrooms,
                listed: true,
            };
            
            
            
            hotel.trippleroom = newRoom;
            hotel = await hotel.save();
            
            
            let HotelWithRoom = await Hotel.findById(hotelId).populate("user", [
                "_id"
            ]);
            
            response.status(200).json({ hotel: HotelWithRoom });
            // console.log("ed" + hotelId);
            // console.log(HotelWithRoom)
        } catch (error) {
            // // // console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    }
);


router.post(
    "/suite/:hotelId",
    authenticate,
    async (request, response) => {
        try {
            let hotelId = request.params.hotelId;
            // let user = await User.findOne({ _id: request.user.id });
            // // console.log("ed" + hotelId);

            let hotel = await Hotel.findById(hotelId);

            // check if hotel is exists
            if (!hotel) {
                return response
                    .status(400)
                    .json({ errors: [{ msg: "No Hotel Found" }] });
            }

            let { roomlinks,
                facilities
                , price, description,
                totalrooms,
            } = request.body;




            let newRoom = {
                roomlinks,
                facilities,
                price,
                description,
                totalrooms,
                listed: true,
            };



            hotel.suite = newRoom;
            hotel = await hotel.save();


            let HotelWithRoom = await Hotel.findById(hotelId).populate("user", [
                "_id"
            ]);

            response.status(200).json({ hotel: HotelWithRoom });
            // console.log(HotelWithRoom)
        } catch (error) {
            // // // console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    }
);



/*
@usage : Update Hotel
    @url : /api/hotel/:hotelId
    @fields : name , address , avatar 
    @method : PUT
    @access : PRIVATE
 */
router.put("/:hotelId", authenticate, async (request, response) => {
    try {

        let hotelId = request.params.hotelId;
        // check if hotel exists
        let hotel = Hotel.findById(hotelId);
        if (!hotel) {
            return response
                .status(401)
                .json({ errors: [{ msg: "No Hotel Found" }] });
        }

        let { name, email, address, contact, facilities, hotelimage, imagelinks } = request.body;

        let hotelObj = {};
        //   hotelObj.user = request.user.id; // id gets from Token
        if (name) hotelObj.name = name;
        else hotelObj.name = hotel.name;

        if (email) hotelObj.email = email;
        else hotelObj.email = hotel.email;

        if (hotelimage) hotelObj.hotelimage = hotelimage;
        else hotelObj.hotelimage = hotel.hotelimage;

        if (address) hotelObj.address = address;
        else hotelObj.address = hotel.address;

        if (contact) hotelObj.contact = contact;
        else hotelObj.contact = hotel.contact;

        if (facilities.length > 0) hotelObj.facilities = facilities;
        else hotelObj.facilities = hotel.facilities;

        if (imagelinks.length > 0) hotelObj.imagelinks = imagelinks;
        else hotelObj.imagelinks = hotel.imagelinks;



        // console.log(hotelObj);

        // update to db
        hotel = await Hotel.findOneAndUpdate(
            { _id: hotelId },
            {
                $set: hotelObj,
            },
            { new: true }
        );



        response.status(200).json({
            msg: "Profile is Updated Successfully",
            hotel: hotel,
        });
    } catch (error) {
        // // // console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

























router.put(
    "/doubleroom/:hotelId",
    authenticate,
    async (request, response) => {
        try {
            let hotelId = request.params.hotelId;
            // let user = await User.findOne({ _id: request.user.id });
            // // console.log("ed" + hotelId);

            let hotel = await Hotel.findById(hotelId);

            // check if hotel is exists
            if (!hotel) {
                return response
                    .status(400)
                    .json({ errors: [{ msg: "No Hotel Found" }] });
            }

            let { roomlinks,
                facilities
                , price, description,
                totalrooms,
            } = request.body;



            // console.log(facilities);
            let newRoom = {};
            if (roomlinks.length > 0) newRoom.roomlinks = roomlinks;
            else newRoom.roomlinks = hotel.doubleroom.roomlinks;

            if (facilities.length > 0) newRoom.facilities = facilities;
            else newRoom.facilities = hotel.doubleroom.facilities;

            if (price) newRoom.price = price;
            else newRoom.price = hotel.doubleroom.price;

            if (description) newRoom.description = description;
            else newRoom.description = hotel.doubleroom.description;

            if (totalrooms) newRoom.totalrooms = totalrooms;
            else newRoom.totalrooms = hotel.doubleroom.totalrooms;
            newRoom.listed = true;


            let HotelWithRoom = await Hotel.findOneAndUpdate({ _id: hotelId },
                { $set: { "doubleroom": newRoom } },
                { new: true });


            // hotel.doubleroom = newRoom;
            // hotel = await hotel.save();

            // // // console.log(hotel);
            // let HotelWithRoom = await Hotel.findById(hotelId).populate("user", [
            //     "_id"
            // ]);

            response.status(200).json({ hotel: HotelWithRoom });
            // console.log(HotelWithRoom)
        } catch (error) {
            // // // console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    }
);





router.put(
    "/trippleroom/:hotelId",
    authenticate,
    async (request, response) => {
        try {
            let hotelId = request.params.hotelId;


            let hotel = await Hotel.findById(hotelId);

            // check if hotel is exists
            if (!hotel) {
                return response
                    .status(400)
                    .json({ errors: [{ msg: "No Hotel Found" }] });
            }

            let { roomlinks,
                facilities
                , price, description,
                totalrooms,
            } = request.body;



            // console.log(facilities);
            let newRoom = {};
            if (roomlinks.length > 0) newRoom.roomlinks = roomlinks;
            else newRoom.roomlinks = hotel.trippleroom.roomlinks;

            if (facilities.length > 0) newRoom.facilities = facilities;
            else newRoom.facilities = hotel.trippleroom.facilities;

            if (price) newRoom.price = price;
            else newRoom.price = hotel.trippleroom.price;

            if (description) newRoom.description = description;
            else newRoom.description = hotel.trippleroom.description;

            if (totalrooms) newRoom.totalrooms = totalrooms;
            else newRoom.totalrooms = hotel.trippleroom.totalrooms;
            newRoom.listed = true;


            let HotelWithRoom = await Hotel.findOneAndUpdate({ _id: hotelId },
                { $set: { "trippleroom": newRoom } },
                { new: true });


            // hotel.trippleroom = newRoom;
            // hotel = await hotel.save();

            // // console.log(hotel);
            // let HotelWithRoom = await Hotel.findById(hotelId).populate("user", [
            //     "_id"
            // ]);

            response.status(200).json({ hotel: HotelWithRoom });
            // console.log(HotelWithRoom)
        } catch (error) {
            // // // console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    }
);





router.put(
    "/suite/:hotelId",
    authenticate,
    async (request, response) => {
        try {
            let hotelId = request.params.hotelId;
            // let user = await User.findOne({ _id: request.user.id });
            // // console.log("ed" + hotelId);

            let hotel = await Hotel.findById(hotelId);

            // check if hotel is exists
            if (!hotel) {
                return response
                    .status(400)
                    .json({ errors: [{ msg: "No Hotel Found" }] });
            }

            let { roomlinks,
                facilities
                , price, description,
                totalrooms,
            } = request.body;



            // console.log(facilities);
            let newRoom = {};
            if (roomlinks.length > 0) newRoom.roomlinks = roomlinks;
            else newRoom.roomlinks = hotel.suite.roomlinks;

            if (facilities.length > 0) newRoom.facilities = facilities;
            else newRoom.facilities = hotel.suite.facilities;

            if (price) newRoom.price = price;
            else newRoom.price = hotel.suite.price;

            if (description) newRoom.description = description;
            else newRoom.description = hotel.suite.description;

            if (totalrooms) newRoom.totalrooms = totalrooms;
            else newRoom.totalrooms = hotel.suite.totalrooms;
            newRoom.listed = true;


            // hotel.suite = newRoom;
            // hotel = await hotel.save();

            let HotelWithRoom = await Hotel.findOneAndUpdate({ _id: hotelId },
                { $set: { "suite": newRoom } },
                { new: true });

            // // console.log(hotel);
            // let HotelWithRoom = await Hotel.findById(hotelId).populate("user", [
            //     "_id"
            // ]);

            response.status(200).json({ hotel: HotelWithRoom });
            // console.log(HotelWithRoom)
        } catch (error) {
            // // // console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    }
);

module.exports = router;
