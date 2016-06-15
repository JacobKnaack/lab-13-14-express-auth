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
//const authController = require('../controller/auth-controller');
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
  });
});
