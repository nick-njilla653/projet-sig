import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonBadge,
    IonBackButton,
    IonSearchbar,
    IonList,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonSpinner,
} from '@ionic/react';
import {
    arrowBack,
    barChart,
    peopleCircle,
    checkmarkCircle,
    analytics,
    informationCircle,
    downloadOutline,
    filterCircle,
    layers,
} from 'ionicons/icons';
import ElectoralMap from '../ElectoralMap/ElectoralMap';

interface MapData {
    region: string;
    participation: number;
    registeredVoters: number;
    resultsAvailable: boolean;
    results?: {
        candidate: string;
        votes: number;
        percentage: number;
        party: string;
    }[];
}

const ElectoralMapPage: React.FC = () => {
    const history = useHistory();
    const [viewMode, setViewMode] = useState<'general' | 'participation' | 'results'>('general');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [mapLevel, setMapLevel] = useState<'region' | 'department' | 'district'>('region');
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [regionData, setRegionData] = useState<MapData>({
        region: 'Centre',
        participation: 67.5,
        registeredVoters: 1234567,
        resultsAvailable: true,
        results: [
            { candidate: 'Candidat A', votes: 45678, percentage: 45.6, party: 'Parti A' },
            { candidate: 'Candidat B', votes: 34567, percentage: 34.5, party: 'Parti B' },
            { candidate: 'Candidat C', votes: 19876, percentage: 19.9, party: 'Parti C' },
        ]
    });

    const handleRegionClick = (region: string) => {
        setIsLoading(true);
        setSelectedRegion(region);
        // Simuler le chargement des données
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <IonPage className="electoral-map-page">
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle>Carte Électorale</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon slot="icon-only" icon={downloadOutline} />
                        </IonButton>
                        <IonButton>
                            <IonIcon slot="icon-only" icon={filterCircle} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>

                <IonToolbar>
                    <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as any)}>
                        <IonSegmentButton value="general">
                            <IonIcon icon={layers} />
                            <IonLabel>Général</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="participation">
                            <IonIcon icon={peopleCircle} />
                            <IonLabel>Participation</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="results">
                            <IonIcon icon={barChart} />
                            <IonLabel>Résultats</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={e => setSearchText(e.detail.value!)}
                        placeholder="Rechercher une région..."
                        className="map-searchbar"
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="map-container">
                    {isLoading ? (
                        <div className="loading-overlay">
                            <IonSpinner name="circular" />
                            <p>Chargement des données...</p>
                        </div>
                    ) : (
                        <ElectoralMap
                            viewType={viewMode}
                            level={mapLevel}
                            onRegionSelect={handleRegionClick}
                        />
                    )}
                </div>

                {selectedRegion && regionData && (
                    <div className="region-details">
                        <IonCard>
                            <IonCardContent>
                                <div className="region-header">
                                    <h2>{regionData.region}</h2>
                                    <IonChip color={regionData.resultsAvailable ? "success" : "warning"}>
                                        <IonIcon icon={regionData.resultsAvailable ? checkmarkCircle : informationCircle} />
                                        <IonLabel>{regionData.resultsAvailable ? "Résultats disponibles" : "En attente"}</IonLabel>
                                    </IonChip>
                                </div>

                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="6">
                                            <div className="stat-box">
                                                <div className="stat-label">Participation</div>
                                                <div className="stat-value">{regionData.participation}%</div>
                                            </div>
                                        </IonCol>
                                        <IonCol size="6">
                                            <div className="stat-box">
                                                <div className="stat-label">Inscrits</div>
                                                <div className="stat-value">{regionData.registeredVoters.toLocaleString()}</div>
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>

                                {regionData.resultsAvailable && (
                                    <div className="results-section">
                                        <h3>Résultats</h3>
                                        <IonList>
                                            {regionData.results?.map((result, index) => (
                                                <IonItem key={index} lines="full">
                                                    <div className="result-item">
                                                        <div className="candidate-info">
                                                            <h4>{result.candidate}</h4>
                                                            <span className="party-name">{result.party}</span>
                                                        </div>
                                                        <div className="vote-info">
                                                            <IonBadge color="primary">{result.percentage}%</IonBadge>
                                                            <span className="vote-count">{result.votes.toLocaleString()} votes</span>
                                                        </div>
                                                    </div>
                                                </IonItem>
                                            ))}
                                        </IonList>
                                    </div>
                                )}
                            </IonCardContent>
                        </IonCard>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ElectoralMapPage;