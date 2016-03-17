var mongoose = require('mongoose'),
    assert = require('assert');

var Promotions = require('./models/promotions');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new promotion
    Promotions.create({
        name: 'Uthapizza',
		image : 'imageTIAGO',
		price: '4.55',
		label : 'vai la buscar',
		description : 'descriptionTIAGO' 
    }, function (err, promotion) {
        if (err) throw err;
        console.log('promotion created!');
        console.log(promotion);

        var id = promotion._id;

        // get all the Promotions
        setTimeout(function () {
            Promotions.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, promotion) {
                    if (err) throw err;
                    console.log('Updated promotion!');
                    console.log(promotion);

                    promotion.save(function (err, promotion) {
                        console.log('Updated Comments!');
                        console.log(promotion);

                        db.collection('promotions').drop(function () {
                            db.close();
                        });
                    });
                });
        }, 3000);
    });
});