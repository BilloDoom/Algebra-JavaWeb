import React, { useEffect, useState } from "react";
import { getAuthLogs } from "../../api/api";

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);
    const [filters, setFilters] = useState({ username: "", eventType: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch logs on mount
    useEffect(() => {
        setLoading(true);
        getAuthLogs()
            .then((data) => {
                const sorted = data.sort(
                    (a, b) => new Date(b.eventTime) - new Date(a.eventTime)
                );
                setLogs(sorted);
                setFilteredLogs(sorted);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch logs");
                setLoading(false);
            });
    }, []);


    // Filter logs when filters or logs change
    useEffect(() => {
        let filtered = logs;

        if (filters.username.trim()) {
            filtered = filtered.filter((log) =>
                log.username.toLowerCase().includes(filters.username.toLowerCase())
            );
        }

        if (filters.eventType.trim()) {
            filtered = filtered.filter((log) =>
                log.eventType.toLowerCase().includes(filters.eventType.toLowerCase())
            );
        }

        setFilteredLogs(filtered);
    }, [filters, logs]);

    // Handle filter input change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Handle display count change
    const handleDisplayCountChange = (e) => {
        setDisplayCount(Number(e.target.value));
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin Logs</h1>

            {error && <div style={{ color: "red" }}>{error}</div>}
            {loading && <div>Loading logs...</div>}

            <div style={{ marginBottom: 20 }}>
                <label>
                    Display count:&nbsp;
                    <select value={displayCount} onChange={handleDisplayCountChange}>
                        {[5, 10, 20, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ marginLeft: 20 }}>
                    Filter by username:&nbsp;
                    <input
                        type="text"
                        name="username"
                        value={filters.username}
                        onChange={handleFilterChange}
                        placeholder="Username"
                    />
                </label>

                <label style={{ marginLeft: 20 }}>
                    Filter by event type:&nbsp;
                    <input
                        type="text"
                        name="eventType"
                        value={filters.eventType}
                        onChange={handleFilterChange}
                        placeholder="Event type"
                    />
                </label>
            </div>

            <table border={1} cellPadding={6} cellSpacing={0} width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Event Type</th>
                        <th>Message</th>
                        <th>IP Address</th>
                        <th>Event Time</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.slice(0, displayCount).map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.username}</td>
                            <td>{log.eventType}</td>
                            <td>{log.message}</td>
                            <td>{log.ipAddress}</td>
                            <td>{new Date(log.eventTime).toLocaleString()}</td>
                        </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}>
                                No logs found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
