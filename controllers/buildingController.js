var Building = require('../models/building');
var formHandler = require('./utilities/formHandler');

//routes for the home page
exports.index_get = (req, res) => {
  res.render('index');
};

//post route
exports.index_post = formHandler.handle_form('index');

//routes that handle after a building has been searched
exports.nearestTap_get = (req, res, next) => {
    var bldg_code = req.params.code.toUpperCase();
    // res.send(bldg_code);
    if(bldg_code.length < 6) {
        // res.send(bldg_code.length);
        Building.findOne({'code': bldg_code})
            .exec(function(err, found) {
                if(err) { return next(err) };

                if(found) {
                    // res.send(found);
                    // res.send(found.name);
                    if(found.has_tap == true) {
                        // res.send("Nearest tap to "
                        // + found.name + ": " + found.tap_locs);
                        res.render('nearest_details', {message: "Filtered water tap(s)  in "
                        + found.name + "  :  " + found.tap_locs});
                    } else {

                        Building.findOne({'blg_num': found.nearest})
                            .exec(function(err, alt_found) {
                                if(err) { return next(err) };
                                res.render('nearest_details', {message: "No taps in this building. :(",
                                    closest: "Closest taps are at: " +
                                    alt_found.name + ": " + alt_found.tap_locs});
                            })
                    }
                } else {
                    next();
                }
            })
    } else {
        next();
    }
}

exports.nearestTap_post = formHandler.handle_form('nearest_details');

//notice all routes have forms.
