'use strict';

//env variables
process.env.APP_SECRET = process.env.APPSECRET || 'testing my authentication';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/test';

// npm
const debug = require('debug')('authDeity:user-test');
const expect = require('chai').expect;
const request = require('superagent-use');
const agentPromise = require('superagent-promise-plugin');

// mah apps
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

const port = process.env.PORT || 3000;
const homeUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(agentPromise);

describe('testing the auth-router', function(){
  before((done) => {
    debug('beforeBlock-auth-router-test');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug(`server is running on : ${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('afterBlock-auth-router-test');
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        debug('server closed');
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST for /api/signup', function() {
    after((done)=> {
      debug('afterBlock-auth-POST-test');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a fat sexy token', function(done) {
      debug('auth-POST-test');
      request.post(`${homeUrl}/signup`)
      .send({
        username: 'test',
        password: '123456'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      }).catch(done);
    });

    describe('testing a bad response', function() {
      it('should return a 400', (done) => {
        request.post(`${homeUrl}/signup`)
        .send({})
        .then(done)
        .catch(err => {
          try {
            const res = err.response;
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('BadRequestError');
            done();
          } catch(err) {
            done(err);
          }
        });
      });
    });
  });

  describe('testing GET for /api/signin', function(){
    before((done) =>{
      debug('beforeBlock-auth-GET-test');
      authController.signup({username:'tester', password: '123456'})
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      debug('aftterBlock-auth-GET-test');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return another fat sexy token', function(done){
      debug('auth-GET-test');
      request.get(`${homeUrl}/signin`)
      .auth('tester', '123456')
      .then( res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      }).catch(done);
    });

    describe('testing unathorized access', function() {
      it('should return a 401', (done) => {
        request.get(`${homeUrl}/signin`)
        .auth('tester', '9393939')
        .then(done)
        .catch( err => {
          try {
            const res = err.response;
            expect(res.status).to.equal(401);
            expect(res.text).to.equal('UnauthorizedError');
            done();
          } catch(err) {
            done(err);
          }
        });
      });
    });
  });
});
