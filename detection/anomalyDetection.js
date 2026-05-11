class AnomalyDetection {
    constructor() {}

    getSeverity(connections) {
        if (connections <= 2) return "LOW";
        if (connections <= 4) return "MEDIUM";
        return "HIGH";
    }

    detect(graph) {
        let alerts = [];

        for (let node in graph.adjList) {
            let connections = graph.adjList[node].length;
            let severity = this.getSeverity(connections);

            if (connections > 2) {
                alerts.push({
                    node: node,
                    type: "ANOMALY DETECTED",
                    connections: connections,
                    severity: severity
                });
            }
        }

        return alerts;
    }
}

module.exports = AnomalyDetection;