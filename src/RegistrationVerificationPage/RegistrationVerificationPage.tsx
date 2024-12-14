
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonLabel,
  IonItem,
  IonList,
  IonBadge,
  IonSpinner,
  IonProgressBar,
  IonText,
  IonBackButton
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  locationOutline,
  calendarOutline,
  idCardOutline,
  arrowBackOutline
} from 'ionicons/icons';

interface VerificationResult {
  isRegistered: boolean;
  voterInfo?: {
    fullName: string;
    pollingStation: string;
    registrationDate: string;
    status: 'active' | 'pending' | 'inactive';
    voterID: string;
  };
  message?: string;
}

const RegistrationVerificationPage: React.FC = () => {
  const history = useHistory();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    idNumber: '',
    birthDate: ''
  });
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation simple
    if (!formData.idNumber || !formData.birthDate) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulation de réponse
      const mockResult: VerificationResult = {
        isRegistered: true,
        voterInfo: {
          fullName: "Jean Dupont",
          pollingStation: "Centre de Vote Yaoundé-Centre 01",
          registrationDate: "2024-01-15",
          status: "active",
          voterID: "CMR2024001234"
        }
      };

      setResult(mockResult);
      setStep(2);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
          </IonButtons>
          <IonTitle>Vérification d'Inscription</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

      <IonContent className="ion-padding">
        {step === 1 && (
          <div className="verification-form">
            <div className="form-header">
              <h2>Vérifiez votre inscription électorale</h2>
              <p>Entrez vos informations pour vérifier votre statut</p>
            </div>

            <form onSubmit={handleSubmit}>
              <IonCard>
                <IonCardContent>
                  <IonList>
                    <IonItem className="custom-input">
                      <IonLabel position="floating">
                        <IonIcon icon={idCardOutline} /> Numéro CNI
                      </IonLabel>
                      <IonInput
                        value={formData.idNumber}
                        onIonChange={e => setFormData({
                          ...formData,
                          idNumber: e.detail.value || ''
                        })}
                        placeholder="Ex: 123456789"
                      />
                    </IonItem>

                    <IonItem className="custom-input">
                      <IonLabel position="floating">
                        <IonIcon icon={calendarOutline} /> Date de naissance
                      </IonLabel>
                      <IonInput
                        type="date"
                        value={formData.birthDate}
                        onIonChange={e => setFormData({
                          ...formData,
                          birthDate: e.detail.value || ''
                        })}
                      />
                    </IonItem>
                  </IonList>

                  {error && (
                    <div className="error-message">
                      <IonText color="danger">
                        <p><IonIcon icon={closeCircleOutline} /> {error}</p>
                      </IonText>
                    </div>
                  )}

                  <IonButton
                    expand="block"
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? <IonSpinner name="crescent" /> : 'Vérifier'}
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </form>
          </div>
        )}

        {step === 2 && result && (
          <div className="result-container">
            <IonCard className={`result-card ${result.isRegistered ? 'success' : 'error'}`}>
              <IonCardContent>
                <div className="result-header">
                  <IonIcon
                    icon={result.isRegistered ? checkmarkCircleOutline : closeCircleOutline}
                    color={result.isRegistered ? "success" : "danger"}
                    className="result-icon"
                  />
                  <h2>{result.isRegistered ? 'Inscription Confirmée' : 'Non Inscrit'}</h2>
                </div>

                {result.isRegistered && result.voterInfo && (
                  <IonList lines="none">
                    <IonItem>
                      <IonLabel>
                        <h3>Nom complet</h3>
                        <p>{result.voterInfo.fullName}</p>
                      </IonLabel>
                    </IonItem>

                    <IonItem>
                      <IonIcon icon={locationOutline} slot="start" />
                      <IonLabel>
                        <h3>Bureau de vote</h3>
                        <p>{result.voterInfo.pollingStation}</p>
                      </IonLabel>
                    </IonItem>

                    <IonItem>
                      <IonIcon icon={calendarOutline} slot="start" />
                      <IonLabel>
                        <h3>Date d'inscription</h3>
                        <p>{new Date(result.voterInfo.registrationDate).toLocaleDateString()}</p>
                      </IonLabel>
                    </IonItem>

                    <IonItem>
                      <IonLabel>
                        <h3>Numéro d'électeur</h3>
                        <p>{result.voterInfo.voterID}</p>
                      </IonLabel>
                      <IonBadge color="primary" slot="end">
                        {result.voterInfo.status.toUpperCase()}
                      </IonBadge>
                    </IonItem>
                  </IonList>
                )}

                <div className="action-buttons">
                  <IonButton
                    expand="block"
                    onClick={() => setStep(1)}
                    fill="outline"
                  >
                    Nouvelle vérification
                  </IonButton>
                  
                  {result.isRegistered && (
                    <IonButton
                      expand="block"
                      onClick={() => history.push('/map')}
                    >
                      Voir mon bureau de vote
                    </IonButton>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RegistrationVerificationPage;