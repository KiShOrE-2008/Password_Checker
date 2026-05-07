import zxcvbn from 'zxcvbn';

export const analyzePassword = (password) => {
  if (!password) return { entropy: 0, score: 0, crackTimes: null, warnings: [], suggestions: [], sequence: [] };
  
  const result = zxcvbn(password);
  
  // Custom crack times based on realistic hardware
  const gpsOnlineLimited = 100;
  const gpsOnlineUnlimited = 100000;
  const gpsOfflinePbkdf2 = 100000;
  const gpsOfflineGpu = 100000000000;

  const calculateCrackTime = (guesses, gps) => {
    let seconds = guesses / gps;
    if (seconds < 1) return "Instant";

    const units = [
        ["universe lifespans", 60 * 60 * 24 * 365 * 13.8e9],
        ["billion years", 60 * 60 * 24 * 365 * 1e9],
        ["million years", 60 * 60 * 24 * 365 * 1e6],
        ["thousand years", 60 * 60 * 24 * 365 * 1e3],
        ["centuries", 60 * 60 * 24 * 365 * 100],
        ["years", 60 * 60 * 24 * 365],
        ["months", 60 * 60 * 24 * 30],
        ["days", 60 * 60 * 24],
        ["hours", 60 * 60],
        ["minutes", 60],
        ["seconds", 1]
    ];
    
    for (let [unit, value] of units) {
        if (seconds >= value) {
            let amount = seconds / value;
            if (amount >= 1000) {
                amount = Math.round(amount).toLocaleString();
            } else if (amount >= 100) {
                amount = Math.round(amount);
            } else {
                amount = amount.toFixed(1).replace('.0', '');
            }
            return `${amount} ${unit}`;
        }
    }
    return "Instant";
  };

  const entropy = Math.max(0, Math.log2(result.guesses));

  return {
    entropy: entropy.toFixed(1),
    score: result.score, // 0-4
    crackTimes: {
      onlineLimited: calculateCrackTime(result.guesses, gpsOnlineLimited),
      onlineUnlimited: calculateCrackTime(result.guesses, gpsOnlineUnlimited),
      offlinePbkdf2: calculateCrackTime(result.guesses, gpsOfflinePbkdf2),
      offlineGpu: calculateCrackTime(result.guesses, gpsOfflineGpu),
    },
    warnings: result.feedback.warning ? [result.feedback.warning] : [],
    suggestions: result.feedback.suggestions || [],
    sequence: result.sequence // useful for visualization
  };
};

export const checkPwned = async (password) => {
  if (!password) return null;
  
  // SHA-1 hash for HIBP
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!res.ok) throw new Error("API error");
    const text = await res.text();
    
    const lines = text.split('\n');
    for (let line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return parseInt(count.trim(), 10);
      }
    }
    return 0;
  } catch (err) {
    console.error("HIBP check failed", err);
    return null;
  }
};

export const generateSecurePassword = (options) => {
  const { length, upper, lower, numbers, symbols, excludeAmbiguous } = options;
  
  let charset = "";
  if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (excludeAmbiguous) {
    charset = charset.replace(/[Il1O0]/g, '');
  }

  if (charset.length === 0) return "";

  let password = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
};

export const demoPbkdf2Hash = async (password) => {
    if (!password) return null;
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const start = performance.now();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );
    const hashBuffer = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        256
    );
    const end = performance.now();
    
    return {
        salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
        hash: Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''),
        timeMs: (end - start).toFixed(1)
    };
};
