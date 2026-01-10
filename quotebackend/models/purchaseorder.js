import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // ✅ note the .js extension

const PurchaseOrder = sequelize.define('PurchaseOrder', {
    po_no: { 
        type: DataTypes.STRING, 
        primaryKey: true // Use the actual PO number as ID
    },
    job_id: { 
        type: DataTypes.INTEGER,
        references: { model: 'jobs', key: 'id' } // Links back to the Job
    },
    po_date: { type: DataTypes.DATEONLY },
    amount_ex_vat: { type: DataTypes.DECIMAL(10, 2) },
    vat_15: { type: DataTypes.DECIMAL(10, 2) },
    total_inc_vat: { type: DataTypes.DECIMAL(10, 2) },
    eta: { type: DataTypes.DATEONLY },        // From your ETA column
    update_notes: { type: DataTypes.TEXT }    // From your UPDATE column
}, {
    tableName: 'purchase_orders',
    timestamps: true
});

export default PurchaseOrder;
