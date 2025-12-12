/**
 * Attendance Screen for Mobile App
 * Face recognition check-in/check-out with camera
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import { useCamera } from '../../hooks/useCamera';
import { useLocation } from '../../hooks/useLocation';

const AI_SERVICE_URL = process.env.EXPO_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface AttendanceResult {
    success: boolean;
    studentName?: string;
    confidence?: number;
    message: string;
}

export default function AttendanceScreen() {
    const [mode, setMode] = useState<'idle' | 'camera' | 'processing' | 'result'>('idle');
    const [result, setResult] = useState<AttendanceResult | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const {
        cameraRef,
        facing,
        permission,
        requestPermission,
        toggleFacing,
        takePhoto
    } = useCamera({
        initialFacing: 'front',
        enableBase64: true,
        onError: (error) => Alert.alert('Hata', error),
    });

    const { location, getCurrentLocation, requestPermission: requestLocationPermission } = useLocation();

    const handleStartAttendance = async () => {
        // Request permissions
        const cameraGranted = await requestPermission();
        if (!cameraGranted) {
            Alert.alert('İzin Gerekli', 'Yoklama için kamera izni gereklidir.');
            return;
        }

        await requestLocationPermission();
        setMode('camera');
    };

    const handleCapture = async () => {
        const photo = await takePhoto();
        if (!photo) return;

        setCapturedPhoto(photo.uri);
        setMode('processing');

        try {
            // Get current location
            const loc = await getCurrentLocation();

            // Send to AI service for face matching
            const matchResponse = await fetch(`${AI_SERVICE_URL}/api/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_base64: photo.base64,
                    threshold: 0.6,
                }),
            });

            const matchResult = await matchResponse.json();

            if (matchResult.match) {
                // Record attendance in Strapi
                const attendanceResponse = await fetch(`${STRAPI_URL}/api/attendance-logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: {
                            student: matchResult.user_id,
                            checkInTime: new Date().toISOString(),
                            status: 'present',
                            verificationMethod: 'face_recognition',
                            faceMatchConfidence: matchResult.confidence,
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                        },
                    }),
                });

                setResult({
                    success: true,
                    studentName: matchResult.user_id, // Would be replaced with actual name from Strapi
                    confidence: matchResult.confidence,
                    message: 'Yoklama başarıyla kaydedildi!',
                });
            } else {
                setResult({
                    success: false,
                    message: 'Yüz tanıma başarısız. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error('Attendance error:', error);
            setResult({
                success: false,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }

        setMode('result');
    };

    const handleReset = () => {
        setMode('idle');
        setResult(null);
        setCapturedPhoto(null);
    };

    // Permission not granted
    if (permission === false) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 p-6">
                <Text className="text-xl font-bold text-gray-800 mb-4">Kamera İzni Gerekli</Text>
                <Text className="text-gray-600 text-center mb-6">
                    Yüz tanıma ile yoklama için kamera erişimi gereklidir.
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="bg-blue-500 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">İzin Ver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Idle State
    if (mode === 'idle') {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 p-6">
                <View className="w-32 h-32 bg-blue-100 rounded-full justify-center items-center mb-8">
                    <Text className="text-6xl">📷</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-2">Yoklama</Text>
                <Text className="text-gray-600 text-center mb-8">
                    Yüz tanıma ile giriş/çıkış kaydı yapın
                </Text>

                <TouchableOpacity
                    onPress={handleStartAttendance}
                    className="bg-green-500 px-8 py-4 rounded-xl mb-4"
                >
                    <Text className="text-white font-bold text-lg">🟢 Giriş Yap</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleStartAttendance}
                    className="bg-red-500 px-8 py-4 rounded-xl"
                >
                    <Text className="text-white font-bold text-lg">🔴 Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Camera State
    if (mode === 'camera') {
        return (
            <View className="flex-1">
                <CameraView
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    facing={facing}
                >
                    {/* Overlay */}
                    <View className="flex-1 justify-end items-center pb-10">
                        {/* Face Guide */}
                        <View className="absolute top-1/4 w-64 h-80 border-4 border-white/50 rounded-[100px]" />

                        <Text className="text-white text-lg mb-8 text-center">
                            Yüzünüzü çerçeve içine yerleştirin
                        </Text>

                        <View className="flex-row items-center gap-6">
                            <TouchableOpacity
                                onPress={toggleFacing}
                                className="w-14 h-14 bg-white/30 rounded-full justify-center items-center"
                            >
                                <Text className="text-2xl">🔄</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleCapture}
                                className="w-20 h-20 bg-white rounded-full justify-center items-center border-4 border-blue-500"
                            >
                                <View className="w-16 h-16 bg-blue-500 rounded-full" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleReset}
                                className="w-14 h-14 bg-white/30 rounded-full justify-center items-center"
                            >
                                <Text className="text-2xl">✕</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </CameraView>
            </View>
        );
    }

    // Processing State
    if (mode === 'processing') {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 p-6">
                {capturedPhoto && (
                    <Image
                        source={{ uri: capturedPhoto }}
                        className="w-48 h-48 rounded-full mb-8"
                    />
                )}
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-lg text-gray-600 mt-4">Yüz tanıma yapılıyor...</Text>
            </View>
        );
    }

    // Result State
    if (mode === 'result' && result) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 p-6">
                <View className={`w-24 h-24 rounded-full justify-center items-center mb-6 ${result.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <Text className="text-5xl">{result.success ? '✅' : '❌'}</Text>
                </View>

                <Text className={`text-2xl font-bold mb-2 ${result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {result.success ? 'Başarılı!' : 'Başarısız'}
                </Text>

                <Text className="text-gray-600 text-center mb-4">{result.message}</Text>

                {result.confidence && (
                    <Text className="text-gray-500 mb-6">
                        Eşleşme: %{(result.confidence * 100).toFixed(1)}
                    </Text>
                )}

                <TouchableOpacity
                    onPress={handleReset}
                    className="bg-blue-500 px-8 py-4 rounded-xl"
                >
                    <Text className="text-white font-bold text-lg">Tamam</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
}
