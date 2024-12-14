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
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonAlert,
  IonToast,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonModal,
  IonDatetime,
  RefresherEventDetail,
  IonFooter
} from '@ionic/react';
import {
  logOutOutline,
  eyeOutline,
  eyeOffOutline,
  warningOutline,
  addOutline,
  locationOutline,
  timeOutline,
  imageOutline,
  documentTextOutline,
  cloudUploadOutline,
  closeOutline,
  chevronForwardOutline,
  alertCircleOutline
} from 'ionicons/icons';
import './SurveillanceInterface.css';

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  location: string;
  datetime: string;
  severity: 'Faible' | 'Moyen' | 'Élevé';
  status: 'Nouveau' | 'En cours' | 'Résolu';
  evidence?: string;
  actions?: string[];
  witnesses?: string[];
  updates?: {
    date: string;
    content: string;
    author: string;
  }[];
}

const SurveillanceInterface: React.FC = () => {
  // États d'authentification
  const history = useHistory();

  // Vérification de l'authentification
  useEffect(() => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuth || userRole !== 'observateur') {
      history.replace('/login');
    }
  }, [history]);

  const [isLoading, setIsLoading] = useState(false);

  // États des incidents
  const [incidents, setIncidents] = useState<SecurityIncident[]>([
    {
      id: 'INC001',
      title: 'Tentative d\'intimidation',
      description: 'Un groupe de personnes suspectes a été observé tentant d\'influencer les électeurs à l\'entrée du bureau de vote. Le groupe est composé d\'environ 5 personnes portant des badges non officiels.',
      location: 'Bureau de vote 042 - Yaoundé-Centre',
      datetime: '2024-12-03T10:30:00',
      severity: 'Moyen',
      status: 'En cours',
      actions: [
        'Notification aux forces de l\'ordre',
        'Rapport transmis au responsable du bureau de vote'
      ],
      witnesses: [
        'Jean Dupont - Observateur principal',
        'Marie Claire - Électrice'
      ],
      updates: [
        {
          date: '2024-12-03T10:45:00',
          content: 'Les forces de l\'ordre sont arrivées sur place',
          author: 'Pierre Dikoto'
        }
      ]
    },
    {
      id: 'INC002',
      title: 'Problème technique',
      description: 'Panne d\'électricité affectant le processus de vote. Les lampes de secours ont été activées mais la situation reste préoccupante.',
      location: 'Centre de vote Douala-Est',
      datetime: '2024-12-03T11:15:00',
      severity: 'Élevé',
      status: 'Résolu',
      actions: [
        'Contact avec la compagnie d\'électricité',
        'Mise en place de générateurs de secours'
      ],
      updates: [
        {
          date: '2024-12-03T11:45:00',
          content: 'Électricité rétablie, reprise normale des opérations',
          author: 'Sarah Ndeme'
        }
      ]
    }
  ]);

  // État pour le modal de détails
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  // États des alertes et notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // État du nouvel incident
  const [newIncident, setNewIncident] = useState<Partial<SecurityIncident>>({
    title: '',
    description: '',
    location: '',
    datetime: new Date().toISOString(),
    severity: 'Moyen',
    status: 'Nouveau'
  });
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    history.replace('/login');
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setToastMessage('Liste des incidents mise à jour');
      setShowToast(true);
    } finally {
      event.detail.complete();
    }
  };

  const handleSubmitIncident = async () => {
    if (!newIncident.title || !newIncident.description || !newIncident.location) {
      setAlertMessage('Veuillez remplir tous les champs requis');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const incident: SecurityIncident = {
        id: `INC${Math.floor(Math.random() * 1000)}`,
        title: newIncident.title!,
        description: newIncident.description!,
        location: newIncident.location!,
        datetime: newIncident.datetime!,
        severity: newIncident.severity as 'Faible' | 'Moyen' | 'Élevé',
        status: 'Nouveau',
        actions: [],
        updates: [],
        witnesses: []
      };

      setIncidents([incident, ...incidents]);
      setShowNewIncidentModal(false);
      setNewIncident({});
      setToastMessage('Incident signalé avec succès');
      setShowToast(true);
    } catch (error) {
      setAlertMessage('Erreur lors de la soumission de l\'incident');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau':
        return 'primary';
      case 'En cours':
        return 'warning';
      case 'Résolu':
        return 'success';
      default:
        return 'medium';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Élevé':
        return 'danger';
      case 'Moyen':
        return 'warning';
      case 'Faible':
        return 'success';
      default:
        return 'medium';
    }
  };

  // const LoginPage: React.FC = () => (
  //   <IonContent className="login-page">
  //     <div className="login-container">
  //       <IonCard className="login-card">
  //         <IonCardHeader>
  //           <IonCardTitle className="ion-text-center">
  //             Comité de Surveillance
  //           </IonCardTitle>
  //         </IonCardHeader>

  //         <IonCardContent>
  //           <form onSubmit={handleLogin}>
  //             <IonList>
  //               <IonItem>
  //                 <IonLabel position="floating">Identifiant</IonLabel>
  //                 <IonInput
  //                   type="text"
  //                   value={credentials.username}
  //                   onIonChange={e => setCredentials({
  //                     ...credentials,
  //                     username: e.detail.value!
  //                   })}
  //                   required
  //                 />
  //               </IonItem>

  //               <IonItem>
  //                 <IonLabel position="floating">Mot de passe</IonLabel>
  //                 <IonInput
  //                   type={showPassword ? "text" : "password"}
  //                   value={credentials.password}
  //                   onIonChange={e => setCredentials({
  //                     ...credentials,
  //                     password: e.detail.value!
  //                   })}
  //                   required
  //                 />
  //                 <IonButton
  //                   fill="clear"
  //                   slot="end"
  //                   onClick={() => setShowPassword(!showPassword)}
  //                 >
  //                   <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
  //                 </IonButton>
  //               </IonItem>
  //             </IonList>

  //             {loginError && (
  //               <div className="error-message">
  //                 <IonIcon icon={warningOutline} />
  //                 <span>{loginError}</span>
  //               </div>
  //             )}

  //             <IonButton
  //               expand="block"
  //               type="submit"
  //               className="login-button"
  //               disabled={isLoading}
  //             >
  //               {isLoading ? <IonSpinner name="crescent" /> : 'Se connecter'}
  //             </IonButton>
  //           </form>
  //         </IonCardContent>
  //       </IonCard>
  //     </div>
  //   </IonContent>
  // );
  const IncidentDetailModal: React.FC<{ incident: SecurityIncident }> = ({ incident }) => (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Détails de l'incident</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setSelectedIncident(null)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <div className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <h1 className="incident-title">{incident.title}</h1>
                  <div className="badge-container">
                    <IonBadge color={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </IonBadge>
                    <IonBadge color={getStatusColor(incident.status)}>
                      {incident.status}
                    </IonBadge>
                  </div>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <h2 className="section-title">Description</h2>
                  <p className="incident-description">{incident.description}</p>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonItem lines="none">
                    <IonIcon icon={locationOutline} slot="start" />
                    <IonLabel>{incident.location}</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonIcon icon={timeOutline} slot="start" />
                    <IonLabel>
                      {new Date(incident.datetime).toLocaleString()}
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>

              {incident.actions && incident.actions.length > 0 && (
                <IonRow>
                  <IonCol>
                    <h2 className="section-title">Actions prises</h2>
                    <IonList>
                      {incident.actions.map((action, index) => (
                        <IonItem key={index} lines="none">
                          <IonIcon icon={chevronForwardOutline} slot="start" />
                          <IonLabel className="ion-text-wrap">{action}</IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCol>
                </IonRow>
              )}

              {incident.witnesses && incident.witnesses.length > 0 && (
                <IonRow>
                  <IonCol>
                    <h2 className="section-title">Témoins</h2>
                    <IonList>
                      {incident.witnesses.map((witness, index) => (
                        <IonItem key={index} lines="none">
                          <IonLabel className="ion-text-wrap">{witness}</IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCol>
                </IonRow>
              )}

              {incident.updates && incident.updates.length > 0 && (
                <IonRow>
                  <IonCol>
                    <h2 className="section-title">Mises à jour</h2>
                    <div className="updates-timeline">
                      {incident.updates.map((update, index) => (
                        <div key={index} className="update-item">
                          <div className="update-time">
                            {new Date(update.date).toLocaleString()}
                          </div>
                          <div className="update-content">
                            <p>{update.content}</p>
                            <small>Par: {update.author}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </IonCol>
                </IonRow>
              )}

              {incident.evidence && (
                <IonRow>
                  <IonCol>
                    <h2 className="section-title">Preuves</h2>
                    <div className="evidence-container">
                      <img src={incident.evidence} alt="Preuve" />
                    </div>
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </div>

      <IonFooter>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => setSelectedIncident(null)}>
              Fermer
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonContent>
  );
  const SurveillanceDashboard: React.FC = () => (
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      <div className="ion-padding">
        <IonGrid>
          <IonRow className="ion-align-items-center ion-justify-content-between">
            <IonCol>
              <h2 className="section-title">Incidents de Sécurité</h2>
            </IonCol>
            <IonCol size="auto">
              <IonButton
                fill="clear"
                onClick={() => setShowNewIncidentModal(true)}
              >
                <IonIcon slot="start" icon={addOutline} />
                Signaler un incident
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonList>
          {incidents.map((incident) => (
            <IonCard
              key={incident.id}
              className="incident-card"
              onClick={() => setSelectedIncident(incident)}
            >
              <IonCardContent>
                <IonGrid>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="12">
                      <div className="incident-header">
                        <h3>{incident.title}</h3>
                        <IonBadge color={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </IonBadge>
                      </div>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <p className="incident-description-preview">
                        {incident.description.substring(0, 150)}
                        {incident.description.length > 150 ? '...' : ''}
                      </p>
                    </IonCol>
                  </IonRow>

                  <IonRow className="incident-details">
                    <IonCol size="12" sizeMd="6">
                      <IonIcon icon={locationOutline} />
                      <span>{incident.location}</span>
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonIcon icon={timeOutline} />
                      <span>
                        {new Date(incident.datetime).toLocaleString()}
                      </span>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol>
                      <IonBadge
                        color={getStatusColor(incident.status)}
                        className="status-badge"
                      >
                        {incident.status}
                      </IonBadge>
                      {incident.updates && incident.updates.length > 0 && (
                        <div className="updates-count">
                          <small>
                            {incident.updates.length} mise{incident.updates.length > 1 ? 's' : ''} à jour
                          </small>
                        </div>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowNewIncidentModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </div>

      {/* Modal de détails d'incident */}
      <IonModal
        isOpen={!!selectedIncident}
        onDidDismiss={() => setSelectedIncident(null)}
        className="incident-detail-modal"
      >
        {selectedIncident && <IncidentDetailModal incident={selectedIncident} />}
      </IonModal>

      {/* Modal de nouvel incident */}
      <IonModal
        isOpen={showNewIncidentModal}
        onDidDismiss={() => setShowNewIncidentModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Signaler un incident</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowNewIncidentModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Titre</IonLabel>
              <IonInput
                value={newIncident.title}
                onIonChange={e => setNewIncident({
                  ...newIncident,
                  title: e.detail.value!
                })}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea
                value={newIncident.description}
                onIonChange={e => setNewIncident({
                  ...newIncident,
                  description: e.detail.value!
                })}
                rows={4}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Lieu</IonLabel>
              <IonInput
                value={newIncident.location}
                onIonChange={e => setNewIncident({
                  ...newIncident,
                  location: e.detail.value!
                })}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Niveau de gravité</IonLabel>
              <IonSelect
                value={newIncident.severity}
                onIonChange={e => setNewIncident({
                  ...newIncident,
                  severity: e.detail.value
                })}
              >
                <IonSelectOption value="Faible">Faible</IonSelectOption>
                <IonSelectOption value="Moyen">Moyen</IonSelectOption>
                <IonSelectOption value="Élevé">Élevé</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Preuve photo/document</IonLabel>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewIncident({
                        ...newIncident,
                        evidence: event.target?.result as string
                      });
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </IonItem>
          </IonList>

          <div className="ion-padding">
            <IonButton
              expand="block"
              onClick={handleSubmitIncident}
              disabled={isLoading}
            >
              {isLoading ? <IonSpinner name="crescent" /> : 'Soumettre'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonContent>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Surveillance Électorale</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

      <SurveillanceDashboard />

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

export default SurveillanceInterface;

