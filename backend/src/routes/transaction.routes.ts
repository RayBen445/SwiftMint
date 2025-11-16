import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';

const router = Router();

router.post('/send', (req, res) => transactionController.send(req, res));
router.post('/receive', (req, res) => transactionController.receive(req, res));
router.post('/convert', (req, res) => transactionController.convert(req, res));
router.get('/', (req, res) => transactionController.getTransactions(req, res));
router.get('/:id', (req, res) => transactionController.getTransactionById(req, res));

export default router;
