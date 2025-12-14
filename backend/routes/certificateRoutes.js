import express from 'express';
import {
  // Template routes
  getCertificateTemplates,
  getCertificateTemplateById,
  createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate,
  bulkDeleteCertificateTemplates,
  initializeDefaultTemplates,
  
  // Certificate generation routes
  getCertificateDropdownData,
  generateCertificate,
  getGeneratedCertificates,
  getGeneratedCertificate,
  updateCertificateStatus,
  exportCertificateToPDF,
  
  // Stats route
  getCertificateStats
} from '../controllers/certificateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ========== TEMPLATE ROUTES ==========
router.get('/templates', getCertificateTemplates);
router.get('/templates/:id', getCertificateTemplateById);
router.post('/templates', createCertificateTemplate);
router.put('/templates/:id', updateCertificateTemplate);
router.delete('/templates/:id', deleteCertificateTemplate);
router.post('/templates/bulk-delete', bulkDeleteCertificateTemplates);
router.post('/templates/initialize', initializeDefaultTemplates);

// ========== CERTIFICATE ROUTES ==========
router.get('/dropdown-data', getCertificateDropdownData);
router.post('/generate', generateCertificate);
router.get('/', getGeneratedCertificates);
router.get('/:id', getGeneratedCertificate);
router.patch('/:id/status', updateCertificateStatus);
router.post('/:id/export', exportCertificateToPDF);

// ========== STATISTICS ==========
router.get('/stats/summary', getCertificateStats);

export default router;