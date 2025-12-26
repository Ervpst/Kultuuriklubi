jest.mock('../../models/user.model', () => {
  const UserMock = jest.fn().mockImplementation(function(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.save = jest.fn().mockResolvedValue(this);
  });
  UserMock.findOne = jest.fn();
  return UserMock;
});

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('fake_salt'),
  hash: jest.fn().mockResolvedValue('fake_hashed_pw'),
  compare: jest.fn().mockResolvedValue(true)
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake_jwt_token')
}));

const { signup, login } = require('../../controllers/user.controller');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('User Auth Controllers', () => {
  describe('signup', () => {
    it('should return 422 if email already exists', async () => {
      const req = { body: { name: 'John', email: 'john@example.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      User.findOne.mockResolvedValueOnce({ id: 'abc', email: 'john@example.com' });

      await signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Email already exists", param: "email" }] });
    });

    it('should create a new user and return 200 on successful signup', async () => {
      const req = { body: { name: 'Jane Doe', email: 'jane@domain.com', password: 'pwd123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      User.findOne.mockResolvedValueOnce(null);

      await signup(req, res);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('pwd123', 'fake_salt');
      expect(User).toHaveBeenCalledWith({ name: 'Jane Doe', email: 'jane@domain.com', password: 'fake_hashed_pw' });
      const newUserInstance = User.mock.instances[0];
      expect(newUserInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
    });

    it('should handle failure to save user (server error scenario)', async () => {
      const req = { body: { name: 'Jim', email: 'jim@domain.com', password: 'pass' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      User.findOne.mockResolvedValueOnce(null);
      const fakeUserInstance = { save: jest.fn().mockResolvedValue(null) };
      User.mockImplementation(() => fakeUserInstance);

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringMatching(/Error saving user/) }));
    });
  });

  describe('login', () => {
    it('should return 400 if user with email does not exist', async () => {
      const req = { body: { email: 'noone@nowhere.com', password: 'secret' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      User.findOne.mockResolvedValueOnce(null);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'noone@nowhere.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User with this e-mail does not exist" });
    });

    it('should return 400 if password is incorrect', async () => {
      const req = { body: { email: 'user@site.com', password: 'wrongpwd' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      User.findOne.mockResolvedValueOnce({ id: 'u123', name: 'User', email: 'user@site.com', password: 'hashedpwd' });
      bcrypt.compare.mockResolvedValueOnce(false);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'user@site.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpwd', 'hashedpwd');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Password is not correct" });
    });

    it('should return 200 and token + user info if credentials are correct', async () => {
      const req = { body: { email: 'user@site.com', password: 'rightpwd' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      User.findOne.mockResolvedValueOnce({ id: 'u999', name: 'Test User', email: 'user@site.com', password: 'hashedpwd' });
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValue('jwt_token_123');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'user@site.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('rightpwd', 'hashedpwd');
      expect(jwt.sign).toHaveBeenCalledWith({ _id: 'u999' }, process.env.JWT_SECRET, { expiresIn: "30m" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'jwt_token_123',
        id: 'u999',
        name: 'Test User',
        email: 'user@site.com',
        message: "Auth Succesful"
      });
    });
  });
});
