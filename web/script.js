const socket = io();

let attackCount = 0;
let riskScore = 100;
let nodeRiskMap = {};

// ---------------- GRAPH ----------------
const nodes = new vis.DataSet([]);
const edges = new vis.DataSet([]);

const network = new vis.Network(
    document.getElementById("network"),
    { nodes, edges },
    {
        nodes: {
            shape: "dot",
            size: 18,
            font: {
                color: "white"
            },
            borderWidth: 2
        },

        edges: {
            color: "#00ffcc",
            smooth: true
        },

        physics: {
            enabled: true
        }
    }
);

// ---------------- CHART ----------------
const ctx = document.getElementById("attackChart");

const attackChart = new Chart(ctx, {
    type: "line",

    data: {
        labels: [],
        datasets: [{
            label: "Attack Count",
            data: [],
            borderWidth: 2
        }]
    },

    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// ---------------- HELPERS ----------------
function addNode(id) {

    if (!nodes.get(id)) {

        nodes.add({
            id,
            label: id,

            color: {
                background: "#3498db",
                border: "#00ffcc"
            }
        });
    }
}

function addEdge(from, to) {

    edges.add({
        from,
        to
    });
}

// ---------------- TRAFFIC ----------------
socket.on("traffic", (packet) => {

    addNode(packet.src);
    addNode(packet.dest);

    addEdge(packet.src, packet.dest);

});

// ---------------- ALERTS ----------------
socket.on("alert", (alert) => {

    const node = alert.node;

    // ATTACK COUNT
    attackCount++;

    // RISK SCORE
    riskScore -= 5;

    if (riskScore < 0) {
        riskScore = 0;
    }

    // NODE RISK
    if (!nodeRiskMap[node]) {
        nodeRiskMap[node] = 20;
    } else {
        nodeRiskMap[node] += 15;
    }

    let nodeRisk = nodeRiskMap[node];

    // UPDATE NODE
    nodes.update({
        id: node,

        color: {
            background: nodeRisk > 70 ? "darkred" : "red",
            border: "white"
        },

        label: `${node} ⚠`
    });

    // UPDATE STATS
    document.getElementById("attackCount").innerText = attackCount;
    document.getElementById("riskScore").innerText = riskScore;

    // THREAT LEVEL
    let level = "LOW";

    if (riskScore < 70) level = "MEDIUM";
    if (riskScore < 40) level = "HIGH";

    document.getElementById("threatLevel").innerText = level;

    // ALERT PANEL
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert">
            🚨 ${node}<br>
            Severity: ${alert.severity}<br>
            Risk: ${nodeRisk}
        </div>
    ` + alerts.innerHTML;

    // TIMELINE
    const timeline = document.getElementById("timeline");

    timeline.innerHTML = `
        <div class="timeline-item">
            ⏱ ${new Date().toLocaleTimeString()} → ${node}
        </div>
    ` + timeline.innerHTML;

    // ---------------- CHART UPDATE ----------------
    attackChart.data.labels.push(
        new Date().toLocaleTimeString()
    );

    attackChart.data.datasets[0].data.push(
        attackCount
    );

    // Keep only latest 10 points
    if (attackChart.data.labels.length > 10) {

        attackChart.data.labels.shift();

        attackChart.data.datasets[0].data.shift();
    }

    attackChart.update();

});