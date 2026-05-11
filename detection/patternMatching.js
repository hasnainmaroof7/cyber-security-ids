class PatternMatching {
    constructor() {
        this.patterns = [
            "DROP TABLE",
            "SELECT *",
            "../",
            "UNION SELECT",
            "OR 1=1"
        ];
    }

    // Check if payload is malicious
    checkPayload(payload) {
        for (let pattern of this.patterns) {
            if (payload.includes(pattern)) {
                return {
                    status: "ALERT",
                    pattern: pattern
                };
            }
        }

        return {
            status: "SAFE"
        };
    }
}

module.exports = PatternMatching;