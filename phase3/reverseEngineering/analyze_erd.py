import json

def analyze_erd(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    nodes = data.get('data', {}).get('nodes', [])
    
    entities = {}
    attributes = {}
    relationships = {}
    
    for node in nodes:
        node_id = node['id']
        node_type = node.get('type')
        if node_type == 'Entity':
            entities[node_id] = node['data']['label']
        elif node_type == 'Attribute':
            parent_id = node.get('parentId')
            attributes.setdefault(parent_id, []).append((node_id, node['data']['label']))
        elif node_type == 'Relationship':
            relationships[node_id] = {
                'label': node['data']['label'],
                'source': node['data'].get('sourceEntityDetails', {}).get('id'),
                'target': node['data'].get('targetEntityDetails', {}).get('id')
            }
            
    print(f"--- Analysis for {file_path} ---")
    print("Entities:")
    for eid, elabel in entities.items():
        attrs = [a[1] for a in attributes.get(eid, [])]
        print(f"  {elabel} ({eid}): {', '.join(attrs)}")
    print("Relationships:")
    for rid, rel in relationships.items():
        src_label = entities.get(rel['source'], f"Unknown({rel['source']})")
        tgt_label = entities.get(rel['target'], f"Unknown({rel['target']})")
        print(f"  {rel['label']}: {src_label} -> {tgt_label}")

analyze_erd(r"c:\RentCarsProj\RentCars\phase2\RentCars (1) (1).json")
analyze_erd(r"c:\RentCarsProj\RentCars\phase2\OrderingRestaurants_100 (1) (1).json")
