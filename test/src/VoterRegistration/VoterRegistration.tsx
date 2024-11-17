import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit, UserX, Filter, Download, Upload, Bell, History, BarChart, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import Progress from '../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './VoterRegistration.css';

const VoterRegistration = () => {
    const [activeTab, setActiveTab] = useState('register');
    const [searchTerm, setSearchTerm] = useState('');

    interface ValidationErrors {
        nin?: string;
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        address?: string;
        pollingStation?: string;
    }    


    interface FormData {
        nin: string;
        firstName: string;
        lastName: string;
        birthDate: string;
        address: string;
        pollingStation: string;
    }

    const [formData, setFormData] = useState<FormData>({
        nin: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        address: '',
        pollingStation: '',
    });

    const [notifications, setNotifications] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [scanProgress, setScanProgress] = useState(0);

    const statsData = [
        { name: 'Jan', enrolements: 240 },
        { name: 'Fév', enrolements: 300 },
        { name: 'Mar', enrolements: 280 },
        { name: 'Avr', enrolements: 320 }
    ];

    const voters = [
        {
            id: 1,
            nin: "1234567890",
            firstName: "Amadou",
            lastName: "Diallo",
            birthDate: "1990-05-15",
            address: "123 Rue Félix Faure, Dakar",
            pollingStation: "Bureau 1 - École A",
            status: "Validé",
            registrationDate: "2024-01-15",
            history: [
                { date: "2024-01-15", action: "Création", user: "Agent1" },
                { date: "2024-01-15", action: "Validation", user: "Superviseur1" }
            ]
        }
    ];

    useEffect(() => {
        const errors: ValidationErrors = {};
        if (formData.nin && !/^\d{10}$/.test(formData.nin)) {
            errors.nin = "Le NIN doit contenir 10 chiffres";
        }
        if (formData.firstName && formData.firstName.length < 2) {
            errors.firstName = "Le prénom doit contenir au moins 2 caractères";
        }
        setValidationErrors(errors);
    }, [formData]);

    const checkDuplicates = (nin: string): boolean => {
        return voters.some(voter => voter.nin === nin);
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleScanDocument = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setFormData({
                    nin: "1234567890",
                    firstName: "Nouveau",
                    lastName: "Électeur",
                    birthDate: "1990-01-01",
                    address: "Adresse scannée",
                    pollingStation: "Bureau 1"
                });
            }
        }, 200);
    };

    const RegistrationForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Numéro d'Identification Nationale</label>
                        <Input
                            placeholder="Entrez le NIN"
                            value={formData.nin}
                            onChange={(e) => handleInputChange('nin', e.target.value)}
                            className={validationErrors.nin ? 'border-red-500' : ''}
                        />
                        {validationErrors.nin && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.nin}</p>
                        )}
                        {checkDuplicates(formData.nin) && (
                            <Alert className="mt-2 bg-yellow-50">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Un électeur avec ce NIN existe déjà dans le système.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <div className="space-y-4">
                        <Input
                            placeholder="Prénom"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                        <Input
                            placeholder="Nom"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                        <Input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <Input
                        placeholder="Adresse complète"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                    <Input
                        placeholder="Bureau de vote"
                        value={formData.pollingStation}
                        onChange={(e) => handleInputChange('pollingStation', e.target.value)}
                    />
                    <div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleScanDocument}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Scanner les documents
                        </Button>
                        {scanProgress > 0 && scanProgress < 100 && (
                            <div className="mt-2">
                                <Progress value={scanProgress} />
                                <p className="text-sm text-gray-500 mt-1">Scan en cours... {scanProgress}%</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const VotersList = () => (
        <div className="mt-4">
            <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">NIN</th>
                        <th className="px-4 py-2 text-left">Nom complet</th>
                        <th className="px-4 py-2 text-left">Bureau de vote</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {voters.map(voter => (
                        <tr key={voter.id} className="border-t">
                            <td className="px-4 py-2">{voter.nin}</td>
                            <td className="px-4 py-2">{`${voter.firstName} ${voter.lastName}`}</td>
                            <td className="px-4 py-2">{voter.pollingStation}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${voter.status === 'Validé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {voter.status}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex justify-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600">
                                        <UserX className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const Statistics = () => (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Statistiques d'enrôlement</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <LineChart width={600} height={200} data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="enrolements" stroke="#8884d8" />
                    </LineChart>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Enrôlement des Électeurs</CardTitle>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setShowStats(!showStats)}>
                                <BarChart className="w-4 h-4 mr-2" />
                                Statistiques
                            </Button>
                            <Button variant="outline">
                                <Bell className="w-4 h-4 mr-2" />
                                Notifications
                                {notifications.length > 0 && (
                                    <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {notifications.length}
                                    </span>
                                )}
                            </Button>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="register" onClick={() => setActiveTab('register')}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Nouvel électeur
                            </TabsTrigger>
                            <TabsTrigger value="list" onClick={() => setActiveTab('list')}>
                                Liste des électeurs
                            </TabsTrigger>

                        </TabsList>

                        <TabsContent value="register" activeValue={activeTab}>
                            <RegistrationForm />
                        </TabsContent>
                        <TabsContent value="list" activeValue={activeTab}>
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Rechercher un électeur"
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtres
                                </Button>
                            </div>
                            <VotersList />
                        </TabsContent>

                    </Tabs>

                    {showStats && <Statistics />}
                </CardContent>
            </Card>
        </div>
    );
};

export default VoterRegistration;