import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import SendMoneyPage from './pages/SendMoneyPage';
import RequestMoneyPage from './pages/RequestMoneyPage';
import ConvertCurrencyPage from './pages/ConvertCurrencyPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import ReceiptPage from './pages/ReceiptPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="send" element={<SendMoneyPage />} />
        <Route path="request" element={<RequestMoneyPage />} />
        <Route path="convert" element={<ConvertCurrencyPage />} />
        <Route path="transactions" element={<TransactionHistoryPage />} />
        <Route path="receipt/:id" element={<ReceiptPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
