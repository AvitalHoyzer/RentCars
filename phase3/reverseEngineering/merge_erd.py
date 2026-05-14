import json
import uuid

def merge_erds(erd1_path, erd2_path, output_path):
    with open(erd1_path, 'r', encoding='utf-8') as f:
        erd1 = json.load(f)
    with open(erd2_path, 'r', encoding='utf-8') as f:
        erd2 = json.load(f)

    # 1. Gather ERD1 data
    erd1_nodes = erd1.get('data', {}).get('nodes', [])
    erd1_edges = erd1.get('data', {}).get('edges', [])
    
    erd1_entities = {}
    erd1_attributes_by_entity = {} # {entity_id: [label1, label2]}
    erd1_relationships = [] # list of (source, target)
    
    for node in erd1_nodes:
        if node.get('type') == 'Entity':
            erd1_entities[node['data']['label']] = node['id']
        elif node.get('type') == 'Attribute':
            pid = node.get('parentId')
            if pid:
                erd1_attributes_by_entity.setdefault(pid, []).append(node['data']['label'].lower())
        elif node.get('type') == 'Relationship':
            src = node['data'].get('sourceEntityDetails', {}).get('id')
            tgt = node['data'].get('targetEntityDetails', {}).get('id')
            if src and tgt:
                erd1_relationships.append((src, tgt))
                erd1_relationships.append((tgt, src)) # undirected for duplicate checking
                
    # 2. Identify common entities and build map
    # User instructions: 'Feedback' is equivalent to 'Review'. Others match by name.
    # We map ERD2 Entity ID -> ERD1 Entity ID
    id_map = {}
    erd2_nodes = erd2.get('data', {}).get('nodes', [])
    erd2_edges = erd2.get('data', {}).get('edges', [])
    
    erd2_entities = {n['id']: n['data']['label'] for n in erd2_nodes if n.get('type') == 'Entity'}
    
    for erd2_id, label in erd2_entities.items():
        if label in erd1_entities:
            id_map[erd2_id] = erd1_entities[label]
        elif label == 'Feedback' and 'Review' in erd1_entities:
            id_map[erd2_id] = erd1_entities['Review']
            
    print(f"ID Map for common entities: {id_map}")

    # 3. Build merged lists
    merged_nodes = list(erd1_nodes)
    merged_edges = list(erd1_edges)
    
    # We need a way to filter duplicate relationships.
    
    for node in erd2_nodes:
        node_type = node.get('type')
        
        if node_type == 'Entity':
            if node['id'] not in id_map:
                # New entity, add it
                # We might want to offset its position so it doesn't overlap perfectly
                if 'position' in node:
                    node['position']['x'] += 100
                    node['position']['y'] += 100
                merged_nodes.append(node)
                
        elif node_type == 'Attribute':
            pid = node.get('parentId')
            mapped_pid = id_map.get(pid, pid)
            
            # If it's a common entity, check if attribute already exists
            if mapped_pid in erd1_attributes_by_entity:
                if node['data']['label'].lower() in erd1_attributes_by_entity[mapped_pid]:
                    # Skip duplicate attribute
                    continue
                    
            # Add attribute, updating parentId
            new_node = dict(node)
            if pid in id_map:
                new_node['parentId'] = mapped_pid
            if 'position' in new_node:
                new_node['position']['x'] += 100
                new_node['position']['y'] += 100
            merged_nodes.append(new_node)
            
        elif node_type == 'Relationship':
            src = node['data'].get('sourceEntityDetails', {}).get('id')
            tgt = node['data'].get('targetEntityDetails', {}).get('id')
            mapped_src = id_map.get(src, src)
            mapped_tgt = id_map.get(tgt, tgt)
            
            # Check if relationship already exists between these entities
            if (mapped_src, mapped_tgt) in erd1_relationships:
                # Skip to avoid duplicate relationships between the same entities
                continue
                
            new_node = dict(node)
            if src in id_map:
                new_node['data']['sourceEntityDetails']['id'] = mapped_src
            if tgt in id_map:
                new_node['data']['targetEntityDetails']['id'] = mapped_tgt
            
            if 'position' in new_node:
                new_node['position']['x'] += 100
                new_node['position']['y'] += 100
            merged_nodes.append(new_node)
            erd1_relationships.append((mapped_src, mapped_tgt))
            erd1_relationships.append((mapped_tgt, mapped_src))
            
    # Process edges
    # We only want to keep edges for nodes that we actually added/kept.
    # And we must update source/target if they were mapped.
    
    # Let's collect all valid node IDs in merged_nodes
    valid_node_ids = {n['id'] for n in merged_nodes}
    
    for edge in erd2_edges:
        src = edge.get('source')
        tgt = edge.get('target')
        
        # If the edge links an attribute, target is attribute, source is entity
        # If the edge links a relationship, source is relationship, target is entity
        # Or vice versa.
        # We just need to remap src and tgt if they are in id_map
        mapped_src = id_map.get(src, src)
        mapped_tgt = id_map.get(tgt, tgt)
        
        # Only add edge if BOTH mapped source and mapped target are in merged_nodes
        if mapped_src in valid_node_ids and mapped_tgt in valid_node_ids:
            new_edge = dict(edge)
            new_edge['source'] = mapped_src
            new_edge['target'] = mapped_tgt
            merged_edges.append(new_edge)

    # Output merged ERD
    erd_out = dict(erd1)
    erd_out['data']['nodes'] = merged_nodes
    erd_out['data']['edges'] = merged_edges
    erd_out['name'] = "Merged_RentCars_Restaurants"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(erd_out, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully wrote {output_path}")

merge_erds(
    r"c:\RentCarsProj\RentCars\phase2\RentCars (1) (1).json", 
    r"c:\RentCarsProj\RentCars\phase2\OrderingRestaurants_100 (1) (1).json", 
    r"c:\RentCarsProj\RentCars\phase2\Merged_ERD.json"
)
