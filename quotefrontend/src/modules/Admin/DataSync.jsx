import React, { useState } from 'react';
import { Upload, Database, DollarSign, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const DataSync = () => {
    const [uploading, setUploading] = useState({ stores: false, pricelist: false });
    const [status, setStatus] = useState({ stores: null, pricelist: null });

    const handleFileUpload = async (type, file) => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));
        setStatus(prev => ({ ...prev, [type]: null }));

        const formData = new FormData();
        formData.append('file', file);

        const endpoint = type === 'stores' ? '/api/master/upload-stores' : '/api/master/upload-pricelist';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus(prev => ({ ...prev, [type]: { success: true, message: data.message } }));
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, [type]: { success: false, message: error.message } }));
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const SyncCard = ({ type, title, icon: Icon, description, endpoint }) => (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group transition-all hover:shadow-2xl">
            <div className={`h-2 bg-gradient-to-r ${type === 'stores' ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600'}`} />
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${type === 'stores' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Icon size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 font-outfit uppercase tracking-tight">{title}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>

                <div className="relative group/upload">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileUpload(type, e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploading[type]}
                    />
                    <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all 
                        ${uploading[type] ? 'bg-gray-50 border-gray-200' : 'border-gray-200 group-hover/upload:border-indigo-400 group-hover/upload:bg-indigo-50/30'}`}>

                        {uploading[type] ? (
                            <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                        ) : (
                            <Upload className="text-gray-400 group-hover/upload:text-indigo-500 mb-2 transition-colors" size={32} />
                        )}

                        <span className="text-sm font-bold text-gray-700 font-outfit uppercase">
                            {uploading[type] ? 'Processing Data...' : 'Drop CSV file or click to upload'}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase mt-1 tracking-widest">Only .CSV files supported</span>
                    </div>
                </div>

                {status[type] && (
                    <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2
                        ${status[type].success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {status[type].success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-xs font-bold font-outfit uppercase tracking-wide">{status[type].message}</span>
                    </div>
                )}

                <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-6">
                    <span>Last Sync: 2 mins ago</span>
                    <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                        Download Template <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Data Management</h1>
                <p className="text-gray-500 max-w-2xl font-medium">
                    Upload and synchronize your master data and price lists. The system will automatically update existing records and add new ones based on the files provided.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SyncCard
                    type="stores"
                    title="Master Stores (AOR)"
                    icon={Database}
                    description="Upload store location database, oracle CCIDs, and management personnel."
                />
                <SyncCard
                    type="pricelist"
                    title="Price List / Rate Card"
                    icon={DollarSign}
                    description="Synchronize material prices, labor rates, and item descriptions."
                />
            </div>

            <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-bold mb-2 font-outfit uppercase">Automatic Backup</h2>
                        <p className="text-indigo-200 text-sm font-medium">Every time you perform a sync, a snapshot of the previous data is saved. You can restore your data to a previous state at any time from the backup vault.</p>
                    </div>
                    <button className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-indigo-50 transition-colors shadow-lg">
                        View History
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default DataSync;
