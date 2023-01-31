const CardSet = require('../models/cardSet');

module.exports.showAccount = async (req, res) => {
    const cardSets = await CardSet.find({ user: req.user._id })
    res.render('account/show', { cardSets });
    // CardSet.find({ user: req.user._id }, (err, cardSets) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.render('account/show', { cardSets });
    // });
}