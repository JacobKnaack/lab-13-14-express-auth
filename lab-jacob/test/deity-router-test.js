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
//const User = require('../model/user');

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

  var newUser = {username: 'tester', password: 'testword'}; // global user variable for testing

  describe('testing endpoints for the deity resource', function() {
    before((done) => {
      authController.signup(newUser)
      .then(token => newUser.token = token)
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      Promise.all([
        userController.removeAllUsers(),
        deityController.removeAllDeities()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('testing successful POST on /api/deity', () => {
      it('should return a deity', (done) => {
        request.post(`${homeUrl}/deity`)
        .send({name: 'tester', power: 'testing stuff'})
        .set({Authorization: `Bearer ${newUser.token}`})
        .then( res => {
          debug(res.body);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('tester');
          done();
        }).catch(done);
      });
    });

    describe('testing an unauthorized error on POST', () => {
      it('should return a 401', (done) => {
        request.post(`${homeUrl}/deity`)
        .send({name: 'testing', power: 'super tests'})
        .set({})
        .then(done)
        .catch((err) => {
          try {
            const res = err.response;
            expect(res.status).to.equal(401);
            expect(res.text).to.equal('UnauthorizedError');
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    describe('testing bad request on POST', () => {
      it('should return a 400', (done) => {
        request.post(`${homeUrl}/deity`)
        .send({})
        .set({Authorization: `Bearer ${newUser.token}`})
        .then(done)
        .catch((err) => {
          try {
            const res = err.response;
            expect(res.status).to.equal(400);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    describe('testing successful GET on /api/deity', () => {
      before((done) => {
        debug('GET-beforeBlock');
        request.post(`${homeUrl}/deity`)
        .send({name: 'something', power: 'testy testers'})
        .set({Authorization: `Bearer ${newUser.token}`})
        .then(res => {
          debug(res.body);
          this.tempDeity = res.body;
          done();
        }).catch((err) => {
          debug('ERROR:', err.message);
          done();
        });
      });

      it('should return a deity', (done) => {
        request.get(`${homeUrl}/deity/${this.tempDeity._id}`)
        .set({Authorization: `Bearer ${newUser.token}`})
        .then( res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('something');
          done();
        }).catch(done);
      });

      // not working
      describe('testing bad request on GET', () => {
        it('should return a 400', (done) => {
          request.get(`${homeUrl}/deity/`)
          .set({Authorization: `Bearer ${newUser.token}`})
          .then(done)
          .catch((err) => {
            try {
              const res = err.response;
              expect(res.status).to.equal(400);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      });

      describe('testing not found on GET', () => {
        it('should return a 404', (done) => {
          request.get(`${homeUrl}/deity/125712635`)
          .set({Authorization: `Bearer ${newUser.token}`})
          .then(done)
          .catch((err) => {
            try {
              const res = err.response;
              expect(res.status).to.equal(404);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      });

      describe('testing unauthorized on GET', () => {
        it('should return a 401', (done) => {
          request.get(`${homeUrl}/deity/${this.tempDeity._id}`)
          .set({})
          .then(done)
          .catch((err) => {
            try {
              const res = err.response;
              expect(res.status).to.equal(401);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      });
    });

    describe('testing successful PUT on /api/deity', () => {
      before((done) => {
        debug('PUT-beforeBlock');
        request.post(`${homeUrl}/deity`)
        .send({name: 'something else', power: 'zesty zesters'})
        .set({Authorization: `Bearer ${newUser.token}`})
        .then(res => {
          debug(res.body);
          this.tempDeity = res.body;
          done();
        }).catch((err) => {
          debug('ERROR:', err.message);
          done();
        });
      });

      it('should return an updated deity', (done) => {
        request.put(`${homeUrl}/deity/${this.tempDeity._id}`)
        .send({name: 'sammy'})
        .set({Authorization: `Bearer ${newUser.token}`})
        .then( res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('sammy');
          done();
        }).catch(done);
      });

      // not working
      describe('testing bad request on PUT', () => {
        it('should return a 400', (done) => {
          request.put (`${homeUrl}/deity/`)
          .send({power: 'something'})
          .set({Authorization: `Bearer ${newUser.token}`})
          .then(done)
          .catch(err => {
            try {
              const res = err.response;
              expect(res.status).to.equal(400);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      });

      //not working
      describe('testing not found on PUT', () => {
        it('should return a 404', (done) => {
          request.put (`${homeUrl}/deity/27469782164`)
          .send({name: 'another name'})
          .set({Authorization: `Bearer ${newUser.token}`})
          .then(done)
          .catch(err => {
            try {
              const res = err.response;
              expect(res.status).to.equal(404);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      });

      describe('testing unauthorized on PUT', () => {
        it('should return a 401', (done) => {
          request.put (`${homeUrl}/deity/${this.tempDeity._id}`)
          .send({name: 'another name'})
          .set({})
          .then(done)
          .catch(err => {
            try {
              const res = err.response;
              expect(res.status).to.equal(401);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      });
    });

    describe('testing successful DELETE on /api/deity', () => {
      before((done) => {
        debug('DELETE-beforeBlock');
        request.post(`${homeUrl}/deity`)
        .send({name: 'another test', power: 'testitude'})
        .set({Authorization: `Bearer ${newUser.token}`})
        .then(res => {
          debug(res.body);
          this.tempDeity = res.body;
          done();
        }).catch((err) => {
          debug('ERROR:', err.message);
          done();
        });
      });

      it('should delete a deity', (done) => {
        request.del(`${homeUrl}/deity/${this.tempDeity._id}`)
        .set({Authorization: `Bearer ${newUser.token}`})
        .then(res => {
          expect(res.status).to.equal(204);
          expect(res.body._id).to.equal(undefined);
          done();
        }).catch(done);
      });
    });
  });
});
