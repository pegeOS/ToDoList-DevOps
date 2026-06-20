const dotenv = require('dotenv');
dotenv.config();

const PKGS = ['@tursodatabase/serverless', '@tursodatabase/database', '@tursodatabase/serverless-client'];

async function getDb() {
    const url = process.env.TURSO_URL;
    const authToken = process.env.TURSO_API_KEY;
    if (!url || !authToken) throw new Error('TURSO_URL or TURSO_API_KEY not set in .env');

    let pkg = null;
    for (const name of PKGS) {
        try {
            pkg = require(name);
            // console.log('using package', name);
            break;
        } catch (e) {
            // continue
        }
    }

    if (!pkg) {
        throw new Error('No Turso client package found. Please install @tursodatabase/serverless');
    }

    // If package exposes connect()
    if (typeof pkg.connect === 'function') {
        // serverless.connect expects a config object { url, authToken }
        try {
            return await pkg.connect({ url, authToken });
        } catch (e) {
            // fallback: some packages may accept (url, opts)
            return await pkg.connect(url, { authToken });
        }
    }

    // If package exposes Database constructor
    if (pkg.Database) {
        const DbCtor = pkg.Database;
        const db = new DbCtor(url, { authToken });
        // if needs connect
        if (typeof db.connect === 'function') await db.connect();
        return db;
    }

    throw new Error('Installed Turso package does not provide a supported API.');
}

module.exports = { getDb };
