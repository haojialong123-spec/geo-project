import React, { useState } from 'react';
import { LegalScenario } from '../types';
import { ID_PREFIX_MAP } from '../constants';
import { BookOpen, BrainCircuit, Target, MessageSquare, Search, Trash2, Edit2, Save, X, ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface TemplateLibraryProps {
  templates: LegalScenario[];
  onUpdate: (template: LegalScenario) => void;
  onDelete: (id: string) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ templates, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Temporary state for editing
  const [editForm, setEditForm] = useState<LegalScenario | null>(null);

  const filteredTemplates = templates.filter(t => 
    t.pain_point.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.case_name && t.case_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatId = (id: string) => {
    const parts = id.split('-');
    if (parts.length > 0 && ID_PREFIX_MAP[parts[0]]) {
      return `${ID_PREFIX_MAP[parts[0]]}-${parts[1]}`;
    }
    return id;
  };

  const handleEditClick = (template: LegalScenario, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(template.id);
    setEditForm({ ...template });
    setExpandedId(template.id); // Auto expand when editing
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editForm) {
      onUpdate(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const toggleExpand = (id: string) => {
    if (editingId) return; // Prevent collapsing while editing
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (field: keyof LegalScenario, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">建工法律场景知识库</h1>
          <p className="text-gray-500 mt-1">
            当前共 {templates.length} 个案件/场景模型。新分析的案源将自动沉淀至此。
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索案件名称、痛点、编号..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {filteredTemplates.map((template) => {
          const isEditing = editingId === template.id;
          const isExpanded = expandedId === template.id;
          const data = isEditing && editForm ? editForm : template;

          return (
            <div 
              key={template.id} 
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'shadow-md border-orange-200' : 'shadow-sm border-gray-200 hover:border-orange-300'
              }`}
            >
              {/* Header / Summary Row */}
              <div 
                className={`p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-orange-50/30' : 'bg-white'}`}
                onClick={() => toggleExpand(template.id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded min-w-[70px] text-center ${
                    template.is_custom ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {formatId(template.id)}
                  </span>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input 
                          type="text" 
                          value={data.case_name || ''}
                          placeholder="案件名称"
                          onChange={(e) => handleInputChange('case_name', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-sm font-semibold text-gray-900 border-b border-orange-300 focus:outline-none bg-transparent"
                        />
                        <input 
                          type="text" 
                          value={data.pain_point}
                          placeholder="核心痛点"
                          onChange={(e) => handleInputChange('pain_point', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-xs text-gray-500 border-b border-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            {data.case_name || data.pain_point}
                            {!data.case_name && <span className="ml-2 text-xs font-normal text-gray-400"> (无案件名)</span>}
                        </h3>
                         <div className="flex items-center space-x-2 mt-1">
                             {data.case_name && (
                                <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                                    # {data.pain_point}
                                </span>
                             )}
                            {!isExpanded && (
                                <p className="text-xs text-gray-500 line-clamp-1">
                                    {data.case_summary || data.marketing_action}
                                </p>
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pl-4">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSaveClick}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="保存"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={handleCancelClick}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        title="取消"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => handleEditClick(template, e)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(template.id, e)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="p-2 text-gray-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-6 border-t border-gray-100 grid grid-cols-1 gap-8">
                  
                  {/* Strategy & Logic (Now Full Width) */}
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block flex items-center">
                        <Quote className="w-3 h-3 mr-1 text-orange-500"/> 客户原话 (提取问题)
                      </label>
                      {isEditing ? (
                        <textarea
                          value={data.triggers.join('\n')}
                          onChange={(e) => handleInputChange('triggers', e.target.value.split('\n').filter(s=>s.trim()) as any)} // Quick hack for array
                          className="w-full text-sm p-2 border border-gray-200 rounded bg-gray-50 focus:ring-1 focus:ring-orange-500 outline-none"
                          rows={4}
                          placeholder="每行一个问题描述..."
                        />
                      ) : (
                        <div className="space-y-2">
                          {data.triggers.map((trigger, idx) => (
                            <div key={idx} className="flex items-start text-sm text-gray-700 italic bg-gray-50 p-2 rounded border-l-2 border-orange-300">
                              <span className="text-orange-400 font-serif text-lg leading-none mr-2">“</span>
                              {trigger}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block flex items-center">
                        <BrainCircuit className="w-3 h-3 mr-1 text-purple-500"/> AI 案情自动总结
                      </label>
                      {isEditing ? (
                        <textarea
                          value={data.case_summary || data.ai_logic}
                          onChange={(e) => handleInputChange('case_summary', e.target.value)}
                          className="w-full text-sm p-2 border border-gray-200 rounded bg-gray-50 focus:ring-1 focus:ring-orange-500 outline-none"
                          rows={3}
                          placeholder="案情摘要..."
                        />
                      ) : (
                        <p className="text-sm text-gray-800 leading-relaxed bg-purple-50/50 p-3 rounded border border-purple-100">
                          {data.case_summary || data.ai_logic}
                        </p>
                      )}
                    </div>
                    
                     <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block flex items-center">
                        <Target className="w-3 h-3 mr-1 text-blue-500"/> 营销方向
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.marketing_action}
                          onChange={(e) => handleInputChange('marketing_action', e.target.value)}
                          className="w-full text-sm p-2 border border-gray-200 rounded bg-gray-50 focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      ) : (
                        <p className="text-sm text-blue-700 font-medium">
                          {data.marketing_action}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Removed Right Column (Generated Content Examples) as requested */}
                </div>
              )}
            </div>
          );
        })}
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpen className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-500">没有找到匹配的记录。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLibrary;