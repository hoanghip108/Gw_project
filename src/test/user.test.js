process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
import server from '../server';
let should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

import { login } from '../services/userServices.js';
let jwtToken;
//Our parent block
describe('Authentication', () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });
  /*
   * Test the /GET route
   */
  describe('Authentication', () => {
    it('it should Login success', (done) => {
      const user = { username: 'admin001', password: '123123' };
      chai
        .request(server)
        .post('/api/users/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Success.');
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');

          const data = res.body.data;
          expect(data).to.be.an('object');
          expect(data).to.have.property('user');
          expect(data).to.have.property('token');

          const user = data.user;
          expect(user).to.be.an('object');
          expect(user).to.have.property('id');
          expect(user).to.have.property('username');
          expect(user).to.have.property('firstName');
          expect(user).to.have.property('lastName');
          // Add more property validations here for the user object

          expect(data.token).to.be.a('string');
          jwtToken = data.token;
          done();
        });
    });
    it('it should login fail', (done) => {
      const user = { username: 'admin001', password: 'random' };
      chai
        .request(server)
        .post('/api/users/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message', 'wrong username or password.');
          expect(res.body).to.have.property('code', 401);
          done();
        });
    });
    it('it should send ramdom password to email', (done) => {
      const data = {
        username: 'admin002',
        email: 'hado76767@gmail.com',
      };
      chai
        .request(server)
        .post('/api/users/forgotpassword')
        .send(data)
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Check Your email for new password');
          expect(res.body).to.have.property('code', 200);
          done();
        });
    });
    it('it should not send ramdom password to email', (done) => {
      const data = {
        username: 'admin001',
        email: 'random@gmail.com',
      };
      chai
        .request(server)
        .post('/api/users/forgotpassword')
        .send(data)
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'Account not found');
          expect(res.body).to.have.property('code', 400);
          done();
        });
    });
  });
});
