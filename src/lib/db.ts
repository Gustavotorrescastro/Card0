import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'users.json');
let memoryUsers: any[] | null = null;

const persistUsers = (users: any[]) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
  } catch {
    console.warn('Production environment detected (read-only FS). Saving in memory only.');
  }
};

export const getUsers = () => {
  if(memoryUsers !== null){
    return memoryUsers;
  }
  try{
    if(!fs.existsSync(dbPath)){
      fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    memoryUsers = Array.isArray(parsed) ? parsed : [];
    return memoryUsers;
  }catch(error){
    console.error('Error in getUsers:', error);
    memoryUsers = [];
    return memoryUsers;
  }
};

export const saveUser = (user: any) => {
  const users = getUsers();
  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
  users.push({
    ...user,
    emailVerified: false,
    verificationToken,
    verificationExpires,
  });
  persistUsers(users);
  return verificationToken;
};

export const verifyUserEmail = (token: string): { success: boolean; message: string } => {
  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.verificationToken === token);

  if (userIndex === -1) {
    return { success: false, message: 'Token inválido.' };
  }

  const user = users[userIndex];

  if (user.emailVerified) {
    return { success: true, message: 'E-mail já verificado anteriormente.' };
  }

  if (new Date(user.verificationExpires) < new Date()) {
    return { success: false, message: 'Token expirado. Solicite um novo cadastro.' };
  }

  users[userIndex] = {
    ...user,
    emailVerified: true,
    verificationToken: null,
    verificationExpires: null,
  };
  persistUsers(users);

  return { success: true, message: 'E-mail verificado com sucesso!' };
};

export const getUserByEmail = (email: string) => {
  const users = getUsers();
  return users.find((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase());
};