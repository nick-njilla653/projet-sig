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
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonAlert,
    IonToast,
    IonProgressBar,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonInput,
    IonTextarea
} from '@ionic/react';
import {
    settingsOutline,
    keyOutline,
    downloadOutline,
    cloudUploadOutline,
    refreshOutline,
    gridOutline,
    documentTextOutline,
    analyticsOutline,
    closeOutline,
    checkmarkOutline,
    warningOutline
} from 'ionicons/icons';
import './IntegrationInterface.css';

interface ApiConfig {
    id: string;
    name: string;
    endpoint: string;
    key: string;
    status: 'active' | 'inactive';
    lastSync?: string;
}

interface ExportConfig {
    id: string;
    format: 'csv' | 'json' | 'pdf';
    frequency: 'manual' | 'hourly' | 'daily';
    destination: string;
    lastExport?: string;
    status: 'success' | 'failed' | 'pending';
}

interface ApiTestResult {
    status: 'success' | 'error';
    latency: number;
    message: string;
    timestamp: string;
}

interface ExportResult {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    url?: string;
    error?: string;
}

interface ApiKeyManagement {
    currentKey: string;
    lastRotation: string;
    expiresAt: string;
    permissions: string[];
}

const IntegrationInterface: React.FC = () => {
    // États
    const [activeTab, setActiveTab] = useState<'api' | 'export'>('api');
    const [showNewApiModal, setShowNewApiModal] = useState(false);
    const [showNewExportModal, setShowNewExportModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    // Ajoutez avec les autres états
    const [selectedExportId, setSelectedExportId] = useState<string>('');
    const [showKeyManagementModal, setShowKeyManagementModal] = useState(false);
    const [showExportProgressModal, setShowExportProgressModal] = useState(false);
    const [showExportConfigModal, setShowExportConfigModal] = useState(false);
    const [selectedApiId, setSelectedApiId] = useState<string>('');
    const [selectedApiKeyInfo, setSelectedApiKeyInfo] = useState<ApiKeyManagement | null>(null);
    const [currentExportJob, setCurrentExportJob] = useState<ExportResult | null>(null);
    const [exportConfigForm, setExportConfigForm] = useState({
        format: 'csv',
        frequency: 'manual',
        destination: ''
    });

    // États des formulaires
    const [newApiConfig, setNewApiConfig] = useState<Partial<ApiConfig>>({
        status: 'inactive'
    });
    const [newExportConfig, setNewExportConfig] = useState<Partial<ExportConfig>>({
        format: 'csv',
        frequency: 'manual'
    });

    // Données simulées
    const [apiConfigs] = useState<ApiConfig[]>([
        {
            id: 'api1',
            name: 'API Identification',
            endpoint: 'https://api.identification.cm/v1',
            key: '*****',
            status: 'active',
            lastSync: '2024-03-01T10:30:00'
        },
        {
            id: 'api2',
            name: 'API Géolocalisation',
            endpoint: 'https://api.geolocation.cm/v1',
            key: '*****',
            status: 'inactive',
            lastSync: '2024-02-28T15:45:00'
        }
    ]);

    // Gestion des APIs

    const handleKeyManagement = async (apiId: string) => {
        setIsLoading(true);
        try {
            const keyInfo: ApiKeyManagement = {
                currentKey: '*****',
                lastRotation: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
                permissions: ['read', 'write']
            };

            setShowKeyManagementModal(true);
            setSelectedApiKeyInfo(keyInfo);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerateKey = async (apiId: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newKey = 'new_generated_key_' + Math.random().toString(36).substr(2, 9);
            setToastMessage('Nouvelle clé générée avec succès');
            setShowToast(true);
            return newKey;
        } catch (error) {
            setAlertMessage('Échec de la génération de la clé');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Gestion des Exports


    const handleConfigureExport = async (exportId: string) => {
        setSelectedExportId(exportId);
        const currentConfig = exportConfigs.find(config => config.id === exportId);
        setExportConfigForm({
            format: currentConfig?.format || 'csv',
            frequency: currentConfig?.frequency || 'manual',
            destination: currentConfig?.destination || ''
        });
        setShowExportConfigModal(true);
    };

    const handleSaveExportConfig = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setToastMessage('Configuration sauvegardée avec succès');
            setShowToast(true);
            setShowExportConfigModal(false);
        } catch (error) {
            setAlertMessage('Échec de la sauvegarde de la configuration');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const [exportConfigs] = useState<ExportConfig[]>([
        {
            id: 'exp1',
            format: 'csv',
            frequency: 'daily',
            destination: 'sftp://exports.elecam.cm/results',
            lastExport: '2024-03-01T00:00:00',
            status: 'success'
        },
        {
            id: 'exp2',
            format: 'json',
            frequency: 'hourly',
            destination: 'https://api.elecam.cm/webhooks/results',
            lastExport: '2024-03-01T12:00:00',
            status: 'pending'
        }
    ]);

    // Version complète de handleApiTest à utiliser
    const handleApiTest = async (apiId: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation d'appel API
            const testResult: ApiTestResult = {
                status: 'success',
                latency: 245, // en ms
                message: 'Connexion établie avec succès',
                timestamp: new Date().toISOString()
            };

            setToastMessage(`Test réussi - Latence: ${testResult.latency}ms`);
            setShowToast(true);
        } catch (error) {
            setAlertMessage('Échec du test de connexion. Veuillez vérifier les paramètres.');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };



    // Ajouter cette version dans la section "Gestion des Exports"
    const handleExportNow = async (exportId: string) => {
        setIsLoading(true);
        try {
            const exportJob: ExportResult = {
                jobId: 'job_' + Math.random().toString(36).substr(2, 9),
                status: 'processing',
                progress: 0
            };

            setShowExportProgressModal(true);
            setCurrentExportJob(exportJob);

            // Simuler la progression
            const interval = setInterval(() => {
                setCurrentExportJob(prev => {
                    if (!prev) return prev;
                    if (prev.progress >= 100) {
                        clearInterval(interval);
                        return {
                            ...prev,
                            status: 'completed',
                            url: 'https://example.com/exports/file.csv'
                        };
                    }
                    return {
                        ...prev,
                        progress: prev.progress + 10
                    };
                });
            }, 1000);

        } catch (error) {
            setAlertMessage('Échec du démarrage de l\'export');
            setShowAlert(true);
        }
    };

    const ApiConfigList: React.FC = () => (
        <IonList>
            {apiConfigs.map((api) => (
                <IonCard key={api.id}>
                    <IonCardHeader>
                        <IonCardTitle className="ion-text-wrap">{api.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="api-details">
                            <IonItem lines="none">
                                <IonLabel>
                                    <h3>Endpoint</h3>
                                    <p>{api.endpoint}</p>
                                </IonLabel>
                            </IonItem>

                            <IonItem lines="none">
                                <IonLabel>
                                    <h3>Statut</h3>
                                    <IonBadge color={api.status === 'active' ? 'success' : 'medium'}>
                                        {api.status === 'active' ? 'Actif' : 'Inactif'}
                                    </IonBadge>
                                </IonLabel>
                            </IonItem>

                            {api.lastSync && (
                                <IonItem lines="none">
                                    <IonLabel>
                                        <h3>Dernière synchronisation</h3>
                                        <p>{new Date(api.lastSync).toLocaleString()}</p>
                                    </IonLabel>
                                </IonItem>
                            )}


                            <div className="ion-padding">
                                <IonButton
                                    expand="block"
                                    onClick={() => handleApiTest(api.id)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <IonSpinner name="crescent" /> : 'Tester la connexion'}
                                </IonButton>
                                <IonButton
                                    expand="block"
                                    onClick={() => {
                                        setSelectedApiId(api.id);
                                        handleKeyManagement(api.id);
                                    }}
                                >
                                    <IonIcon slot="start" icon={keyOutline} />
                                    Gérer la clé
                                </IonButton>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>
            ))}
        </IonList>
    );

    const ExportConfigList: React.FC = () => (
        <IonList>
            {exportConfigs.map((config) => (
                <IonCard key={config.id}>
                    <IonCardHeader>
                        <IonCardTitle className="ion-text-wrap">
                            Export {config.format.toUpperCase()}
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="export-details">
                            <IonItem lines="none">
                                <IonLabel>
                                    <h3>Destination</h3>
                                    <p>{config.destination}</p>
                                </IonLabel>
                            </IonItem>

                            <IonItem lines="none">
                                <IonLabel>
                                    <h3>Fréquence</h3>
                                    <p>{config.frequency}</p>
                                </IonLabel>
                            </IonItem>

                            <IonItem lines="none">
                                <IonLabel>
                                    <h3>Statut</h3>
                                    <IonBadge
                                        color={
                                            config.status === 'success' ? 'success' :
                                                config.status === 'failed' ? 'danger' :
                                                    'warning'
                                        }
                                    >
                                        {config.status}
                                    </IonBadge>
                                </IonLabel>
                            </IonItem>

                            {config.lastExport && (
                                <IonItem lines="none">
                                    <IonLabel>
                                        <h3>Dernier export</h3>
                                        <p>{new Date(config.lastExport).toLocaleString()}</p>
                                    </IonLabel>
                                </IonItem>
                            )}


                            <div className="ion-padding">
                                <IonButton
                                    expand="block"
                                    onClick={() => handleExportNow(config.id)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <IonSpinner name="crescent" /> : 'Exporter maintenant'}
                                </IonButton>
                                <IonButton
                                    expand="block"
                                    onClick={() => handleConfigureExport(config.id)}
                                >
                                    <IonIcon slot="start" icon={settingsOutline} />
                                    Configurer
                                </IonButton>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>
            ))}
        </IonList>
    );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Intégration & Export</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => activeTab === 'api' ? setShowNewApiModal(true) : setShowNewExportModal(true)}>
                            <IonIcon slot="icon-only" icon={gridOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as 'api' | 'export')}>
                        <IonSegmentButton value="api">
                            <IonLabel>APIs</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="export">
                            <IonLabel>Exports</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
                {isLoading && <IonProgressBar type="indeterminate" />}
            </IonHeader>

            <IonContent>
                {activeTab === 'api' ? <ApiConfigList /> : <ExportConfigList />}

                {/* Modal de gestion des clés API */}
                <IonModal isOpen={showKeyManagementModal} onDidDismiss={() => setShowKeyManagementModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Gestion de la clé API</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowKeyManagementModal(false)}>
                                    <IonIcon icon={closeOutline} />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="ion-padding">
                        {selectedApiKeyInfo && (
                            <>
                                <IonList>
                                    <IonItem>
                                        <IonLabel>
                                            <h2>Clé actuelle</h2>
                                            <p>{selectedApiKeyInfo.currentKey}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>
                                            <h2>Dernière rotation</h2>
                                            <p>{new Date(selectedApiKeyInfo.lastRotation).toLocaleString()}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>
                                            <h2>Expire le</h2>
                                            <p>{new Date(selectedApiKeyInfo.expiresAt).toLocaleString()}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>
                                            <h2>Permissions</h2>
                                            {selectedApiKeyInfo.permissions.map(perm => (
                                                <IonBadge key={perm} color="primary" className="ion-margin-end">
                                                    {perm}
                                                </IonBadge>
                                            ))}
                                        </IonLabel>
                                    </IonItem>
                                </IonList>

                                <div className="ion-padding">
                                    <IonButton expand="block" onClick={() => handleRegenerateKey(selectedApiId)}>
                                        Générer une nouvelle clé
                                    </IonButton>
                                </div>
                            </>
                        )}
                    </IonContent>
                </IonModal>

                {/* Modal de progression d'export */}
                <IonModal isOpen={showExportProgressModal} onDidDismiss={() => setShowExportProgressModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Progression de l'export</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="ion-padding">
                        {currentExportJob && (
                            <div className="export-progress">
                                <IonProgressBar
                                    value={currentExportJob.progress / 100}
                                    buffer={1}
                                    color={currentExportJob.status === 'completed' ? 'success' : 'primary'}
                                />

                                <div className="progress-details ion-text-center ion-padding">
                                    <h2 className="ion-padding">{currentExportJob.progress}%</h2>
                                    <p>Status: {currentExportJob.status}</p>

                                    {currentExportJob.status === 'completed' && currentExportJob.url && (
                                        <IonButton expand="block" href={currentExportJob.url} target="_blank">
                                            <IonIcon slot="start" icon={downloadOutline} />
                                            Télécharger l'export
                                        </IonButton>
                                    )}

                                    {currentExportJob.status === 'failed' && currentExportJob.error && (
                                        <div className="error-message ion-padding">
                                            <IonIcon icon={warningOutline} />
                                            <p>{currentExportJob.error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </IonContent>
                </IonModal>

                {/* Modal de configuration d'export */}
                <IonModal isOpen={showExportConfigModal} onDidDismiss={() => setShowExportConfigModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Configuration de l'export</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowExportConfigModal(false)}>
                                    <IonIcon icon={closeOutline} />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="ion-padding">
                        <IonList>
                            <IonItem>
                                <IonLabel>Format</IonLabel>
                                <IonSelect
                                    value={exportConfigForm.format}
                                    onIonChange={e => setExportConfigForm({
                                        ...exportConfigForm,
                                        format: e.detail.value
                                    })}
                                >
                                    <IonSelectOption value="csv">CSV</IonSelectOption>
                                    <IonSelectOption value="json">JSON</IonSelectOption>
                                    <IonSelectOption value="pdf">PDF</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Fréquence</IonLabel>
                                <IonSelect
                                    value={exportConfigForm.frequency}
                                    onIonChange={e => setExportConfigForm({
                                        ...exportConfigForm,
                                        frequency: e.detail.value
                                    })}
                                >
                                    <IonSelectOption value="manual">Manuel</IonSelectOption>
                                    <IonSelectOption value="hourly">Toutes les heures</IonSelectOption>
                                    <IonSelectOption value="daily">Quotidien</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Destination</IonLabel>
                                <IonInput
                                    value={exportConfigForm.destination}
                                    onIonChange={e => setExportConfigForm({
                                        ...exportConfigForm,
                                        destination: e.detail.value!
                                    })}
                                    placeholder="sftp://exemple.com/exports/"
                                    required
                                />
                            </IonItem>
                        </IonList>

                        <div className="ion-padding">
                            <IonButton expand="block" onClick={() => handleSaveExportConfig()}>
                                Sauvegarder la configuration
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>



                {/* Modal Nouvelle API */}
                <IonModal isOpen={showNewApiModal} onDidDismiss={() => setShowNewApiModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Nouvelle API</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowNewApiModal(false)}>
                                    <IonIcon icon={closeOutline} />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Nom</IonLabel>
                                <IonInput
                                    value={newApiConfig.name}
                                    onIonChange={e => setNewApiConfig({
                                        ...newApiConfig,
                                        name: e.detail.value!
                                    })}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Endpoint</IonLabel>
                                <IonInput
                                    value={newApiConfig.endpoint}
                                    onIonChange={e => setNewApiConfig({
                                        ...newApiConfig,
                                        endpoint: e.detail.value!
                                    })}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Clé API</IonLabel>
                                <IonInput
                                    type="password"
                                    value={newApiConfig.key}
                                    onIonChange={e => setNewApiConfig({
                                        ...newApiConfig,
                                        key: e.detail.value!
                                    })}
                                    required
                                />
                            </IonItem>
                        </IonList>

                        <div className="ion-padding">
                            <IonButton expand="block">
                                Ajouter l'API
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>

                {/* Modal Nouvel Export */}
                <IonModal isOpen={showNewExportModal} onDidDismiss={() => setShowNewExportModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Nouvel Export</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowNewExportModal(false)}>
                                    <IonIcon icon={closeOutline} />
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonList>
                            <IonItem>
                                <IonLabel>Format</IonLabel>
                                <IonSelect
                                    value={newExportConfig.format}
                                    onIonChange={e => setNewExportConfig({
                                        ...newExportConfig,
                                        format: e.detail.value
                                    })}
                                >
                                    <IonSelectOption value="csv">CSV</IonSelectOption>
                                    <IonSelectOption value="json">JSON</IonSelectOption>
                                    <IonSelectOption value="pdf">PDF</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Fréquence</IonLabel>
                                <IonSelect
                                    value={newExportConfig.frequency}
                                    onIonChange={e => setNewExportConfig({
                                        ...newExportConfig,
                                        frequency: e.detail.value
                                    })}
                                >
                                    <IonSelectOption value="manual">Manuel</IonSelectOption>
                                    <IonSelectOption value="hourly">Toutes les heures</IonSelectOption>
                                    <IonSelectOption value="daily">Quotidien</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Destination</IonLabel>
                                <IonInput
                                    value={newExportConfig.destination}
                                    onIonChange={e => setNewExportConfig({
                                        ...newExportConfig,
                                        destination: e.detail.value!
                                    })}
                                    required
                                />
                            </IonItem>
                        </IonList>

                        <div className="ion-padding">
                            <IonButton expand="block">
                                Configurer l'export
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>

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

export default IntegrationInterface;