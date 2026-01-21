import React from 'react';
import { AnalysisRecord, PainPoint } from '../types';
import { Wand2, FileAudio, Loader2, AlertCircle, Quote, BrainCircuit, Hash, ShieldAlert, Scale } from 'lucide-react';

interface DashboardProps {
  records: AnalysisRecord[];
  onGenerateClick: (record: AnalysisRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, onGenerateClick }) => {
  
  if (records.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>暂无记录，请上传文件开始深度法律分析。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-1/6">案件来源</th>
              <th className="px-6 py-4 w-1/4">用户画像 & 法律要素</th>
              <th className="px-6 py-4 w-1/4">证据链状态</th>
              <th className="px-6 py-4 w-1/6">AI 洞察摘要</th>
              <th className="px-6 py-4 w-1/6 text-right">GEO 内容引擎</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => {
              const result = record.result;
              return (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  {/* Column 1: Source */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded text-blue-600">
                        <FileAudio size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1" title={record.fileName}>{record.fileName}</p>
                        <p className="text-xs text-gray-500">{record.uploadDate}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Column 2: Persona & Legal Concepts */}
                  <td className="px-6 py-4 align-top">
                    {result ? (
                      <div className="space-y-3">
                        {/* Persona Tags */}
                        <div className="flex flex-wrap gap-1">
                           {result.user_persona?.tags?.map((tag, idx) => (
                             <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700">
                               {tag}
                             </span>
                           ))}
                        </div>
                        {/* Legal Terms */}
                        <div className="flex items-start gap-1 text-gray-600 text-xs">
                           <Scale size={12} className="mt-0.5 text-gray-400"/>
                           <span className="font-medium text-gray-800">{result.case_type}</span>
                        </div>
                        <div className="pl-4 text-xs text-gray-500">
                          {result.legal_concepts?.join('、')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">分析中...</span>
                    )}
                  </td>

                  {/* Column 3: Evidence Analysis */}
                  <td className="px-6 py-4 align-top">
                    {result ? (
                      <div className="space-y-2">
                         <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                             result.evidence_analysis?.strength?.includes('强') ? 'bg-green-100 text-green-700' :
                             result.evidence_analysis?.strength?.includes('中') ? 'bg-yellow-100 text-yellow-700' :
                             'bg-red-100 text-red-700'
                         }`}>
                             <ShieldAlert size={12} className="mr-1"/>
                             {result.evidence_analysis?.strength || '未知强度'}
                         </div>
                         <p className="text-xs text-gray-600 leading-tight">
                            {result.evidence_analysis?.description || '证据链待确认'}
                         </p>
                         <div className="text-[10px] text-gray-400">
                            关键词: {result.evidence_analysis?.keywords?.join(', ')}
                         </div>
                      </div>
                    ) : (
                      <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    )}
                  </td>

                  {/* Column 4: Summary */}
                  <td className="px-6 py-4 align-top">
                    {result ? (
                       <div className="space-y-2">
                          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                              {result.problem_summary}
                          </p>
                          {result.marketing_direction && (
                              <div className="flex items-center text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                  <Hash size={10} className="mr-1"/>
                                  建议: {result.marketing_direction}
                              </div>
                          )}
                       </div>
                    ) : (
                       <div className="space-y-2">
                          <div className="h-2 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                       </div>
                    )}
                  </td>

                  {/* Column 5: Action */}
                  <td className="px-6 py-4 align-top text-right">
                    {record.status === 'completed' && (
                      <button
                        onClick={() => onGenerateClick(record)}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                      >
                        <Wand2 size={14} />
                        <span>GEO 内容裂变</span>
                      </button>
                    )}
                    {record.status === 'processing' && (
                       <span className="text-orange-500 text-xs flex items-center justify-end">
                         <Loader2 size={14} className="animate-spin mr-1"/> 深度分析中
                       </span>
                    )}
                    {record.status === 'failed' && (
                       <span className="text-red-500 text-xs flex items-center justify-end">
                         <AlertCircle size={14} className="mr-1"/> 失败
                       </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
