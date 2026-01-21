import React, { useState, useRef, useEffect } from 'react';
import { AnalysisRecord, ContentType } from '../types';
import { generateArticle, generateVideoScript, generateZhihuAnswer } from '../services/geminiService';
import { FileText, Video, RefreshCw, Copy, ArrowLeft, Loader2, Check, Sparkles, Quote, Tag, Wand2, BookOpen, ChevronDown, ChevronRight, Info, MoreVertical, FileCode } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { PRESET_PAIN_POINTS } from '../constants';

interface ContentGeneratorProps {
  record: AnalysisRecord;
  onBack: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ record, onBack }) => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.ARTICLE);
  const [generatedContent, setGeneratedContent] = useState<{ [key in ContentType]?: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for selected Tags (Pain Points)
  const [selectedIssues, setSelectedIssues] = useState<string[]>(
    record.result?.detected_issues.map(i => i.tag_name) || []
  );

  // State for selected Original Texts (Quotes)
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>(
    record.result?.detected_issues.map(i => i.original_text) || []
  );

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied_md' | 'copied_text'>('idle');
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
        setShowCopyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Accordion state for preset categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "合同签署与效力": true, // Default open first one
    "施工与签证管理": false,
    "资金与结算困境": false,
    "诉讼与执行难点": false
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let result = '';
      const marketingDir = record.result?.marketing_direction;
      const legalConcepts = record.result?.legal_concepts || [];

      if (activeTab === ContentType.ARTICLE) {
        result = await generateArticle(selectedIssues, selectedQuotes, legalConcepts, marketingDir);
      } else if (activeTab === ContentType.VIDEO) {
        result = await generateVideoScript(selectedIssues, selectedQuotes, legalConcepts, marketingDir);
      } else if (activeTab === ContentType.ZHIHU) {
        result = await generateZhihuAnswer(selectedIssues, selectedQuotes, legalConcepts, marketingDir);
      }

      setGeneratedContent(prev => ({ ...prev, [activeTab]: result }));
    } catch (error) {
      console.error(error);
      alert("生成失败，请检查网络或 Key");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleIssue = (tag: string) => {
    if (selectedIssues.includes(tag)) {
      setSelectedIssues(selectedIssues.filter(t => t !== tag));
    } else {
      setSelectedIssues([...selectedIssues, tag]);
    }
  };

  const toggleQuote = (quote: string) => {
    if (selectedQuotes.includes(quote)) {
      setSelectedQuotes(selectedQuotes.filter(q => q !== quote));
    } else {
      setSelectedQuotes([...selectedQuotes, quote]);
    }
  };

  // Utility to strip Markdown syntax
  const stripMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/^#+\s+/gm, '') // Headers
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/^>\s+/gm, '') // Blockquotes
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
      .replace(/`(.+?)`/g, '$1') // Inline code
      .replace(/^\s*-\s+/gm, '') // List items
      .replace(/^\s*\d+\.\s+/gm, '') // Ordered list items
      .replace(/\n{3,}/g, '\n\n'); // Max 2 newlines
  };

  const handleCopyMarkdown = () => {
    const text = generatedContent[activeTab];
    if (text) {
      navigator.clipboard.writeText(text);
      setCopyStatus('copied_md');
      setShowCopyMenu(false);
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleCopyPlainText = () => {
    const text = generatedContent[activeTab];
    if (text) {
      navigator.clipboard.writeText(stripMarkdown(text));
      setCopyStatus('copied_text');
      setShowCopyMenu(false);
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const hasContent = !!generatedContent[activeTab];
  const isButtonDisabled = isGenerating || (selectedIssues.length === 0 && selectedQuotes.length === 0);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> 返回案源列表
      </button>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Configuration */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin">
            <div className="mb-4">
               <h3 className="font-semibold text-gray-900">GEO 策略配置</h3>
               <p className="text-xs text-gray-500 mt-1">强制植入：正己律师事务所 · 北京建工</p>
            </div>
            
            {/* AI Recommendation Box */}
            {record.result?.marketing_direction && (
                <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center text-indigo-700 font-bold text-xs uppercase mb-2">
                        <Sparkles size={12} className="mr-1" />
                        GEO 长尾词建议
                    </div>
                    <p className="text-indigo-900 text-sm font-medium leading-tight">
                        {record.result.marketing_direction}
                    </p>
                </div>
            )}

            {/* Selection Area */}
            <div className="space-y-8">
                
                {/* 1. Quotes Selection (Extracted) */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span className="flex items-center"><Quote size={12} className="mr-1" /> 案源提取原话 (素材)</span>
                    <span className="text-[10px] font-normal text-gray-400">来自上传文档</span>
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                    {record.result?.detected_issues.length === 0 ? (
                        <p className="text-xs text-gray-400 italic p-2">未检测到明显痛点原话。</p>
                    ) : record.result?.detected_issues.map((issue, idx) => (
                        <label 
                            key={`q-${idx}`} 
                            className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all group relative ${
                            selectedQuotes.includes(issue.original_text) 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-200'
                            }`}
                            title={issue.original_text} // Native tooltip as fallback
                        >
                            <input 
                                type="checkbox" 
                                className="mt-1 mr-3 accent-blue-600 shrink-0"
                                checked={selectedQuotes.includes(issue.original_text)}
                                onChange={() => toggleQuote(issue.original_text)}
                            />
                            <div className="text-xs text-gray-700 italic line-clamp-3 leading-relaxed">
                              “{issue.original_text}”
                            </div>
                        </label>
                    ))}
                  </div>
                </div>

                {/* 2. Issues Selection (Library) */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span className="flex items-center"><Tag size={12} className="mr-1" /> 痛点/原话库 (可展开)</span>
                  </label>
                  
                  {/* Extracted Issues Tags (Chips) */}
                  {record.result?.detected_issues.length > 0 && (
                     <div className="mb-4 pb-4 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 mb-2">AI 智能提取标签:</p>
                        <div className="flex flex-wrap gap-2">
                            {record.result.detected_issues.map((issue, idx) => (
                                <button
                                    key={`ai-t-${idx}`}
                                    onClick={() => toggleIssue(issue.tag_name)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    selectedIssues.includes(issue.tag_name)
                                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-200'
                                    }`}
                                >
                                    {selectedIssues.includes(issue.tag_name) && <Check size={10} className="inline mr-1"/>}
                                    {issue.tag_name}
                                </button>
                            ))}
                        </div>
                     </div>
                  )}

                  {/* Preset Library (Accordion List) */}
                  <div className="space-y-2">
                    {Object.entries(PRESET_PAIN_POINTS).map(([category, items]) => {
                        const isExpanded = expandedCategories[category];
                        return (
                            <div key={category} className="border border-gray-100 rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-xs font-bold text-gray-700">{category}</span>
                                    {isExpanded ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400"/>}
                                </button>
                                
                                {isExpanded && (
                                    <div className="p-2 space-y-2 bg-white max-h-60 overflow-y-auto scrollbar-thin">
                                        {items.map((item, idx) => (
                                            <div 
                                                key={`${category}-${idx}`} 
                                                className={`group relative p-2 rounded border cursor-pointer transition-all ${
                                                    selectedIssues.includes(item.tag)
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'bg-white border-gray-100 hover:border-blue-200'
                                                }`}
                                                onClick={() => toggleIssue(item.tag)}
                                            >
                                                {/* Header: Tag + Check */}
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-xs font-bold ${selectedIssues.includes(item.tag) ? 'text-blue-700' : 'text-gray-700'}`}>
                                                        {item.tag}
                                                    </span>
                                                    {selectedIssues.includes(item.tag) && <Check size={12} className="text-blue-600"/>}
                                                </div>
                                                {/* Body: Truncated Quote */}
                                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                                                    {item.desc}
                                                </p>

                                                {/* Hover Tooltip (Full Quote) */}
                                                <div className="absolute left-0 bottom-full w-full mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                    <div className="font-bold mb-1 text-orange-300">{item.tag}</div>
                                                    <div className="leading-relaxed">“{item.desc}”</div>
                                                    {/* Triangle */}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                  </div>

                </div>

            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
                <button 
                onClick={handleGenerate}
                disabled={isButtonDisabled}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <RefreshCw className="mr-2" size={18} />}
                {hasContent ? '重新生成内容' : '启动 GEO 引擎生成'}
                </button>
            </div>
          </div>
        </div>

        {/* Right Column: Content Output */}
        <div className="col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[700px] flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab(ContentType.ARTICLE)}
                className={`flex-1 py-4 text-sm font-medium text-center flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                  activeTab === ContentType.ARTICLE 
                    ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText size={18} />
                <span>深度文章 (公众号)</span>
              </button>
              <button
                onClick={() => setActiveTab(ContentType.VIDEO)}
                className={`flex-1 py-4 text-sm font-medium text-center flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                  activeTab === ContentType.VIDEO 
                    ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Video size={18} />
                <span>口播脚本 (抖音)</span>
              </button>
              <button
                onClick={() => setActiveTab(ContentType.ZHIHU)}
                className={`flex-1 py-4 text-sm font-medium text-center flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                  activeTab === ContentType.ZHIHU 
                    ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen size={18} />
                <span>逻辑回答 (知乎)</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 relative bg-gray-50/30">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                   <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                   <p className="text-gray-900 font-bold text-lg animate-pulse">
                     GEO 引擎正在运行...
                   </p>
                   <div className="text-sm text-gray-500 mt-2 space-y-1 text-center">
                     <p>✓ 正在绑定“正己律所”实体词</p>
                     <p>✓ 正在植入“北京”本地化地标</p>
                     <p>✓ 正在生成结构化引用块</p>
                   </div>
                </div>
              ) : generatedContent[activeTab] ? (
                <>
                  <div className="absolute top-4 right-4 z-10 flex flex-col items-end" ref={copyMenuRef}>
                    <button 
                      onClick={() => setShowCopyMenu(!showCopyMenu)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border shadow-sm transition-all active:scale-95 ${
                        copyStatus !== 'idle'
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                      title="复制内容"
                    >
                      {copyStatus === 'idle' ? <Copy size={16} /> : <Check size={16} />}
                      <span className="text-sm font-medium">
                          {copyStatus === 'idle' ? '一键复制' : copyStatus === 'copied_md' ? '已复制源码' : '已复制文本'}
                      </span>
                      <ChevronDown size={14} className={`transition-transform ${showCopyMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Copy Dropdown Menu */}
                    {showCopyMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20">
                            <button
                                onClick={handleCopyMarkdown}
                                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100"
                            >
                                <FileCode size={16} className="mr-2 text-gray-400"/>
                                复制 Markdown 源码
                            </button>
                            <button
                                onClick={handleCopyPlainText}
                                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700"
                            >
                                <FileText size={16} className="mr-2 text-gray-400"/>
                                复制纯文本 (无格式)
                            </button>
                        </div>
                    )}
                  </div>
                  <MarkdownRenderer content={generatedContent[activeTab]!} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Wand2 size={48} className="mb-4 text-gray-200" />
                  <p>请勾选左侧配置</p>
                  <p className="text-sm mt-1">AI 将为您生成符合 SEO/GEO 标准的高权重内容</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
