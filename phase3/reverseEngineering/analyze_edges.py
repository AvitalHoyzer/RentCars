import json

def analyze_erd(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    nodes = data.get('data', {}).get('nodes', [])
    edges = data.get('data', {}).get('edges', [])
    
    print(f"--- Analysis for {file_path} ---")
    print(f"Edges present: {len(edges)}")
    if edges:
        for edge in edges[:3]:
            print(f"  Edge: {edge}")

analyze_erd(r"c:\RentCarsProj\RentCars\phase2\RentCars (1) (1).json")
analyze_erd(r"c:\RentCarsProj\RentCars\phase2\OrderingRestaurants_100 (1) (1).json")
