Tasks = new Mongo.Collection("tasks");
Freinds = new Mongo.Collection("freinds");
Groups = new Mongo.Collection("group");
GroupsTasks = new Mongo.Collection("groupMessage");
Expression = new Mongo.Collection("expression");
var which = "",
    preWhich;

if (Meteor.isClient) {
    // This code only runs on the client
    Meteor.subscribe("freinds");
    Meteor.subscribe("groupMessage");
    Tracker.autorun(function() {
        Meteor.subscribe("tasks");
    });
    Meteor.subscribe("group");
    Meteor.subscribe("userData");
    // if (Session.get("count"))
    // Session.set("count", 1);
    Template.body.helpers({
        tasks: function() {
            if (!Session.get("withfreind") && !Session.get("ingroup"))
                Session.set("withfreind", true);
            var howmany;
            if (Session.get("withfreind"))
                howmany = Session.get("amount");
            else
                howmany = Session.get("amountInGroup");
            if (howmany <= 20)
                howmany = 20;
            if (Session.get("history") == 1) {
                if (howmany < 100) {
                    howmany = 20;
                } else {
                    howmany = howmany - 80;
                }
            }
            if (Session.get("withfreind")) {
                // var howmany = 7;
                freind = Session.get("who");
                return Tasks.find({
                    $and: [{
                        count: {
                            $gt: howmany - 20
                        }
                    }, {
                        $or: [{
                            $and: [{
                                freind: freind
                            }, {
                                username: Meteor.user().username
                            }]
                        }, {
                            $and: [{
                                freind: Meteor.user().username
                            }, {
                                username: freind
                            }]
                        }]
                    }]
                });
            } else {
                groupname = Session.get("who");
                return GroupsTasks.find({
                    groupname: groupname,
                    count: {$gt: howmany - 20}
                }, {
                    sort: {
                        createdAt: 1
                    }
                });
            }
        },
        who: function() {
            var str;
            if (Session.get("withfreind"))
                str = "with " + Session.get("who");
            if (Session.get("ingroup"))
                str = "in " + Session.get("who");
            return str;
        },
        background: function() {
            return Session.get("currentBackground");
        }
    });

    Template.body.events({
        "click .history": function() {
            Session.set("history", 1);
        },
        "click .changeBackground": function() {
            if (!Session.get("currentBackground"))
                Session.set("currentBackground", "background3.jpg");
            var Rand;
            var background = ["background3.jpg", "background2.jpg", "background1.jpg", "background4.jpg", "background5.jpg", "background7.jpg", "background7.jpg", "background8.jpg", "background9.jpg", "background10.jpg"];
            while (1) {
                Rand = parseInt(Math.random() * 10);
                if (background[Rand] != Session.get("currentBackground")) {
                    Session.set("currentBackground", background[Rand]);
                    break;
                }
            }
            // alert(Rand);
            // alert(background[Rand]);
            // alert(document.getElementById("allArear").className);
            // document.getElementById('allArear').style.background = "url(background[Rand])";
        },
        "click .cut": function() {
            var mount = Tasks.find({
                $or: [{
                    $and: [{
                        freind: freind
                    }, {
                        username: Meteor.user().username
                    }]
                }, {
                    $and: [{
                        freind: Meteor.user().username
                    }, {
                        username: freind
                    }]
                }]
            }).count();
            // alert(mount);
            Session.set("amount", mount);
            // howmany = Session.get("amount");
        },
        "click .Chathistory": function() {
            Session.set("history", 1);
        },
        "click .addgroup": function() {
            $(".groupName").show();
        },
        // "onmousedown .relative": function(e) {      
        //     var d = document;
        //     var page = {
        //         event: function(evt) {
        //             var ev = evt || window.event;
        //             return ev;
        //         },
        //         PageX: function(evt) {
        //             var e = this.event(evt);
        //             return e.PageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
        //         },
        //         pageY: function(evt) {
        //             var e = this.event(evt);
        //             return e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);
        //         },
        //         layerX: function(evt) {
        //             var e = this.event(evt);
        //             return e.layerX || e.offsetX;
        //         },
        //         layerY: function(evt) {
        //             var e = this.event(evt);
        //             return e.layerY || e.offsetY;
        //         }
        //     }
        //     var x = page.layerX(e), y = page.layerY(e);
        //     if ($(".relative").setCapture) {
        //         $(".relative").setCapture();
        //     } else if (window.captureEvents) {
        //         window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        //     }
        //     d.onmousemove = function(e) {
        //         var tx = page.pageX(e) - x;
        //         var ty = page.pageY(e) - y;
        //         $(".relative").style.left = tx + "px";
        //         $(".relative").style.top = ty + "px";
        //     }
        //      d.onmouseup = function () {
        //         if ($(".relative").releaseCapture) {
        //             $(".relative").releaseCapture();
        //         }
        //         else if (window.releaseEvents) {
        //             window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        //         }
        //         d.onmousemove = null;
        //         d.onmouseup = null;
        //     }
        // },

        "click .mask": function() {
            var mount = Tasks.find({
                $or: [{
                    $and: [{
                        freind: freind
                    }, {
                        username: Meteor.user().username
                    }]
                }, {
                    $and: [{
                        freind: Meteor.user().username
                    }, {
                        username: freind
                    }]
                }]
            }).count();
            Session.set("amount", mount);
        },
        "submit .new-task": function(event) {
            // This function is called when the new task form is submitted
            var text = event.target.text.value,
                freind = Session.get("who"),
                count = Tasks.find({
                    $or: [{
                        $and: [{
                            freind: freind
                        }, {
                            username: Meteor.user().username
                        }]
                    }, {
                        $and: [{
                            freind: Meteor.user().username
                        }, {
                            username: freind
                        }]
                    }]
                }).count() + 1;
            Session.set("amount", count);
            // alert(count);
            if (Session.get("withfreind"))
                Meteor.call("addTask", text, freind, count);
            if (Session.get("ingroup")) {
                var groupname = Session.get("who");
                countInGroup = GroupsTasks.find({
                    groupname: groupname
                }).count() + 1;
                Session.set("amountInGroup", countInGroup);
                Meteor.call("addMessageInGroup", text, groupname, countInGroup);
            }
            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        },
        "click .close": function() {
            $(".container").hide();
        }
    });

    Template.task.events({
        "click .delete": function() {
                Meteor.call("deleteTask", this._id);
            }
            // "click .who": function(event) {
            //     Session.set("who", event.target.innerHTML);
            // }
    });

    Template.task.helpers({
        isOwner: function() {
            return this.owner === Meteor.userId();
        }
    });


    Template.addFreinds.events({
        "click .withfreind": function() {
            Session.set("withfreind", true);
            Session.set("ingroup", false);
        },
        "click .ingroup": function() {
            Session.set("withfreind", false);
            Session.set("ingroup", true);
        },
        "submit .groupName": function(event) {
            var text = event.target.groupName.value;
            Meteor.call("createGroup", text);
            // alert(text);
            // alert(Groups.find({}).count());
            Session.set("ingroup", true);
            Session.set("withfreind", false);
        },
        "click .GroupAdd": function() {
            $(".none").show();
        },
        "click .freindsAdd": function(event) {
            $(".none").show();
        },
        "submit .none1": function(event) {
            var freindsName = event.target.freinds.value;
            if (Session.get("withfreind"))
                Meteor.call("addFreinds", freindsName);
            if (Session.get("ingroup"))
                Meteor.call("addgroup", freindsName);
            event.target.freinds.value = "";
            $(".none").hide();
            return false;
        },
        "click .freindDelete": function(event) {
            // alert("Are you sure to delete your friend!");
            Meteor.call("freindDelete", this._id);
        },
        "click .who": function(event) {
            Session.set("who", event.target.innerHTML);
            $(".container").show();
            preWhich = which;
            which = Session.get("who");
        }
    });

    Template.addFreinds.helpers({
        Allfreinds: function() {
            return Freinds.find({
                username: Meteor.user().username
            });
        },
        Allgroups: function() {
            return Groups.find({
                username: Meteor.user().username
            });
        },
        withfreind: function() {
            if (!Session.get("withfreind") && !Session.get("ingroup"))
                Session.set("withfreind", true);
            return Session.get("withfreind");
        },
        ingroup: function() {
            if (!Session.get("withfreind") && !Session.get("ingroup"))
                Session.set("ingroup", false);
            return Session.get("ingroup");
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
    });

}

    // Template.expressions.helpers({
         
    // });

    //  Template.expressions.events({
    //     "click #expression": function() {
    //         $(".Allexpression").show();
    //     },
    //     "click .whichImage": function(event) {
    //          var information = $("#information").value, ;
    //     }
    //  });
Meteor.methods({
    addMessageInGroup: function(text, groupname, count) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        if (text == "")
            throw new Meteor.Error("the sending content shouldn't be null!");
        GroupsTasks.insert({
            username: Meteor.user().username,
            groupname: groupname,
            text: text,
            createdAt: new Date(),
            count: count
        });
    },
    createGroup: function(groupname) {
        if (groupname == "")
            throw new Meteor.Error("the group name shouldn't be nuul!");
        var isExit = Groups.find({
            groupname: groupname
        }).count();
        if (isExit > 0)
            throw new Meteor.Error("the group has been esisted");
        var hasGrouper = Groups.find({
            groupname: groupname
        }).count();
        if (hasGrouper > 0)
            throw new Meteor.Error("the group has been exited!");
        Groups.insert({
            groupname: groupname,
            username: Meteor.user().username,
            userId: true,
            createdAt: new Date()
        });
    },
    addgroup: function(groupname) {
        if (groupname == "")
            throw new Meteor.Error("the group name shouldn't be null!");
        var isExit = Groups.find({
            groupname: groupname
        }).count();
        if (isExit == 0)
            throw new Meteor.Error("the group has not been existed");
        var hasGrouper = Groups.find({
            username: Meteor.user().username,
            groupname: groupname
        }).count();
        if (hasGrouper > 0)
            throw new Meteor.Error("you have been in the group!");
        Groups.insert({
            groupname: groupname,
            username: Meteor.user().username,
            userId: false,
            createdAt: new Date()
        });
    },
    addFreinds: function(freindId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var isExit = Meteor.users.find({
            username: freindId
        }).count();
        var isFreind = Freinds.find({
            $and: [{
                freinds: freindId
            }, {
                username: Meteor.user().username
            }]
        }).count();
        if (isFreind > 0)
            throw new Meteor.Error("the kid has been your friend");
        if (isExit == 0) {
            throw new Meteor.Error("Do not have such a user");
        }
        if (freindId === Meteor.user().username) {
            throw new Meteor.Error("the form of name is invalid!")
        }
        Freinds.insert({
            username: Meteor.user().username,
            freinds: freindId,
            createdAt: new Date()
        });
    },
    freindDelete: function(freind) {
        var item = Freinds.findOne(freind);
        Freinds.remove(freind);
    },

    addTask: function(text, freind, count) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        if (text == "")
            throw new Meteor.Error("the sending content shouldn't be null!");
        // alert(count);
        Tasks.insert({
            text: text,
            count: count,
            freind: freind,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteTask: function(taskId) {
        var task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }

        Tasks.remove(taskId);
    }
});

if (Meteor.isServer) {
    // Only publish tasks that are public or belong to the current user
    Meteor.publish("tasks", function() {
        return Tasks.find({});
    });
    Meteor.publish("freinds", function() {
        return Freinds.find();
    });
    Meteor.publish("userData", function() {
        if (this.userId) {
            return Meteor.users.find();
        } else {
            this.ready();
        }
    });
    Meteor.publish("group", function() {
        return Groups.find({});
    });
    Meteor.publish("groupMessage", function() {
        return GroupsTasks.find();
    });
    Meteor.publish("expression", function() {
        return Expression.find();
    });
    // Meteor.startup
}