import { IExecDataProtectorCore } from '@iexec/dataprotector';

export interface DualGPXProtectionOptions {
  name?: string;
  verbose?: boolean;
}

export interface DualGPXProtectionResult {
  address: string;
  name: string;
  owner: string;
  schema: any;
  transactionHash?: string;
  creationTimestamp: number;
  multiaddr?: string;
  gpx1Info: {
    fileName: string;
    size: number;
  };
  gpx2Info: {
    fileName: string;
    size: number;
  };
}

/**
 * Frontend version of the protectDualGPXFiles function
 * Protect two GPX files in a single dataset with keys "gpx1" and "gpx2"
 */
export async function protectDualGPXFiles(
  dataProtectorCore: IExecDataProtectorCore,
  gpx1File: File,
  gpx2File: File,
  options: DualGPXProtectionOptions = {}
): Promise<DualGPXProtectionResult> {
  
  // Helper function to read file as ArrayBuffer
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as ArrayBuffer;
        if (!result) {
          reject(new Error('Failed to read file content'));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Validate files
  if (!gpx1File.name.toLowerCase().endsWith('.gpx')) {
    throw new Error('GPX1 file must have .gpx extension');
  }
  if (!gpx2File.name.toLowerCase().endsWith('.gpx')) {
    throw new Error('GPX2 file must have .gpx extension');
  }

  const gpx1FileName = gpx1File.name.replace('.gpx', '');
  const gpx2FileName = gpx2File.name.replace('.gpx', '');
  const protectionName = options.name || `DualGPX-${gpx1FileName}-${gpx2FileName}-${Date.now()}`;

  if (options.verbose) {
    console.log(`📍 Protecting dual GPX files:`);
    console.log(`   GPX1: ${gpx1File.name} (${(gpx1File.size / 1024).toFixed(2)} KB)`);
    console.log(`   GPX2: ${gpx2File.name} (${(gpx2File.size / 1024).toFixed(2)} KB)`);
    console.log(`📝 Protection name: ${protectionName}`);
  }

  // Read both files
  const gpx1Buffer = await readFileAsArrayBuffer(gpx1File);
  const gpx2Buffer = await readFileAsArrayBuffer(gpx2File);

  if (options.verbose) {
    console.log(`📦 Creating dataset with two GPX files...`);
  }

  // Protect the data with both files in a single dataset
  const protectedData = await dataProtectorCore.protectData({
    name: protectionName,
    data: { 
      gpx1: gpx1Buffer,
      gpx2: gpx2Buffer
    },
    onStatusUpdate: ({ title, isDone }) => {
      if (options.verbose) {
        console.log(`${title} ${isDone ? '✅' : '⏳'}`);
      }
    },
  });

  return {
    ...protectedData,
    transactionHash: undefined, // This might not be available in the frontend version
    creationTimestamp: Date.now(),
    gpx1Info: {
      fileName: gpx1FileName,
      size: gpx1File.size
    },
    gpx2Info: {
      fileName: gpx2FileName,
      size: gpx2File.size
    }
  };
}

/**
 * Protect a single GPX file
 */
export async function protectGPXFile(
  dataProtectorCore: IExecDataProtectorCore,
  gpxFile: File,
  options: { name?: string; verbose?: boolean } = {}
) {
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as ArrayBuffer;
        if (!result) {
          reject(new Error('Failed to read file content'));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  if (!gpxFile.name.toLowerCase().endsWith('.gpx')) {
    throw new Error('File must have .gpx extension');
  }

  const fileName = gpxFile.name.replace('.gpx', '');
  const protectionName = options.name || `GPX-${fileName}-${Date.now()}`;

  const gpxBuffer = await readFileAsArrayBuffer(gpxFile);

  const protectedData = await dataProtectorCore.protectData({
    name: protectionName,
    data: {
      gpx: gpxBuffer
    },
    onStatusUpdate: ({ title, isDone }) => {
      if (options.verbose) {
        console.log(`${title} ${isDone ? '✅' : '⏳'}`);
      }
    },
  });

  return {
    ...protectedData,
    creationTimestamp: Date.now(),
    gpxInfo: {
      fileName,
      size: gpxFile.size
    }
  };
}
