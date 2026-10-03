# Contents for calculator.py
# File loaded from Sahil707-pop/AI-risk-manager


def calculate_average(numbers):
    if len(numbers) == 0:
        return 0.0
    total = sum(numbers)
    return total / len(numbers)


# Example usage:
# numbers = []
# print(calculate_average(numbers))  # Safely returns 0.0 instead of raising ZeroDivisionError