# 🔐 Password Strength Analyzer (Python)

A Python-based Password Strength Analyzer that evaluates password security using entropy calculation, character diversity, and estimated brute-force crack time.
It provides color-coded feedback, security suggestions, and audible alerts based on password strength.

## 📌 Features

- 🔒 **Masked Password Input** using `pwinput`
- 📊 **Entropy-Based Strength Evaluation**
- 🧮 **Realistic Crack Time Estimation**
- 🎯 **Strength Score** (0–5)
- 🎨 **Color-coded Output** with `colorama`
- 🔔 **Sound Alerts** (Windows only)
- ⏱ **Execution Time Measurement**
- 🧠 **Improvement Suggestions**

## 🧠 How Password Strength Is Measured

The analyzer evaluates the password based on:
- Length (minimum 8 characters)
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
- Entropy calculation using log₂
- Character uniqueness ratio

### 📊 Strength Classification

| Entropy (bits) | Strength     |
|----------------|--------------|
| < 40           | Weak 🔴      |
| 40 – 59        | Moderate 🟡  |
| 60 – 79        | Strong 🔵    |
| ≥ 80           | Very Strong 🟢|

## 🛠️ Tech Stack

- **Language:** Python 3
- **Libraries Used:**
  - `math`
  - `pwinput`
  - `colorama`
  - `platform`
  - `winsound` (Windows only)
  - `time`

## 📦 Installation

1. Clone the repository (replace `<your-github-username>` with the actual GitHub username or organization name):
   ```bash
   git clone https://github.com/<your-github-username>/PasswordChecker.git
   cd PasswordChecker
   ```

2. Install dependencies:
   ```bash
   pip install pwinput colorama
   ```

> ⚠️ **Note:** Sound alerts work only on Windows due to `winsound`.

## ▶️ Usage

1. Run the program:
   ```bash
   python password_checker.py
   ```

2. **Flow:**
   - Enter password (hidden input)
   - Optionally reveal entered password
   - Password is analyzed
   - Strength, entropy & crack time are displayed
   - Suggestions are shown if needed

## 📸 Sample Output

```text
Score: 4 / 5
Entropy: 72.45 bits
Estimated Crack Time: 1.34 years

Strong

To improve your password:
- Add a special character

Time taken for analysis: 0.02 seconds
```

## ⚠️ Limitations

- Crack time is theoretical, not real-world guaranteed
- No dictionary or leaked password checks
- No GUI (CLI only)
- Sound alerts are OS-limited

## 🚀 Future Enhancements

- 🔐 Breach detection (Have I Been Pwned API)
- 📚 Dictionary & pattern analysis
- 🖥 GUI / Web version
- 🔊 Cross-platform sound support
- 📁 Modular code structure

## 📄 License

This project is licensed under the MIT License.
Free to use for learning, academic, and personal projects.

## 🙌 Author

**Kishore K V**
- B.Tech – Information Technology
- Cybersecurity & Python Enthusiast