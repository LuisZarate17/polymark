"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// Main App with routing
const react_1 = require("react");
const Dashboard_1 = require("./pages/Dashboard");
const Analyzer_1 = require("./pages/Analyzer");
require("./index.css");
function App() {
    const [currentPage, setCurrentPage] = (0, react_1.useState)('dashboard');
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800", children: [(0, jsx_runtime_1.jsx)("header", { className: "bg-slate-900 border-b border-slate-700 py-4 sticky top-0 z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "Polymarket Trading" }), (0, jsx_runtime_1.jsxs)("nav", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(NavButton, { label: "Dashboard", active: currentPage === 'dashboard', onClick: () => setCurrentPage('dashboard') }), (0, jsx_runtime_1.jsx)(NavButton, { label: "Analyzer", active: currentPage === 'analyzer', onClick: () => setCurrentPage('analyzer') })] })] }) }) }), (0, jsx_runtime_1.jsxs)("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [currentPage === 'dashboard' && (0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, {}), currentPage === 'analyzer' && (0, jsx_runtime_1.jsx)(Analyzer_1.Analyzer, {})] })] }));
}
const NavButton = ({ label, active, onClick }) => ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, className: `px-4 py-2 rounded font-medium transition ${active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, children: label }));
exports.default = App;
//# sourceMappingURL=App.js.map