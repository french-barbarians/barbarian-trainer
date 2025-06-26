"use client";

import { ProtectedData } from "@iexec/dataprotector";
import { CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProtectedDataDisplayProps {
  protectedData: ProtectedData & {
    transactionHash?: string;
    creationTimestamp?: number;
    gpx1Info?: {
      fileName: string;
      size: number;
    };
    gpx2Info?: {
      fileName: string;
      size: number;
    };
  };
}

export default function ProtectedDataDisplay({
  protectedData,
}: ProtectedDataDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center space-x-2 text-green-800">
        <CheckCircle className="h-6 w-6" />
        <h3 className="text-xl font-bold">
          Protected Data Created Successfully!
        </h3>
      </div>

      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 border-b pb-1">
              Dataset Information
            </h4>

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Name
                </label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded flex-1 truncate">
                    {protectedData.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(protectedData.name, "name")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {copiedField === "name" && (
                  <p className="text-xs text-green-600">Copied!</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Address
                </label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded flex-1 truncate">
                    {protectedData.address}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(protectedData.address, "address")
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {copiedField === "address" && (
                  <p className="text-xs text-green-600">Copied!</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Owner
                </label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded flex-1 truncate">
                    {protectedData.owner}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(protectedData.owner, "owner")
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {copiedField === "owner" && (
                  <p className="text-xs text-green-600">Copied!</p>
                )}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 border-b pb-1">
              Technical Details
            </h4>

            <div className="space-y-2">
              {protectedData.multiaddr && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Multiaddr
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded flex-1 truncate">
                      {protectedData.multiaddr}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(protectedData.multiaddr!, "multiaddr")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {copiedField === "multiaddr" && (
                    <p className="text-xs text-green-600">Copied!</p>
                  )}
                </div>
              )}

              {protectedData.transactionHash && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Transaction Hash
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded flex-1 truncate">
                      {protectedData.transactionHash}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          protectedData.transactionHash!,
                          "transaction"
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {copiedField === "transaction" && (
                    <p className="text-xs text-green-600">Copied!</p>
                  )}
                </div>
              )}

              {protectedData.creationTimestamp && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Created
                  </label>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    {formatTimestamp(protectedData.creationTimestamp)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schema Information */}
        {protectedData.schema && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 border-b pb-1">
              Schema
            </h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                {JSON.stringify(protectedData.schema, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* GPX Files Information */}
        {(protectedData.gpx1Info || protectedData.gpx2Info) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 border-b pb-1">
              Protected GPX Files
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {protectedData.gpx1Info && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-900">
                    {'GPX File 1 (key: "gpx1")'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Name: {protectedData.gpx1Info.fileName}
                  </p>
                  <p className="text-sm text-blue-700">
                    Size: {formatFileSize(protectedData.gpx1Info.size)}
                  </p>
                </div>
              )}
              {protectedData.gpx2Info && (
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-medium text-purple-900">
                    {'GPX File 2 (key: "gpx2")'}
                  </p>
                  <p className="text-sm text-purple-700">
                    Name: {protectedData.gpx2Info.fileName}
                  </p>
                  <p className="text-sm text-purple-700">
                    Size: {formatFileSize(protectedData.gpx2Info.size)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(JSON.stringify(protectedData, null, 2), "full")
            }
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Full JSON
          </Button>
          {copiedField === "full" && (
            <span className="text-xs text-green-600 self-center">
              Copied full data!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
