import { Router } from 'express';
import { currencyController } from '../controllers/currency.controller';

const router = Router();

router.get('/rates', (req, res) => currencyController.getRates(req, res));
router.get('/convert', (req, res) => currencyController.convert(req, res));
router.get('/optimal-rate', (req, res) => currencyController.getOptimalRate(req, res));
router.get('/supported', (req, res) => currencyController.getSupportedCurrencies(req, res));
router.get('/historical', (req, res) => currencyController.getHistoricalRates(req, res));

export default router;
