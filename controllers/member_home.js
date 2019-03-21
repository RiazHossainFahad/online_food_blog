var express = require('express');
var userModel = require.main.require('./model/user-model');
var router = express.Router();


//ROUTES
router.get('*', function(req, res, next) {
    if (req.session.u_id != null) {
        next();
    } else {
        res.redirect('/login');
    }
});

router.get('/', (req, res) => {
    userModel.get(req.session.u_id, (result) => {
        var data = { user_info: result };
        res.render('member/index', data);
    });
});

//edit member profile
router.get('/member-edit_account', (req, res) => {
    userModel.get(req.session.u_id, (result_info) => {
        if (result_info.user_id != null) {
            var data = {
                user_info: result_info,
                errors: req.session.errors
            };
            res.render('member/edit_profile', data);
        } else { res.redirect('/home-member') }
    });
});

router.post('/member-edit_account', (req, res) => {

    req.check('name', 'Empty name').notEmpty().rtrim();
    req.check('u_email', 'Invalid e-mail').isEmail();
    req.check('u_pass', 'Invalid password length').isLength({ min: 4 });
    req.check('u_birthday', 'Invalid date of birth').notEmpty().rtrim();

    var err = req.validationErrors();
    if (!err) {
        req.session.errors = null;
        req.session.u_loc = req.body.u_location;
        var update_user = {
            name: req.body.name,
            u_email: req.body.u_email,
            user_type: req.body.user_type,
            relationship_status: req.body.relationship_status,
            u_pass: req.body.u_pass,
            u_location: req.body.u_location,
            u_gender: req.body.u_gender,
            u_birthday: req.body.u_birthday,
            user_id: req.session.u_id
        };

        //update user_info table information
        userModel.update(update_user, (user_update_status) => {
            if (user_update_status) {
                res.redirect('/home-member');
            } else {
                res.redirect('/home-member/member-edit_account');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/home-member/member-edit_account');
    }
});

//view restaurants default by location
router.get('/view-restaurant', (req, res) => {
    userModel.getRestaurantByLocation(req.session.u_loc, (results) => {
        var data = {
            r_list: results
        };
        res.render('member/view_restaurant_list', data);
    });
});

//view single restaurant
router.get('/view/:id', (req, res) => {
    userModel.getRestaurantInfo(req.params.id, (r_result) => {
        userModel.getAllItems(req.params.id, (i_result) => {
            var data = {
                r_info: r_result,
                i_info: i_result
            };
            res.render('member/view_restaurant', data);
        });
    });
});

//view single item
router.get('/view-item/:id', (req, res) => {
    userModel.getItem(req.params.id, (i_result) => {
        userModel.getRestaurantInfo(i_result.r_id, (r_result) => {
            userModel.getComment(req.params.id, (c_result) => {
                userModel.getAll((u_result) => {
                    var data = {
                        r_info: r_result,
                        i_info: i_result,
                        c_info: c_result,
                        u_info: u_result,
                        errors: req.session.errors
                    };
                    req.session.errors = null;
                    res.render('member/view_item', data);
                });
            });
        });
    });
});

//search field
router.get('/search/:value', (req, res) => {
    userModel.getRestaurantByLocation(req.params.value, (result) => {
        res.send(result);
    });
});

//comment on item
router.post('/view-item/:id', (req, res) => {
    req.check('comment', 'Insert something to comment').rtrim().notEmpty();

    var err = req.validationErrors();
    if (!err) {
        req.session.errors = null;
        var data = {
            i_id: req.params.id,
            u_id: req.session.u_id,
            comment: req.body.comment
        };
        userModel.insertComment(data, (status) => {
            res.redirect('/home-member/view-item/' + req.params.id);
        });
    } else {
        req.session.errors = err;
        res.redirect('/home-member/view-item/' + req.params.id);
    }
});

module.exports = router;