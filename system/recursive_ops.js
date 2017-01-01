const winston = require('winston');
const rfr = require('rfr');
const moment = require('moment');
const GlobalFn = rfr('system/globals.js');

const Agenda = require('agenda');
const mongoConnectionString = "mongodb://localhost/agenda";
const agenda = new Agenda({
    db: {
        address: mongoConnectionString
    }
});

agenda.define('broadcast', {
    priority: 'high',
    concurrency: 20
}, function(job, done) {
    GlobalFn.retrieveSplitAndBroadcast();
    done();
});

agenda.define('start replica', function(job) {
    GlobalFn.isReplicaConnected();
});

agenda.define('clean friend list', function(job) {
    GlobalFn.cleanFriendList();
});

agenda.on('ready', function() {
    agenda.every('3 seconds', 'broadcast');
    agenda.every('1 minutes', 'start replica');
    agenda.every('24 hours','clean friend list');
    agenda.start();
});