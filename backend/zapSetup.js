import { exec } from 'child_process';

export const ensureZapRunning = async () => {
  return new Promise((resolve, reject) => {
    // Check if ZAP is running by trying to connect to its API
    const checkZap = exec('curl -s http://localhost:8080/JSON/core/view/version/');
    
    checkZap.on('close', (code) => {
      if (code === 0) {
        console.log("ZAP is already running");
        resolve(true);
      } else {
        console.log("ZAP is not running, please start ZAP with API enabled");
        console.log("Typical command: zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.disablekey=true");
        reject(new Error("ZAP is not running"));
      }
    });
  });
};