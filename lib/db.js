import fs from 'fs/promises';
import path from 'path';

// Using a local JSON file to serve as a simple database for the hackathon
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

export async function getDb() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultDb = { tasks: [], volunteers: [], assignments: [] };
      // Ensure the data directory exists
      await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    throw error;
  }
}

export async function saveDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Helper methods
export const db = {
  async getTasks() {
    const data = await getDb();
    return data.tasks || [];
  },
  async getVolunteers() {
    const data = await getDb();
    return data.volunteers || [];
  },
  async getAssignments() {
    const data = await getDb();
    return data.assignments || [];
  },
  async saveTasks(tasks) {
    const data = await getDb();
    data.tasks = tasks;
    await saveDb(data);
  },
  async saveVolunteers(volunteers) {
    const data = await getDb();
    data.volunteers = volunteers;
    await saveDb(data);
  },
  async saveAssignments(assignments) {
    const data = await getDb();
    data.assignments = assignments;
    await saveDb(data);
  }
};
