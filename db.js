import { LocalStoragePreset } from 'lowdb/browser'

const defaultData = { cubes: [] }
const db = await LocalStoragePreset('my-db', defaultData)

export const readDB = () => {
  return db.data.cubes
};

export const writeDB = async (cube) => {
  await db.update(({ cubes }) => cubes.push(cube))
};
