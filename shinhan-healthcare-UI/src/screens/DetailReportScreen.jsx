import React from 'react';
import { ArrowLeft, Users, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 헤더 컴포넌트
const ReportHeader = ({ onBack, date }) => {
  return (
    <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-blue-700" />
        </button>
        <h1 className="text-lg font-bold text-blue-700">대시보드</h1>
      </div>
      <div className="ml-9">
        <p className="text-sm font-semibold text-gray-800">내 매장</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
};

// 섹션 헤더 컴포넌트
const SectionHeader = ({ icon: Icon, title, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
    </div>
  );
};

// 주요 지표 컴포넌트
const KeyMetrics = ({ data }) => {
  // 등급 추출 함수 (앞의 숫자만)
  const extractGrade = (value) => {
    if (!value || value === null) return 'N/A';
    const match = value.toString().match(/^(\d+)_/);
    return match ? match[1] : 'N/A';
  };

  const metrics = [
    { label: '매출 구간', value: extractGrade(data.RC_M1_SAA), color: 'blue' },
    { label: '매출건수 구간', value: extractGrade(data.RC_M1_TO_UE_CT), color: 'green' },
    { label: '유니크 고객', value: extractGrade(data.RC_M1_UE_CUS_CN), color: 'purple' },
    { label: '객단가 구간', value: extractGrade(data.RC_M1_AV_NP_AT), color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <h2 className="text-base font-bold text-gray-900 mb-4">주요 지표 등급</h2>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className={`rounded-xl p-4 border ${colorClasses[metric.color]}`}>
            <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
            <p className="text-3xl font-bold">{metric.value}</p>
            <p className="text-xs text-gray-500 mt-1">등급</p>
          </div>
        ))}
      </div>
    </div>
  );
};



// 고객 분석 컴포넌트
const CustomerAnalysis = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <SectionHeader icon={Users} title="고객 분석" color="green" />
      
      {/* 고객 비율 */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">고객 비율</p>
        {data.hasValidCustomerRatio ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">재방문 고객</p>
              <p className="text-2xl font-bold text-blue-700">{data.returning}%</p>
            </div>
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
              <p className="text-xs text-gray-600 mb-1">신규 고객</p>
              <p className="text-2xl font-bold text-sky-700">{data.new}%</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-gray-600">값이 측정이 안되어 시각화 서비스가 불가능합니다.</p>
          </div>
        )}
      </div>

      {/* 고객층 분포 차트 */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">연령대별 분포</p>
        {data.hasValidAgeData ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="age" 
                  tick={{ fontSize: 11 }}
                  stroke="#666"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  label={{ value: '비율 (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="percentage" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-gray-600">값이 측정이 안되어 시각화 서비스가 불가능합니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 업종/상권 비교 컴포넌트
const IndustryComparison = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <SectionHeader icon={Trophy} title="업종/상권 비교" color="purple" />
      
      <div className="space-y-4">
        {/* 업종 평균 대비 */}
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">업종 평균 대비</p>
            <p className="text-2xl font-bold text-purple-700">{data.industryAverage}%</p>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all"
              style={{ width: `${data.industryAverage}%` }}
            />
          </div>
        </div>

        {/* 추가 지표 */}
        {data.additionalMetrics && (
          <div className="grid grid-cols-2 gap-3">
            {data.additionalMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 메인 상세 리포트 화면
export default function DetailReportScreen({ onBack }) {
  const [storeData, setStoreData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
  const loadData = async () => {
    try {
      const res = await fetch(`${process.env.PUBLIC_URL}/data/My_Store.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const jsonData = await res.json();             // ✅ res.json()으로 파싱
      if (!jsonData?.info?.length) throw new Error('info 배열이 비어있음');

      const latestInfo = jsonData.info[jsonData.info.length - 1];
      setStoreData({ latestData: latestInfo, info: jsonData.info });
      setLoading(false);
    } catch (error) {
      console.error('파일 로드 실패:', error);
      setLoading(false);
    }
  };
  loadData();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const { latestData, info } = storeData;

  // 날짜 포맷팅 (202412 -> 2024년 12월)
  const formatDate = (yyyymm) => {
    const str = yyyymm.toString();
    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    return `${year}년 ${parseInt(month)}월 기준`;
  };

  // 고객 유형 분포 데이터 체크
  const ageFields = [
    'M12_MAL_1020_RAT', 'M12_MAL_30_RAT', 'M12_MAL_40_RAT', 'M12_MAL_50_RAT', 'M12_MAL_60_RAT',
    'M12_FME_1020_RAT', 'M12_FME_30_RAT', 'M12_FME_40_RAT', 'M12_FME_50_RAT', 'M12_FME_60_RAT'
  ];
  
  const hasValidAgeData = ageFields.every(field => 
    latestData[field] !== -999999.9 && latestData[field] !== null
  );

  const ageDistribution = hasValidAgeData ? [
    { age: '남성 20대', percentage: latestData.M12_MAL_1020_RAT || 0 },
    { age: '남성 30대', percentage: latestData.M12_MAL_30_RAT || 0 },
    { age: '남성 40대', percentage: latestData.M12_MAL_40_RAT || 0 },
    { age: '남성 50대', percentage: latestData.M12_MAL_50_RAT || 0 },
    { age: '남성 60대', percentage: latestData.M12_MAL_60_RAT || 0 },
    { age: '여성 20대', percentage: latestData.M12_FME_1020_RAT || 0 },
    { age: '여성 30대', percentage: latestData.M12_FME_30_RAT || 0 },
    { age: '여성 40대', percentage: latestData.M12_FME_40_RAT || 0 },
    { age: '여성 50대', percentage: latestData.M12_FME_50_RAT || 0 },
    { age: '여성 60대', percentage: latestData.M12_FME_60_RAT || 0 },
  ].filter(item => item.percentage > 0) : [];

  // 고객 비율 데이터 체크
  const hasValidCustomerRatio = 
    latestData.MCT_UE_CLN_REU_RAT !== -999999.9 && 
    latestData.MCT_UE_CLN_NEW_RAT !== -999999.9 &&
    latestData.MCT_UE_CLN_REU_RAT !== null &&
    latestData.MCT_UE_CLN_NEW_RAT !== null ;

  const customerData = {
    returning: hasValidCustomerRatio ? latestData.MCT_UE_CLN_REU_RAT : 0,
    new: hasValidCustomerRatio ? latestData.MCT_UE_CLN_NEW_RAT : 0,
    ageDistribution,
    hasValidAgeData,
    hasValidCustomerRatio,
  };

const comparisonData = {
    industryAverage: latestData.M12_SME_RY_SAA_PCE_RT || 0,
    additionalMetrics: [
      { 
        label: '배달매출 비율', 
        value: latestData.DLV_SAA_RAT === -999999.9 || latestData.DLV_SAA_RAT === null 
          ? '결측값이 있습니다' 
          : `${latestData.DLV_SAA_RAT}%` 
      },
      { 
        label: '동일업종 해지점 비중', 
        value: latestData.M12_SME_RY_ME_MCT_RAT === -999999.9 || latestData.M12_SME_RY_ME_MCT_RAT === null
          ? '결측값이 있습니다' 
          : `${latestData.M12_SME_RY_ME_MCT_RAT}%` 
      },
    ],
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <ReportHeader 
        onBack={onBack} 
        date={formatDate(latestData.TA_YM)}
      />

      {/* Content */}
      <div className="px-5 pt-5 space-y-5">
        {/* 주요 지표 */}
        <KeyMetrics data={latestData} />

        {/* 고객 분석 */}
        <CustomerAnalysis data={customerData} />

        {/* 업종/상권 비교 */}
        <IndustryComparison data={comparisonData} />
      </div>
    </div>
  );
}

// import React from 'react';
// import { ArrowLeft, TrendingUp, Users, Trophy } from 'lucide-react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // 헤더 컴포넌트
// const ReportHeader = ({ onBack }) => {
//   return (
//     <div className="bg-white px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-md">
//       <button onClick={onBack}>
//         <ArrowLeft className="w-6 h-6 text-blue-700" />
//       </button>
//       <h1 className="text-lg font-bold text-blue-700">대시보드</h1>
//     </div>
//   );
// };

// // 섹션 헤더 컴포넌트
// const SectionHeader = ({ icon: Icon, title, color = 'blue' }) => {
//   const colorClasses = {
//     blue: 'text-blue-700',
//     green: 'text-green-700',
//     purple: 'text-purple-700',
//   };

//   return (
//     <div className="flex items-center gap-2 mb-3">
//       <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
//       <h2 className="text-base font-bold text-gray-900">{title}</h2>
//     </div>
//   );
// };

// // 매출 추이 컴포넌트
// const SalesTrendChart = ({ data }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
//       <SectionHeader icon={TrendingUp} title="매출 추이 (6개월)" color="blue" />
      
//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="month" 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//             />
//             <YAxis 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: '#fff',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: '8px',
//                 fontSize: '12px'
//               }}
//             />
//             <Legend wrapperStyle={{ fontSize: '12px' }} />
//             <Line 
//               type="monotone" 
//               dataKey="sales" 
//               stroke="#1d4ed8" 
//               strokeWidth={3}
//               name="매출 (만원)"
//               dot={{ fill: '#1d4ed8', r: 4 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // 고객 분석 컴포넌트
// const CustomerAnalysis = ({ data }) => {
//   const pieData = [
//     { name: '재방문 고객', value: data.returning, color: '#1d4ed8' },
//     { name: '신규 고객', value: data.new, color: '#93c5fd' },
//   ];

//   const ageData = data.ageDistribution || [];

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
//       <SectionHeader icon={Users} title="고객 분석" color="green" />
      
//       {/* 고객 비율 */}
//       <div className="grid grid-cols-2 gap-3 mb-5">
//         <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
//           <p className="text-xs text-gray-600 mb-1">재방문 고객</p>
//           <p className="text-2xl font-bold text-blue-700">{data.returning}%</p>
//         </div>
//         <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
//           <p className="text-xs text-gray-600 mb-1">신규 고객</p>
//           <p className="text-2xl font-bold text-sky-700">{data.new}%</p>
//         </div>
//       </div>

//       {/* 고객층 분포 차트 */}
//       <div className="h-64">
//         <p className="text-sm font-semibold text-gray-700 mb-3">연령대별 분포</p>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={ageData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="age" 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//             />
//             <YAxis 
//               tick={{ fontSize: 12 }}
//               stroke="#666"
//               label={{ value: '비율 (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: '#fff',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: '8px',
//                 fontSize: '12px'
//               }}
//             />
//             <Bar dataKey="percentage" fill="#10b981" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // 업종/상권 비교 컴포넌트
// const IndustryComparison = ({ data }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
//       <SectionHeader icon={Trophy} title="업종/상권 비교" color="purple" />
      
//       <div className="space-y-4">
//         {/* 업종 평균 대비 */}
//         <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm font-medium text-gray-700">업종 평균 대비</p>
//             <p className="text-2xl font-bold text-purple-700">{data.industryAverage}%</p>
//           </div>
//           <div className="w-full bg-purple-200 rounded-full h-3">
//             <div 
//               className="bg-purple-600 h-3 rounded-full transition-all"
//               style={{ width: `${data.industryAverage}%` }}
//             />
//           </div>
//         </div>

//         {/* 상권 내 순위 */}
//         <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
//           <p className="text-sm font-medium text-gray-700 mb-2">상권 내 순위</p>
//           <div className="flex items-baseline gap-2">
//             <p className="text-3xl font-bold text-indigo-700">{data.ranking}</p>
//             <p className="text-lg text-gray-600">/ {data.totalStores}개</p>
//           </div>
//           <p className="text-xs text-gray-500 mt-2">
//             상위 {Math.round((data.ranking / data.totalStores) * 100)}%
//           </p>
//         </div>

//         {/* 추가 지표 */}
//         {data.additionalMetrics && (
//           <div className="grid grid-cols-2 gap-3 mt-4">
//             {data.additionalMetrics.map((metric, index) => (
//               <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
//                 <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
//                 <p className="text-lg font-bold text-gray-900">{metric.value}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // 메인 상세 리포트 화면
// export default function DetailReportScreen({
//   salesData = [
//     { month: '4월', sales: 3200 },
//     { month: '5월', sales: 3800 },
//     { month: '6월', sales: 3500 },
//     { month: '7월', sales: 4200 },
//     { month: '8월', sales: 3900 },
//     { month: '9월', sales: 3600 },
//   ],
//   customerData = {
//     returning: 45,
//     new: 55,
//     ageDistribution: [
//       { age: '20대', percentage: 15 },
//       { age: '30대', percentage: 35 },
//       { age: '40대', percentage: 30 },
//       { age: '50대', percentage: 15 },
//       { age: '60대+', percentage: 5 },
//     ],
//   },
//   comparisonData = {
//     industryAverage: 85,
//     ranking: 15,
//     totalStores: 50,
//     additionalMetrics: [
//       { label: '전월 대비', value: '-5%' },
//       { label: '전년 대비', value: '+12%' },
//     ],
//   },
//   onBack,
// }) {
//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       {/* Header */}
//       <ReportHeader onBack={onBack} />

//       {/* Content */}
//       <div className="px-5 pt-5 space-y-5">
//         {/* 매출 추이 */}
//         <SalesTrendChart data={salesData} />

//         {/* 고객 분석 */}
//         <CustomerAnalysis data={customerData} />

//         {/* 업종/상권 비교 */}
//         <IndustryComparison data={comparisonData} />
//       </div>
//     </div>
//   );
// }