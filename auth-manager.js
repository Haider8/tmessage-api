const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const bcrypt = require('bcryptjs');

const userAccountSchema = require('./userAccount');

module.exports = function() {
    var UserAccount;

    return {
        initialize: function(mongoDBConnectionString) {
            return new Promise((resolve, reject) =>  {
                let db = mongoose.createConnection(mongoDBConnectionString);
                db.on('error', err => reject(err));
                db.once('open', _ => {
                    UserAccount = db.model('userAccount', userAccountSchema, 'userAccount');
                    resolve(db);
                });
            });
        },

        register: async function(newUser) {
            if (!newUser.user_name || newUser.user_name == '') {
                throw new Error('user_name is missing or empty');
            }

            if (newUser.password != newUser.password_confirm) {
                throw new Error('password and password_confirm do not match');
            }

            if (!newUser.displayed_name || newUser.displayed_name == '') {
                throw new Error('displayed_name is missing or empty');
            }

            // Hash and update password for new user
            let salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(newUser.password, salt);
            newUser.password = hashedPassword;

            // Create new user document
            let newUserDoc = new UserAccount(newUser);

            return await newUserDoc.save();
        },

        checkExist: async function(user_name) {
            let userData = await UserAccount.findOne({user_name: user_name}).exec();
            return userData ? true : false;
        },

        login: async function(credential) {
            let userData = await UserAccount.findOne({user_name: credential.user_name}).exec();
            if (userData) {
                let passwordMatched = bcrypt.compareSync(credential.password, userData.password);
                if (passwordMatched) {
                    return userData;
                } else {
                    throw new Error('Wrong password');
                }
            } else {
                throw new Error('user_name does not exist');
            }
        }

    };
};