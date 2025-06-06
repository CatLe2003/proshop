import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'Cat Le',
    email: 'catle@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  },
  {
    name: 'Kieu Nhi',
    email: 'kieunhi@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  },
];

export default users;