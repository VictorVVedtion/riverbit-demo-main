import './App.css'

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { RiverChainProvider } from "./contexts/RiverChainContext";
import Announcement from "./pages/Announcement";
import API from "./pages/API";
import Assets from "./pages/Assets";
import Earn from "./pages/Earn";
import Trading from "./pages/Trading";
import TradingNew from "./pages/TradingNew";
import RiverPool from "./pages/RiverPool";
import Referral from "./pages/Referral";
import ReferralNew from "./pages/ReferralNew";
import Governance from "./pages/Governance";
import ProposalDetail from "./pages/ProposalDetail";
import Docs from "./pages/Docs";
import Wallet from "./pages/Wallet";

function App() {
  return (
    <RiverChainProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TradingNew />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/api" element={<API />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/trading" element={<TradingNew />} />
          <Route path="/trading-old" element={<Trading />} />
          <Route path="/riverpool" element={<RiverPool />} />
          <Route path="/referral" element={<ReferralNew />} />
          <Route path="/referral-old" element={<Referral />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/governance/:id" element={<ProposalDetail />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </Router>
    </RiverChainProvider>
  )
}

export default App
