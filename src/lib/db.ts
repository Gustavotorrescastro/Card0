import fs from 'fs';
import path from 'path';
const dbPath = path.join(process.cwd(), 'users.json');
if(!fs.existsSync(dbPath)){
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

export const getUsers = () => {
  try{
    if(!fs.existsSync(dbPath)){
      fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  }catch(error){
    console.error('Error in getUsers:', error);
    return [];
  }
};

export const saveUser = (user: any) => {
  try{
    const users = getUsers();
    users.push(user);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
  }catch(error){
    console.error('Error in saveUser:', error);
    throw error;
  }
};
