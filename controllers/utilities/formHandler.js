const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Building = require('../../models/building');

function parseBody(bodyName) {
    var identifier;
    var isCode = false;

    if (bodyName.length > 4) {
        //must be processing the full building name
        identifier = bodyName.substr(0, bodyName.indexOf(':') - 1);
    } else {
        //must be the 3-4 digit code
        isCode = true;
        identifier = bodyName.toUpperCase();
    }


    if(isCode) {
        return [
            new Building({
                code: identifier
            }),
            { code: identifier }
        ]
    } else {
        return [
            new Building({
                name: identifier
            }),
            { name: identifier }
        ]
    }

}

exports.handle_form = function(template) {
    return [
      //validate
      body('name', 'Need a building to find a tap.').isLength({
        min: 1
      }).trim(),

      //sanitize
      sanitizeBody('name').trim().escape(),

      (req, res, next) => {
        const errors = validationResult(req);

        //create new building object using escaped and trimmed data
        var [building, query] = parseBody(req.body.name);
        // res.send([building, query]);

        if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('index', {
            title: "Find a tap",
            building: building,
            errors: errors.array()
          });
        } else {
            Building.findOne(query)
                .exec( function(err, found)  {
                    if(err) { return next(err) };

                    if(found) {
                        res.redirect(found.url);
                    } else {
                        res.render(template, {
                          title: "Find a tap",
                          building: building,
                          errors: {},
                          notFound: true
                        });
                    }
                })
        }
      }
    ];
}
