import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, FileText, Loader2, Clipboard } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    const blob = new Blob([pastedText], { type: 'text/plain' });
    const file = new File([blob], "文本粘贴稿.txt", { type: 'text/plain' });
    onUpload(file);
    setPastedText(''); // Clear after submit
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">案情材料采集</h3>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('upload')}
             className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
           >
             文件上传
           </button>
           <button 
             onClick={() => setActiveTab('paste')}
             className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'paste' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
           >
             文本/录音粘贴
           </button>
        </div>
      </div>
      
      {activeTab === 'upload' ? (
        <div 
          className={`relative border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-all min-h-[250px] ${
            dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={!isProcessing ? handleDrop : undefined}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleChange}
            accept=".mp3,.wav,.m4a,.docx,.pdf,.txt"
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-700">AI 深度法律语义识别中...</p>
              <p className="text-sm text-gray-500 mt-2">正在提取：案件要素、证据等级、用户画像</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <UploadCloud className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-lg font-medium text-gray-700">点击上传或拖拽文件</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md text-center">
                支持 Word(.docx), 文本(.txt), 或其他案情文档
              </p>
              <div className="flex gap-4 mt-6 text-xs text-gray-400">
                 <span className="flex items-center"><FileAudio size={14} className="mr-1"/> 咨询录音转写</span>
                 <span className="flex items-center"><FileText size={14} className="mr-1"/> 案件笔录文档</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative min-h-[250px]">
           <textarea
             className="w-full h-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm text-gray-700"
             placeholder="请直接粘贴录音转写稿、案情描述或复制 PDF 中的文字内容..."
             value={pastedText}
             onChange={(e) => setPastedText(e.target.value)}
             disabled={isProcessing}
           />
           <button
             onClick={handlePasteSubmit}
             disabled={isProcessing || !pastedText.trim()}
             className="absolute bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
           >
             {isProcessing ? <Loader2 size={16} className="animate-spin mr-2"/> : <Clipboard size={16} className="mr-2"/>}
             开始分析
           </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
