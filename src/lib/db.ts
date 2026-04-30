import fs from 'fs';
import path from 'path';
const dbPath = path.join(process.cwd(), 'users.json');
let memoryUsers: any[] | null = null;

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
  users.push(user);
  try{
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
  }catch(error){
    console.warn('Production environment detected (read-only FS). Saving in memory only.');
  }
};
