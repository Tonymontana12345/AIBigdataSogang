import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Search, Send, UserPlus, AlertCircle, X, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 알림 발송 확인 팝업
const NotificationModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">일괄 알림 발송</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Send className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-gray-700 font-medium">선택한 가맹점주에게 알림문자를 보냅니다</p>
              <p className="text-sm text-gray-600 mt-1">선택된 가맹점: {selectedCount}개</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
};

// 전문 부서 배정 팝업
const DepartmentAssignModal = ({ isOpen, onClose, onAssign }) => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const departments = [
    { id: 'sales_decline', label: '매출 급락형 담당' },
    { id: 'other_risk', label: '기타 위험 담당' },
    { id: 'competitive_disadvantage', label: '경쟁 열위형 담당' },
  ];

  const handleToggle = (deptId) => {
    setSelectedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleAssign = () => {
    if (selectedDepartments.length > 0) {
      onAssign(selectedDepartments);
      setSelectedDepartments([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">전문 부서 배정</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 text-center">가맹점주에게 해당 담당 부서가 연락하게 합니다</p>
        </div>

        <div className="mb-6 space-y-3">
          {departments.map((dept) => (
            <label
              key={dept.id}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedDepartments.includes(dept.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedDepartments.includes(dept.id)}
                onChange={() => handleToggle(dept.id)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="font-medium text-gray-900">{dept.label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedDepartments([]);
              onClose();
            }}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedDepartments.length === 0}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors ${
              selectedDepartments.length > 0
                ? 'bg-green-700 text-white hover:bg-green-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            승인
          </button>
        </div>
      </div>
    </>
  );
};

// 상단 네비게이션 바
const AdminNavigation = ({ activeTab, onTabChange, onHomeClick }) => {
  const navItems = [
    { id: 'overview', label: '전체 현황' },
    { id: 'risk', label: '위험군 관리' },
    { id: 'performance', label: '성과 분석' },
    { id: 'settings', label: '설정' },
  ];

  return (
    <div className="bg-white shadow-md px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-700" />
          <h1 className="text-xl font-bold text-blue-700">관리자 콘솔</h1>
        </div>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={onHomeClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium text-sm">HomeScreen</span>
      </button>
    </div>
  );
};

// 상태별 카드 컴포넌트
const StatusCard = ({ status, count, percentage, color }) => {
  const colorClasses = {
    safe: 'bg-green-50 border-green-300 text-green-700',
    good: 'bg-blue-50 border-blue-300 text-blue-700',
    caution: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    warning: 'bg-orange-50 border-orange-300 text-orange-700',
    danger: 'bg-red-50 border-red-300 text-red-700',
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-4 text-center transition-all hover:shadow-md`}>
      <p className="text-sm font-semibold mb-2">{status}</p>
      <p className="text-3xl font-bold mb-1">{count.toLocaleString()}</p>
      <p className="text-sm font-medium">{percentage}%</p>
    </div>
  );
};

// 전체 가맹점 현황
const OverviewSection = ({ regionName, totalStores, statusBreakdown }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">전체 가맹점 현황 ({regionName})</h2>
        <div className="text-sm text-gray-600">
          전체 가맹점: <span className="font-bold text-blue-700">{totalStores.toLocaleString()}개</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statusBreakdown.map((item, index) => (
          <StatusCard
            key={index}
            status={item.status}
            count={item.count}
            percentage={item.percentage}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

// 위험 유형 배지
const RiskTypeBadge = ({ type }) => {
  const typeConfig = {
    '매출 급락형': 'bg-red-100 text-red-700',
    '기타 위험': 'bg-orange-100 text-orange-700',
    '경쟁 열위형': 'bg-yellow-100 text-yellow-700',
    '정상': 'bg-green-100 text-green-700',
  };

  return (
    <span className={`${typeConfig[type] || 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-full text-xs font-semibold`}>
      {type}
    </span>
  );
};

// 위험도 표시
const RiskScore = ({ score }) => {
  const getColor = (score) => {
    if (score >= 90) return 'text-red-700 font-bold';
    if (score >= 80) return 'text-orange-700 font-bold';
    return 'text-amber-700 font-bold';
  };

  return <span className={`${getColor(score)} text-sm`}>{score}점</span>;
};

// 위험군 테이블 행
const RiskMerchantRow = ({ merchant, onDetailClick, isSelected, onToggleSelect }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(merchant)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {merchant.isUrgent && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className="font-medium text-gray-900">{merchant.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">{merchant.category}</td>
      <td className="px-4 py-3">
        <RiskScore score={merchant.riskScore} />
      </td>
      <td className="px-4 py-3">
        <RiskTypeBadge type={merchant.riskType} />
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">
        {merchant.lastConsultDate || <span className="text-red-600 font-semibold">미상담</span>}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onDetailClick(merchant)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          상세
        </button>
      </td>
    </tr>
  );
};

// 위험군 목록 테이블
const RiskMerchantTable = ({ merchants, onDetailClick, selectedMerchants, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || m.riskType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleToggleSelect = (merchant) => {
    const isSelected = selectedMerchants.some(m => m.name === merchant.name);
    if (isSelected) {
      onSelectionChange(selectedMerchants.filter(m => m.name !== merchant.name));
    } else {
      onSelectionChange([...selectedMerchants, merchant]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMerchants.length === filteredMerchants.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredMerchants);
    }
  };

  const isAllSelected = filteredMerchants.length > 0 && selectedMerchants.length === filteredMerchants.length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            위험군 가맹점 목록
            <span className="text-red-600 ml-2">({merchants.length}개)</span>
            {selectedMerchants.length > 0 && (
              <span className="text-blue-600 ml-2">선택됨: {selectedMerchants.length}개</span>
            )}
          </h2>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="가맹점명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 유형</option>
            <option value="매출 급락형">매출 급락형</option>
            <option value="기타 위험">기타 위험</option>
            <option value="경쟁 열위형">경쟁 열위형</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가맹점명</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">업종</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">위험도</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">위험유형</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">최종상담일</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredMerchants.map((merchant, index) => (
              <RiskMerchantRow
                key={index}
                merchant={merchant}
                onDetailClick={onDetailClick}
                isSelected={selectedMerchants.some(m => m.name === merchant.name)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filteredMerchants.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

// 위험군 관리 탭 - 추이와 분포
const RiskManagementTab = ({ distributionData }) => {
  // 월별 추이 데이터
  const trendData = [
    { month: '7월', 정상: 3850, 매출급락형: 60, 기타위험: 30, 경쟁열위형: 8 },
    { month: '8월', 정상: 3900, 매출급락형: 58, 기타위험: 28, 경쟁열위형: 7 },
    { month: '9월', 정상: 3920, 매출급락형: 55, 기타위험: 27, 경쟁열위형: 7 },
    { month: '10월', 정상: 3940, 매출급락형: 53, 기타위험: 27, 경쟁열위형: 6 },
    { month: '11월', 정상: 3955, 매출급락형: 52, 기타위험: 26, 경쟁열위형: 6 },
    { month: '12월', 정상: 3633, 매출급락형: 324, 기타위험: 90, 경쟁열위형: 11 },
  ];

  return (
    <div className="space-y-6">
      {/* 추이 차트 */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">위험 유형별 추이 (최근 6개월)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="정상" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="매출급락형" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="기타위험" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="경쟁열위형" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 분포 차트 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">현재 위험 유형 분포</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">위험군 상세 통계</h2>
          <div className="space-y-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 성과 분석 탭
const PerformanceTab = () => {
  const performanceData = [
    {
      merchant: '호호치킨',
      consultApproved: '승인',
      expert: '매출 급락형 담당',
      consultDate: '2024-09-15',
      solutionRequested: '요청',
      selectedSolution: '고객 재방문 캠페인',
      applicationDate: '2024-09-18',
      initialRisk: 95,
      currentRisk: 72,
    },
    {
      merchant: '카페***',
      consultApproved: '승인',
      expert: '기타 위험 담당',
      consultDate: '2024-09-20',
      solutionRequested: '미요청',
      selectedSolution: '-',
      applicationDate: '-',
      initialRisk: 85,
      currentRisk: 82,
    },
    {
      merchant: '한식당**',
      consultApproved: '미승인',
      expert: '-',
      consultDate: '-',
      solutionRequested: '-',
      selectedSolution: '-',
      applicationDate: '-',
      initialRisk: 78,
      currentRisk: 78,
    },
    {
      merchant: '피자가게',
      consultApproved: '승인',
      expert: '매출 급락형 담당',
      consultDate: '2024-09-10',
      solutionRequested: '요청',
      selectedSolution: '마케팅 지원 대출',
      applicationDate: '2024-09-12',
      initialRisk: 88,
      currentRisk: 65,
    },
    {
      merchant: '분식집',
      consultApproved: '승인',
      expert: '경쟁 열위형 담당',
      consultDate: '2024-09-08',
      solutionRequested: '요청',
      selectedSolution: 'SNS 마케팅 강화',
      applicationDate: '2024-09-10',
      initialRisk: 82,
      currentRisk: 68,
    },
  ];

  const getRiskChange = (initial, current) => {
    const change = initial - current;
    if (change > 0) {
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <TrendingDown className="w-4 h-4" />
          -{change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center gap-1 text-red-600 font-semibold">
          <TrendingUp className="w-4 h-4" />
          +{Math.abs(change)}
        </span>
      );
    }
    return <span className="text-gray-600">-</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">상담 및 솔루션 실적</h2>
        <p className="text-sm text-gray-600 mt-1">전문 부서 배정 및 솔루션 신청 현황을 확인할 수 있습니다</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가맹점주</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상담승인</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">배정부서</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상담일</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">솔루션요청</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">선택솔루션</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">신청일</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">신청시위험도</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">현재위험도</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">변화</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{row.merchant}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.consultApproved === '승인' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {row.consultApproved}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{row.expert}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">{row.consultDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.solutionRequested === '요청' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {row.solutionRequested}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{row.selectedSolution}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">{row.applicationDate}</td>
                <td className="px-4 py-3">
                  <span className="text-red-700 font-bold">{row.initialRisk}점</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${
                    row.currentRisk < 70 ? 'text-green-700' :
                    row.currentRisk < 80 ? 'text-orange-700' :
                    'text-red-700'
                  }`}>
                    {row.currentRisk}점
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getRiskChange(row.initialRisk, row.currentRisk)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 메인 관리자 콘솔
export default function AdminConsoleScreen({onHomeClick}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) JSON 로드
        const statsRes = await fetch(
          `${process.env.PUBLIC_URL}/data/risk_type_statistics.json`,
          { cache: 'no-store' }
        );
        if (!statsRes.ok) throw new Error(`stats HTTP ${statsRes.status}`);
        const statsJson = await statsRes.json();
        setStatsData(statsJson);

        // 2) CSV 로드
        try {
          const csvRes = await fetch(
            `${process.env.PUBLIC_URL}/data/risk_classification_results_merge.csv`,
            { cache: 'no-store' }
          );
          if (!csvRes.ok) throw new Error(`csv HTTP ${csvRes.status}`);
          const csvText = await csvRes.text();

          const Papa = (await import('papaparse')).default;
          const parsed = Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            delimitersToGuess: [',', '\t', '|', ';'],
          });

          if (parsed.data?.length) {
            console.log('CSV 파일 로드 성공:', parsed.data.length, '개 행');
            setCsvData(parsed.data);
          } else {
            console.log('CSV 파일이 비어있습니다. 샘플 데이터를 사용합니다.');
            setCsvData([]);
          }
        } catch (csvErr) {
          console.log('CSV 파일 로드 실패:', csvErr.message);
          setCsvData([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('데이터 로드 중 에러:', err);
        setError('risk_type_statistics.json 파일을 불러올 수 없습니다.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} onHomeClick={() => {}} />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} onHomeClick={() => {}} />
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Admin 데이터를 불러올 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  const regionName = '성동구';
  const totalStores = statsData?.summary?.total_merchants || 0;
  
  const statusBreakdown = [
    { 
      status: '정상', 
      count: statsData?.priority_distribution?.normal || 0, 
      percentage: totalStores > 0 ? (((statsData?.priority_distribution?.normal || 0) / totalStores) * 100).toFixed(1) : '0.0', 
      color: 'safe' 
    },
    { 
      status: '관찰 필요', 
      count: statsData?.priority_distribution?.watch || 0, 
      percentage: totalStores > 0 ? (((statsData?.priority_distribution?.watch || 0) / totalStores) * 100).toFixed(1) : '0.0', 
      color: 'caution' 
    },
    { 
      status: '중요', 
      count: statsData?.priority_distribution?.important || 0, 
      percentage: totalStores > 0 ? (((statsData?.priority_distribution?.important || 0) / totalStores) * 100).toFixed(1) : '0.0', 
      color: 'warning' 
    },
    { 
      status: '긴급', 
      count: statsData?.priority_distribution?.urgent || 0, 
      percentage: totalStores > 0 ? (((statsData?.priority_distribution?.urgent || 0) / totalStores) * 100).toFixed(1) : '0.0', 
      color: 'danger' 
    },
  ];

  const distributionData = [
    { name: '매출 급락형', value: statsData?.type_distribution?.['매출 급락형'] || 0, color: '#ef4444', percentage: totalStores > 0 ? (((statsData?.type_distribution?.['매출 급락형'] || 0) / totalStores) * 100).toFixed(2) : '0.00' },
    { name: '기타 위험', value: statsData?.type_distribution?.['기타 위험'] || 0, color: '#f97316', percentage: totalStores > 0 ? (((statsData?.type_distribution?.['기타 위험'] || 0) / totalStores) * 100).toFixed(2) : '0.00' },
    { name: '경쟁 열위형', value: statsData?.type_distribution?.['경쟁 열위형'] || 0, color: '#f59e0b', percentage: totalStores > 0 ? (((statsData?.type_distribution?.['경쟁 열위형'] || 0) / totalStores) * 100).toFixed(2) : '0.00' },
  ];
  
  const riskMerchants = csvData && csvData.length > 0
    ? csvData
        .filter(row => row.risk_type !== '정상')
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, 4)
        .map(row => ({
          name: row.MCT_NM || 'Unknown',
          category: row.HPSN_MCT_BZN_CD_NM || 'Unknown',
          riskScore: row.risk_score || 0,
          riskType: row.risk_type || 'Unknown',
          lastConsultDate: null,
          isUrgent: row.priority === 'critical',
        }))
    : [];

  const handleNotificationConfirm = () => {
    alert(`${selectedMerchants.length}개 가맹점에 알림을 발송했습니다.`);
    setSelectedMerchants([]);
  };

  const handleDepartmentAssign = (selectedDepartments) => {
    alert(`${selectedDepartments.length}개 부서를 ${selectedMerchants.length}개 가맹점에 배정했습니다.`);
    setSelectedMerchants([]);
  };

  const handleBulkNotifyClick = () => {
    if (selectedMerchants.length === 0) {
      alert('알림을 보낼 가맹점을 선택해주세요.');
      return;
    }
    setIsNotificationModalOpen(true);
  };

  const handleAssignDepartmentClick = () => {
    if (selectedMerchants.length === 0) {
      alert('부서를 배정할 가맹점을 선택해주세요.');
      return;
    }
    setIsDepartmentModalOpen(true);
  };

  const handleDetailClick = (merchant) => {
    alert(`${merchant.name} 상세 정보`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onConfirm={handleNotificationConfirm}
        selectedCount={selectedMerchants.length}
      />
      
      <DepartmentAssignModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        onAssign={handleDepartmentAssign}
      />

      <AdminNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onHomeClick={onHomeClick} 
      />

      <div className="max-w-7xl mx-auto px-8 py-6">
        {activeTab === 'overview' && (
          <>
            <OverviewSection
              regionName={regionName}
              totalStores={totalStores}
              statusBreakdown={statusBreakdown}
            />

            <RiskMerchantTable
              merchants={riskMerchants}
              onDetailClick={handleDetailClick}
              selectedMerchants={selectedMerchants}
              onSelectionChange={setSelectedMerchants}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleBulkNotifyClick}
                className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
                일괄 알림 발송
                {selectedMerchants.length > 0 && (
                  <span className="ml-1 bg-white text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {selectedMerchants.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={handleAssignDepartmentClick}
                className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                전문 부서 배정
                {selectedMerchants.length > 0 && (
                  <span className="ml-1 bg-white text-green-700 px-2 py-0.5 rounded-full text-xs">
                    {selectedMerchants.length}
                  </span>
                )}
              </button>
            </div>
          </>
        )}

        {activeTab === 'risk' && <RiskManagementTab distributionData={distributionData} />}

        {activeTab === 'performance' && <PerformanceTab />}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">설정</h2>
            <p className="text-gray-600">설정 기능은 개발 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}