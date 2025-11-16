import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Send from './pages/Send';
import Request from './pages/Request';
import Convert from './pages/Convert';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/send" element={<Send />} />
            <Route path="/request" element={<Request />} />
            <Route path="/convert" element={<Convert />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600">
            <p className="mb-2">⚡ SwiftMint - Instant Global Micro-Payments</p>
            <p className="text-sm">Ultra-low fees · Instant transfers · Multi-currency support</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
