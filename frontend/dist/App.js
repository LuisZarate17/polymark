import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Main App with routing
import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Analyzer } from './pages/Analyzer';
import './index.css';
function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800", children: [_jsx("header", { className: "bg-slate-900 border-b border-slate-700 py-4 sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Polymarket Trading" }), _jsxs("nav", { className: "flex gap-2", children: [_jsx(NavButton, { label: "Dashboard", active: currentPage === 'dashboard', onClick: () => setCurrentPage('dashboard') }), _jsx(NavButton, { label: "Analyzer", active: currentPage === 'analyzer', onClick: () => setCurrentPage('analyzer') })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [currentPage === 'dashboard' && _jsx(Dashboard, {}), currentPage === 'analyzer' && _jsx(Analyzer, {})] })] }));
}
const NavButton = ({ label, active, onClick }) => (_jsx("button", { onClick: onClick, className: `px-4 py-2 rounded font-medium transition ${active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, children: label }));
export default App;
//# sourceMappingURL=App.js.map