import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import QuotationEditModal from './QuotationEditModal';
import { useTheme } from '../../context/ThemeContext';
import API_BASE_URL from '../../config/api';

const QuotationList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const navigate = useNavigate();
    const { darkMode, colors, themeStyles } = useTheme();

    // Define all available statuses for the filter bar
    const statuses = ['ALL', 'DRAFT', 'SENT', 'APPROVED', 'REVISED', 'CANCELLED'];

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/quotations`);
            setQuotations(res.data.data || []);
        } catch (err) {
            console.error(err);
            setQuotations([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuotations = quotations.filter(q =>
        filter === 'ALL' ? true : q.quote_status === filter
    );

    // Helper to style different statuses
    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600';
            case 'SENT': return 'text-blue-500';
            case 'Approved': return 'text-blue-500';
            case 'REVISED': return 'text-orange-500';
            case 'CANCELLED': return 'text-red-500';
            case 'DRAFT': return 'text-gray-500';
            default: return darkMode ? 'text-gray-300' : 'text-black';
        }
    };

    const exportToExcel = () => {
        // Prepare data for export with ALL columns from the table
        const exportData = filteredQuotations.map((q, index) => {
            const po = q.PurchaseOrders?.[0] || {};
            const fin = po.Finance || {};

            return {
                'SR#': index + 1,
                'Company': q.brand_name || q.Store?.brand || 'N/A',
                'Quote Date': q.sent_at || q.createdAt?.split('T')[0] || 'N/A',
                'Status': q.quote_status || 'DRAFT',
                'Quote #': q.quote_no || 'N/A',
                'MR Date': q.mr_date || 'N/A',
                'MR #': q.mr_no || 'N/A',
                'PR #': q.pr_no || 'N/A',
                'Brand': q.brand || q.Store?.brand || 'N/A',
                'Location': q.location || 'N/A',
                'City': q.city || 'N/A',
                'Region': q.region || 'N/A',
                'Work Desc': q.work_description || 'N/A',
                'Work Status': q.work_status || 'N/A',
                'Comp Date': q.completion_date || 'N/A',
                'Completed By': q.completed_by || 'N/A',
                'PO #': po.po_no || 'N/A',
                'PO Date': po.po_date || 'N/A',
                'ETA': po.eta || 'N/A',
                'Update': po.update_notes || 'N/A',
                'Amt Ex VAT': po.amount_ex_vat || q.subtotal || 0,
                'VAT': po.vat_15 || q.vat_amount || 0,
                'Total': po.total_inc_vat || q.grand_total || 0,
                'Inv Status': fin.invoice_status || 'N/A',
                'Inv #': fin.invoice_no || 'N/A',
                'Inv Date': fin.invoice_date || 'N/A',
                'Supervisor': q.supervisor || 'N/A',
                'Comments': q.comments || 'N/A',
                'Store ID': q.oracle_ccid || 'N/A',
                'Adv Pay': fin.advance_payment || 0,
                'Pay Ref': fin.payment_ref || 'N/A',
                'Recv Amt': fin.received_amount || 0,
                'Pay Date': fin.payment_date || 'N/A',
                'Pay Month': fin.payment_month || 'N/A',
                'Ref #': fin.general_ref || 'N/A', // Changed from payment_status to general_ref based on table
                'Bank Date': fin.bank_date || 'N/A',
                'HSBC #': fin.hsbc_no || 'N/A',
                'Our Bank Ref': fin.our_bank_ref || 'N/A',
                'Comp Bank Ref': fin.company_bank_ref || 'N/A',
                'VAT Status': fin.vat_status || 'N/A',
                'VAT Duration': fin.vat_duration || 'N/A',
                'Days': fin.days_outstanding || 0
            };
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths for all 42 columns
        const colWidths = [
            { wch: 5 },  // SR#
            { wch: 20 }, // Company
            { wch: 12 }, // Quote Date
            { wch: 12 }, // Status
            { wch: 15 }, // Quote #
            { wch: 12 }, // MR Date
            { wch: 15 }, // MR #
            { wch: 15 }, // PR #
            { wch: 20 }, // Brand
            { wch: 25 }, // Location
            { wch: 15 }, // City
            { wch: 15 }, // Region
            { wch: 40 }, // Work Desc
            { wch: 15 }, // Work Status
            { wch: 12 }, // Comp Date
            { wch: 20 }, // Completed By
            { wch: 15 }, // PO #
            { wch: 12 }, // PO Date
            { wch: 12 }, // ETA
            { wch: 30 }, // Update
            { wch: 12 }, // Amt Ex VAT
            { wch: 12 }, // VAT
            { wch: 12 }, // Total
            { wch: 15 }, // Inv Status
            { wch: 15 }, // Inv #
            { wch: 12 }, // Inv Date
            { wch: 20 }, // Supervisor
            { wch: 30 }, // Comments
            { wch: 15 }, // Store ID
            { wch: 12 }, // Adv Pay
            { wch: 20 }, // Pay Ref
            { wch: 12 }, // Recv Amt
            { wch: 12 }, // Pay Date
            { wch: 12 }, // Pay Month
            { wch: 15 }, // Ref #
            { wch: 12 }, // Bank Date
            { wch: 15 }, // HSBC #
            { wch: 20 }, // Our Bank Ref
            { wch: 20 }, // Comp Bank Ref
            { wch: 15 }, // VAT Status
            { wch: 15 }, // VAT Duration
            { wch: 8 }   // Days
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Quotations');

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const filename = `Quotations_${filter}_${date}.xlsx`;

        // Download
        XLSX.writeFile(wb, filename);
    };

    return (
        <div className="p-4 md:p-6 min-h-screen text-[10px] ${themeStyles.container}">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-1">Main Tracking Sheet</h1>
                    <p className={colors.textSecondary}>Excel Sync: All Companies Sheet 2025</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <button
                        onClick={exportToExcel}
                        className={`${themeStyles.button} ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white justify-center`}
                    >
                        <Download size={16} /> Download Excel
                    </button>
                    <button
                        onClick={() => navigate('/quotations/new')}
                        className={`${themeStyles.button} w-full md:w-auto justify-center`}
                    >
                        <Plus size={16} /> Create New Quotation
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            <div className={`flex overflow-x-auto gap-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} mb-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0`}>
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`pb-2 px-4 font-bold uppercase transition-colors ${filter === status
                            ? `border-b-4 ${darkMode ? 'border-[#00a8aa] text-[#00a8aa]' : 'border-black text-black'}`
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className={`overflow-x-auto shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className={themeStyles.tableHeader}>
                            <th className="p-2 border-r">Actions</th>
                            <th className="p-2 border-r">SR#</th>
                            <th className="p-2 border-r">Company</th>
                            <th className="p-2 border-r">Quote Date</th>
                            <th className="p-2 border-r text-center">Status</th>
                            <th className="p-2 border-r">Quote #</th>
                            <th className="p-2 border-r">MR Date</th>
                            <th className="p-2 border-r">MR #</th>
                            <th className="p-2 border-r">PR #</th>
                            <th className="p-2 border-r">Brand</th>
                            <th className="p-2 border-r">Location</th>
                            <th className="p-2 border-r">City</th>
                            <th className="p-2 border-r">Region</th>
                            <th className="p-2 border-r">Work Desc</th>
                            <th className="p-2 border-r">Work Status</th>
                            <th className="p-2 border-r">Comp Date</th>
                            <th className="p-2 border-r">Completed By</th>
                            <th className="p-2 border-r">PO #</th>
                            <th className="p-2 border-r">PO Date</th>
                            <th className="p-2 border-r">ETA</th>
                            <th className="p-2 border-r">Update</th>
                            <th className="p-2 border-r text-right">Amt Ex VAT</th>
                            <th className="p-2 border-r text-right">VAT</th>
                            <th className="p-2 border-r text-right">Total</th>
                            <th className="p-2 border-r">Inv Status</th>
                            <th className="p-2 border-r">Inv #</th>
                            <th className="p-2 border-r">Inv Date</th>
                            <th className="p-2 border-r">Supervisor</th>
                            <th className="p-2 border-r">Comments</th>
                            <th className="p-2 border-r">Store ID</th>
                            <th className="p-2 border-r text-right">Adv Pay</th>
                            <th className="p-2 border-r">Pay Ref</th>
                            <th className="p-2 border-r text-right">Recv Amt</th>
                            <th className="p-2 border-r">Pay Date</th>
                            <th className="p-2 border-r">Pay Month</th>
                            <th className="p-2 border-r">Ref #</th>
                            <th className="p-2 border-r">Bank Date</th>
                            <th className="p-2 border-r">HSBC #</th>
                            <th className="p-2 border-r">Our Bank Ref</th>
                            <th className="p-2 border-r">Comp Bank Ref</th>
                            <th className="p-2 border-r">VAT Status</th>
                            <th className="p-2 border-r">VAT Duration</th>
                            <th className="p-2 border-r text-center">Days</th>
                        </tr>
                    </thead>

                    <tbody className={darkMode ? 'text-gray-300' : 'text-black'}>
                        {loading ? (
                            <tr>
                                <td colSpan="41" className="p-8 text-center font-bold">Loading...</td>
                            </tr>
                        ) : filteredQuotations.length === 0 ? (
                            <tr>
                                <td colSpan="41" className="p-8 text-center opacity-50">No quotations found for this status.</td>
                            </tr>
                        ) : filteredQuotations.map((q, i) => {
                            const po = q.PurchaseOrders?.[0] || {};
                            const fin = po.Finance || {};

                            return (
                                <tr key={q.id} className={themeStyles.tableRow}>
                                    <td className="p-2 text-center">
                                        <button onClick={() => setSelectedQuotation(q)} className="hover:scale-110 transition-transform">
                                            <Edit size={12} className={darkMode ? "text-cyan-400" : "text-blue-600"} />
                                        </button>
                                    </td>
                                    <td className="p-2 text-center opacity-60">{i + 1}</td>
                                    <td className="p-2">{q.brand_name || q.Store?.brand || '-'}</td>
                                    <td className="p-2">{q.sent_at || '-'}</td>

                                    {/* Quotation Status Column */}
                                    <td className={`p-2 font-bold text-center border-r ${getStatusColor(q.quote_status)}`}>
                                        {q.quote_status || 'DRAFT'}
                                    </td>

                                    <td className="p-2 font-bold">{q.quote_no}</td>
                                    <td className="p-2">{q.mr_date || '-'}</td>
                                    <td className="p-2">{q.mr_no || '-'}</td>
                                    <td className="p-2">{q.pr_no || '-'}</td>
                                    <td className="p-2">{q.brand || q.Store?.brand || '-'}</td>
                                    <td className="p-2">{q.location || '-'}</td>
                                    <td className="p-2">{q.city || '-'}</td>
                                    <td className="p-2">{q.region || '-'}</td>
                                    <td className="p-2 truncate max-w-[120px]">{q.work_description}</td>
                                    <td className="p-2 font-bold text-green-600">{q.work_status || '-'}</td>
                                    <td className="p-2">{q.completion_date || '-'}</td>
                                    <td className="p-2">{q.completed_by || '-'}</td>
                                    <td className="p-2 font-bold text-green-600">{po.po_no || '-'}</td>
                                    <td className="p-2">{po.po_date || '-'}</td>
                                    <td className="p-2">{po.eta || '-'}</td>
                                    <td className="p-2">{po.update_notes || '-'}</td>
                                    <td className="p-2 text-right">{po.amount_ex_vat || q.subtotal || '0.00'}</td>
                                    <td className="p-2 text-right">{po.vat_15 || q.vat_amount || '0.00'}</td>
                                    <td className="p-2 text-right font-bold">{po.total_inc_vat || q.grand_total || '0.00'}</td>
                                    <td className="p-2 font-bold text-green-600">{fin.invoice_status || '-'}</td>
                                    <td className="p-2 font-bold text-green-600">{fin.invoice_no || '-'}</td>
                                    <td className="p-2">{fin.invoice_date || '-'}</td>
                                    <td className="p-2">{q.supervisor || '-'}</td>
                                    <td className="p-2">{q.comments || '-'}</td>
                                    <td className="p-2">{q.oracle_ccid || '-'}</td>
                                    <td className="p-2 text-right">{fin.advance_payment || '0.00'}</td>
                                    <td className="p-2">{fin.payment_ref || '-'}</td>
                                    <td className="p-2 text-right font-bold text-green-700">{fin.received_amount || '0.00'}</td>
                                    <td className="p-2">{fin.payment_date || '-'}</td>
                                    <td className="p-2">{fin.payment_month || '-'}</td>
                                    <td className="p-2">{fin.general_ref || '-'}</td>
                                    <td className="p-2">{fin.bank_date || '-'}</td>
                                    <td className="p-2">{fin.hsbc_no || '-'}</td>
                                    <td className="p-2">{fin.our_bank_ref || '-'}</td>
                                    <td className="p-2">{fin.company_bank_ref || '-'}</td>
                                    <td className="p-2 font-bold text-green-600">{fin.vat_status || '-'}</td>
                                    <td className="p-2">{fin.vat_duration || '-'}</td>
                                    <td className="p-2 text-center font-bold">{fin.days_outstanding || '0'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedQuotation && (
                <QuotationEditModal
                    quotation={selectedQuotation}
                    onClose={() => setSelectedQuotation(null)}
                    onUpdated={fetchQuotations}
                />
            )}
        </div>
    );
};

export default QuotationList;