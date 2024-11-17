import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const handleNavigationToGestionBureauxVote = () => {
    history.push('/GestionBureauxVote');
  };
  const handleNavigationToVoterRegistration = () => {
    history.push('/VoterRegistration');
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <IonButton onClick={handleNavigationToGestionBureauxVote}>Go to Polling Station Management</IonButton> 
        <IonButton onClick={handleNavigationToVoterRegistration}>Go to Voter Registration</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
