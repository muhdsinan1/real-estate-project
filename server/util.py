import json
import pickle
import numpy as np
import os

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bhk, bath):
    try:
        # Match case-insensitively with lower()
        loc_index = -1
        for i, col in enumerate(__data_columns):
            if col.lower() == location.lower():
                loc_index = i
                break
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

def get_location_names():
    return __locations

def load_saved_artifacts():
    print("Loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    # Paths are relative to the current file (util.py)
    base_dir = os.path.dirname(os.path.abspath(__file__))  # e.g., /home/user/BHP/server
    artifacts_path = os.path.join(base_dir, 'artifacts')

    columns_file_path = os.path.join(artifacts_path, 'columns.json')
    model_file_path = os.path.join(artifacts_path, 'banglore_home_prices_model.pickle')

    with open(columns_file_path, 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # Assuming: [sqft, bath, bhk, <locations>]

    with open(model_file_path, 'rb') as f:
        __model = pickle.load(f)

    print("Loading saved artifacts...done")

# For testing the utility independently
if __name__ == "__main__":
    load_saved_artifacts()
    print(get_location_names())
    print(get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    print(get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    print(get_estimated_price('Kalhalli', 1000, 2, 2))
    print(get_estimated_price('Ejipura', 1000, 2, 2))
