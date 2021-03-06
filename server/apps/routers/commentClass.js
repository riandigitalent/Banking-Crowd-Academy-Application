const express = require("express");
const auth = require("../middleware/auth");
const commentClass = require("../models/commentClass");
const Classs = require("../models/class");

const commentClassRouter = express.Router();

//check role
const checkRole = (...roles) => { //...spread operator extrak isi array 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.send(403) // error fobbriden
        }

        next();
    };
};

//add comment in article
commentClassRouter.post("/class/comment", auth, async(req, res) => {
    try {

        const cekClass = await Classs.find({
            _id: req.body.classId
        }).countDocuments()

        console.log(cekClass)
        if (cekClass == 0) {
            throw Error("Cannot find class!");;
        }

        const commentC = new commentClass({
            userId: req.user._id,
            classId: req.body.classId,
            commentDetail: req.body.comment

        });
        await commentC.save();

        res.status(201).send({ commentC });
    } catch (err) {
        res.status(400).send(err.message);
    }

});

commentClassRouter.patch("/class/comment/:id", auth, async(req, res) => {
    try {
        const commentC = await commentClass.findById(req.params.id);
        //console.log(likeC.userId, req.user._id)
        if (commentC.userId != req.user._id) {
            throw Error("This not your Comment!");;
        }
        commentC.commentDetail = req.body.commentDetail,

            await commentC.save();
        commentC ? res.status(200).send(commentC) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete Comment in Article
commentClassRouter.delete("/class/comment/:id", auth, async(req, res) => {
    const commentC = await commentClass.findByIdAndDelete(req.params.id);
    try {
        commentC ? res.status(204).send("Comment deleted!") : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//get all list comment in article
commentClassRouter.get("/class/comment/all", auth, async(req, res) => {
    try {
        const commentC = await commentClass.find({});
        commentC ? res.status(200).json({
            commentC

        }) : res.status(404).send(err.message);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = commentClassRouter;