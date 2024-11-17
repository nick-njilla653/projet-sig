import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Button from '../components/ui/button';
import Input from "../components/ui/input";
import './GestionBureauxVote.css';


type Region = {
    id: number;
    name: string;
    departments: Department[];
};

type Department = {
    id: number;
    name: string;
    arrondissements: Arrondissement[];
};

type Arrondissement = {
    id: number;
    name: string;
    pollingCenters: PollingCenter[];
};

type PollingCenter = {
    id: number;
    name: string;
    pollingStations: PollingStation[];
};

type PollingStation = {
    id: number;
    name: string;
    capacity: number;
};

const GestionBureauxVote: React.FC = () => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    const regions: Region[] = [
        {
            id: 1,
            name: 'Dakar',
            departments: [
                {
                    id: 1,
                    name: 'Dakar',
                    arrondissements: [
                        {
                            id: 1,
                            name: 'Plateau',
                            pollingCenters: [
                                {
                                    id: 1,
                                    name: 'École Primaire A',
                                    pollingStations: [
                                        { id: 1, name: 'Bureau 1', capacity: 500 },
                                        { id: 2, name: 'Bureau 2', capacity: 450 },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            name: 'Étranger',
            departments: [
                {
                    id: 2,
                    name: 'Europe',
                    arrondissements: [
                        {
                            id: 2,
                            name: 'France',
                            pollingCenters: [
                                {
                                    id: 2,
                                    name: 'Ambassade Paris',
                                    pollingStations: [
                                        { id: 3, name: 'Bureau 1', capacity: 300 },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="p-4 max-w-6xl max-h-6xl mx-auto">
            <Card>
                <CardHeader className="justify-between">
                    <CardTitle className='items-center'>Gestion des Bureaux de Vote</CardTitle>
                    <div className="items-center">
                        <Button className="bg-green-600 w-4 hover:bg-green-700 items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Bureau
                        </Button>
                    </div>

                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex gap-4">
                        <div className="relative flex-1 items-center">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Rechercher un bureau de vote..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {regions.map((region) => (
                            <div key={region.id} className="border rounded-lg space-y-4">
                                <div
                                    className="flex items-center p-3 bg-gray-50 cursor-pointer"
                                    onClick={() => toggleExpand(`region-${region.id}`)}
                                >
                                    {expanded[`region-${region.id}`] ?
                                        <ChevronDown className="w-4 h-4 mr-2" /> :
                                        <ChevronRight className="w-4 h-4 mr-2" />
                                    }
                                    <span className="font-medium">{region.name}</span>
                                    <div className="ml-auto space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {expanded[`region-${region.id}`] && (
                                    <div className="p-3 pl-8">
                                        {region.departments.map((dept) => (
                                            <div key={dept.id} className="border rounded-lg mt-2">
                                                <div
                                                    className="flex items-center p-3 bg-gray-50 cursor-pointer"
                                                    onClick={() => toggleExpand(`dept-${dept.id}`)}
                                                >
                                                    {expanded[`dept-${dept.id}`] ?
                                                        <ChevronDown className="w-4 h-4 mr-2" /> :
                                                        <ChevronRight className="w-4 h-4 mr-2" />
                                                    }
                                                    <span>{dept.name}</span>
                                                    <div className="ml-auto space-x-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {expanded[`dept-${dept.id}`] && (
                                                    <div className="p-3 pl-8">
                                                        {dept.arrondissements.map((arr) => (
                                                            <div key={arr.id} className="border rounded-lg mt-2">
                                                                <div className="flex items-center p-3 bg-gray-50">
                                                                    <span>{arr.name}</span>
                                                                    <div className="ml-auto space-x-2">
                                                                        <Button variant="ghost" size="sm">
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm" className="text-red-600">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );


};
export default GestionBureauxVote;