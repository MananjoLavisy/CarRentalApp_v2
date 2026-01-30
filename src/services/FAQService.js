import { getDBConnection } from '../database/db';

export const getAllFAQ = async () => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM faq ORDER BY categorie, ordre ASC'
    );
    
    const faqs = [];
    for (let i = 0; i < result.rows.length; i++) {
      faqs.push(result.rows.item(i));
    }
    return faqs;
  } catch (error) {
    console.error('Error getting FAQs:', error);
    throw error;
  }
};

export const getFAQByCategory = async (category) => {
  const db = await getDBConnection();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM faq WHERE categorie = ? ORDER BY ordre ASC',
      [category]
    );
    
    const faqs = [];
    for (let i = 0; i < result.rows.length; i++) {
      faqs.push(result.rows.item(i));
    }
    return faqs;
  } catch (error) {
    console.error('Error getting FAQs by category:', error);
    throw error;
  }
};