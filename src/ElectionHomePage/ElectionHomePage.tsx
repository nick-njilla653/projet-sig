import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import {
  mapOutline,
  peopleOutline, // au lieu de personCheckmark
  calendarOutline,
  statsChartOutline,
  newspaperOutline,
  searchOutline,
  notificationsOutline,
  arrowForwardOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { RefresherEventDetail } from '@ionic/core';

// Interfaces
interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface ElectionStats {
  totalRegistered: number;
  totalCenters: number;
  activeObservers: number;
  completedRegistrations: number;
}

interface GuideItem {
  icon: string;
  title: string;
  description: string;
}

const ElectionHomePage: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState<string>('');

  // Données statiques
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Ouverture des inscriptions",
      description: "Les inscriptions pour les élections présidentielles sont maintenant ouvertes",
      date: "15 Dec 2024",
      category: "Inscription"
    },
    {
      id: 2,
      title: "Formation des scrutateurs",
      description: "Sessions de formation prévues dans toutes les régions",
      date: "20 Dec 2024",
      category: "Formation"
    },
    {
      id: 3,
      title: "Nouveaux bureaux de vote",
      description: "Ajout de 50 nouveaux bureaux de vote dans la région du Centre",
      date: "22 Dec 2024",
      category: "Infrastructure"
    }
  ];

  const electionStats: ElectionStats = {
    totalRegistered: 6500000,
    totalCenters: 25000,
    activeObservers: 1200,
    completedRegistrations: 4500000
  };

  const guideItems: GuideItem[] = [
    {
      icon: peopleOutline,
      title: "S'inscrire",
      description: "Comment s'inscrire sur les listes électorales"
    },
    {
      icon: calendarOutline,
      title: "Dates clés",
      description: "Calendrier des événements importants"
    },
    {
      icon: informationCircleOutline,
      title: "Voter",
      description: "Le processus de vote expliqué"
    }
  ];

  const mainFeatures = [
    {
      title: 'Carte Électorale',
      description: 'Explorez la carte interactive des bureaux de vote',
      icon: mapOutline,
      path: '/map',
      gradient: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
      animation: 'slide-right'
    },
    {
      title: 'Vérification',
      description: 'Vérifiez votre inscription sur la liste électorale',
      icon: peopleOutline,
      path: '/verify',
      gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
      animation: 'slide-up'
    },
    {
      title: 'Calendrier',
      description: 'Dates importantes du processus électoral',
      icon: calendarOutline,
      path: '/calendar',
      gradient: 'linear-gradient(135deg, #f6d365, #fda085)',
      animation: 'slide-left'
    }
  ];

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      event.detail.complete();
    }, 1500);
  };

  return (
    <IonPage className="election-home">
      <IonHeader className="ion-no-border">
        <IonToolbar className="main-toolbar">
          <IonTitle>ELECAM 2024</IonTitle>
          <IonButton slot="end" fill="clear">
            <IonIcon icon={notificationsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Bannière de bienvenue */}
        <div className="welcome-section">
          <h1 className="text-gradient">Bienvenue sur ELECAM</h1>
          <p>Votre guide pour les élections présidentielles 2024</p>
        </div>

        {/* Carrousel des fonctionnalités principales */}
        <div className="carousel-section">
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            className="feature-carousel"
          >
            {mainFeatures.map((feature, index: number) => (
              <SwiperSlide key={index}>
                <IonCard
                  className={`feature-card ${feature.animation}`}
                  style={{ background: feature.gradient }}
                  onClick={() => history.push(feature.path)}
                >
                  <div className="feature-content">
                    <IonIcon icon={feature.icon} className="feature-icon" />
                    <h2>{feature.title}</h2>
                    <p>{feature.description}</p>
                    <IonIcon icon={arrowForwardOutline} className="arrow-icon" />
                  </div>
                </IonCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Section Actualités */}
        <div className="news-section">
          <div className="section-header">
            <h2>Dernières Actualités</h2>
            <IonSearchbar
              value={searchText}
              onIonChange={e => setSearchText(e.detail.value!)}
              placeholder="Rechercher..."
              className="custom-searchbar"
            />
          </div>

          <IonList className="news-list">
            {newsItems.map((item: NewsItem) => (
              <IonItem key={item.id} className="news-item" button>
                <IonLabel>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="news-meta">
                    <IonBadge color="medium">{item.date}</IonBadge>
                    <IonBadge color="primary">{item.category}</IonBadge>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>

        {/* Section Statistiques */}
        <div className="stats-section">
          <h2>Statistiques des Inscriptions</h2>
          <IonGrid>
            <IonRow>
              {Object.entries(electionStats).map(([key, value]: [string, number], index: number) => (
                <IonCol size="6" size-md="3" key={index}>
                  <div className="stat-card">
                    <h3>{value.toLocaleString()}</h3>
                    <p>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Guide de l'électeur */}
        <div className="guide-section">
          <h2>Guide de l'électeur</h2>
          <div className="guide-cards">
            {guideItems.map((item: GuideItem, index: number) => (
              <IonCard
                key={index}
                className="guide-card"
                button
                onClick={() => history.push(`/guide/${index + 1}`)}
              >
                <IonIcon icon={item.icon} className="guide-icon" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <IonIcon icon={arrowForwardOutline} className="guide-arrow" />
              </IonCard>
            ))}
          </div>
        </div>

        {/* Pied de page avec aide */}
        <div className="help-section">
          <IonCard className="help-card" button onClick={() => history.push('/help')}>
            <IonIcon icon={informationCircleOutline} className="help-icon" />
            <h3>Besoin d'aide ?</h3>
            <p>Consultez notre guide complet ou contactez-nous</p>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ElectionHomePage;