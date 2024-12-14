import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonModal,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonAlert,
  IonToast,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  RefresherEventDetail
} from '@ionic/react';
import {
  personCircleOutline,
  logOutOutline,
  eyeOutline,
  eyeOffOutline,
  peopleOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  refreshOutline,
  downloadOutline,
  filterOutline,
  addOutline
} from 'ionicons/icons';
import './AdminInterface.css';

interface VoterRegistration {
  id: string;
  fullName: string;
  idNumber: string;
  pollingStation: string;
  status: 'En attente' | 'Validé' | 'Rejeté';
}

interface PollingResult {
  stationId: string;
  location: string;
  totalVotes: number;
  validVotes: number;
  invalidVotes: number;
  status: 'En attente' | 'Validé' | 'Rejeté';
}

const AdminInterface: React.FC = () => {
  // États d'authentification
  const history = useHistory();
  
  // Vérification de l'authentification au chargement
  useEffect(() => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuth || userRole !== 'admin') {
      history.replace('/LoginPage');
    }
  }, [history]);

  // États de l'interface administrative
  const [isLoading, setIsLoading] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'voters' | 'results'>('voters');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Données simulées
  const [voterRegistrations] = useState<VoterRegistration[]>([
    {
      id: 'V001',
      fullName: 'Jean Dupont',
      idNumber: 'ID12345',
      pollingStation: 'Yaoundé-Centre-01',
      status: 'En attente'
    },
    {
      id: 'V002',
      fullName: 'Marie Claire',
      idNumber: 'ID12346',
      pollingStation: 'Yaoundé-Centre-02',
      status: 'Validé'
    }
  ]);

  const [pollingResults] = useState<PollingResult[]>([
    {
      stationId: 'PS001',
      location: 'Yaoundé-Centre-01',
      totalVotes: 500,
      validVotes: 480,
      invalidVotes: 20,
      status: 'En attente'
    },
    {
      stationId: 'PS002',
      location: 'Yaoundé-Centre-02',
      totalVotes: 600,
      validVotes: 585,
      invalidVotes: 15,
      status: 'Validé'
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    history.replace('/LoginPage');
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setToastMessage('Données actualisées');
      setShowToast(true);
    } finally {
      setIsLoading(false);
      event.detail.complete();
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsLoading(true);
    try {
      // Simulation de la mise à jour du statut
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToastMessage('Statut mis à jour avec succès');
      setShowToast(true);
    } catch (error) {
      setAlertMessage('Erreur lors de la mise à jour du statut');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Administration ELECAM</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonSegment 
          value={activeSegment} 
          onIonChange={e => setActiveSegment(e.detail.value as 'voters' | 'results')}
        >
          <IonSegmentButton value="voters">
            <IonLabel>Électeurs</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="results">
            <IonLabel>Résultats</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div className="ion-padding">
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="12" sizeMd="6">
                <IonSearchbar
                  value={searchText}
                  onIonChange={e => setSearchText(e.detail.value!)}
                  placeholder="Rechercher..."
                />
              </IonCol>
              <IonCol size="12" sizeMd="6">
                <IonSelect
                  value={filterStatus}
                  placeholder="Filtrer par statut"
                  onIonChange={e => setFilterStatus(e.detail.value)}
                >
                  <IonSelectOption value="all">Tous</IonSelectOption>
                  <IonSelectOption value="pending">En attente</IonSelectOption>
                  <IonSelectOption value="validated">Validés</IonSelectOption>
                  <IonSelectOption value="rejected">Rejetés</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Contenu principal selon le segment actif */}
          {activeSegment === 'voters' ? (
            <IonList>
              {voterRegistrations.map(voter => (
                <IonItem key={voter.id}>
                  <IonLabel>
                    <h2>{voter.fullName}</h2>
                    <p>ID: {voter.idNumber}</p>
                    <p>Bureau: {voter.pollingStation}</p>
                  </IonLabel>
                  <IonSelect
                    value={voter.status}
                    onIonChange={e => handleStatusChange(voter.id, e.detail.value)}
                    interface="popover"
                  >
                    <IonSelectOption value="En attente">En attente</IonSelectOption>
                    <IonSelectOption value="Validé">Validé</IonSelectOption>
                    <IonSelectOption value="Rejeté">Rejeté</IonSelectOption>
                  </IonSelect>
                  <IonBadge
                    color={
                      voter.status === 'Validé' 
                        ? 'success' 
                        : voter.status === 'Rejeté' 
                          ? 'danger' 
                          : 'warning'
                    }
                    slot="end"
                  >
                    {voter.status}
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <IonList>
              {pollingResults.map(result => (
                <IonItem key={result.stationId}>
                  <IonLabel>
                    <h2>{result.location}</h2>
                    <p>Total des votes: {result.totalVotes}</p>
                    <p>Votes valides: {result.validVotes}</p>
                  </IonLabel>
                  <IonBadge
                    color={
                      result.status === 'Validé' 
                        ? 'success' 
                        : result.status === 'Rejeté' 
                          ? 'danger' 
                          : 'warning'
                    }
                    slot="end"
                  >
                    {result.status}
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>

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
          header="Erreur"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminInterface;
