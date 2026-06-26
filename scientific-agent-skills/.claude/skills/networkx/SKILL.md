---
name: networkx
description: Build and analyze networks and graphs for biological, social, and computational data. Covers network construction, centrality, community detection, pathway mapping, and visualization.
argument-hint: "<data file or edge list> [--type protein-interaction|gene-regulatory|metabolic|social|citation]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /networkx

Construct and analyze networks from biological, social, or computational data. Find key nodes, detect communities, identify paths, and visualize network topology.

## When to invoke

- "network analysis"
- "build a protein interaction network"
- "find hub genes"
- "community detection"
- "analyze this gene regulatory network"
- "citation network"

## Installation

```bash
pip install networkx matplotlib scipy
```

## Core patterns

### Build a network

```python
import networkx as nx
import pandas as pd

# From edge list (DataFrame with source, target columns)
def build_network(edges_df, source="source", target="target", weight=None):
    if weight:
        G = nx.from_pandas_edgelist(edges_df, source=source, target=target,
                                     edge_attr=weight)
    else:
        G = nx.from_pandas_edgelist(edges_df, source=source, target=target)
    return G

# From adjacency matrix
import numpy as np
adj = np.array([[0, 1, 0], [1, 0, 1], [0, 1, 0]])
G = nx.from_numpy_array(adj)

# Manual construction
G = nx.Graph()
G.add_nodes_from(["TP53", "MDM2", "CDKN1A", "CDK2", "CCND1"])
G.add_edges_from([("TP53", "MDM2"), ("TP53", "CDKN1A"), ("CDKN1A", "CDK2")])
G.add_edge("TP53", "MDM2", weight=0.95, interaction="inhibition")

# Directed network
G = nx.DiGraph()
G.add_edge("A", "B", weight=1.0)

# Multigraph (multiple edges between nodes)
G = nx.MultiGraph()
```

### Network statistics

```python
def network_summary(G):
    print(f"Nodes: {G.number_of_nodes()}")
    print(f"Edges: {G.number_of_edges()}")
    print(f"Density: {nx.density(G):.4f}")
    print(f"Connected: {nx.is_connected(G)}")
    
    if nx.is_connected(G):
        print(f"Diameter: {nx.diameter(G)}")
        print(f"Average path length: {nx.average_shortest_path_length(G):.3f}")
    
    print(f"Average clustering coefficient: {nx.average_clustering(G):.4f}")
    
    degrees = dict(G.degree())
    print(f"Average degree: {sum(degrees.values())/len(degrees):.2f}")
    print(f"Max degree: {max(degrees.values())} ({max(degrees, key=degrees.get)})")
    
    return {
        "n_nodes": G.number_of_nodes(),
        "n_edges": G.number_of_edges(),
        "density": nx.density(G),
        "avg_clustering": nx.average_clustering(G),
    }
```

### Centrality measures (identify key nodes)

```python
def compute_centralities(G):
    # Degree centrality — how many connections
    degree_cent = nx.degree_centrality(G)
    
    # Betweenness centrality — how often on shortest paths (bridges)
    betweenness = nx.betweenness_centrality(G, normalized=True)
    
    # Closeness centrality — average distance to all other nodes
    closeness = nx.closeness_centrality(G)
    
    # Eigenvector centrality — connected to well-connected nodes
    try:
        eigenvector = nx.eigenvector_centrality(G, max_iter=1000)
    except nx.PowerIterationFailedConvergence:
        eigenvector = {n: 0 for n in G.nodes()}
    
    # PageRank (directed networks)
    if G.is_directed():
        pagerank = nx.pagerank(G)
    else:
        pagerank = nx.pagerank(G.to_directed())
    
    # Combine into DataFrame
    df = pd.DataFrame({
        "degree": degree_cent,
        "betweenness": betweenness,
        "closeness": closeness,
        "eigenvector": eigenvector,
        "pagerank": pagerank,
    })
    return df.sort_values("betweenness", ascending=False)

# Top hub nodes
centralities = compute_centralities(G)
print("Top 10 hub nodes by betweenness centrality:")
print(centralities.head(10))
```

### Community detection

```python
from networkx.algorithms import community

# Louvain method (best for large networks)
from community import best_partition  # pip install python-louvain
partition = best_partition(G)
n_communities = max(partition.values()) + 1
print(f"Detected {n_communities} communities")

# Greedy modularity optimization (built-in)
communities = list(community.greedy_modularity_communities(G))
print(f"Found {len(communities)} communities")
print(f"Modularity: {community.modularity(G, communities):.4f}")

# Girvan-Newman (hierarchical, slow for large graphs)
gen = community.girvan_newman(G)
communities_4 = tuple(sorted(c) for c in next(gen))  # 2 communities
communities_8 = tuple(sorted(c) for c in next(gen))  # 4 communities

# Assign community labels to nodes
for i, comm in enumerate(communities):
    for node in comm:
        G.nodes[node]["community"] = i
```

### Shortest paths

```python
# Single pair
path = nx.shortest_path(G, source="TP53", target="CDK2")
print(f"Path: {' → '.join(path)}")
print(f"Length: {len(path) - 1} hops")

# All shortest paths between two nodes
all_paths = list(nx.all_shortest_paths(G, "TP53", "CDK2"))
print(f"Number of shortest paths: {len(all_paths)}")

# All-pairs shortest path (small networks only)
lengths = dict(nx.all_pairs_shortest_path_length(G))

# Neighborhood
neighbors_1hop = list(G.neighbors("TP53"))
neighbors_2hop = list(nx.ego_graph(G, "TP53", radius=2).nodes())
```

### Biological network analysis

```python
def protein_interaction_analysis(ppi_df, gene_of_interest=None):
    """Analyze a protein-protein interaction network."""
    G = build_network(ppi_df, source="protein_A", target="protein_B", 
                      weight="combined_score")
    
    # Remove low-confidence edges
    edges_to_remove = [(u, v) for u, v, d in G.edges(data=True) 
                       if d.get("combined_score", 0) < 400]
    G.remove_edges_from(edges_to_remove)
    
    # Keep only largest connected component
    G_main = G.subgraph(max(nx.connected_components(G), key=len)).copy()
    
    # Identify hub proteins
    centralities = compute_centralities(G_main)
    hubs = centralities[centralities["degree"] > centralities["degree"].quantile(0.95)]
    
    # Local neighborhood of a gene of interest
    if gene_of_interest:
        neighborhood = nx.ego_graph(G_main, gene_of_interest, radius=1)
        first_shell = list(G_main.neighbors(gene_of_interest))
        print(f"{gene_of_interest} interacts with {len(first_shell)} proteins")
    
    return G_main, hubs
```

### Visualization

```python
import matplotlib.pyplot as plt

def draw_network(G, node_colors=None, node_sizes=None, labels=None,
                 layout="spring", title="", out="network.png"):
    fig, ax = plt.subplots(figsize=(12, 10))
    
    # Choose layout
    if layout == "spring":
        pos = nx.spring_layout(G, seed=42, k=1/G.number_of_nodes()**0.5)
    elif layout == "kamada_kawai":
        pos = nx.kamada_kawai_layout(G)
    elif layout == "circular":
        pos = nx.circular_layout(G)
    elif layout == "hierarchical":
        pos = nx.multipartite_layout(G, subset_key="layer")
    
    # Node properties
    if node_colors is None:
        node_colors = "steelblue"
    if node_sizes is None:
        # Size by degree
        node_sizes = [G.degree(n) * 100 for n in G.nodes()]
    
    # Draw
    nx.draw_networkx_nodes(G, pos, node_color=node_colors, 
                           node_size=node_sizes, alpha=0.9, ax=ax)
    nx.draw_networkx_edges(G, pos, alpha=0.3, width=0.5, ax=ax)
    
    if labels or G.number_of_nodes() <= 50:
        nx.draw_networkx_labels(G, pos, font_size=8, ax=ax,
                                labels=labels)
    
    ax.set_title(title, fontsize=14)
    ax.axis("off")
    plt.tight_layout()
    fig.savefig(out, dpi=150, bbox_inches="tight")
    plt.close()
```

## STRING database integration

```python
import requests

def get_string_network(genes, species=9606, score=400):
    """Fetch protein interactions from STRING database."""
    url = "https://string-db.org/api/json/network"
    params = {
        "identifiers": "%0d".join(genes),  # newline-separated
        "species": species,
        "required_score": score,
        "network_type": "functional",
    }
    r = requests.post(url, data=params)
    interactions = r.json()
    
    edges = [(i["preferredName_A"], i["preferredName_B"], i["score"])
             for i in interactions]
    
    G = nx.Graph()
    for a, b, score in edges:
        G.add_edge(a, b, weight=score / 1000)
    
    return G

# Example: build TP53 interaction network
tp53_network = get_string_network(["TP53"], species=9606, score=700)
tp53_neighborhood = nx.ego_graph(tp53_network, "TP53", radius=1)
```
