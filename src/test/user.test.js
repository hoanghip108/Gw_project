let chai = require('chai');
let chaiHttp = require('chai-http');
import server from '../server';
let should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
import hashPassword from '../helper/hashPassword';
const User = require('../database/models/user');
let jwtToken;
//Our parent block
const emptyDatabase = async () => {
  console.log('empty database');
  await sequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_DATABASE}`);
  await sequelize.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
  await sequelize.query(`USE ${process.env.DB_DATABASE}`);
  await sequelize.sync({ force: true });
  console.log('Database reset and seeded.');
  // await db.sequelize.sync({ force: true });
  // await db.sequelize.close();
};
describe('Authentication test', () => {
  beforeEach((done) => {
    User.destroy({ where: { username: 'newuser001' } }).then(() => {
      User.update({ password: hashPassword('123123') }, { where: { username: 'admin001' } }).then(
        () => {
          done();
        },
      );
    });
    // emptyDatabase();
  });
  it('it should Login success', (done) => {
    const user = { username: 'admin001', password: '123123' };
    chai
      .request(server)
      .post('/api/users/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Success.');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('code', 200);
        expect(res.body).to.have.property('data');

        const data = res.body.data;
        expect(data).to.be.an('object');
        expect(data).to.have.property('user');
        expect(data).to.have.property('accessToken');
        expect(data).to.have.property('refreshToken');

        const user = data.user;
        expect(user).to.be.an('object');
        expect(user).to.have.property('id');
        expect(user).to.have.property('username');
        expect(user).to.have.property('firstName');
        expect(user).to.have.property('lastName');
        // Add more property validations here for the user object

        expect(data.accessToken).to.be.a('string');
        expect(data.refreshToken).to.be.a('string');
        jwtToken = data.accessToken;
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
        expect(res.body).to.have.property('status', 401);
        done();
      });
  });
  it('it should send random password to email', (done) => {
    const data = {
      username: 'client001',
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
        expect(res.body).to.have.property('status', 200);
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
        expect(res.body).to.have.property('status', 400);
        done();
      });
  });
  it('it should register new user', (done) => {
    const data = {
      username: 'newuser001',
      password: '123123',
      email: 'newuser0100@gmail.com',
      firstName: 'Hoang',
      lastName: 'Do',
      phoneNumber: '0333804202',
    };
    chai
      .request(server)
      .post('/api/users/auth/register')
      .send(data)
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          'message',
          'A verification email has been sent to your registered email address. It will be expire after one day. If you not get verification Email click on resend token.',
        );
        expect(res.body).to.have.property('status', 200);
        done();
      });
  });
  it('it should fail to create new duplicate user', (done) => {
    const data = {
      username: 'admin001',
      password: '123123',
      email: 'newuser0100@gmail.com',
      firstName: 'Hoang',
      lastName: 'Do',
      phoneNumber: '0333804202',
    };
    chai
      .request(server)
      .post('/api/users/auth/register')
      .send(data)
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'username is already exists');
        expect(res.body).to.have.property('status', 400);
        done();
      });
  });
  it('it should change password success', (done) => {
    const data = {
      oldPassword: '123123',
      newPassword: '123456',
    };
    chai
      .request(server)
      .put('/api/users/changepassword')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(data)
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Password changed');
        expect(res.body).to.have.property('status', 200);
        done();
      });
  });
});
describe('User test', () => {
  beforeEach((done) => {
    User.update({ isActive: 1 }, { where: { username: 'client001' } }).then(() => {
      done();
    });
  });
  it('it should get current user', (done) => {
    chai
      .request(server)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer ' + jwtToken)
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'User found');
        expect(res.body).to.have.property('status', 200);
        done();
      });
  });
  it('it should failed to get current user', (done) => {
    chai
      .request(server)
      .get('/api/users/profile')
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('errors', 'Wrong username or password');
        expect(res.body).to.have.property('status', 401);
        done();
      });
  });
  it('it should failed to get all users', (done) => {
    chai
      .request(server)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('errors', 'Wrong username or password');
        expect(res.body).to.have.property('status', 401);
        done();
      });
  });
  it('it should get all users', (done) => {
    chai
      .request(server)
      .get('/api/users')
      .set('Authorization', 'Bearer ' + jwtToken)
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pageIndex');
        expect(res.body).to.have.property('pageSize');
        expect(res.body).to.have.property('totalCount');
        expect(res.body).to.have.property('totalPages');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('status', 200);
        done();
      });
  });
  it('it should disable specific user', (done) => {
    chai
      .request(server)
      .delete('/api/users/disable/2')
      .set('Authorization', 'Bearer ' + jwtToken)
      .end((err, res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'User disable successfully');
        expect(res.body).to.have.property('status', 200);
        done();
      });
  });
});
