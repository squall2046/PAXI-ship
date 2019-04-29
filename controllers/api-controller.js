const db = require("../models/index");

// Defining methods for the booksController
module.exports = {

  createPack: function (req, res) {
    db.Pack.create(req.body)
      .then(dbModel => {
        return db.User.findOneAndUpdate({ _id: dbModel.userId }, { $push: { pack: dbModel._id } }, { new: true });
      })
      .then(dbUser => {
        res.json(dbUser);
      })
      .catch(err => res.status(422).json(err));
  },

  findUserPacks: function (req, res) {
    db.User.findById(req.params.userId)
      .populate("pack")
      .populate("carrier")
      .sort({ date: -1 })
      .then(dbModel => {
        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },

  findUnpicked: function (req, res) {
    db.Pack.find({ isPicked: false })
      .sort({ date: -1 })
      .then(dbModel => { res.json(dbModel) })
      .catch(err => res.status(422).json(err));
  },

  findAllPacks: function (req, res) {
    db.Pack.find()
      .sort({ date: -1 })
      .then(dbModel => { res.json(dbModel) })
      .catch(err => res.status(422).json(err));
  },

  findUser: function (req, res) {
    db.User.find({ _id: req.params.id })
      .then(dbModel => { res.json(dbModel) })
      .catch(err => res.status(422).json(err));
  },


  updateCarrier: function (req, res) {
    db.Pack.findOneAndUpdate({ _id: req.params.packId }, { isPicked: true, carrierId: req.params.userId })
      .then(dbModel => {
        return db.User.findOneAndUpdate({ _id: req.params.userId }, { $push: { carrier: req.params.packId } }, { new: true });
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  updateDelivered: function (req, res) {
    db.Pack.findOneAndUpdate({ _id: req.params.packId }, { isDelivered: true })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  createMsgBtn: function (req, res) {
    db.Message.create(req.body)
      .then(newMsg => {
        return db.User.findOneAndUpdate({ _id: req.body.userid }, { $push: { message: newMsg._id } }, { new: true });
      })
      .then(dbUser => {
        res.json(dbUser);
      })
      .catch(err => res.status(422).json(err));
  },

  replyMsgBtn: function (req, res) {
    db.Message.create(req.body)
      .then(reMsg => {
        if (req.params.loginid === reMsg.userid) {
          return db.User.findOneAndUpdate({ _id: reMsg.carrierid }, { $push: { message: reMsg._id } }, { new: true });
        }
        else if (req.params.loginid === reMsg.carrierid) {
          return db.User.findOneAndUpdate({ _id: reMsg.userid }, { $push: { message: reMsg._id } }, { new: true });
        }
      })
      .then(dbUser => {
        res.json(dbUser);
      })
      .catch(err => res.status(422).json(err));
  },

  removeMsgBtn: function (req, res) {
    db.Message.deleteOne({ _id: req.params.msgId })
      .then(dbUser => {
        res.json(dbUser);
      })
      .catch(err => res.status(422).json(err));
  },

  findAllMsg: function (req, res) {
    db.User.find({ _id: req.params.userId })
      .populate("message")
      .then(dbModel => {
        res.json(dbModel[0]);
      })
      .catch(err => res.status(422).json(err));
  },
};
