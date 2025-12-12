/**
 * Service Tracking Screen for Mobile App
 * Real-time GPS tracking for drivers and parents
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '../../hooks/useLocation';

const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface RouteStop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    estimatedTime: string;
    status: 'pending' | 'arrived' | 'departed';
}

interface ServiceRoute {
    id: string;
    name: string;
    vehiclePlate: string;
    driverName: string;
    stops: RouteStop[];
    currentLocation?: {
        latitude: number;
        longitude: number;
        updatedAt: string;
    };
}

// Mock data for demo
const MOCK_ROUTE: ServiceRoute = {
    id: '1',
    name: 'Sabah Servisi - Kadıköy',
    vehiclePlate: '34 ABC 123',
    driverName: 'Ahmet Yılmaz',
    stops: [
        { id: '1', name: 'Kadıköy Merkez', latitude: 40.9903, longitude: 29.0230, estimatedTime: '07:30', status: 'departed' },
        { id: '2', name: 'Fenerbahçe', latitude: 40.9697, longitude: 29.0369, estimatedTime: '07:45', status: 'arrived' },
        { id: '3', name: 'Bostancı', latitude: 40.9619, longitude: 29.0925, estimatedTime: '08:00', status: 'pending' },
        { id: '4', name: 'Okul', latitude: 41.0082, longitude: 28.9784, estimatedTime: '08:30', status: 'pending' },
    ],
    currentLocation: {
        latitude: 40.9697,
        longitude: 29.0369,
        updatedAt: new Date().toISOString(),
    },
};

export default function ServiceTrackingScreen() {
    const [route, setRoute] = useState<ServiceRoute>(MOCK_ROUTE);
    const [isDriverMode, setIsDriverMode] = useState(false);
    const [isLive, setIsLive] = useState(true);

    const {
        location,
        isTracking,
        startTracking,
        stopTracking,
        requestPermission,
    } = useLocation({
        updateInterval: 10000,
        distanceInterval: 20,
        onLocationUpdate: async (loc) => {
            if (isDriverMode) {
                // Send location to server
                try {
                    await fetch(`${STRAPI_URL}/api/location-logs`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            data: {
                                route: route.id,
                                latitude: loc.latitude,
                                longitude: loc.longitude,
                                speedKmh: loc.speed ? loc.speed * 3.6 : null,
                                heading: loc.heading,
                                recordedAt: new Date().toISOString(),
                                source: 'gps',
                            },
                        }),
                    });
                } catch (error) {
                    console.error('Failed to send location:', error);
                }
            }
        },
    });

    // Simulate live updates for demo
    useEffect(() => {
        if (!isLive || isDriverMode) return;

        const interval = setInterval(() => {
            setRoute(prev => ({
                ...prev,
                currentLocation: prev.currentLocation ? {
                    ...prev.currentLocation,
                    latitude: prev.currentLocation.latitude + (Math.random() - 0.5) * 0.001,
                    longitude: prev.currentLocation.longitude + (Math.random() - 0.5) * 0.001,
                    updatedAt: new Date().toISOString(),
                } : undefined,
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [isLive, isDriverMode]);

    const handleToggleDriverMode = async () => {
        if (!isDriverMode) {
            const granted = await requestPermission();
            if (!granted) {
                Alert.alert('İzin Gerekli', 'Şoför modu için konum izni gereklidir.');
                return;
            }
            await startTracking();
        } else {
            stopTracking();
        }
        setIsDriverMode(!isDriverMode);
    };

    const currentStop = route.stops.find(s => s.status === 'arrived') || route.stops[0];
    const nextStop = route.stops.find(s => s.status === 'pending');

    const mapRegion = {
        latitude: route.currentLocation?.latitude || 41.0082,
        longitude: route.currentLocation?.longitude || 28.9784,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-white px-4 py-3 shadow-sm">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-lg font-bold text-gray-900">{route.name}</Text>
                        <Text className="text-sm text-gray-500">{route.vehiclePlate} • {route.driverName}</Text>
                    </View>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => setIsLive(!isLive)}
                            className={`px-3 py-1.5 rounded-full ${isLive ? 'bg-green-100' : 'bg-gray-100'}`}
                        >
                            <Text className={isLive ? 'text-green-700' : 'text-gray-600'}>
                                {isLive ? '🔴 Canlı' : '⏸️ Durdur'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Map */}
            <View className="flex-1">
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    region={mapRegion}
                    showsUserLocation={isDriverMode}
                >
                    {/* Route Polyline */}
                    <Polyline
                        coordinates={route.stops.map(s => ({ latitude: s.latitude, longitude: s.longitude }))}
                        strokeColor="#3B82F6"
                        strokeWidth={4}
                    />

                    {/* Stop Markers */}
                    {route.stops.map((stop, index) => (
                        <Marker
                            key={stop.id}
                            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                            title={stop.name}
                            description={`${stop.estimatedTime} - ${stop.status === 'departed' ? 'Geçti' : stop.status === 'arrived' ? 'Burada' : 'Bekliyor'}`}
                            pinColor={stop.status === 'departed' ? 'green' : stop.status === 'arrived' ? 'orange' : 'red'}
                        />
                    ))}

                    {/* Current Vehicle Location */}
                    {route.currentLocation && !isDriverMode && (
                        <Marker
                            coordinate={{
                                latitude: route.currentLocation.latitude,
                                longitude: route.currentLocation.longitude,
                            }}
                            title="Servis"
                            description={`Son güncelleme: ${new Date(route.currentLocation.updatedAt).toLocaleTimeString('tr-TR')}`}
                        >
                            <View className="bg-blue-500 p-2 rounded-full">
                                <Text className="text-lg">🚌</Text>
                            </View>
                        </Marker>
                    )}
                </MapView>
            </View>

            {/* Stops List */}
            <View className="bg-white max-h-48">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
                    {route.stops.map((stop, index) => (
                        <View
                            key={stop.id}
                            className={`mr-3 p-3 rounded-xl min-w-[140px] ${stop.status === 'arrived'
                                    ? 'bg-blue-100 border-2 border-blue-500'
                                    : stop.status === 'departed'
                                        ? 'bg-gray-100'
                                        : 'bg-white border border-gray-200'
                                }`}
                        >
                            <View className="flex-row items-center mb-1">
                                <View className={`w-6 h-6 rounded-full mr-2 justify-center items-center ${stop.status === 'departed' ? 'bg-green-500' :
                                        stop.status === 'arrived' ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}>
                                    <Text className="text-white text-xs font-bold">{index + 1}</Text>
                                </View>
                                <Text className={`font-semibold ${stop.status === 'departed' ? 'text-gray-500' : 'text-gray-900'}`}>
                                    {stop.name}
                                </Text>
                            </View>
                            <Text className="text-sm text-gray-500">{stop.estimatedTime}</Text>
                            <Text className={`text-xs mt-1 ${stop.status === 'departed' ? 'text-green-600' :
                                    stop.status === 'arrived' ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                {stop.status === 'departed' ? '✓ Geçti' : stop.status === 'arrived' ? '📍 Burada' : 'Bekliyor'}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Driver Mode Toggle */}
            <View className="bg-white px-4 py-3 border-t border-gray-200">
                <TouchableOpacity
                    onPress={handleToggleDriverMode}
                    className={`py-3 rounded-xl flex-row justify-center items-center ${isDriverMode ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                >
                    <Text className="text-white font-bold text-lg">
                        {isDriverMode ? '🛑 Takibi Durdur' : '🚌 Şoför Modu Başlat'}
                    </Text>
                </TouchableOpacity>
                {isDriverMode && isTracking && (
                    <Text className="text-center text-green-600 text-sm mt-2">
                        📍 Konum paylaşılıyor...
                    </Text>
                )}
            </View>
        </View>
    );
}
