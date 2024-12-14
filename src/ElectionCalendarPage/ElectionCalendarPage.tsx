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
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonBadge,
    IonList,
    IonItem,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonFab,
    IonFabButton,
    IonAlert,
} from '@ionic/react';
import {
    calendar,
    listOutline,
    filterOutline,
    addOutline,
    notificationsOutline,
    downloadOutline,
    shareOutline,
} from 'ionicons/icons';

interface EventItem {
    id: number;
    title: string;
    date: string;
    description: string;
    location?: string;
    type: string;
    importance: 'high' | 'medium' | 'low';
}

const ElectionCalendarPage: React.FC = () => {
    const history = useHistory();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
    const [searchText, setSearchText] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('Décembre');
    const [showAlert, setShowAlert] = useState(false);

    const [events] = useState<EventItem[]>([
        {
            id: 1,
            title: "Début des inscriptions",
            date: "2024-12-15",
            description: "Ouverture officielle des inscriptions sur les listes électorales",
            location: "Tout le territoire",
            type: "Inscription",
            importance: "high"
        },
        {
            id: 2,
            title: "Formation des agents électoraux",
            date: "2024-12-20",
            description: "Session de formation pour les agents des bureaux de vote",
            location: "Centre de formation - Yaoundé",
            type: "Formation",
            importance: "medium"
        },
        {
            id: 3,
            title: "Distribution du matériel électoral",
            date: "2024-12-22",
            description: "Distribution des urnes et bulletins de vote",
            location: "Centres régionaux",
            type: "Logistique",
            importance: "high"
        }
    ]);

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            default: return 'primary';
        }
    };

    const filterEvents = (items: EventItem[]) => {
        return items.filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    return (
        <IonPage className="calendar-page">
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle>Calendrier Électoral</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowAlert(true)}>
                            <IonIcon slot="icon-only" icon={notificationsOutline} />
                        </IonButton>
                        <IonButton>
                            <IonIcon slot="icon-only" icon={shareOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>

                <IonToolbar>
                    <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as any)}>
                        <IonSegmentButton value="calendar">
                            <IonIcon icon={calendar} />
                            <IonLabel>Calendrier</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="list">
                            <IonIcon icon={listOutline} />
                            <IonLabel>Liste</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={e => setSearchText(e.detail.value!)}
                        placeholder="Rechercher un événement..."
                        className="calendar-searchbar"
                    />
                </IonToolbar>

                {viewMode === 'list' && (
                    <IonToolbar>
                        <IonItem lines="none">
                            <IonSelect
                                value={selectedMonth}
                                onIonChange={e => setSelectedMonth(e.detail.value)}
                                interface="popover"
                                placeholder="Sélectionner le mois"
                                className="month-select"
                            >
                                <IonSelectOption value="Décembre">Décembre 2024</IonSelectOption>
                                <IonSelectOption value="Janvier">Janvier 2025</IonSelectOption>
                                <IonSelectOption value="Février">Février 2025</IonSelectOption>
                            </IonSelect>
                            <IonButton slot="end" fill="clear">
                                <IonIcon slot="icon-only" icon={filterOutline} />
                            </IonButton>
                        </IonItem>
                    </IonToolbar>
                )}
            </IonHeader>

            <IonContent>
                {viewMode === 'calendar' ? (
                    <div className="calendar-view">
                        <IonCard>
                            <IonCardContent>
                                <div className="calendar-grid">
                                    {/* En-tête des jours */}
                                    <div className="calendar-header">
                                        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                                            <div key={day} className="calendar-day-header">{day}</div>
                                        ))}
                                    </div>

                                    {/* Grille des jours */}
                                    <div className="calendar-days">
                                        {Array(35).fill(null).map((_, index) => {
                                            const day = index + 1;
                                            const hasEvent = events.some(event =>
                                                new Date(event.date).getDate() === day
                                            );

                                            return (
                                                <div
                                                    key={index}
                                                    className={`calendar-day ${hasEvent ? 'has-event' : ''}`}
                                                >
                                                    <span className="day-number">{day}</span>
                                                    {hasEvent && <div className="event-indicator" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        {/* Liste des événements du jour sélectionné */}
                        <div className="selected-day-events">
                            <h3>Événements du jour</h3>
                            <IonList>
                                {filterEvents(events).map(event => (
                                    <IonItem key={event.id} className="calendar-event-item">
                                        <div className="event-time-line">
                                            <div className="event-time">
                                                {new Date(event.date).toLocaleDateString()}
                                            </div>
                                            <div className="event-line" />
                                        </div>
                                        <div className="event-content">
                                            <h4>{event.title}</h4>
                                            <p>{event.description}</p>
                                            {event.location && (
                                                <div className="event-location">
                                                    <IonIcon icon={calendar} />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <IonBadge
                                            slot="end"
                                            color={getImportanceColor(event.importance)}
                                        >
                                            {event.type}
                                        </IonBadge>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    </div>
                ) : (
                    <div className="list-view">
                        <IonList>
                            {filterEvents(events).map(event => (
                                <IonItem key={event.id} className="list-event-item">
                                    <IonCard className="event-card">
                                        <IonCardContent>
                                            <div className="event-card-header">
                                                <div className="event-date-badge">
                                                    <span className="event-month">
                                                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                                    </span>
                                                    <span className="event-day">
                                                        {new Date(event.date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="event-info">
                                                    <h3>{event.title}</h3>
                                                    <IonBadge color={getImportanceColor(event.importance)}>
                                                        {event.type}
                                                    </IonBadge>
                                                </div>
                                            </div>
                                            <p className="event-description">{event.description}</p>
                                            {event.location && (
                                                <div className="event-location">
                                                    <IonIcon icon={calendar} />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                        </IonCardContent>
                                    </IonCard>
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowAlert(true)}>
                        <IonIcon icon={downloadOutline} />
                    </IonFabButton>
                </IonFab>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Télécharger le calendrier"
                    message="Voulez-vous télécharger le calendrier électoral complet?"
                    buttons={[
                        {
                            text: 'Annuler',
                            role: 'cancel',
                        },
                        {
                            text: 'Télécharger',
                            handler: () => {
                                console.log('Téléchargement du calendrier');
                            }
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default ElectionCalendarPage;