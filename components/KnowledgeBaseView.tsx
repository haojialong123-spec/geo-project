import React from 'react';
import { FIRM_KNOWLEDGE_BASE } from '../constants';
import MarkdownRenderer from './MarkdownRenderer';
import { ShieldCheck, Info, Award, MapPin } from 'lucide-react';

const KnowledgeBaseView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Intro Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold mb-2">北京正己律师事务所</h1>
                <div className="flex items-center space-x-4 text-blue-100 text-sm mb-6">
                    <span className="flex items-center"><MapPin size={16} className="mr-1"/> 北京朝阳</span>
                    <span>|</span>
                    <span>成立于 2015年</span>
                    <span>|</span>
                    <span>300+ 团队成员</span>
                </div>
                <p className="max-w-2xl text-blue-50 leading-relaxed">
                    本模块展示系统当前加载的“品牌资产知识库”。AI 在生成所有公众号文章、视频脚本及回答时，
                    将严格依据以下信息进行 GEO (Generative Engine Optimization) 优化，确保品牌一致性与专业度。
                </p>
            </div>
            <Award size={64} className="text-yellow-400 opacity-80"/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-green-600 mr-2"/>
                  核心服务承诺
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                      <span>重大节点 24小时主动告知</span>
                  </li>
                  <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                      <span>无隐形消费，杜绝中途加价</span>
                  </li>
                  <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                      <span>利益冲突强制检索</span>
                  </li>
                   <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                      <span>全员投保执业责任险</span>
                  </li>
              </ul>
          </div>

          {/* Main Content */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm col-span-2">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <Info className="w-5 h-5 text-blue-600 mr-2"/>
                <h3 className="font-bold text-gray-900">系统知识库详情 (Raw Context)</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <MarkdownRenderer content={FIRM_KNOWLEDGE_BASE} />
            </div>
          </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseView;
