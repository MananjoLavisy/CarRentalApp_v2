import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { register } from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cin: '',
    mot_de_passe: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validations
    if (!validateRequired(formData.nom)) {
      Alert.alert('Erreur', 'Le nom est requis');
      return;
    }
    if (!validateRequired(formData.prenom)) {
      Alert.alert('Erreur', 'Le prénom est requis');
      return;
    }
    if (!validateEmail(formData.email)) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }
    if (!validatePassword(formData.mot_de_passe)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (formData.mot_de_passe !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      await loginUser(result.user);
      Alert.alert('Succès', 'Compte créé avec succès !');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Remplissez vos informations</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={formData.nom}
              onChangeText={(value) => updateField('nom', value)}
              placeholderTextColor="#95a5a6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={formData.prenom}
              onChangeText={(value) => updateField('prenom', value)}
              placeholderTextColor="#95a5a6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#95a5a6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="phone-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Téléphone (optionnel)"
              value={formData.telephone}
              onChangeText={(value) => updateField('telephone', value)}
              keyboardType="phone-pad"
              placeholderTextColor="#95a5a6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="card-account-details-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="CIN (optionnel)"
              value={formData.cin}
              onChangeText={(value) => updateField('cin', value)}
              placeholderTextColor="#95a5a6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={formData.mot_de_passe}
              onChangeText={(value) => updateField('mot_de_passe', value)}
              secureTextEntry={!showPassword}
              placeholderTextColor="#95a5a6"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#7f8c8d"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-check-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry={!showPassword}
              placeholderTextColor="#95a5a6"
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  eyeIcon: {
    padding: 8,
  },
  registerButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 8px rgba(52, 152, 219, 0.3)',
    elevation: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  loginLink: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default RegisterScreen;