import React from 'react';
import { LayoutDashboard, FileText, Settings, UserCircle, HardHat, Book } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const getHeaderTitle = () => {
    switch (activeView) {
      case 'dashboard': return '需求管理列表';
      case 'templates': return '建工法律场景库';
      case 'generator': return '智能内容生成';
      case 'knowledge': return '正己律所知识库';
      default: return '工作台';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center space-x-3 border-b border-gray-700">
          <HardHat className="w-8 h-8 text-orange-500" />
          <div>
            <h1 className="text-lg font-bold leading-tight">AI 建工营销</h1>
            <p className="text-xs text-gray-400">正己律所·智能中台</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
              activeView === 'dashboard' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">工作台</span>
          </button>
          
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 px-3">
            品牌资产
          </div>
          <button
            onClick={() => onNavigate('knowledge')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
              activeView === 'knowledge' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Book size={20} />
            <span className="font-medium">知识库 (GEO)</span>
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 px-3">
            工具箱
          </div>
           <button
            onClick={() => onNavigate('templates')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
              activeView === 'templates' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <FileText size={20} />
            <span>场景模型库</span>
          </button>
           <button
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800 cursor-not-allowed opacity-60"
          >
            <Settings size={20} />
            <span>设置</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <UserCircle size={24} />
            <div className="flex-1">
              <p className="text-white font-medium">管理员用户</p>
              <p className="text-xs">GEO 引擎已激活</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {getHeaderTitle()}
          </h2>
          <div className="text-sm text-gray-500">
            当前日期: {new Date().toLocaleDateString('zh-CN')}
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
