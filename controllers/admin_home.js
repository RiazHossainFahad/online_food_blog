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
        res.render('admin/index', data);
    });
});

//edit admin profile
router.get('/admin-edit_account', (req, res) => {
    userModel.get(req.session.u_id, (result_info) => {
        if (result_info.user_id != null) {
            var data = {
                user_info: result_info,
                errors: req.session.errors
            };
            res.render('admin/edit_profile', data);
        } else { res.redirect('/home-admin') }
    });
});

router.post('/admin-edit_account', (req, res) => {

    req.check('name', 'Empty name').notEmpty().rtrim();
    req.check('u_email', 'Invalid e-mail').isEmail();
    req.check('u_pass', 'Invalid password length').isLength({ min: 4 });
    req.check('u_birthday', 'Invalid date of birth').notEmpty().rtrim();

    var err = req.validationErrors();
    if (!err) {
        req.session.errors = null;
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
                res.redirect('/home-admin');
            } else {
                res.redirect('/home-admin/admin-edit_account');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/home-admin/admin-edit_account');
    }
});

router.get('/user_list', (req, res) => {

    userModel.getAll(function(results) {
        var data = {
            admin_id: req.session.u_id,
            uList: results
        };
        res.render('admin/user_list', data);
    });
});

router.get("/delete/:id", function(req, res) {

    userModel.delete(req.params.id, function(status) {
        res.redirect('/home-admin/user_list');
    });
});

//add restaurants & menus
router.get('/add_restaurants', (req, res) => {
    var data = {
        errors: req.session.errors
    };
    res.render('admin/add_restaurants', data);
});

router.post('/add_restaurants', (req, res) => {
    req.check('count', 'add 5 item').rtrim().isDivisibleBy(5);

    var err = req.validationErrors();
    if (!err) {
        var data = {
            r_name: req.body.r_name,
            r_loc: req.body.r_location,
            r_details: req.body.r_about,
            item1: req.body.item1,
            item1_d: req.body.about1
        };

        userModel.insertIntoRestaurant(data, (status) => {
            if (status) {
                userModel.getRestaurant(data, function(result) {
                    if (result) {
                        var data = {
                            item1: req.body.item1,
                            item1_d: req.body.about1,
                            item2: req.body.item2,
                            item2_d: req.body.about2,
                            item3: req.body.item3,
                            item3_d: req.body.about3,
                            item4: req.body.item4,
                            item4_d: req.body.about4,
                            item5: req.body.item5,
                            item5_d: req.body.about5,
                            id: result.r_id
                        };
                        userModel.insertIntoRestaurantItem(data, function(st) {
                            if (st) {
                                res.redirect('/home-admin');
                            }
                        });
                    }

                });
            } else {
                res.redirect('/home-admin/add_restaurants');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/home-admin/add_restaurants');
    }
});

//show restaurants list 
router.get('/restaurants_list', (req, res) => {
    userModel.getAllRestaurant(function(result) {
        if (result.length) {
            var data = {
                r_list: result
            }
            res.render('admin/restaurants_list', data);
        }
    });
});

//edit restaurant info and menus
router.get('/edit/:id', (req, res) => {
    userModel.getRestaurantInfo(req.params.id, (r_results) => {
        req.session.r_id = r_results.r_id;
        if (r_results.length != 0) {
            userModel.getAllItems(req.params.id, (i_results) => {
                if (i_results.length != 0) {
                    var data = {
                        r_info: r_results,
                        i_info: i_results,
                        errors: req.session.errors
                    };
                    res.render('admin/edit_restaurant', data);
                }
            });
        } else { res.redirect('/home-admin/restaurants_list'); }
    });
});

//edit restaurant info
router.post('/edit-restaurant/:id', (req, res) => {
    var data = {
        id: req.params.id,
        r_name: req.body.r_n,
        r_location: req.body.r_loc,
        r_details: req.body.r_d
    };
    userModel.updateRestaurant(data, (status) => {
        res.redirect('/home-admin/restaurants_list');
    });
});

//delete restaurant
router.get('/delete-restaurant/:id', (req, res) => {
    userModel.deleteRestaurants(req.params.id, (status) => {
        res.redirect('/home-admin/restaurants_list');
    });
});

//add item
router.post('/add-item/:id', (req, res) => {
    var data = {
        r_id: req.params.id,
        i_name: req.body.i_n,
        i_detail: req.body.i_d
    };
    userModel.addItem(data, (status) => {
        res.redirect('/home-admin/restaurants_list');
    });
});

//edit item
router.post('/edit-item/:id', (req, res) => {
    var data = {
        id: req.params.id,
        i_name: req.body.i_n,
        i_detail: req.body.i_d
    };
    userModel.updateItem(data, (status) => {
        res.redirect('/home-admin/edit/' + req.session.r_id);
    });
});

//delete item
router.get('/delete-item/:id', (req, res) => {
    userModel.deleteItem(req.params.id, (status) => {
        res.redirect('/home-admin/edit/' + req.session.r_id);
    });
});

//view restaurants default by location
router.get('/view-restaurant', (req, res) => {
    userModel.getRestaurantByLocation(req.session.u_loc, (results) => {
        var data = {
            r_list: results
        };
        res.render('admin/view_restaurant_list', data);
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
            res.render('admin/view_restaurant', data);
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
                    res.render('admin/view_item', data);
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

//delete comment
router.get('/delete-comment/:c_id/:i_id', (req, res) => {
    userModel.deleteComment(req.params.c_id, (status) => {
        res.redirect('/home-admin/view-item/' + req.params.i_id);
    });
});

module.exports = router;