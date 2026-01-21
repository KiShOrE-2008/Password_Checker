import math
import pwinput
import time
import hashlib
import os
from colorama import Fore, Style, init
init(autoreset=True)


def has_repetition(password):
    return len(set(password)) <= len(password) * 0.6

def has_sequence(password, length=3):
    sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "0123456789"
    ]

    for seq in sequences:
        for i in range(len(seq) - length + 1):
            if seq[i:i+length] in password:
                return True
            if seq[i:i+length][::-1] in password:
                return True
    return False

def has_keyboard_pattern(password):
    keyboard_rows = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm",
        "1234567890"
    ]

    pwd = password.lower()
    for row in keyboard_rows:
        for i in range(len(row) - 2):
            pattern = row[i:i+3]
            if pattern in pwd or pattern[::-1] in pwd:
                return True
    return False



# ------------------ CRACK TIME ESTIMATION ------------------
def estimate_crack_time(entropy, guesses_per_second=1_000_000_000):
    if entropy <= 0:
        return "Instant"

    seconds = (2 ** entropy) / guesses_per_second
    units = [
        ("years", 60 * 60 * 24 * 365),
        ("days", 60 * 60 * 24),
        ("hours", 60 * 60),
        ("minutes", 60),
        ("seconds", 1),
    ]

    for unit, value in units:
        if seconds >= value:
            return f"{seconds / value:.2f} {unit}"

    return "Instant"

# ------------------ ENTROPY CALCULATION ------------------
def realistic_entropy(password):
    if not password:
        return 0
    
    pool = 0
    if any(c.islower() for c in password):
        pool += 26
    if any(c.isupper() for c in password):
        pool += 26
    if any(c.isdigit() for c in password):
        pool += 10
    if any(c in "!@#$&*~?" for c in password):
        pool += 7

    if pool == 0:
        return 0

    # Base entropy
    entropy = len(password) * math.log2(pool)

    # Unique character penalty
    unique_ratio = len(set(password)) / len(password)
    entropy *= unique_ratio

    # Pattern penalties
    penalty = 1.0

    if has_repetition(password):
        penalty *= 0.6

    if has_sequence(password):
        penalty *= 0.7

    if has_keyboard_pattern(password):
        penalty *= 0.7

    # Hard floor to avoid negative nonsense
    entropy = max(entropy * penalty, 0)

    return round(entropy, 2)


# ------------------ PASSWORD STRENGTH CHECK ------------------
def check_password(password):
    suggestions = []
    special_chars = "!@#$&*~?"
    score = 0

    if not password:
        print(Fore.RED + "Password cannot be empty!")
        return None, None

    if len(password) >= 8:
        score += 1
    else:
        suggestions.append("Increase the length to at least 8 characters")

    if any(c.isupper() for c in password):
        score += 1
    else:
        suggestions.append("Add an uppercase letter")

    if any(c.islower() for c in password):
        score += 1
    else:
        suggestions.append("Add a lowercase letter")

    if any(c.isdigit() for c in password):
        score += 1
    else:
        suggestions.append("Add a number")

    if any(c in special_chars for c in password):
        score += 1
    else:
        suggestions.append("Add a special character")

    entropy = realistic_entropy(password)
    crack_time = estimate_crack_time(entropy)

    print("\nScore:", score, "/5")
    print("Entropy:", entropy, "bits")
    print("Estimated Crack Time:", crack_time, "\n")

    if entropy >= 80:
        print(Fore.GREEN + "Very Strong")
    elif entropy >= 60:
        print(Fore.CYAN + "Strong")
    elif entropy >= 40:
        print(Fore.YELLOW + "Moderate")
    else:
        print(Fore.RED + "Weak")

    if suggestions:
        print("\nTo improve your password:")
        for s in suggestions:
            print("-", s)
    else:
        print("\nYour password meets all strength criteria!")
    print("\nPattern Analysis:")
    if has_repetition(password):
        print(Fore.RED + "- Excessive character repetition detected")

    if has_sequence(password):
        print(Fore.RED + "- Sequential pattern detected (abc, 123, etc.)")

    if has_keyboard_pattern(password):
        print(Fore.RED + "- Keyboard pattern detected (qwerty, asdf, etc.)")

    if not (has_repetition(password) or has_sequence(password) or has_keyboard_pattern(password)):
        print(Fore.GREEN + "- No obvious patterns detected")
    print()
    return score, entropy

# ------------------ HASHING (SECURE) ------------------
def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(16) 
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100_000)
    return salt, pwd_hash


def verify_password(password, salt, stored_hash):
    _, new_hash = hash_password(password, salt)
    return new_hash == stored_hash

# ------------------ HASH STORAGE & VERIFICATION ------------------
def hash_and_verify():
    print("Hashing password securely...")
    salt, password_hash = hash_password(in_pass)
    time.sleep(2)
    print("Verifying password using hash...")
    time.sleep(2)
    if verify_password(in_pass, salt, password_hash):
        print(Fore.GREEN + "Password verification successful (hash matched)")
    else:
        print(Fore.RED + "Password verification failed (hash mismatch)")
    print("\nSalt (hex):", salt.hex())
    print("Password Hash (hex):", password_hash.hex())
    print(" ")

# ------------------ MAIN PROGRAM ------------------
in_pass = pwinput.pwinput("Enter the password: ")
print(" ")

ch = input("Press Y to show the typed password or press Enter to continue: ")
if ch.lower() == 'y':
    print("\nTyped Password:", in_pass, "\n")
hash_and_verify()
print("\nAnalyzing password strength...")
time.sleep(1)
start_time = time.time()

check_password(in_pass)

end_time = time.time()
print(f"Time taken for analysis: {round(end_time - start_time, 2)} seconds\n")