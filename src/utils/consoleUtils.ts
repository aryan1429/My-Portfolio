// Development utility for managing console output
export const setupConsoleFiltering = () => {
  if (typeof window === 'undefined' || import.meta.env.PROD) {
    return; // Only run in development browser environment
  }

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };

  // Patterns to filter out (platform noise, extensions, etc.)
  const noisePatterns = [
    // Browser extensions
    'enable_copy.js',
    'feature_collector.js',
    'content.js',
    'E.C.P is not enabled',
    'using deprecated parameters',
    
    // Platform/hosting related
    'Content Security Policy directive',
    'blob:https://vercel.com',
    'script-src-elem',
    'Deprecated API for given entry type',
    'preloaded using link preload but not used',
    'Check out our code here: https://vercel.com/oss',
    'Have a great day!',
    
    // Other common noise
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://',
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded'
  ];

  const shouldFilter = (message) => {
    if (typeof message !== 'string') {
      message = String(message);
    }
    return noisePatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  const createFilteredMethod = (methodName) => {
    return (...args) => {
      const message = args.join(' ');
      if (!shouldFilter(message)) {
        originalConsole[methodName].apply(console, args);
      }
    };
  };

  // Override console methods
  console.log = createFilteredMethod('log');
  console.warn = createFilteredMethod('warn');
  console.error = createFilteredMethod('error');
  console.info = createFilteredMethod('info');

  // Add a way to restore original console if needed
  (window as any).__restoreConsole = () => {
    Object.assign(console, originalConsole);
  };

  // Add a way to see what's being filtered
  (window as any).__showFilteredLogs = () => {
    console.log('🔇 Console filtering is active. Filtered patterns:', noisePatterns);
    console.log('💡 Use __restoreConsole() to see all logs');
  };
};

// For debugging: check if your own logs are working
export const testConsole = () => {
  console.log('✅ Your portfolio console.log is working');
  console.warn('⚠️ Your portfolio console.warn is working');
  console.error('❌ Your portfolio console.error is working');
};
