
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCommentOwnership =function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flas("error", "Comment not found")
            res.redirect("back");
        }else{
            //does user own the campground
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You're not the owner. Stop that")
                res.redirect("back")
            }
        }
        });
    } else{
        res.redirect("back")
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found")
            res.redirect("back");
        }else{
            //does user own the campground
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You're not the owner, stop")
                res.redirect("back")
            }
        }
        });
    } else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in!")
    res.redirect("/login");
}

module.exports = middlewareObj;