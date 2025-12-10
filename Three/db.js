import { LocalStoragePreset } from 'lowdb/browser'

const defaultData = { cubes: [] }
const db = await LocalStoragePreset('my-db', defaultData)

// read cube data from lowdb
export const readDB = () => {
  return db.data.cubes
};

// write cube data to lowdb
export const writeDB = async (cube) => {
  await db.update(({ cubes }) => cubes.push(cube))
};
