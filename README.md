🔐 Password Strength Analyzer (Python)

A security-focused Python CLI tool that evaluates password strength using realistic entropy modeling, human-pattern detection, and real-world crack-time estimation — not misleading length checks.

Built for cybersecurity learning, secure coding practice, and defensive security demonstrations.

🚀 Why This Project?

Most password checkers give false confidence.
This tool takes a realistic attacker mindset, combining entropy math with common human password weaknesses.

If you're learning cybersecurity, this project shows you actually understand password security — not just regex rules.

✨ Features
🔒 Secure Input & Hashing

Hidden password input using pwinput

Optional password reveal

PBKDF2-HMAC-SHA256

128-bit random salt

100,000 iterations

Timing-safe hash comparison

📊 Realistic Strength Analysis

True entropy calculation (log₂)

Character pool estimation

Unique character ratio penalty

Pattern-based entropy reduction

🧠 Human Pattern Detection

Detects common weaknesses:

Character repetition (aaaa, 1111)

Sequential patterns (abc, 123)

Keyboard patterns (qwerty, asdf)

📈 Clear Strength Visualization

ASCII strength bar

Color-coded output

Strength levels:

Very Weak

Weak

Moderate

Strong

Very Strong

⏱️ Real-World Crack Time Estimation

Crack time is estimated across multiple attacker models, not a single misleading number:

Attack Scenario	Guess Rate
Online (rate-limited)	100 guesses/sec
Online (no limits)	1,000 guesses/sec
Offline (PBKDF2 hashes)	10,000 guesses/sec
Offline GPU (worst case)	1,000,000,000 guesses/sec

⚠️ Crack times are theoretical estimates, not guarantees.

🧠 How Strength Is Measured

Passwords are evaluated using:

Length (minimum recommended: 8)

Uppercase characters

Lowercase characters

Numbers

Special characters

Entropy calculation (log₂)

Unique character ratio

Pattern penalties (repetition, sequences, keyboard layouts)

📊 Strength Classification
Entropy (bits)	Rating
< 30	Very Weak 🔴
30 – 44	Weak 🔴
45 – 59	Moderate 🟡
60 – 79	Strong 🔵
≥ 80	Very Strong 🟢
🛠 Tech Stack

Language: Python 3.x

Libraries:

math

pwinput

colorama

hashlib

hmac

os

time

📦 Installation
git clone https://github.com/KiShOrE-2008/Password_Checker.git
cd Password_Checker
pip install pwinput colorama

▶️ Usage
python password_checker.py

Program Flow

Enter password (hidden input)

Optional password reveal

Secure hashing (PBKDF2)

Strength analysis

Entropy, strength bar, crack times, and warnings displayed

Improvement suggestions shown (if needed)

📸 Sample Output
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

Crack times are theoretical

No dictionary or breached-password checks

CLI only (no GUI)

Not intended for production authentication systems

🚀 Future Improvements

Dictionary & leetspeak detection

Breached-password database checks

Markov-chain entropy modeling

GUI / Web interface

Modular Python package

Configurable password policy engine

📄 License

MIT License — free for learning, academic, and personal projects.

👤 Author

Kishore K V
B.Tech – Information Technology
Cybersecurity & Python Enthusiast