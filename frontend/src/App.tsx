import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SendMoneyPage from './pages/SendMoneyPage';
import RequestMoneyPage from './pages/RequestMoneyPage';
import ConvertCurrencyPage from './pages/ConvertCurrencyPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="send" element={<SendMoneyPage />} />
        <Route path="request" element={<RequestMoneyPage />} />
        <Route path="convert" element={<ConvertCurrencyPage />} />
        <Route path="transactions" element={<TransactionHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
