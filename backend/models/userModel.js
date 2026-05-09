const axios = require('axios');

const API = 'http://localhost:3001/users';

exports.findUserByUsername = async (username) => {
  const res = await axios.get(`${API}?username=${username}`);
  return res.data[0];
};

exports.createUser = async (user) => {
  const res = await axios.post(API, user);
  return res.data;
};