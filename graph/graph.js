class Graph {
    constructor() {
        this.adjList = {};
    }

    // Add a node
    addNode(node) {
        if (!this.adjList[node]) {
            this.adjList[node] = [];
        }
    }

    // Add an edge
    addEdge(src, dest) {
    // ensure both nodes exist
    this.addNode(src);
    this.addNode(dest);

    // prevent duplicate edges (important for realistic graph)
    if (!this.adjList[src].includes(dest)) {
        this.adjList[src].push(dest);
    }
}

    // Print graph
    printGraph() {
        for (let node in this.adjList) {
            console.log(node + " -> " + this.adjList[node].join(", "));
        }
    }

    // BFS Traversal
    bfs(start) {
        let visited = {};
        let queue = [];

        visited[start] = true;
        queue.push(start);

        while (queue.length > 0) {
            let node = queue.shift();
            console.log("Visited:", node);

            for (let neighbor of this.adjList[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }
    }

    // DFS Traversal
    dfs(start, visited = {}) {
        if (!visited[start]) {
            console.log("Visited:", start);
            visited[start] = true;

            for (let neighbor of this.adjList[start]) {
                this.dfs(neighbor, visited);
            }
        }
    }
}

module.exports = Graph;