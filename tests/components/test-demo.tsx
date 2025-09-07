import React from 'react';
import { createRoot } from 'react-dom/client';
import AgentDashboard from '../../src/components/AgentDashboard';

// Simple test to verify the component renders without syntax errors
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AgentDashboard />
    </div>
  );
}

// This would be used in a real application
// const container = document.getElementById('root');
// const root = createRoot(container!);
// root.render(<App />);

export default App;