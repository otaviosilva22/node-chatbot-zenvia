const { PrismaClient } =  require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function createUser(user) {
  return await prisma.user.create({
    data: {
      ...user
    }
  });
}
 async function deleteUser(cellphone) {
  return await prisma.user.delete({
  where: {
    cellphone: cellphone,
  },
})
}
async function findUser(cellphone) {
  const user = await prisma.user.findUnique({
  where: {
    cellphone
    },
})
  return user;
}
async function updateUser(user){
  const updateUser = await prisma.user.update({
    where: {
      cellphone: user.cellphone,
    },
    data: {
      ...user
    },
  });
  return updateUser;
}

module.exports = {
  createUser, findUser, updateUser, deleteUser
}
