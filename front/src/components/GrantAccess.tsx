"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IExecDataProtectorCore } from "@iexec/dataprotector";
import { Key, Users, CheckCircle, AlertCircle } from "lucide-react";

interface GrantAccessProps {
  dataProtectorCore: IExecDataProtectorCore | null;
  protectedDataAddress: string;
  onAccessGranted: (grantedAccess: any) => void;
}

export default function GrantAccess({ dataProtectorCore, protectedDataAddress, onAccessGranted }: GrantAccessProps) {
  const [authorizedApp, setAuthorizedApp] = useState("");
  const [authorizedUser, setAuthorizedUser] = useState("0x0000000000000000000000000000000000000000"); // Default to zero address (all users)
  const [isGranting, setIsGranting] = useState(false);
  const [grantStatus, setGrantStatus] = useState<string>("");
  const [grantedAccess, setGrantedAccess] = useState<any>(null);

  const handleGrantAccess = async () => {
    if (!dataProtectorCore || !authorizedApp) {
      alert('Please ensure wallet is connected and iApp address is provided');
      return;
    }

    setIsGranting(true);
    setGrantStatus('Granting access...');

    try {
      console.log('Granting access with:', {
        protectedData: protectedDataAddress,
        authorizedApp,
        authorizedUser,
      });

      const result = await dataProtectorCore.grantAccess({
        protectedData: protectedDataAddress,
        authorizedApp: authorizedApp,
        authorizedUser: authorizedUser,
      });

      console.log('Access granted successfully:', result);
      setGrantedAccess(result);
      onAccessGranted(result);
      setGrantStatus('Access granted successfully! ✅');
      
    } catch (error) {
      console.error('Error granting access:', error);
      setGrantStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGranting(false);
    }
  };

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const canGrantAccess = dataProtectorCore && 
                        protectedDataAddress && 
                        authorizedApp && 
                        isValidAddress(authorizedApp) && 
                        isValidAddress(authorizedUser) && 
                        !isGranting;

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Key className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Grant Access to Your Protected Data</h2>
        </div>
        <p className="text-gray-600">Authorize your iApp to access the protected GPX data</p>
      </div>

      {/* Protected Data Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Protected Data</h3>
        <p className="text-sm font-mono text-blue-700 break-all">{protectedDataAddress}</p>
      </div>

      {/* Authorization Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="authorized-app" className="block text-sm font-medium text-gray-700">
            iApp Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="authorized-app"
            type="text"
            placeholder="0x... (your iApp address)"
            value={authorizedApp}
            onChange={(e) => setAuthorizedApp(e.target.value)}
            disabled={isGranting}
            className={`font-mono ${authorizedApp && !isValidAddress(authorizedApp) ? 'border-red-300' : ''}`}
          />
          {authorizedApp && !isValidAddress(authorizedApp) && (
            <p className="text-sm text-red-600">Please enter a valid Ethereum address</p>
          )}
          <p className="text-xs text-gray-500">
            The address of your deployed iApp that will process the protected data
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="authorized-user" className="block text-sm font-medium text-gray-700">
            Authorized User
          </label>
          <Input
            id="authorized-user"
            type="text"
            placeholder="0x0000... (zero address for all users)"
            value={authorizedUser}
            onChange={(e) => setAuthorizedUser(e.target.value)}
            disabled={isGranting}
            className={`font-mono ${authorizedUser && !isValidAddress(authorizedUser) ? 'border-red-300' : ''}`}
          />
          {authorizedUser && !isValidAddress(authorizedUser) && (
            <p className="text-sm text-red-600">Please enter a valid Ethereum address</p>
          )}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Users className="h-3 w-3" />
            <span>Use 0x0000000000000000000000000000000000000000 to grant access to all users</span>
          </div>
        </div>
      </div>

      {/* Grant Status */}
      {grantStatus && (
        <div className={`p-3 rounded-lg border ${
          grantStatus.includes('Error') 
            ? 'bg-red-50 border-red-200' 
            : grantStatus.includes('✅')
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-2">
            {grantStatus.includes('Error') ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : grantStatus.includes('✅') ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            <p className={`text-sm ${
              grantStatus.includes('Error') 
                ? 'text-red-800' 
                : grantStatus.includes('✅')
                ? 'text-green-800'
                : 'text-blue-800'
            }`}>
              {grantStatus}
            </p>
          </div>
        </div>
      )}

      {/* Grant Access Button */}
      <div className="text-center">
        <Button
          onClick={handleGrantAccess}
          disabled={!canGrantAccess}
          className="px-8"
        >
          {isGranting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Granting Access...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Grant Access to iApp
            </>
          )}
        </Button>
      </div>

      {!canGrantAccess && !isGranting && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {!dataProtectorCore ? 'Please connect your wallet first' : 
             !authorizedApp ? 'Please enter the iApp address' :
             !isValidAddress(authorizedApp) ? 'Please enter a valid iApp address' :
             !isValidAddress(authorizedUser) ? 'Please enter a valid user address' : ''}
          </p>
        </div>
      )}

      {/* Granted Access Information */}
      {grantedAccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Access Granted Successfully!</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-green-800">Transaction Hash:</span>
              <p className="font-mono text-green-700 break-all">{grantedAccess.txHash || 'N/A'}</p>
            </div>
            {grantedAccess.permissions && (
              <div>
                <span className="font-medium text-green-800">Permissions:</span>
                <pre className="font-mono text-green-700 text-xs bg-green-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(grantedAccess.permissions, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {grantedAccess && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🏃 Ready to Run Your iApp!</h3>
          <p className="text-sm text-yellow-800 mb-2">
            You can now run your iApp with the protected data:
          </p>
          <div className="bg-yellow-100 p-3 rounded font-mono text-xs overflow-auto">
            <code>iapp run {authorizedApp} --protectedData {protectedDataAddress}</code>
          </div>
        </div>
      )}
    </div>
  );
}
