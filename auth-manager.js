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
            if (newUser.userName === '') {
                throw new Error('Username is empty');
            }

            if (newUser.password != newUser.passwordConfirm) {
                throw new Error('Passwords do not match');
            }

            // Hash and update password for new user
            let salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(newUser.password, salt);
            newUser.password = hashedPassword;

            // Create new user document
            let newUserDoc = new UserAccount(newUser);

            return await newUserDoc.save();
        },

        checkExist: async function(userName) {
            let userData = await UserAccount.findOne({userName: userName}).exec();
            return userData ? true : false;
        },

        login: async function(credential) {
            let userData = await UserAccount.findOne({userName: credential.userName}).exec();
            let passwordMatched = bcrypt.compareSync(credential.password, userData.password);
            if (passwordMatched) {
                return userData;
            } else {
                throw new Error('Wrong password');
            }
        }

    };
};