'use strict';

// environment variables
process.env.APP_SECRET = process.env.APP_SECRET || 'secret string for testing';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const agentPromise = require('superagent-promise-plugin');
const debug = require('debug')('authDeity:deity-test');

// app modules
const deityController = require('../controller/deity-controller');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

// module constants
const port = process.env.PORT || 3000;
const homeUrl = `http://localhost:${port}/api`;
const server = require('../server');

request.use(agentPromise);

describe('testing the deity router', function(){
  before((done) => {
    debug('beforeBlack:RouterTest');
    if(!server.isRunning) {
      server.listen(port, () =>{
        server.isRunning = true;
        debug(`server is up: ${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('afterBlock:RouterTest');
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        debug('server closed');
        done();
      });
      return;
    }
    done();
  });

  describe('testing a endponts for deity resource', function() {
    beforeEach((done) => {
      authController.signup({username: 'tester', password: 'testword'})
      .then(token => this.tempToken = token)
      .then(() => done())
      .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers(),
        deityController.removeAllDeities()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('testing success post with /api/deity', () => {
      it('should return a deity', (done) => {
        request.post(`${homeUrl}/deity`)
        .send({name: 'tester', power: 'testing stuff'})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then( res => {
          debug(res.body);
          expect(res.status).to.equal(200);
          done();
        }).catch(done);
      });
    });
  });
});
