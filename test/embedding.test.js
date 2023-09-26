const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require("../pluginServer")(null, null, 3001);

debugger;
let originalConsoleError;
describe('Embedding API Tests', function () {

    let capturedLogs = [];
    // Backup the original console.error
    let originalConsoleError;
    let originalConsoleLog;
    beforeEach(function () {
        // Backup the original console.log
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
        console.error = function () {
            capturedLogs.push({error: arguments});
        };
        // Override console.log to capture logs
        console.log = function () {
            capturedLogs.push({log: arguments});
        };
    });

    afterEach(function () {
        // Restore the original console.log
        console.log = originalConsoleLog;

        if (this.currentTest.state == "failed") {
            console.log("Verbose logs for failed test:");
            capturedLogs.forEach(log => console.log(log));
        }

        // Clear captured logs for the next test
        capturedLogs = [];
    });

    it('should return an error when text is missing', function (done) {
        request(app)
            .post('/api/getSentenceVectors')
            .send({})
            .end(function (err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.body.error).to.equal('Text is required.');
                done();
            });
    });

    it('should return embeddings for valid text input', function (done) {
        request(app)
            .post('/api/getSentenceVectors')
            .send({text: 'Hello there ChatGPT'})
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
});
