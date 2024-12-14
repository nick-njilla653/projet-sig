import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useHistory } from 'react-router';

const Home: React.FC = () => {

  const history = useHistory();

  const handleNavigationToAdminInterface = () => {
    history.push('/AdminInterface');
  };
  const handleNavigationToElectionHomePage = () => {
    history.push('/ElectionHomePage');
  };
  const handleNavigationToIntegrationInterface = () => {
    history.push('/IntegrationInterface');
  };
  const handleNavigationToScrutateurInterface = () => {
    history.push('/ScrutateurInterface');
  };
  const handleNavigationToSurveillanceInterface = () => {
    history.push('/SurveillanceInterface');
  };
  const handleNavigationToTransversalInterface = () => {
    history.push('/TransversalInterface');
  };
  const handleNavigationToVoterInterface = () => {
    history.push('/VoterInterface');
  };
  const handleNavigationToLoginPage = () => {
    history.push('/LoginPage');
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
        <IonButton onClick={handleNavigationToAdminInterface}>Go to Admin Interface</IonButton>
        <IonButton onClick={handleNavigationToElectionHomePage}>Go to Election Home Page</IonButton>
        <IonButton onClick={handleNavigationToIntegrationInterface}>Go to Integration Interface</IonButton>
        <IonButton onClick={handleNavigationToScrutateurInterface}>Go to Scrutateur Interface</IonButton>
        <IonButton onClick={handleNavigationToSurveillanceInterface}>Go to Surveillance Interface</IonButton>
        <IonButton onClick={handleNavigationToTransversalInterface}>Go to Transversal Interface</IonButton>
        <IonButton onClick={handleNavigationToVoterInterface}>Go to Voter Interface</IonButton>
        <IonButton onClick={handleNavigationToLoginPage}>Go to Login Page</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
