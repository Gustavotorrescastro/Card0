import fs from 'fs';
import path from 'path';

// Define o caminho para o "banco de dados" em formato JSON
const dbPath = path.join(process.cwd(), 'users.json');

// Inicializa o arquivo se ele não existir
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

export const getUsers = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const saveUser = (user: any) => {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};
