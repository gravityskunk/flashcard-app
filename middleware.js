const { cardSetSchema, cardSchema } = require('./schemas.js')
const ExpressError = require('./utilities/ExpressError');
const CardSet = require('./models/cardSet');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.originalUrl) {
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const cardSet = await CardSet.findById(id);
    if (!cardSet.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/cardSets/${id}`);
    }
    next();
}

module.exports.validateCardSet = (req, res, next) => {
    const { error } = cardSetSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateCard = (req, res, next) => {
    const { error } = cardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.returnToSession = (req, res, next) => {
    if (req.headers.referer && req.session.returnTo == undefined) {
        req.session.returnTo = req.headers.referer;
    }
    next();
}

module.exports.returnToLocal = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next();
}