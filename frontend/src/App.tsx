import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Send from './pages/Send';
import Request from './pages/Request';
import Convert from './pages/Convert';
import History from './pages/History';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Beneficiaries from './pages/Beneficiaries';
import Receipt from './pages/Receipt';
import ScheduledPayments from './pages/ScheduledPayments';
import PaymentTemplates from './pages/PaymentTemplates';
import QRPayment from './pages/QRPayment';
import SplitPayment from './pages/SplitPayment';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/send" element={<Send />} />
                  <Route path="/request" element={<Request />} />
                  <Route path="/convert" element={<Convert />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/beneficiaries" element={<Beneficiaries />} />
                  <Route path="/receipt/:id?" element={<Receipt />} />
                  <Route path="/scheduled" element={<ScheduledPayments />} />
                  <Route path="/templates" element={<PaymentTemplates />} />
                  <Route path="/qr-payment" element={<QRPayment />} />
                  <Route path="/split-payment" element={<SplitPayment />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/budget" element={<Budget />} />
                </Routes>
              </main>
              <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16 transition-colors">
                <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                  <p className="mb-2">⚡ SwiftMint - Instant Global Micro-Payments</p>
                  <p className="text-sm">Ultra-low fees · Instant transfers · Multi-currency support</p>
                </div>
              </footer>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
