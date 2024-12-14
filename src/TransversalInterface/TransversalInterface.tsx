import React, { useState } from 'react';
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
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonToast,
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonSearchbar,
  IonModal,
  IonTextarea,
  IonFooter,
  IonProgressBar,
  IonSpinner
} from '@ionic/react';
import {
  lockClosedOutline,
  personOutline,
  helpCircleOutline,
  documentTextOutline,
  sendOutline,
  chatbubbleEllipsesOutline,
  searchOutline,
  closeOutline,
  keyOutline,
  alertCircleOutline
} from 'ionicons/icons';
import './TransversalInterface.css';

type UserRole = 'électeur' | 'scrutateur' | 'admin' | 'observateur';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const TransversalInterface: React.FC = () => {
  // États d'authentification
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: '' as UserRole
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // États du support
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    message: '',
    category: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // FAQ simulée
  const faqs: FAQ[] = [
    {
      question: "Comment puis-je vérifier mon bureau de vote ?",
      answer: "Vous pouvez vérifier votre bureau de vote en utilisant votre numéro d'électeur sur la page de recherche.",
      category: "Inscription"
    },
    {
      question: "Que faire en cas de problème technique ?",
      answer: "Contactez immédiatement le support technique via le formulaire de contact ou appelez le numéro d'urgence.",
      category: "Technique"
    },
    {
      question: "Comment signaler une irrégularité ?",
      answer: "Les observateurs peuvent utiliser le formulaire de signalement dans leur interface dédiée.",
      category: "Sécurité"
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!credentials.role || !credentials.username || !credentials.password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulation de validation basée sur le rôle
      const validCredentials = {
        électeur: { user: 'voter', pass: 'voter123' },
        scrutateur: { user: 'counter', pass: 'counter123' },
        admin: { user: 'admin', pass: 'admin123' },
        observateur: { user: 'observer', pass: 'observer123' }
      };

      const roleCheck = validCredentials[credentials.role];
      if (roleCheck &&
        credentials.username === roleCheck.user &&
        credentials.password === roleCheck.pass) {
        setIsLoggedIn(true);
        setToastMessage('Connexion réussie');
        setShowToast(true);
      } else {
        setLoginError('Identifiants invalides pour ce rôle');
      }
    } catch (error) {
      setLoginError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToastMessage('Ticket de support envoyé avec succès');
      setShowToast(true);
      setShowSupportModal(false);
      setSupportTicket({ subject: '', message: '', category: '' });
    } catch (error) {
      setToastMessage('Erreur lors de l\'envoi du ticket');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LoginPage: React.FC = () => (
    <IonContent className="login-page">
      <div className="login-container">
        <IonCard className="login-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">
              Accès au Système Électoral
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <form onSubmit={handleLogin}>
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Rôle</IonLabel>
                  <IonSelect
                    value={credentials.role}
                    onIonChange={e => setCredentials({
                      ...credentials,
                      role: e.detail.value
                    })}
                  >
                    <IonSelectOption value="électeur">Électeur</IonSelectOption>
                    <IonSelectOption value="scrutateur">Scrutateur</IonSelectOption>
                    <IonSelectOption value="admin">Administrateur</IonSelectOption>
                    <IonSelectOption value="observateur">Observateur</IonSelectOption>
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
                    type="password"
                    value={credentials.password}
                    onIonChange={e => setCredentials({
                      ...credentials,
                      password: e.detail.value!
                    })}
                    required
                  />
                </IonItem>
              </IonList>

              {loginError && (
                <div className="error-message">
                  <IonIcon icon={alertCircleOutline} />
                  <span>{loginError}</span>
                </div>
              )}

              <IonButton
                expand="block"
                type="submit"
                className="ion-margin-top"
                disabled={isLoading}
              >
                {isLoading ? <IonSpinner name="crescent" /> : 'Se connecter'}
              </IonButton>
            </form>

            <div className="help-links ion-text-center ion-margin-top">
              <IonButton
                fill="clear"
                size="small"
                onClick={() => setShowSupportModal(true)}
              >
                Besoin d'aide ?
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>

      <IonFooter>
        <IonToolbar>
          <div className="footer-content ion-text-center">
            <small>© 2024 ELECAM - Système de Gestion des Élections</small>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonContent>
  );

  const SupportModal: React.FC = () => (
    <IonModal isOpen={showSupportModal} onDidDismiss={() => setShowSupportModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Support et Aide</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowSupportModal(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <IonSearchbar
            value={searchQuery}
            onIonChange={e => setSearchQuery(e.detail.value!)}
            placeholder="Rechercher dans la FAQ..."
          />

          <IonAccordionGroup>
            {filteredFAQs.map((faq, index) => (
              <IonAccordion key={index}>
                <IonItem slot="header">
                  <IonLabel>{faq.question}</IonLabel>
                  <IonBadge slot="end">{faq.category}</IonBadge>
                </IonItem>
                <div slot="content" className="ion-padding">
                  {faq.answer}
                </div>
              </IonAccordion>
            ))}
          </IonAccordionGroup>

          <IonCard className="ion-margin-top">
            <IonCardHeader>
              <IonCardTitle>Contactez le support</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSupportTicket}>
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">Catégorie</IonLabel>
                    <IonSelect
                      value={supportTicket.category}
                      onIonChange={e => setSupportTicket({
                        ...supportTicket,
                        category: e.detail.value
                      })}
                    >
                      <IonSelectOption value="technique">Problème technique</IonSelectOption>
                      <IonSelectOption value="access">Problème d'accès</IonSelectOption>
                      <IonSelectOption value="other">Autre question</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">Sujet</IonLabel>
                    <IonInput
                      value={supportTicket.subject}
                      onIonChange={e => setSupportTicket({
                        ...supportTicket,
                        subject: e.detail.value!
                      })}
                      required
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">Message</IonLabel>
                    <IonTextarea
                      value={supportTicket.message}
                      onIonChange={e => setSupportTicket({
                        ...supportTicket,
                        message: e.detail.value!
                      })}
                      rows={4}
                      required
                    />
                  </IonItem>
                </IonList>

                <IonButton
                  expand="block"
                  type="submit"
                  className="ion-margin-top"
                  disabled={isLoading}
                >
                  {isLoading ? <IonSpinner name="crescent" /> : 'Envoyer'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonModal>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Système Électoral</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

      <LoginPage />
      <SupportModal />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />
    </IonPage>
  );
};

export default TransversalInterface;
