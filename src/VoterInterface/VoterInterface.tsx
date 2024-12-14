import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonInput,
  IonIcon,
  IonBadge,
  IonList,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert
} from '@ionic/react';
import { 
  logIn,
  logOut as logOutOutline, 
  person, 
  locationSharp, 
  calendar, 
  notifications,
  checkmarkCircle,
  alertCircle 
} from 'ionicons/icons';

interface VoterInfo {
  id: string;
  fullName: string;
  pollingStation: string;
  registrationDate: string;
  votingStatus: 'Non voté' | 'Voté';
  notifications: Notification[];
}

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

const VoterInterface: React.FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Vérification de l'authentification
  useEffect(() => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuth || userRole !== 'electeur') {
      history.replace('/login');
    }
  }, [history]);

  // Exemple de données d'électeur
  const mockVoterInfo: VoterInfo = {
    id: "12345",
    fullName: "Jean Dupont",
    pollingStation: "Centre de Vote Yaoundé-Centre",
    registrationDate: "15/11/2024",
    votingStatus: "Non voté",
    notifications: [
      {
        id: 1,
        title: "Rappel Élections",
        message: "Les élections auront lieu dans 5 jours",
        date: "01/12/2024",
        isRead: false
      },
      {
        id: 2,
        title: "Mise à jour du bureau",
        message: "Votre bureau de vote a été confirmé",
        date: "28/11/2024",
        isRead: true
      }
    ]
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    history.replace('/login');
  };

  // const LoginPage = () => (
  //   <IonContent className="ion-padding">
  //     <IonCard>
  //       <IonCardHeader>
  //         <IonCardTitle className="ion-text-center">
  //           Connexion Électeur
  //         </IonCardTitle>
  //       </IonCardHeader>
  //       <IonCardContent>
  //         <form onSubmit={(e) => {
  //           e.preventDefault();
  //           handleLogin();
  //         }}>
  //           <IonItem>
  //             <IonLabel position="floating">Numéro d'électeur</IonLabel>
  //             <IonInput
  //               type="text"
  //               value={voterID}
  //               onIonChange={e => setVoterID(e.detail.value!)}
  //               required
  //             />
  //           </IonItem>

  //           <IonItem className="ion-margin-bottom">
  //             <IonLabel position="floating">Mot de passe</IonLabel>
  //             <IonInput
  //               type="password"
  //               value={password}
  //               onIonChange={e => setPassword(e.detail.value!)}
  //               required
  //             />
  //           </IonItem>

  //           <IonButton expand="block" onClick={handleLogin}>
  //             <IonIcon icon={logIn} slot="start" />
  //             Se connecter
  //           </IonButton>
  //         </form>
  //       </IonCardContent>
  //     </IonCard>

  //     <IonAlert
  //       isOpen={showAlert}
  //       onDidDismiss={() => setShowAlert(false)}
  //       header="Erreur de connexion"
  //       message="Identifiants invalides. Veuillez réessayer."
  //       buttons={['OK']}
  //     />
  //   </IonContent>
  // );

  const DashboardPage = () => (
    <IonContent className="ion-padding">
      {/* Carte d'information de l'électeur */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{mockVoterInfo.fullName}</IonCardTitle>
          <IonCardSubtitle>N° Électeur: {mockVoterInfo.id}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonIcon icon={locationSharp} slot="start" />
                  <IonLabel>
                    <h3>Bureau de vote</h3>
                    <p>{mockVoterInfo.pollingStation}</p>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonIcon icon={calendar} slot="start" />
                  <IonLabel>
                    <h3>Date d'inscription</h3>
                    <p>{mockVoterInfo.registrationDate}</p>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonIcon 
                    icon={mockVoterInfo.votingStatus === 'Voté' ? checkmarkCircle : alertCircle} 
                    slot="start"
                    color={mockVoterInfo.votingStatus === 'Voté' ? 'success' : 'warning'}
                  />
                  <IonLabel>
                    <h3>Statut de vote</h3>
                    <p>{mockVoterInfo.votingStatus}</p>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      {/* Notifications */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={notifications} className="ion-margin-end" />
            Notifications
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {mockVoterInfo.notifications.map((notification) => (
              <IonItem key={notification.id}>
                <IonLabel>
                  <h2>{notification.title}</h2>
                  <p>{notification.message}</p>
                  <p className="ion-text-end">{notification.date}</p>
                </IonLabel>
                {!notification.isRead && (
                  <IonBadge color="primary" slot="end">
                    Nouveau
                  </IonBadge>
                )}
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonButton 
        expand="block" 
        color="medium" 
        onClick={() => setIsLoggedIn(false)}
        className="ion-margin-top"
      >
        Se déconnecter
      </IonButton>
    </IonContent>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tableau de bord Électeur</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>
      <DashboardPage />
    </IonPage>
  );
};

export default VoterInterface;
