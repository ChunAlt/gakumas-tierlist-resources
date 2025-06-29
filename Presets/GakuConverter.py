import csv
import pandas as pd

# Path to the CSV file
file_path = 'Presets.csv'

# Initialize an empty list to hold the dictionary-like strings
output_list = []

output = pd.read_csv(file_path)
output2 = output.to_dict(orient='records')
output3 = 'const presets = [' + ', '.join(
    ['{' + ', '.join([f'"{key}": "{value}"' if isinstance(value, str) else f'"{key}": {value}' for key, value in row.items()]) + '}' for row in output2]
) + '];\n\nexport default presets;'
print(output3)

with open('presets.js', 'w') as file:
    file.write(output3)
print("done")