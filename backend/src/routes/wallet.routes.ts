import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller';

const router = Router();

router.get('/', (req, res) => walletController.getWallet(req, res));
router.post('/pockets', (req, res) => walletController.addPocket(req, res));
router.get('/balance/:currency', (req, res) => walletController.getBalance(req, res));

export default router;
