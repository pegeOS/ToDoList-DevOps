const fs = require('fs');
const path = require('path');
const { getDb } = require('./db-client');

async function run() {
    const sqlPath = path.join(__dirname, '..', 'migrations', 'tasks.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        const db = await getDb();
        // try exec, then fallback to execute
        if (typeof db.exec === 'function') {
            await db.exec(sql);
        } else if (typeof db.execute === 'function') {
            await db.execute(sql);
        } else {
            throw new Error('DB client does not support exec/execute');
        }
        console.log('Migração executada com sucesso.');
    } catch (err) {
        console.error('Erro ao executar migração:', err);
        process.exit(1);
    }
}

run();
