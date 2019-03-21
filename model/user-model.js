var db = require('./db');


module.exports = {
    get: function(userId, callback) {
        var sql = "select * from users_info where user_id=?";
        db.getResults(sql, [userId], function(result) {
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback([]);
            }
        });
    },

    getAll: function(callback) {
        var sql = "select * from users_info";
        db.getResults(sql, [], function(results) {
            callback(results);
        });
    },

    validate: function(user, callback) {
        var sql = "select * from users_info where user_email=? and user_password =?";
        db.getResults(sql, [user.u_email, user.u_pass], function(result) {
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback([]);
            }
        })
    },

    insert: function(user, callback) {
        var sql = "INSERT into users_info values(null,?,?,?,?,?,?,?,?)";
        db.execute(sql, [user.name,
            user.u_email,
            user.user_type,
            user.relationship_status,
            user.u_pass, user.u_location,
            user.u_gender,
            user.u_birthday
        ], function(success) {
            callback(success);
        });
    },

    update: function(user, callback) {
        var sql = "UPDATE users_info SET user_name=?,user_email=?,user_relationship_status=?,user_password=?,user_location=?,user_gender=?,user_dob=? where user_id=?";
        db.execute(sql, [
            user.name,
            user.u_email,
            user.relationship_status,
            user.u_pass,
            user.u_location,
            user.u_gender,
            user.u_birthday,
            user.user_id
        ], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    delete: function(id, callback) {
        var sql = "delete from users_info where user_id=?";
        db.execute(sql, [id], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    getAllRestaurant: function(callback) {
        var sql = "select * from restaurant_info";
        db.getResults(sql, [], function(results) {
            callback(results);
        });

    },
    getRestaurantByLocation: function(location, callback) {
        var sql = "select * from restaurant_info where r_location=?";
        db.getResults(sql, [location], (result) => {
            callback(result);
        });
    },
    getRestaurantInfo: function(id, callback) {
        var sql = "select * from restaurant_info where r_id=?";
        db.getResults(sql, [id], (result) => {
            callback(result[0]);
        });
    },

    getAllItems: function(id, callback) {
        var sql = "select * from item_details where r_id=?";
        db.getResults(sql, [id], (results) => {
            callback(results);
        });
    },

    getItem: function(id, callback) {
        var sql = "select * from item_details where i_id=?";
        db.getResults(sql, [id], (result) => {
            callback(result[0]);
        });
    },

    getRestaurant: function(data, callback) {
        var sql = "select r_id from restaurant_info where r_name=? and r_location=?";
        db.getResults(sql, [data.r_name, data.r_loc], function(result) {
            callback(result[0]);
        });

    },

    updateRestaurant: function(data, callback) {
        var sql = "update restaurant_info set r_name=?, r_location=?, r_details=? where r_id=?";
        db.execute(sql, [data.r_name,
            data.r_location,
            data.r_details,
            data.id
        ], function(status) {
            callback(status);
        });
    },

    addItem: function(data, callback) {
        var sql = "insert into item_details values(null,?,?,?)";
        db.execute(sql, [data.r_id, data.i_name, data.i_detail], function(status) {
            callback(status);
        });
    },

    updateItem: function(data, callback) {
        var sql = "update item_details set i_name=?, i_detail=? where i_id=?";
        db.execute(sql, [data.i_name, data.i_detail, data.id], function(status) {
            callback(status);
        });
    },

    deleteItem: function(id, callback) {
        var sql = "delete from item_details where i_id=?";
        db.execute(sql, [id], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    insertIntoRestaurant: function(data, callback) {
        var sql = "insert into restaurant_info values(null,?,?,?)";
        db.execute(sql, [
            data.r_name,
            data.r_loc,
            data.r_details,
        ], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    insertIntoRestaurantItem: function(data, callback) {
        var sql = "insert into item_details values(null,?,?,?),(null,?,?,?),(null,?,?,?),(null,?,?,?),(null,?,?,?)";
        db.execute(sql, [
            data.id, data.item1, data.item1_d,
            data.id, data.item2, data.item2_d,
            data.id, data.item3, data.item3_d,
            data.id, data.item4, data.item4_d,
            data.id, data.item5, data.item5_d
        ], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    insertComment: function(data, callback) {
        var sql = "insert into comment values(null,?,?,?)";
        db.execute(sql, [
            data.u_id,
            data.i_id,
            data.comment,
        ], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    getComment: function(id, callback) {
        var sql = "select * from comment where i_id=?";
        db.getResults(sql, [id], (result) => {
            callback(result);
        });
    },

    deleteComment: function(id, callback) {
        var sql = "delete from comment where c_id=?";
        db.execute(sql, [id], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    deleteRestaurants: function(id, callback) {
        var sql = "delete from restaurant_info where r_id=?";
        db.execute(sql, [id], function(status) {
            if (status) {
                var sql = "delete from item_details where r_id=?";
                db.execute(sql, [id], function(status) {
                    callback(true);
                });
            }
        });
    },

    getAllFoodExperience: function(callback) {
        var sql = "select * from food_experience";
        db.getResults(sql, [], function(results) {
            callback(results);
        });
    },
    insertFoodExperience: function(data, callback) {
        var sql = "insert into food_experience values(null,?,?,?,?,?)";
        db.execute(sql, [
            data.u_id,
            data.u_name,
            data.f_about,
            data.r_loc,
            data.f_exp
        ], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    deleteFoodExperience: function(id, callback) {
        var sql = "delete from food_experience where f_id=?";
        db.execute(sql, [id], function(status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
};