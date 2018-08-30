import { User } from '../types'

const passport = require('passport');

import { Strategy as LocalStrategy } from 'passport-local';

/**
 * initialisiert Passport - siehe https://entwickler.de/online/javascript/passport-579800408.html
 */

export const initPassport = (trustedUser: string, trustedPassword: string) => {
    passport.use(new LocalStrategy(
        function(username: string, password: string, done) {
            if (username === trustedUser && password === trustedPassword) {
                return done(null, {name: 'admin'});
            }
            return done(null, false);
        }
    ));
    passport.serializeUser(function(user: User, cb: any) {
        cb(null, user);
    });
    passport.deserializeUser(function(user: User, cb: any) {
        cb(null, user);
    });
};