
import React, { useState, useEffect } from 'react';
import { Menu, Bell, AlertTriangle, TrendingDown, Repeat, Package, X, Home, Shield, BarChart3 } from 'lucide-react';

// 사이드 메뉴 컴포넌트
const SideMenu = ({ isOpen, onClose, onNavigate }) => {
  const menuItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'admin', label: '관리자 콘솔 (신한카드 담당자용)', icon: Shield },
    { id: 'dashboard', label: '웹 대시보드 (상세 분석용)', icon: BarChart3 },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-blue-700">메뉴</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-blue-50 rounded-lg transition-colors text-left"
              >
                <Icon className="w-5 h-5 text-blue-700" />
                <span className="text-gray-900 font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

// 아이콘 매핑
const iconMap = {
  repeat: Repeat,
  trending: TrendingDown,
  package: Package,
};

// 위험 신호 아이템 컴포넌트
const RiskItem = ({ icon, title, description, color = 'red' }) => {
  const Icon = iconMap[icon] || AlertTriangle;
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
  };

  return (
    <div className="flex items-start gap-3 p-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-semibold text-sm">{title}</p>
        <p className="text-gray-500 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
};

// 건강 점수 카드 컴포넌트
const HealthScoreCard = ({ score = 72, status = 'warning', daysUntilCrisis = '고객 이탈형', riskLevel = 'Medium' }) => {
  const statusConfig = {
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600',
    },
    danger: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    good: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
  };

  const config = statusConfig[status] || statusConfig.warning;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-gray-600 text-sm font-medium mb-4 text-center">내 점포 위기 점수</h2>
      
      <div className="flex flex-col items-center mb-4">
        <div className="text-6xl font-bold text-gray-900 mb-3">
          {score}<span className="text-3xl text-gray-500">점</span>
        </div>
        
        <div className={`inline-flex items-center gap-2 ${config.bgColor} border-2 ${config.borderColor} rounded-full px-5 py-2.5`}>
          <AlertTriangle className={`w-5 h-5 ${config.iconColor}`} />
          <span className={`${config.textColor} font-bold text-sm`}>{riskLevel}</span>
        </div>
      </div>
      
      <div className="bg-red-50 rounded-xl p-4 mt-4 border border-red-100">
        <p className="text-center text-red-700 font-medium text-sm">
          <span className="font-bold text-red-800">{daysUntilCrisis}</span>
        </p>
      </div>
    </div>
  );
};

// 헤더 컴포넌트
const Header = ({ title = '신한 가맹점 헬스케어', hasNotification = true, onMenuClick, onNotificationClick }) => {
  return (
    <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick}>
          <Menu className="w-6 h-6 text-blue-700" />
        </button>
        <h1 className="text-lg font-bold text-blue-700">{title}</h1>
      </div>
      <button onClick={onNotificationClick} className="relative">
        <Bell className="w-6 h-6 text-blue-700" />
        {hasNotification && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
    </div>
  );
};

// 메인 홈 화면 컴포넌트
export default function MerchantHealthHome( { onDetailReport = () => {},
  onSolutionClick = () => {},
  onNavigate = () => {},}) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // My_Store.json 파일 읽기
  useEffect(() => {
  const loadStoreData = async () => {
    try {
      const res = await fetch(`${process.env.PUBLIC_URL}/data/My_Store.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const jsonData = await res.json();
      setStoreData(jsonData);
      setLoading(false);
    } catch (err) {
      setError('Home 데이터를 불러올 수 없습니다.');
      setLoading(false);
      console.error('Error loading My_Store.json:', err);
    }
  };
  loadStoreData();
}, []);


  // 데이터 변환 함수들
  const getHealthScore = (riskScore) => {
    return riskScore;
  };

  const getStatus = (riskLevel) => {
    const statusMap = {
      'Very High': 'danger',
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'good',
    };
    return statusMap[riskLevel] || 'warning';
  };

  const getRiskSignals = (riskFactors) => {
    const top3 = riskFactors.slice(0, 3);
    const icons = ['repeat', 'trending', 'package'];
    const colors = ['red', 'orange', 'amber'];

    return top3.map((factor, index) => ({
      icon: icons[index],
      title: factor.feature_kr,
      description: `위험도 기여: ${(factor.shap_value * 100).toFixed(1)}% (${factor.impact === 'increase' ? '증가' : '감소'})`,
      color: colors[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error || '데이터를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const healthData = {
    score: getHealthScore(storeData.risk_score),
    status: getStatus(storeData.risk_level),
    daysUntilCrisis: storeData.risk_type,
    riskLevel: storeData.risk_level,
  };

  const riskSignals = getRiskSignals(storeData.risk_factors);


 const handleDetailReport = () => {
     onDetailReport();
 };

 const handleSolutionCheck = () => {
    onSolutionClick();
}

  const handleNotificationClick = () => {
    console.log('알림 클릭');
  };

  const handleNavigate = (id) => {
    onNavigate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <SideMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
      />

      <Header 
        onMenuClick={() => setIsMenuOpen(true)}
        onNotificationClick={handleNotificationClick}
      />

      <div className="px-5 pt-6 pb-4">
        <HealthScoreCard 
          score={healthData.score}
          status={healthData.status}
          daysUntilCrisis={healthData.daysUntilCrisis}
          riskLevel={healthData.riskLevel}
        />
      </div>

      <div className="px-5 mt-4">
        <h3 className="text-gray-900 font-bold text-base mb-3 px-1">주요 위험 신호</h3>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="divide-y divide-gray-100">
            {riskSignals.map((risk, index) => (
              <RiskItem
                key={index}
                icon={risk.icon}
                title={risk.title}
                description={risk.description}
                color={risk.color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-3">
        <button 
          onClick={handleDetailReport}
          className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-800 transition-colors active:scale-98"
        >
          상세 리포트 보기
        </button>
        
        <button 
          onClick={handleSolutionCheck}
          className="w-full bg-white text-blue-700 font-bold py-4 rounded-xl shadow-sm border-2 border-blue-700 hover:bg-blue-50 transition-colors active:scale-98"
        >
          추천 솔루션 확인
        </button>
      </div>
    </div>
  );
}
