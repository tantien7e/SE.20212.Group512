const ExtractJWT = require('passport-jwt').ExtractJwt;
const Strategy = require('passport-jwt').Strategy;
const fs = require('fs');
const path = require('path');
const Staffs = require('../models/staffs/staffs.model');

const pathToKey = path.join(__dirname, '..', 'lib', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

module.exports = passport => {
    passport.use(new Strategy(options, (jwt_payload, done) => {

        Staffs.findById(jwt_payload.sub, (err, staff) => {
            if (err) {
                return done(err, false);
            } else {
                if (staff) {
                    return done(null, staff);
                } else {
                    return done(null, false);
                }
            }
        });
    }));
}