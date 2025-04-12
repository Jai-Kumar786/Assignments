from flask import Flask, jsonify, send_file
from flask_cors import CORS
import random
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# Store history
dice_1_rolls = []
dice_2_rolls = []
sums = []
roll_numbers = []

@app.route('/roll-dice', methods=['GET'])
def roll_dice():
    dice_1 = random.randint(1, 6)
    dice_2 = random.randint(1, 6)
    dice_sum = dice_1 + dice_2

    # Track rolls
    roll_index = len(dice_1_rolls) + 1
    roll_numbers.append(roll_index)
    dice_1_rolls.append(dice_1)
    dice_2_rolls.append(dice_2)
    sums.append(dice_sum)

    print(f"🎲 Dice 1: {dice_1}, Dice 2: {dice_2}, Sum: {dice_sum}")

    # Generate and save the combined plot
    generate_plot()

    return jsonify({'dice_1': dice_1, 'dice_2': dice_2, 'sum': dice_sum})

@app.route('/plot', methods=['GET'])
def get_plot():
    return send_file('../sum_plot.png', mimetype='image/png')

def generate_plot():
    plt.figure(figsize=(10, 5))

    # Scatter plots for individual dice
    plt.scatter(roll_numbers, dice_1_rolls, color='blue', label='Dice 1', alpha=0.7)
    plt.scatter(roll_numbers, dice_2_rolls, color='green', label='Dice 2', alpha=0.7)

    # Line plot for sum
    plt.plot(roll_numbers, sums, color='red', label='Sum', linewidth=2, marker='o')

    # Chart styling
    plt.title('Dice Rolls and Sum Over Time')
    plt.xlabel('Roll Number')
    plt.ylabel('Value')
    plt.xticks(roll_numbers)
    plt.yticks(range(2, 13))  # Sum can be 2 to 12
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    plt.savefig('sum_plot.png')
    plt.close()

if __name__ == '__main__':
    app.run(debug=True)
