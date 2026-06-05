import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiFile, FiImage, FiMusic, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadAPI } from '../services/api';

export default function MediaUpload({ onUploadComplete, multiple = false, accept = 'image/*,audio/*,video/*,application/pdf', prefix = '/media' }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    setUploading(true);
    for (const fileItem of files) {
      try {
        const response = await uploadAPI.uploadSingle(
          fileItem.file,
          prefix,
          (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(prev => ({ ...prev, [fileItem.id]: percent }));
          }
        );
        const uploadedFile = {
          ...response.data,
          url: uploadAPI.getFileUrl(response.data.id),
        };
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? { ...f, status: 'success', url: uploadedFile.url } : f
        ));
        if (onUploadComplete) onUploadComplete(uploadedFile);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error', error: error.response?.data?.error || 'Upload failed' } : f
        ));
        toast.error(`Upload failed for ${fileItem.file.name}`);
      }
    }
    setUploading(false);
    // Clear successful files after delay
    setTimeout(() => {
      setFiles(prev => prev.filter(f => f.status !== 'success'));
    }, 3000);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="w-8 h-8 text-blue-400" />;
    if (type.startsWith('audio/')) return <FiMusic className="w-8 h-8 text-green-400" />;
    if (type.startsWith('video/')) return <FiVideo className="w-8 h-8 text-purple-400" />;
    return <FiFile className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-primary">Fayllarni tashlang...</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag & drop fayllarni bu yerga tashlang</p>
            <p className="text-sm text-gray-400 mt-1">yoki tanlash uchun bosing</p>
            <p className="text-xs text-gray-400 mt-2">Rasm, audio, video, PDF (max 50MB)</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold">Yuklanayotgan fayllar ({files.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((fileItem) => (
              <motion.div
                key={fileItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                {fileItem.preview ? (
                  <img src={fileItem.preview} alt="preview" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                    {getFileIcon(fileItem.file.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                  <p className="text-xs text-gray-500">{(fileItem.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {fileItem.status === 'pending' && progress[fileItem.id] !== undefined && (
                    <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress[fileItem.id]}%` }} />
                    </div>
                  )}
                  {fileItem.status === 'success' && (
                    <p className="text-xs text-green-600">✓ Yuklandi</p>
                  )}
                  {fileItem.status === 'error' && (
                    <p className="text-xs text-red-500">{fileItem.error}</p>
                  )}
                </div>
                {fileItem.status === 'pending' && (
                  <button onClick={() => removeFile(fileItem.id)} className="text-gray-400 hover:text-red-500">
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full py-2 mt-2 font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? 'Yuklanmoqda...' : `${files.length} ta faylni yuklash`}
          </button>
        </div>
      )}
    </div>
  );
}
