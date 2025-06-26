"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IExecDataProtectorCore, ProtectedData } from "@iexec/dataprotector";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { protectDualGPXFiles, DualGPXProtectionResult } from "@/lib/gpxProtection";

interface GPXFile {
  file: File;
  name: string;
  size: number;
  content: ArrayBuffer;
}

interface GPXUploaderProps {
  dataProtectorCore: IExecDataProtectorCore | null;
  onProtectionComplete: (protectedData: DualGPXProtectionResult) => void;
}

export default function GPXUploader({ dataProtectorCore, onProtectionComplete }: GPXUploaderProps) {
  const [gpx1, setGpx1] = useState<GPXFile | null>(null);
  const [gpx2, setGpx2] = useState<GPXFile | null>(null);
  const [protectionName, setProtectionName] = useState("");
  const [isProtecting, setIsProtecting] = useState(false);
  const [protectionStatus, setProtectionStatus] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<'ipfs' | 'arweave'>('ipfs');
  
  const gpx1InputRef = useRef<HTMLInputElement>(null);
  const gpx2InputRef = useRef<HTMLInputElement>(null);

  const validateGPXFile = (file: File): Promise<GPXFile> => {
    return new Promise((resolve, reject) => {
      console.log('Validating file:', file.name, 'size:', file.size);
      
      if (!file.name.toLowerCase().endsWith('.gpx')) {
        console.error('File validation failed: not a GPX file');
        reject(new Error('Please select a GPX file (.gpx extension)'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        console.error('File validation failed: file too large');
        reject(new Error('File size must be less than 10MB'));
        return;
      }

      console.log('File passed basic validation, reading content...');
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as ArrayBuffer;
        if (!content) {
          console.error('Failed to read file content');
          reject(new Error('Failed to read file content'));
          return;
        }

        console.log('File content read successfully, size:', content.byteLength);
        resolve({
          file,
          name: file.name.replace('.gpx', ''),
          size: file.size,
          content,
        });
      };
      reader.onerror = () => {
        console.error('FileReader error');
        reject(new Error('Failed to read file'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (fileList: FileList | null, setGpx: (gpx: GPXFile | null) => void) => {
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    console.log('File selected:', file.name, file.size);
    
    try {
      const gpxFile = await validateGPXFile(file);
      console.log('File validated successfully:', gpxFile);
      setGpx(gpxFile);
    } catch (error) {
      console.error('File validation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to process file');
    }
  };

  const removeFile = (setGpx: (gpx: GPXFile | null) => void, inputRef: React.RefObject<HTMLInputElement | null>) => {
    setGpx(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const protectDualGPXFilesHandler = async () => {
    if (!dataProtectorCore || !gpx1 || !gpx2) {
      alert('Please ensure both GPX files are uploaded and wallet is connected');
      return;
    }

    setIsProtecting(true);
    setProtectionStatus('Preparing files...');

    try {
      const protectedData = await protectDualGPXFiles(
        dataProtectorCore,
        gpx1.file,
        gpx2.file,
        {
          name: protectionName,
          verbose: true
        }
      );

      console.log('Protected Data:', protectedData);
      onProtectionComplete(protectedData);
      
      // Reset form
      setGpx1(null);
      setGpx2(null);
      setProtectionName('');
      if (gpx1InputRef.current) gpx1InputRef.current.value = '';
      if (gpx2InputRef.current) gpx2InputRef.current.value = '';
      
      setProtectionStatus('Protection completed successfully! ✅');
      
    } catch (error) {
      console.error('Error protecting dual GPX files:', error);
      setProtectionStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      alert(`Failed to protect GPX files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProtecting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  const canProtect = gpx1 && gpx2 && !isProtecting && dataProtectorCore;

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">GPX File Protection</h2>
        <p className="text-gray-600">Upload two GPX files to create a protected dataset</p>
      </div>

      {/* Protection Name Input */}
      <div className="space-y-2">
        <label htmlFor="protection-name" className="block text-sm font-medium text-gray-700">
          Protection Name (optional)
        </label>
        <Input
          id="protection-name"
          type="text"
          placeholder="Enter a custom name for your protected data"
          value={protectionName}
          onChange={(e) => setProtectionName(e.target.value)}
          disabled={isProtecting}
        />
      </div>

      {/* Upload Mode Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Storage Mode</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="ipfs"
              checked={uploadMode === 'ipfs'}
              onChange={(e) => setUploadMode(e.target.value as 'ipfs' | 'arweave')}
              disabled={isProtecting}
              className="mr-2"
            />
            IPFS (recommended)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="arweave"
              checked={uploadMode === 'arweave'}
              onChange={(e) => setUploadMode(e.target.value as 'ipfs' | 'arweave')}
              disabled={isProtecting}
              className="mr-2"
            />
            Arweave
          </label>
        </div>
      </div>

      {/* File Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GPX File 1 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">GPX File 1</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {!gpx1 ? (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <Input
                    ref={gpx1InputRef}
                    type="file"
                    accept=".gpx"
                    onChange={(e) => handleFileUpload(e.target.files, setGpx1)}
                    disabled={isProtecting}
                    className="cursor-pointer"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Max size: 10MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{gpx1.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(gpx1.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(setGpx1, gpx1InputRef)}
                  disabled={isProtecting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* GPX File 2 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">GPX File 2</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {!gpx2 ? (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <Input
                    ref={gpx2InputRef}
                    type="file"
                    accept=".gpx"
                    onChange={(e) => handleFileUpload(e.target.files, setGpx2)}
                    disabled={isProtecting}
                    className="cursor-pointer"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Max size: 10MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{gpx2.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(gpx2.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(setGpx2, gpx2InputRef)}
                  disabled={isProtecting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Protection Status */}
      {protectionStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">{protectionStatus}</p>
        </div>
      )}

      {/* Protection Button */}
      <div className="text-center">
        <Button
          onClick={protectDualGPXFilesHandler}
          disabled={!canProtect}
          className="w-full md:w-auto px-8"
        >
          {isProtecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Protecting Files...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Protect GPX Files
            </>
          )}
        </Button>
      </div>

      {!canProtect && !isProtecting && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {!dataProtectorCore ? 'Please connect your wallet first' : 
             !gpx1 || !gpx2 ? 'Please upload both GPX files' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
