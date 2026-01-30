import { getDBConnection } from './db';

export const seedDatabase = async () => {
  const db = await getDBConnection();
  
  try {
    // Vérifier si déjà peuplé
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM voitures');
    if (result && result.count > 0) {
      console.log('Database already seeded');
      return;
    }
    
    // Seed Voitures
    const voitures = [
      {
        marque: 'Toyota',
        modele: 'Corolla',
        annee: 2022,
        couleur: 'Blanc',
        type: 'Berline',
        nombre_places: 5,
        transmission: 'Automatique',
        prix_par_jour: 150000,
        immatriculation: '1234 TAB',
        description: 'Voiture économique et fiable, parfaite pour les trajets urbains',
        photos: JSON.stringify(['https://via.placeholder.com/400x300/ffffff/000000?text=Toyota+Corolla'])
      },
      {
        marque: 'Hyundai',
        modele: 'Tucson',
        annee: 2023,
        couleur: 'Noir',
        type: 'SUV',
        nombre_places: 7,
        transmission: 'Automatique',
        prix_par_jour: 250000,
        immatriculation: '5678 TAB',
        description: 'SUV spacieux et confortable pour toute la famille',
        photos: JSON.stringify(['https://via.placeholder.com/400x300/000000/ffffff?text=Hyundai+Tucson'])
      },
      {
        marque: 'Renault',
        modele: 'Clio',
        annee: 2021,
        couleur: 'Rouge',
        type: 'Compact',
        nombre_places: 5,
        transmission: 'Manuelle',
        prix_par_jour: 120000,
        immatriculation: '9012 TAB',
        description: 'Petite voiture agile, idéale pour la ville',
        photos: JSON.stringify(['https://via.placeholder.com/400x300/ff0000/ffffff?text=Renault+Clio'])
      },
      {
        marque: 'Peugeot',
        modele: '3008',
        annee: 2022,
        couleur: 'Gris',
        type: 'SUV',
        nombre_places: 5,
        transmission: 'Automatique',
        prix_par_jour: 200000,
        immatriculation: '3456 TAB',
        description: 'SUV élégant avec technologies embarquées',
        photos: JSON.stringify(['https://via.placeholder.com/400x300/808080/ffffff?text=Peugeot+3008'])
      },
      {
        marque: 'Mercedes',
        modele: 'Classe C',
        annee: 2023,
        couleur: 'Noir',
        type: 'Berline',
        nombre_places: 5,
        transmission: 'Automatique',
        prix_par_jour: 350000,
        immatriculation: '7890 TAB',
        description: 'Berline de luxe pour une expérience premium',
        photos: JSON.stringify(['https://via.placeholder.com/400x300/000000/ffffff?text=Mercedes+C'])
      },
      {
        marque: 'Ford',
        modele: 'Ranger',
        annee: 2022,
        couleur: 'Bleu',
        type: 'Pick-up',
        nombre_places: 5,
        transmission: 'Automatique',
        prix_par_jour: 280000,
        immatriculation: '2468 TAB',
        description: 'Pick-up robuste pour tous terrains',
        photos: JSON.stringify(['https://via.placeholder.com/400x300/0000ff/ffffff?text=Ford+Ranger'])
      }
    ];
    
    for (const car of voitures) {
      await db.runAsync(
        `INSERT INTO voitures (marque, modele, annee, couleur, type, nombre_places, 
          transmission, prix_par_jour, immatriculation, description, photos) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [car.marque, car.modele, car.annee, car.couleur, car.type, 
         car.nombre_places, car.transmission, car.prix_par_jour, 
         car.immatriculation, car.description, car.photos]
      );
    }
    
    // Seed FAQ
    const faqs = [
      {
        question: 'Quels documents sont nécessaires pour louer une voiture ?',
        reponse: 'Vous aurez besoin de votre CIN (Carte d\'Identité Nationale) et d\'un numéro de téléphone valide. Une photo de profil peut également être demandée.',
        categorie: 'Documents',
        ordre: 1
      },
      {
        question: 'Puis-je annuler ma réservation ?',
        reponse: 'Oui, vous pouvez annuler votre réservation depuis l\'onglet "Mes Réservations". L\'annulation doit être effectuée au moins 24h avant la date de début de location.',
        categorie: 'Réservation',
        ordre: 2
      },
      {
        question: 'Comment prolonger ma location ?',
        reponse: 'Dans vos réservations actives, cliquez sur le bouton "Prolonger" et choisissez la nouvelle date de fin. Le coût supplémentaire sera calculé automatiquement.',
        categorie: 'Location',
        ordre: 3
      },
      {
        question: 'Quel est l\'âge minimum pour louer ?',
        reponse: 'Vous devez avoir au minimum 21 ans et posséder un permis de conduire valide depuis au moins 1 an.',
        categorie: 'Conditions',
        ordre: 4
      },
      {
        question: 'Le carburant est-il inclus ?',
        reponse: 'Non, le carburant n\'est pas inclus dans le prix de location. Vous devez rendre le véhicule avec le même niveau de carburant qu\'à la prise en charge.',
        categorie: 'Location',
        ordre: 5
      },
      {
        question: 'Que se passe-t-il en cas de retard ?',
        reponse: 'Un retard de plus de 2 heures sera facturé comme une journée supplémentaire. Merci de nous prévenir en cas de retard.',
        categorie: 'Retour',
        ordre: 6
      },
      {
        question: 'L\'assurance est-elle incluse ?',
        reponse: 'Une assurance de base est incluse dans le prix. Vous êtes responsable de la franchise en cas de dommages.',
        categorie: 'Assurance',
        ordre: 7
      },
      {
        question: 'Puis-je conduire hors de la ville ?',
        reponse: 'Oui, vous pouvez conduire partout à Madagascar. Veuillez nous informer si vous prévoyez de longs trajets.',
        categorie: 'Location',
        ordre: 8
      }
    ];
    
    for (const faq of faqs) {
      await db.runAsync(
        'INSERT INTO faq (question, reponse, categorie, ordre) VALUES (?, ?, ?, ?)',
        [faq.question, faq.reponse, faq.categorie, faq.ordre]
      );
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};