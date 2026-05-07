document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const toggleBtn = document.getElementById('toggle-visibility');
    const toggleIcon = toggleBtn.querySelector('i');
    
    const strengthBarFill = document.getElementById('strength-bar-fill');
    const strengthText = document.getElementById('strength-text');
    const entropyText = document.getElementById('entropy-text');
    
    const timeOnlineLimited = document.getElementById('time-online-limited');
    const timeOnlineUnlimited = document.getElementById('time-online-unlimited');
    const timeOfflinePbkdf2 = document.getElementById('time-offline-pbkdf2');
    const timeOfflineGpu = document.getElementById('time-offline-gpu');
    
    const analysisList = document.getElementById('analysis-list');
    const saltOutput = document.getElementById('salt-output');
    const hashOutput = document.getElementById('hash-output');

    // Toggle Visibility
    toggleBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });

    // Helper Functions
    function hasRepetition(password) {
        return new Set(password).size <= password.length * 0.6;
    }

    function hasSequence(password, length = 3) {
        const sequences = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789"];
        for (let seq of sequences) {
            for (let i = 0; i <= seq.length - length; i++) {
                let part = seq.substring(i, i + length);
                let partRev = part.split('').reverse().join('');
                if (password.includes(part) || password.includes(partRev)) return true;
            }
        }
        return false;
    }

    function hasKeyboardPattern(password) {
        const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];
        const pwd = password.toLowerCase();
        for (let row of keyboardRows) {
            for (let i = 0; i <= row.length - 3; i++) {
                let pattern = row.substring(i, i + 3);
                let patternRev = pattern.split('').reverse().join('');
                if (pwd.includes(pattern) || pwd.includes(patternRev)) return true;
            }
        }
        return false;
    }

    function realisticEntropy(password) {
        if (!password) return 0;
        
        let pool = 0;
        if (/[a-z]/.test(password)) pool += 26;
        if (/[A-Z]/.test(password)) pool += 26;
        if (/\d/.test(password)) pool += 10;
        if (/[!@#$&*~?]/.test(password)) pool += 7;

        if (pool === 0) return 0;

        let entropy = password.length * Math.log2(pool);

        const uniqueRatio = new Set(password).size / password.length;
        entropy *= uniqueRatio;

        let penalty = 1.0;
        if (hasRepetition(password)) penalty *= 0.6;
        if (hasSequence(password)) penalty *= 0.7;
        if (hasKeyboardPattern(password)) penalty *= 0.7;

        entropy = Math.max(entropy * penalty, 0);
        return Math.round(entropy * 100) / 100;
    }

    function estimateCrackTime(entropy, gps) {
        if (entropy <= 0) return "Instant";
        let seconds = Math.pow(2, entropy) / gps;
        
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
                return amount + " " + unit;
            }
        }
        return "Instant";
    }

    // Web Crypto Hash
    let hashTimeout;
    async function updateHash(password) {
        if (!password) {
            saltOutput.textContent = '--';
            hashOutput.textContent = '--';
            return;
        }

        try {
            const enc = new TextEncoder();
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            
            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                enc.encode(password),
                { name: "PBKDF2" },
                false,
                ["deriveBits"]
            );
            
            // Reduced iterations for browser responsiveness, real python uses 100,000
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
            
            saltOutput.textContent = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
            hashOutput.textContent = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            hashOutput.textContent = 'Error computing hash';
        }
    }

    // Main Analysis Logic
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        
        if (!password) {
            strengthBarFill.style.width = '0%';
            strengthBarFill.style.backgroundColor = 'var(--text-muted)';
            strengthBarFill.style.boxShadow = 'none';
            strengthText.textContent = 'Awaiting Input...';
            strengthText.style.color = 'var(--text-main)';
            entropyText.textContent = '0 bits';
            
            timeOnlineLimited.textContent = '--';
            timeOnlineUnlimited.textContent = '--';
            timeOfflinePbkdf2.textContent = '--';
            timeOfflineGpu.textContent = '--';
            
            analysisList.innerHTML = '<li class="neutral">Enter a password to begin analysis.</li>';
            saltOutput.textContent = '--';
            hashOutput.textContent = '--';
            return;
        }

        const entropy = realisticEntropy(password);
        entropyText.textContent = `${entropy} bits`;

        // Strength Bar
        let percent = Math.min((entropy / 100) * 100, 100);
        strengthBarFill.style.width = `${percent}%`;

        let color, label;
        if (entropy < 30) {
            color = 'var(--color-very-weak)';
            label = 'Very Weak';
        } else if (entropy < 45) {
            color = 'var(--color-weak)';
            label = 'Weak';
        } else if (entropy < 60) {
            color = 'var(--color-moderate)';
            label = 'Moderate';
        } else if (entropy < 80) {
            color = 'var(--color-strong)';
            label = 'Strong';
        } else {
            color = 'var(--color-very-strong)';
            label = 'Very Strong';
        }

        strengthBarFill.style.backgroundColor = color;
        strengthBarFill.style.boxShadow = `0 0 10px ${color}`;
        strengthText.textContent = label;
        strengthText.style.color = color;

        // Crack Times (using modern realistic speeds)
        timeOnlineLimited.textContent = estimateCrackTime(entropy, 100);
        timeOnlineUnlimited.textContent = estimateCrackTime(entropy, 100000); // 100k requests/sec
        timeOfflinePbkdf2.textContent = estimateCrackTime(entropy, 100000); // 100k hashes/sec (modern CPU)
        timeOfflineGpu.textContent = estimateCrackTime(entropy, 100000000000); // 100 Billion hashes/sec (Modern GPU cluster)

        // Pattern Analysis
        let analysisHtml = '';
        let hasPattern = false;

        if (password.length < 8) {
            analysisHtml += `<li class="bad"><i class="fa-solid fa-triangle-exclamation"></i> Increase length to at least 8 characters.</li>`;
            hasPattern = true;
        }
        if (hasRepetition(password)) {
            analysisHtml += `<li class="bad"><i class="fa-solid fa-clone"></i> Excessive character repetition detected.</li>`;
            hasPattern = true;
        }
        if (hasSequence(password)) {
            analysisHtml += `<li class="bad"><i class="fa-solid fa-arrow-down-1-9"></i> Sequential pattern detected.</li>`;
            hasPattern = true;
        }
        if (hasKeyboardPattern(password)) {
            analysisHtml += `<li class="bad"><i class="fa-solid fa-keyboard"></i> Keyboard pattern detected.</li>`;
            hasPattern = true;
        }
        
        if (!hasPattern) {
            analysisHtml = `<li class="good"><i class="fa-solid fa-check-circle"></i> No obvious patterns detected. Good job!</li>`;
        }

        analysisList.innerHTML = analysisHtml;

        // Debounce Hash Calculation
        clearTimeout(hashTimeout);
        hashOutput.textContent = 'Computing...';
        saltOutput.textContent = 'Computing...';
        hashTimeout = setTimeout(() => {
            updateHash(password);
        }, 300);
    });
});
