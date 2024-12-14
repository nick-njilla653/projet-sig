import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonToast,
  IonProgressBar
} from '@ionic/react';
import {
  logInOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import './LoginPage.css';

interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'scrutateur' | 'observateur' | 'electeur';
}

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    role: 'electeur'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateCredentials = (creds: LoginCredentials): boolean => {
    console.log('Vérification des identifiants:', creds); // Pour le débogage
    
    switch (creds.role) {
      case 'admin':
        return creds.username === 'admin' && creds.password === 'admin123';
      case 'scrutateur':
        return creds.username === 'scrutateur' && creds.password === 'scr123';
      case 'observateur':
        return creds.username === 'observateur' && creds.password === 'obs123';
      case 'electeur':
        return creds.username === '12345' && creds.password === 'password';
      default:
        return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentative de connexion avec:', credentials);
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simuler une requête d'authentification
      await new Promise(resolve => setTimeout(resolve, 1500));

      const isValid = validateCredentials(credentials);
    console.log('Validation des identifiants:', isValid);

      if (validateCredentials(credentials)) {
        console.log('Redirection vers:', `/${credentials.role}`);
        localStorage.setItem('userRole', credentials.role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Rediriger vers l'interface appropriée
        switch (credentials.role) {
          case 'admin':
            history.push('/AdminInterface');
            break;
          case 'scrutateur':
            history.push('/ScrutateurInterface');
            break;
          case 'observateur':
            history.push('/SurveillanceInterface');
            break;
          case 'electeur':
            history.push('/VoterInterface');
            break;
        }
      } else {
        setErrorMessage('Identifiants invalides');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage('Erreur de connexion au serveur');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>ELECAM - Connexion</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">
                Système de Gestion des Élections
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonLabel position="floating">Type d'utilisateur</IonLabel>
                  <IonSelect
                    value={credentials.role}
                    onIonChange={e => setCredentials({
                      ...credentials,
                      role: e.detail.value
                    })}
                  >
                    <IonSelectOption value="electeur">Électeur</IonSelectOption>
                    <IonSelectOption value="scrutateur">Scrutateur</IonSelectOption>
                    <IonSelectOption value="observateur">Observateur</IonSelectOption>
                    <IonSelectOption value="admin">Administrateur</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Identifiant</IonLabel>
                  <IonInput
                    type="text"
                    value={credentials.username}
                    onIonChange={e => setCredentials({
                      ...credentials,
                      username: e.detail.value!
                    })}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Mot de passe</IonLabel>
                  <IonInput
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onIonChange={e => setCredentials({
                      ...credentials,
                      password: e.detail.value!
                    })}
                    required
                  />
                  <IonButton
                    fill="clear"
                    slot="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                  </IonButton>
                </IonItem>

                <div className="ion-padding-top">
                  <IonButton
                    expand="block"
                    type="submit"
                    disabled={isLoading}
                  >
                    <IonIcon icon={logInOutline} slot="start" />
                    Se connecter
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Erreur"
          message={errorMessage}
          buttons={['OK']}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Connexion réussie"
          duration={2000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;