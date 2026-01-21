import math
import pwinput
import time
import hashlib
import os
from colorama import Fore, Style, init
init(autoreset=True)

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
def check_entropy(password):
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

    entropy = len(password) * math.log2(pool)
    unique_ratio = len(set(password)) / len(password)
    entropy *= unique_ratio

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

    entropy = check_entropy(password)
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

    print()
    return score, entropy

# ------------------ HASHING (SECURE) ------------------
def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(16)  # 128-bit salt
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
print()

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