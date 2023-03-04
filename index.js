var DEFAULT_PORT = 5000
var DEFAULT_HOST = '127.0.0.1'
var SERVER_NAME = 'healthrecords'

var http = require('http');
const { ObjectId } = require('mongoose');
var mongoose = require("mongoose");


var port = process.env.PORT;

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/patientrecords';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("!!!! Connected to db: " + uristring)
});

// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var patientsSchema = new mongoose.Schema({
    id: ObjectId,
    fullName: String,
    gender: String,
    dateOfBirth: String,
    age: String,
    phoneNumber: String,
    address: String,
    doctor: String,
    department: String
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patients' collection in the MongoDB database
var Patients = mongoose.model('Patients', patientsSchema);


var errors = require('restify-errors');
var restify = require('restify')
    // Create the restify server
    , server = restify.createServer({ name: SERVER_NAME })

if (typeof ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No process.env.IP var, using default: ' + DEFAULT_HOST);
    ipaddress = DEFAULT_HOST;
};

if (typeof port === "undefined") {
    console.warn('No process.env.PORT var, using default port: ' + DEFAULT_PORT);
    port = DEFAULT_PORT;
};


server.listen(port, ipaddress, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Endpoints: http://127.0.0.1:5000/patients method: GET, POST')

})

server
    // Allow the use of POST
    .use(restify.plugins.fullResponse())

    // Maps req.body to req.params
    .use(restify.plugins.bodyParser())

// Get all patients in the system
server.get('/patients', function (req, res, next) {
    console.log('GET request: patients');
    // Find every entity within the given collection
    Patients.find({}).exec(function (error, result) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(200, result);
    });
})

// Create a new patients
server.post('/patients', function (req, res, next) {
    console.log('POST request: patients params=>' + JSON.stringify(req.params));
    console.log('POST request: patients body=>' + JSON.stringify(req.body));
    // Make sure name is defined
    if (req.body.fullName === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('fullName must be supplied'))
    }
    if (req.body.gender === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('gender must be supplied'))
    }
    if (req.body.dateOfBirth === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('dateOfBirth must be supplied'))
    }
    if (req.body.age === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('age must be supplied'))
    }
    if (req.body.phoneNumber === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('phoneNumber must be supplied'))
    }
    if (req.body.address === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('address must be supplied'))
    }
    if (req.body.doctor === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('doctor must be supplied'))
    }
    if (req.body.department === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errors.BadRequestError('department must be supplied'))
    }

    // Creating new patients
    var newPatients = new Patients({
        _id: req.params.id,
        fullName: req.body.fullName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        doctor: req.body.doctor,
        department: req.body.department
    });


    // Create the patients and saving to db
    newPatients.save(function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new Error(JSON.stringify(error.errors)))
        // Send the patients if no issues
        res.send(200, result)
    })
})
