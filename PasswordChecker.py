import math
import pwinput
import platform
import time
from colorama import Fore, Style, init
init(autoreset=True)


def beep(freq, dur):
    if platform.system() == "Windows":
        import winsound
        winsound.Beep(freq, dur)

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
    print("Estimated Crack Time:", crack_time,'\n')

    if entropy >= 80:
        print(Fore.GREEN + "Very Strong")
        beep(1200, 100)
        beep(1200, 100)
    elif entropy >= 60:
        print(Fore.CYAN + "Strong")
        beep(1000, 200)
    elif entropy >= 40:
        print(Fore.YELLOW + "Moderate")
        beep(700, 300)
    else:
        print(Fore.RED + "Weak")
        beep(400, 600)

    if suggestions:
        print("\nTo improve your password:")
        for s in suggestions:
            print("-", s)
        print()
    else:
        print("\nYour password meets all strength criteria!\n")

    return score, entropy
    print()


in_pass = pwinput.pwinput("Enter the password: ")
print()

ch = input("Press Y to show the typed password or press enter to continue: ")
if ch.lower() == 'y':
    print("\nTyped Password:", in_pass)

print("\nPassword Analysis:")

start_time = time.time()

check_password(in_pass)

end_time = time.time()

print(f"Time taken for analysis: {round(end_time - start_time, 2)} seconds\n")
print()