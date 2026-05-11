const Graph = require("./graph/graph");
const TrafficSimulator = require("./data/trafficSimulator");
const PatternMatching = require("./detection/patternMatching");
const AnomalyDetection = require("./detection/anomalyDetection");

const networkGraph = new Graph();
const simulator = new TrafficSimulator();
const detector = new PatternMatching();
const anomaly = new AnomalyDetection(2); // threshold = 2

// Generate traffic
let trafficData = simulator.generateBatch(10);

console.log("Generated Traffic:\n", trafficData);

// Build graph + check patterns
trafficData.forEach(packet => {

    networkGraph.addEdge(packet.src, packet.dest);

    // Fake payload check (still simple)
    let result = detector.checkPayload("NORMAL REQUEST");

    if (result.status === "ALERT") {
        console.log("🚨 ATTACK DETECTED:", result.pattern);
    }
});

// Anomaly detection
const alerts = anomaly.detect(networkGraph);

console.log("\n🚨 SECURITY REPORT");
console.log("====================");

if (alerts.length === 0) {
    console.log("✅ No anomalies detected");
} else {
    alerts.forEach(alert => {
        console.log("\n⚠️ ALERT");
        console.log("Node: " + alert.node);
        console.log("Connections: " + alert.connections);
        console.log("Severity: " + alert.severity);
        console.log("Type: " + alert.type);
    });
}

// Print final graph
console.log("\nGraph:\n");
networkGraph.printGraph();