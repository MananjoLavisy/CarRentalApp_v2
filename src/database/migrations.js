import { getDBConnection } from './db';

export const createTables = async () => {
  const db = await getDBConnection();
  
  try {
    // Table Users
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telephone TEXT,
        cin TEXT,
        mot_de_passe TEXT NOT NULL,
        photo_profil TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table Voitures
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS voitures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marque TEXT NOT NULL,
        modele TEXT NOT NULL,
        annee INTEGER,
        couleur TEXT,
        type TEXT,
        nombre_places INTEGER,
        transmission TEXT,
        prix_par_jour REAL NOT NULL,
        immatriculation TEXT UNIQUE,
        photos TEXT,
        description TEXT,
        statut TEXT DEFAULT 'disponible',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Table Reservations
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        voiture_id INTEGER NOT NULL,
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        nombre_jours INTEGER NOT NULL,
        prix_total REAL NOT NULL,
        statut TEXT DEFAULT 'en_attente',
        ticket_id TEXT UNIQUE,
        date_reservation DATETIME DEFAULT CURRENT_TIMESTAMP,
        extended BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (voiture_id) REFERENCES voitures(id)
      );
    `);
    
    // Table Paiements
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS paiements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reservation_id INTEGER NOT NULL,
        montant REAL NOT NULL,
        methode_paiement TEXT,
        statut TEXT DEFAULT 'validé',
        reference_transaction TEXT,
        date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reservation_id) REFERENCES reservations(id)
      );
    `);
    
    // Table Favoris
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favoris (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        voiture_id INTEGER NOT NULL,
        date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (voiture_id) REFERENCES voitures(id),
        UNIQUE(user_id, voiture_id)
      );
    `);
    
    // Table FAQ
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS faq (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        reponse TEXT NOT NULL,
        categorie TEXT,
        ordre INTEGER DEFAULT 0
      );
    `);
    
    // Table Extensions
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS extensions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reservation_id INTEGER NOT NULL,
        ancienne_date_fin DATE NOT NULL,
        nouvelle_date_fin DATE NOT NULL,
        jours_supplementaires INTEGER NOT NULL,
        cout_supplementaire REAL NOT NULL,
        date_extension DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reservation_id) REFERENCES reservations(id)
      );
    `);
    
    // Table Notifications
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        reservation_id INTEGER,
        type TEXT,
        titre TEXT NOT NULL,
        message TEXT NOT NULL,
        lu BOOLEAN DEFAULT 0,
        date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export const dropAllTables = async () => {
  const db = await getDBConnection();
  const tables = ['notifications', 'extensions', 'faq', 'favoris', 'paiements', 'reservations', 'voitures', 'users'];
  
  for (const table of tables) {
    await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
  }
  
  console.log('All tables dropped');
};