# 🔐 Password Strength Analyzer (Python)

A **security-aware Python CLI tool** that evaluates password strength using **realistic entropy calculation**, **pattern detection**, and **real-world crack-time models**.  
The tool also demonstrates **secure password hashing** using PBKDF2 with salt.

Designed for **cybersecurity learning**, **secure coding practice**, and **defensive security demonstrations**.

---

## ✨ Key Features

### 🔒 Secure Password Input
- Masked password entry using `pwinput`
- Optional password reveal (user-controlled)

### 📊 Realistic Password Strength Analysis
- Entropy-based strength calculation (not naive length checks)
- Character pool estimation
- Unique character ratio penalty
- Pattern-based entropy reduction

### 🧠 Pattern Detection
Detects common human weaknesses:
- Excessive character repetition
- Sequential patterns (`abc`, `123`, etc.)
- Keyboard patterns (`qwerty`, `asdf`, etc.)

### 📈 Visual Strength Indicator
- ASCII **password strength bar**
- Color-coded output
- Clear strength labels:
  - Very Weak
  - Weak
  - Moderate
  - Strong
  - Very Strong

### ⏱️ Real-World Crack Time Estimation
Instead of a single misleading value, crack time is estimated across **multiple attacker models**:

| Attack Scenario | Guess Rate |
|-----------------|-----------|
| Online (rate-limited) | 100 guesses/sec |
| Online (no limits) | 1,000 guesses/sec |
| Offline (PBKDF2 hashes) | 10,000 guesses/sec |
| Offline GPU (worst case) | 1,000,000,000 guesses/sec |

> ⚠️ Crack times are **theoretical estimates**, not guarantees.

### 🔐 Secure Password Hashing
- PBKDF2-HMAC-SHA256
- 128-bit random salt
- 100,000 iterations
- Timing-attack-safe hash comparison

### ⏱ Execution Metrics
- Measures total password analysis time
- Clean CLI output for easy readability

---

## 🧠 How Password Strength Is Measured

The analyzer evaluates passwords using the following factors:

- Length (minimum recommended: 8 characters)
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
- Entropy calculation using `log₂`
- Unique character ratio
- Pattern penalties (repetition, sequences, keyboard patterns)

---

## 📊 Strength Classification

| Entropy (bits) | Strength |
|---------------|----------|
| < 30 | Very Weak 🔴 |
| 30 – 44 | Weak 🔴 |
| 45 – 59 | Moderate 🟡 |
| 60 – 79 | Strong 🔵 |
| ≥ 80 | Very Strong 🟢 |

---

## 🛠 Tech Stack

- **Language:** Python 3.x  
- **Libraries Used:**
  - `math`
  - `pwinput`
  - `colorama`
  - `hashlib`
  - `hmac`
  - `os`
  - `time`

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/KiShOrE-2008/Password_Checker.git
cd Password_Checker
Install dependencies:

bash
Copy code
pip install pwinput colorama
▶️ Usage
Run the program:

bash
Copy code
python password_checker.py
Program Flow:
Enter password (hidden input)

Optionally reveal the password

Password is hashed securely

Password strength is analyzed

Entropy, strength bar, crack times, and pattern warnings are displayed

Suggestions are shown if improvements are needed

📸 Sample Output
text
Copy code
Entropy: 58.7 bits

Password Strength:
[██████████████████------------] 58% (Moderate)

Estimated Crack Times:
- Online (rate-limited): 1.9 days
- Online (no limits): 4.6 hours
- Offline (PBKDF2): 23 seconds
- Offline GPU (worst case): Instant

Pattern Analysis:
- Sequential pattern detected (123)

Overall Strength: Moderate
⚠️ Limitations
Crack times are theoretical estimates

No dictionary or breached-password checking

No GUI (CLI only)

Not intended for direct production authentication systems

🚀 Future Enhancements
📚 Dictionary & leetspeak detection

🔐 Breached-password checking

🧠 Markov-based entropy estimation

🖥 GUI / Web interface

📦 Modular Python package

🔐 Configurable password policy engine

📄 License
This project is licensed under the MIT License.
Free to use for learning, academic, and personal projects.

🙌 Author
Kishore K V
B.Tech – Information Technology
Cybersecurity & Python Enthusiast

🏁 Final Note
This project focuses on realistic security modeling, not false confidence.
It is suitable for:

Cybersecurity learning

Mini-projects

GitHub portfolios

Interview discussions