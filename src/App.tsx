import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import ElectionHomePage from './ElectionHomePage/ElectionHomePage';
import AdminInterface from './AdminInterface/AdminInterface';
import IntegrationInterface from './IntegrationInterface/IntegrationInterface';
import ScrutateurInterface from './ScrutateurInterface/ScrutateurInterface';
import SurveillanceInterface from './SurveillanceInterface/SurveillanceInterface';
import VoterInterface from './VoterInterface/VoterInterface';
import TransversalInterface from './TransversalInterface/TransversalInterface';
import LoginPage from './LoginPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ElectoralMapPage from './ElectoralMapPage/ElectoralMapPage';
import RegistrationVerificationPage from './RegistrationVerificationPage/RegistrationVerificationPage';
import ElectionCalendarPage from './ElectionCalendarPage/ElectionCalendarPage'

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>

        <Route exact path="/map" component={ElectoralMapPage} />
        <Route exact path="/verify" component={RegistrationVerificationPage} />
        <Route exact path="/calendar" component={ElectionCalendarPage} />
        <Route exact path="/ElectionHomePage" component={ElectionHomePage} />
        <Route exact path="/IntegrationInterface" component={IntegrationInterface} />
        <Route exact path="/ScrutateurInterface" component={ScrutateurInterface} />
        <Route exact path="/TransversalInterface" component={TransversalInterface} />
        <ProtectedRoute exact path="/SurveillanceInterface" component={SurveillanceInterface} requiredRole="observateur" />        
        <ProtectedRoute exact path="/VoterInterface" component={VoterInterface} requiredRole="electeur" />
        <Route exact path="/LoginPage" component={LoginPage} />
        <Route exact path="/AdminInterface" component={AdminInterface} />

        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
