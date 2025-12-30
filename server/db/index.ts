import {Sequelize, DataTypes} from 'sequelize';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {logger} from '../utils/logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db: { [key: string]: any; sequelize?: Sequelize; Sequelize?: typeof Sequelize } = {};

const sequelize = new Sequelize('jmclimousine', process.env.DB_USER!, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

sequelize.authenticate()
    .then(() => {
        logger.info('Database connection established successfully');
    })
    .catch(err => {
        logger.error('Unable to connect to the database', { error: err.message });
    });


(async () => {
    const files = await fs.promises.readdir(__dirname);
    for (const file of files) {
        if (file.startsWith('.') || file === 'index.ts' || file === 'index.js') continue;
        const modelPath = path.join(__dirname, file);
        const module = await import(modelPath);
        const model = module.default(sequelize, DataTypes);
        db[model.name] = model;
    }

    Object.keys(db).forEach((modelName) => {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db);
        }
    });

    // await sequelize.sync({ alter: true, force: true }); // ⬅️ Sync models here, and reset the db
    await sequelize.sync({ alter: true }); // ⬅️ Sync models here
    logger.info('All models synchronized successfully');
    // console.log('Models sync is disabled.');
})();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;