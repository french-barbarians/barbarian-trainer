"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IExecDataProtectorCore } from "@iexec/dataprotector";
import { protectDualGPXFiles, DualGPXProtectionResult } from "@/lib/gpxProtection";
import GrantAccess from "./GrantAccess";

// You'll need to get this from your environment or config
const PRIVATE_COACH_APP_ADDRESS = "0x27DdE5fd9B3C800538D11ccf3a4Af5AaaE70A0CF"; // Your latest iApp address

interface CreateProfile4Props {
  dataProtectorCore?: IExecDataProtectorCore | null;
}

export default function CreateProfile4({ dataProtectorCore = null }: CreateProfile4Props) {
  const router = useRouter();
  const [gpx1File, setGpx1File] = useState<File | null>(null);
  const [gpx2File, setGpx2File] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState<'gpx1' | 'gpx2' | null>(null);
  const [protectedData, setProtectedData] = useState<DualGPXProtectionResult | null>(null);
  const [grantedAccess, setGrantedAccess] = useState<any>(null);
  const [isProtecting, setIsProtecting] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);

  const validateGPXFile = (file: File): boolean => {
    return file.name.toLowerCase().endsWith('.gpx') && file.size < 10 * 1024 * 1024; // 10MB limit
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'gpx1' | 'gpx2') => {
    const file = event.target.files?.[0];
    if (file && validateGPXFile(file)) {
      if (fileType === 'gpx1') {
        setGpx1File(file);
      } else {
        setGpx2File(file);
      }
    } else {
      alert('Please select a valid GPX file (under 10MB)');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, fileType: 'gpx1' | 'gpx2') => {
    event.preventDefault();
    setDragOver(null);
    
    const file = event.dataTransfer.files[0];
    if (file && validateGPXFile(file)) {
      if (fileType === 'gpx1') {
        setGpx1File(file);
      } else {
        setGpx2File(file);
      }
    } else {
      alert('Please select a valid GPX file (under 10MB)');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, fileType: 'gpx1' | 'gpx2') => {
    event.preventDefault();
    setDragOver(fileType);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleProtectData = async () => {
    if (!dataProtectorCore || !gpx1File || !gpx2File) {
      alert('Please ensure wallet is connected and both GPX files are selected');
      return;
    }

    setIsProtecting(true);
    try {
      const result = await protectDualGPXFiles(
        dataProtectorCore,
        gpx1File,
        gpx2File,
        { name: 'Barbarian Trainer GPX Data' }
      );
      setProtectedData(result);
    } catch (error) {
      console.error('Protection failed:', error);
      alert('Failed to protect data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProtecting(false);
    }
  };

  const handleAccessGranted = (access: any) => {
    setGrantedAccess(access);
    setIsProcessingComplete(true);
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const handleBack = () => {
    router.back();
  };

  const removeFile = (fileType: 'gpx1' | 'gpx2') => {
    if (fileType === 'gpx1') {
      setGpx1File(null);
    } else {
      setGpx2File(null);
    }
  };

  // If data is protected and access is granted, show completion
  if (isProcessingComplete) {
    return (
      <div className="min-h-screen w-full max-w-[375px] mx-auto" style={{ backgroundColor: '#0F0641' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#0F0641' }}>
          <div className="w-10 h-10 relative">
            <Image
              src="/logo-bleu.png"
              alt="Barbarian Trainer Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-base font-bold leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Setup Complete
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold leading-[150%] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Profile Created Successfully!
            </h2>
            <p className="text-white text-base leading-relaxed mb-8 opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your training profile is now complete and your private coach is ready to help you achieve your goals.
            </p>
          </div>

          {/* Validation Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 space-y-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Personal Information
                </p>
                <p className="text-white/70 text-xs">Profile details saved</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Coach Selected
                </p>
                <p className="text-white/70 text-xs">Your private coach is assigned</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Training Data Protected
                </p>
                <p className="text-white/70 text-xs">GPX files securely encrypted</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Access Granted
                </p>
                <p className="text-white/70 text-xs">Coach connected to your data</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full h-12 bg-[#E0F466] hover:bg-[#d1e855] text-[#0F0641] font-semibold rounded-lg"
          >
            Start Training
          </Button>
        </div>
      </div>
    );
  }

  // If data is protected, show access granting
  if (protectedData && !grantedAccess) {
    return (
      <div className="min-h-screen w-full max-w-[375px] mx-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white">
          <div className="w-10 h-10 relative">
            <Image
              src="/logo-bleu.png"
              alt="Barbarian Trainer Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-[#0F0641] text-base font-bold leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Grant Access
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="px-6 py-8">
          <div className="text-center mb-6">
            <h2 className="text-[#0F0641] text-2xl font-bold leading-[150%] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Grant access to your private coach
            </h2>
            <p className="text-[#0F0641] text-base leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Allow your coach to process your protected training data
            </p>
          </div>

          {/* Protected Data Success */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-green-800 text-lg font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your Training Data is Secured!
            </h3>
            <p className="text-green-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your GPX files are now encrypted and protected using advanced blockchain technology. 
              Only you control who can access your training data.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4 text-green-600">
              <span className="text-sm">🔐 Encrypted</span>
              <span className="text-sm">•</span>
              <span className="text-sm">🌐 Decentralized</span>
              <span className="text-sm">•</span> 
              <span className="text-sm">🔒 Private</span>
            </div>
          </div>

          <GrantAccess
            authorizedApp={PRIVATE_COACH_APP_ADDRESS}
            dataProtectorCore={dataProtectorCore}
            protectedDataAddress={protectedData.address}
            onAccessGranted={handleAccessGranted}
          />
        </div>
      </div>
    );
  }

  // Main GPX upload interface
  return (
    <div className="min-h-screen w-full max-w-[375px] mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="w-10 h-10 relative">
          <Image
            src="/logo-bleu.png"
            alt="Barbarian Trainer Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-[#0F0641] text-base font-bold leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Upload GPX Data
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#0F0641] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">✓</span>
            </div>
            <div className="w-8 h-8 bg-[#0F0641] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">✓</span>
            </div>
            <div className="w-8 h-8 bg-[#0F0641] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">✓</span>
            </div>
            <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
              <span className="text-[#0F0641] font-semibold text-sm">4</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h2 className="text-[#0F0641] text-2xl font-bold leading-[150%] mb-4 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Upload your training data
          </h2>
          <p className="text-[#0F0641] text-base leading-relaxed mb-8 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Upload 2 GPX files to securely protect and analyze your performance
          </p>

          {/* GPX File 1 Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0F0641] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              GPX File 1
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver === 'gpx1' 
                  ? 'border-[#E0F466] bg-[#E0F466]/10' 
                  : 'border-gray-300 bg-white'
              }`}
              onDrop={(e) => handleDrop(e, 'gpx1')}
              onDragOver={(e) => handleDragOver(e, 'gpx1')}
              onDragLeave={handleDragLeave}
            >
              {gpx1File ? (
                <div className="space-y-2">
                  <div className="text-green-600 text-2xl">📁</div>
                  <p className="text-[#0F0641] font-semibold text-sm">{gpx1File.name}</p>
                  <p className="text-gray-500 text-xs">{(gpx1File.size / 1024).toFixed(1)} KB</p>
                  <Button
                    onClick={() => removeFile('gpx1')}
                    variant="outline"
                    size="sm"
                    className="text-[#0F0641] border-[#0F0641] text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-gray-400 text-2xl">📤</div>
                  <p className="text-[#0F0641] font-semibold text-sm">Drop GPX file here</p>
                  <Input
                    type="file"
                    accept=".gpx"
                    onChange={(e) => handleFileSelect(e, 'gpx1')}
                    className="hidden"
                    id="gpx1-upload"
                  />
                  <label htmlFor="gpx1-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer border-[#0F0641] text-[#0F0641] hover:bg-[#0F0641] hover:text-white text-xs"
                      asChild
                    >
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* GPX File 2 Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#0F0641] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              GPX File 2
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver === 'gpx2' 
                  ? 'border-[#E0F466] bg-[#E0F466]/10' 
                  : 'border-gray-300 bg-white'
              }`}
              onDrop={(e) => handleDrop(e, 'gpx2')}
              onDragOver={(e) => handleDragOver(e, 'gpx2')}
              onDragLeave={handleDragLeave}
            >
              {gpx2File ? (
                <div className="space-y-2">
                  <div className="text-green-600 text-2xl">📁</div>
                  <p className="text-[#0F0641] font-semibold text-sm">{gpx2File.name}</p>
                  <p className="text-gray-500 text-xs">{(gpx2File.size / 1024).toFixed(1)} KB</p>
                  <Button
                    onClick={() => removeFile('gpx2')}
                    variant="outline"
                    size="sm"
                    className="text-[#0F0641] border-[#0F0641] text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-gray-400 text-2xl">📤</div>
                  <p className="text-[#0F0641] font-semibold text-sm">Drop GPX file here</p>
                  <Input
                    type="file"
                    accept=".gpx"
                    onChange={(e) => handleFileSelect(e, 'gpx2')}
                    className="hidden"
                    id="gpx2-upload"
                  />
                  <label htmlFor="gpx2-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer border-[#0F0641] text-[#0F0641] hover:bg-[#0F0641] hover:text-white text-xs"
                      asChild
                    >
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          {gpx1File && gpx2File && (
            <Button
              onClick={handleProtectData}
              disabled={isProtecting}
              className="w-full h-12 bg-[#E0F466] hover:bg-[#d1e855] text-[#0F0641] font-semibold rounded-lg disabled:opacity-50"
            >
              {isProtecting ? 'Protecting Data...' : 'Protect & Continue'}
            </Button>
          )}
          
          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full h-12 border-[#0F0641] text-[#0F0641] font-semibold rounded-lg hover:bg-[#0F0641] hover:text-white"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
