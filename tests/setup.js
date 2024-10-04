import { sequelizeConn } from "../src/core/config/database.js";

beforeAll(async () => {
  await sequelizeConn.sync({ force: true });
});

beforeEach(async () => {
  const models = sequelizeConn.models;
  await Promise.all(
    Object.keys(models).map((key) =>
      models[key].destroy({ truncate: true, force: true })
    )
  );
});

afterAll(async () => {
  await sequelizeConn.close();
});
