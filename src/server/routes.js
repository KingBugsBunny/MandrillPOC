var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var mandrill = require('mandrill-api/mandrill');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', four0four.notFoundMiddleware);

//create instance of Mandrill and designate API key
var m = new mandrill.Mandrill('fRpV-9-cdN04u7RHKn9N4w');
//Establish parameters here, refer to documentation to see all available parameters (there's a large amount)
var params = {
    'message': {
        'from_email':'robert.brush@briebug.com',
        'to':[{'email':'m8r-go9mnv@mailinator.com'}],
        'subject': 'Hello from BrieBug Mandrill!',
        //this parameter can be html or text and is the actual message sent
        'html': 'This is an example email sent from MandrillPOC to show mandrill use',
        //this parameter will default to a text message if the users email service doesn't support html
        'autotext': 'true',
        //mandrill offers analytics through their console to track opened URLs as well as clicked html
        'tracks_open': 'true',
        'track_clicks': 'true',
    }
};

module.exports = router;

//////////////

function getPeople(req, res, next) {
    res.status(200).send(data.people);

    //using mandrill send mail
    m.messages.send(params, function(res) {
        console.log(res);
    }, function(err) {
        console.log(err);
    });

}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function(p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}
