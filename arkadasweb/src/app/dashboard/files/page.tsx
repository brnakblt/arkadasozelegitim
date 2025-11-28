"use client";

import React, { useEffect, useState } from 'react';
import { FileStat } from 'webdav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile, faDownload, faArrowLeft, faExclamationTriangle, faUpload, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useDashboard } from '@/app/dashboard/layout';

export default function FilesPage() {
    const { user } = useDashboard();
    const [files, setFiles] = useState<FileStat[]>([]);
    const [currentPath, setCurrentPath] = useState(''); // Start empty for root of user folder
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.username) {
            loadFiles(user.username, currentPath);
        }
    }, [currentPath, user]);

    const loadFiles = async (username: string, path: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error("No token found");

            const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch files");
            }

            const contents = await res.json();
            setFiles(contents);
        } catch (err) {
            console.error(err);
            setError("Dosyalar yüklenemedi. Lütfen Nextcloud bağlantı ayarlarını kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
    };

    const handleGoBack = () => {
        const userRoot = `/ArkadasUsers/${user?.username}`;
        if (currentPath === '' || currentPath === '/' || currentPath === userRoot) {
            setCurrentPath('');
            return;
        }
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        // If parent path is the user root, we can set it, or set to empty string if we want to be consistent with initial state
        // But since service handles full paths, keeping it as full path is fine.
        // However, if parentPath becomes just "/ArkadasUsers", we must stop.
        if (parentPath === '/ArkadasUsers') {
            setCurrentPath('');
            return;
        }
        setCurrentPath(parentPath);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user?.username) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', currentPath);

        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error("No token found");

            const res = await fetch('/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            // Refresh files
            await loadFiles(user.username, currentPath);
        } catch (err) {
            console.error(err);
            setError("Dosya yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = async (filename: string) => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error("No token found");

            // Use fetch to get the blob with auth headers
            const res = await fetch(`/api/files/download?path=${encodeURIComponent(currentPath)}&filename=${encodeURIComponent(filename)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            setError("Dosya indirilemedi.");
        }
    };

    const handleCreateFolder = async () => {
        const folderName = prompt("Klasör adı:");
        if (!folderName || !user?.username) return;

        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error("No token found");

            const res = await fetch('/api/files/create-folder', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: currentPath, folderName })
            });

            if (!res.ok) throw new Error("Folder creation failed");

            await loadFiles(user.username, currentPath);
        } catch (err) {
            console.error(err);
            setError("Klasör oluşturulamadı.");
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm(`${filename} silinecek. Emin misiniz?`)) return;
        if (!user?.username) return;

        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error("No token found");

            const res = await fetch(`/api/files/delete?path=${encodeURIComponent(currentPath)}&filename=${encodeURIComponent(filename)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Delete failed");

            await loadFiles(user.username, currentPath);
        } catch (err) {
            console.error(err);
            setError("Dosya silinemedi.");
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-dark">Dosyalarım</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {currentPath.includes('/ArkadasUsers/')
                            ? currentPath.split(`/ArkadasUsers/${user?.username}`).pop() || 'Ana Dizin'
                            : (currentPath === '' ? 'Ana Dizin' : currentPath)}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    {currentPath !== '' && (
                        <button
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <span>Geri Dön</span>
                        </button>
                    )}
                    <div className="flex items-center space-x-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                            {uploading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <FontAwesomeIcon icon={faUpload} />
                            )}
                            <span>{uploading ? 'Yükleniyor...' : 'Dosya Yükle'}</span>
                        </button>
                        <button
                            onClick={handleCreateFolder}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Klasör</span>
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center space-x-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {files.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <FontAwesomeIcon icon={faFolder} className="text-4xl mb-4 text-gray-300" />
                            <p>Bu klasör boş.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {files.map((file) => (
                                <div
                                    key={file.filename}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => file.type === 'directory' ? handleNavigate(file.filename) : null}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${file.type === 'directory' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <FontAwesomeIcon icon={file.type === 'directory' ? faFolder : faFile} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                                                {file.basename}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(file.lastmod).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className="text-sm text-gray-400">{file.type === 'file' ? formatSize(file.size) : '-'}</span>
                                        {file.type === 'file' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(file.basename);
                                                }}
                                                className="text-gray-400 hover:text-primary transition-colors p-2"
                                                title="İndir"
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(file.basename);
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Sil"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
