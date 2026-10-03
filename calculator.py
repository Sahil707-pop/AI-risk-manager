# Contents for calculator.py
# File loaded from Sahil707-pop/AI-risk-manager

def calculate_average(numbers):
    if not numbers:
        return 0
    total = sum(numbers)
    return total / len(numbers)


if __name__ == "__main__":
    # Example usage:
    print(calculate_average([1, 2, 3]))  # Output: 2.0
    print(calculate_average([]))         # Output: 0 (no longer raises ZeroDivisionError)