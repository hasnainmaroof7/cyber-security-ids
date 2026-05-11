class TrafficSimulator {
    constructor() {
        this.ips = [
            "192.168.1.1",
            "192.168.1.2",
            "192.168.1.3",
            "192.168.1.4",
            "192.168.1.5"
        ];
    }

    // Generate random traffic
    generateTraffic() {
        let srcIndex = Math.floor(Math.random() * this.ips.length);
        let destIndex = Math.floor(Math.random() * this.ips.length);

        // avoid same node connection
        while (destIndex === srcIndex) {
            destIndex = Math.floor(Math.random() * this.ips.length);
        }

        return {
            src: this.ips[srcIndex],
            dest: this.ips[destIndex]
        };
    }

    // Generate multiple packets
    generateBatch(count) {
        let data = [];

        for (let i = 0; i < count; i++) {
            data.push(this.generateTraffic());
        }

        return data;
    }
}

module.exports = TrafficSimulator;