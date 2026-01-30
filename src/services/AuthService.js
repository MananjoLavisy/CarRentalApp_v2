import { createUser, getUserByEmail } from '../database/models/User';

export const register = async (userData) => {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    const user = await createUser(userData);
    
    return {
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        cin: user.cin
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const login = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    if (user.mot_de_passe !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        cin: user.cin
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};