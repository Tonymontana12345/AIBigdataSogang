// src/App.js
import React, { useState } from 'react';

// 각 화면 import
import HomeScreen from './screens/HomeScreen';
import AdminConsoleScreen from './screens/AdminConsoleScreen';
import DetailReportScreen from './screens/DetailReportScreen';
import SolutionScreen from './screens/SolutionScreen';
import WebDashboardScreen from './screens/WebDashboardScreen';

function App() {
  // 현재 화면 상태
  const [screen, setScreen] = useState('home');

  // 화면 이동 함수 (다른 화면에서 필요 시 사용)
  const navigate = (next) => setScreen(next);

  // 화면 렌더링
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
             onNavigate={(next) => setScreen(next)}
            onDetailReport={() => setScreen('report')}
            onSolutionClick={() => setScreen('solution')}
            
          />
        );
      case 'admin':
        return <AdminConsoleScreen onNavigate={navigate} onHomeClick={() => setScreen('home')}/>;
      case 'dashboard':
        return <WebDashboardScreen onNavigate={navigate} onLogout={() => setScreen('home')} onSolutionClick={() => setScreen('solution')} />;
        
      case 'report':
        return <DetailReportScreen onBack={() => setScreen('home')} />;
      case 'solution':
        return <SolutionScreen onBack={() => setScreen('home')} />;
      default:
        return (
          <HomeScreen
            onNavigate={(next) => setScreen(next)}
            onDetailReport={() => setScreen('report')}
            onSolutionClick={() => setScreen('solution')}
            
          />
        );
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
}

export default App;