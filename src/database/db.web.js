import initSqlJs from 'sql.js/dist/sql-asm.js';

let db = null;

export const getDBConnection = async () => {
  if (db) {
    return db;
  }

  try {
    const SQL = await initSqlJs();
    const sqlDb = new SQL.Database();

    db = {
      runAsync: async (sql, params = []) => {
        sqlDb.run(sql, params);
        const changes = sqlDb.getRowsModified();
        const idResult = sqlDb.exec('SELECT last_insert_rowid() as id');
        const lastInsertRowId =
          idResult.length > 0 ? idResult[0].values[0][0] : 0;
        return { changes, lastInsertRowId };
      },

      getAllAsync: async (sql, params = []) => {
        const stmt = sqlDb.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      },

      getFirstAsync: async (sql, params = []) => {
        const stmt = sqlDb.prepare(sql);
        stmt.bind(params);
        let row = null;
        if (stmt.step()) {
          row = stmt.getAsObject();
        }
        stmt.free();
        return row;
      },

      execAsync: async (sql) => {
        sqlDb.run(sql);
      },

      executeSql: async (sql, params = []) => {
        const stmt = sqlDb.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();

        const changes = sqlDb.getRowsModified();
        const idResult = sqlDb.exec('SELECT last_insert_rowid() as id');
        const insertId =
          idResult.length > 0 ? idResult[0].values[0][0] : 0;

        return [
          {
            rows: {
              length: rows.length,
              item: (i) => rows[i],
              _array: rows,
            },
            insertId,
            rowsAffected: changes,
          },
        ];
      },

      closeAsync: async () => {
        sqlDb.close();
      },
    };

    console.log('Web database opened successfully (sql.js in-memory)');
    return db;
  } catch (error) {
    console.error('Error opening web database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    console.log('Database closed');
    db = null;
  }
};
