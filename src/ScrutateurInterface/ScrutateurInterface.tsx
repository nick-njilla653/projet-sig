import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonToast,
  IonFab,
  IonFabButton,
  IonBadge,
  IonFooter,
  IonProgressBar,
  IonSpinner
} from '@ionic/react';
import { 
  logOutOutline, 
  eyeOutline, 
  eyeOffOutline,
  documentTextOutline,
  barChartOutline,
  saveOutline,
  alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import './ScrutateurInterface.css';

interface ElectionResults {
  candidateVotes: { [key: string]: number };
  totalVotes: number;
  invalidVotes: number;
  timestamp: string;
}

interface ScrutateurInfo {
  id: string;
  name: string;
  pollingStation: string;
  role: string;
}

const ScrutateurInterface: React.FC = () => {
  // États d'authentification
  const history = useHistory();

  // Vérification de l'authentification
  useEffect(() => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuth || userRole !== 'scrutateur') {
      history.replace('/LoginPage');
    }
  }, [history]);

  // États de saisie des résultats
  const [results, setResults] = useState<ElectionResults>({
    candidateVotes: {
      'Candidat A': 0,
      'Candidat B': 0,
      'Candidat C': 0
    },
    totalVotes: 0,
    invalidVotes: 0,
    timestamp: ''
  });

  // États pour les alertes et toasts
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);

  const mockScrutateurInfo: ScrutateurInfo = {
    id: "SCR123",
    name: "Pierre Dupont",
    pollingStation: "Bureau 042 - Yaoundé Centre",
    role: "Scrutateur Principal"
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    history.replace('/LoginPage');
  }

  const handleVoteInput = (candidate: string, value: string) => {
    const votes = parseInt(value) || 0;
    const newCandidateVotes = {
      ...results.candidateVotes,
      [candidate]: votes
    };
    
    const totalVotes = Object.values(newCandidateVotes).reduce((a, b) => a + b, 0) + results.invalidVotes;
    
    setResults({
      ...results,
      candidateVotes: newCandidateVotes,
      totalVotes
    });
  };

  const validateResults = () => {
    const totalVotes = Object.values(results.candidateVotes).reduce((a, b) => a + b, 0) + results.invalidVotes;

    if (totalVotes === 0) {
      setAlertMessage('Le nombre total de votes ne peut pas être zéro.');
      setShowAlert(true);
      return false;
    }

    if (totalVotes > 1000) {
      setAlertMessage('Le nombre de votes dépasse la capacité du bureau.');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateResults()) {
      setIsLoading(true);
      try {
        // Simulation d'envoi des données
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setResults({
          ...results,
          timestamp: new Date().toISOString()
        });
        
        setToastMessage('Résultats soumis avec succès !');
        setShowToast(true);
      } catch (error) {
        setAlertMessage('Erreur lors de la soumission');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ResultsEntryPage: React.FC = () => (
    <IonContent className="results-page">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCard className="info-card">
              <IonCardHeader>
                <IonCardTitle>Informations du Scrutateur</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>
                      <h2>ID Scrutateur</h2>
                      <p>{mockScrutateurInfo.id}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Nom</h2>
                      <p>{mockScrutateurInfo.name}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Bureau de vote</h2>
                      <p>{mockScrutateurInfo.pollingStation}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Rôle</h2>
                      <p>{mockScrutateurInfo.role}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            <IonCard className="results-card">
              <IonCardHeader>
                <IonCardTitle>Saisie des résultats</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {Object.entries(results.candidateVotes).map(([candidate, votes]) => (
                    <IonItem key={candidate}>
                      <IonLabel position="stacked">{candidate}</IonLabel>
                      <IonInput
                        type="number"
                        value={votes}
                        onIonChange={e => handleVoteInput(candidate, e.detail.value!)}
                        min="0"
                      />
                    </IonItem>
                  ))}
                  <IonItem>
                    <IonLabel position="stacked">Votes invalides</IonLabel>
                    <IonInput
                      type="number"
                      value={results.invalidVotes}
                      onIonChange={e => setResults({
                        ...results,
                        invalidVotes: parseInt(e.detail.value!) || 0
                      })}
                      min="0"
                    />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={handleSubmit}>
          <IonIcon icon={saveOutline} />
        </IonFabButton>
      </IonFab>
    </IonContent>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Saisie des Résultats</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

     <ResultsEntryPage />

      <IonFooter>
        <IonToolbar>
          <div className="footer-content">
            <small>© 2024 ELECAM - Système de Gestion des Élections</small>
          </div>
        </IonToolbar>
      </IonFooter>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Attention"
        message={alertMessage}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default ScrutateurInterface;
