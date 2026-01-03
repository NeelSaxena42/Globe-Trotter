import React from "react";
const card = {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "24px", // increased spacing between cards
    background: "#fff",
};

const primaryBtn = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #0b79f7",
    background: "#0b79f7",
    color: "#fff",
    cursor: "pointer",
};

const secondaryBtn = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
};

// Add subtle badge style
const badge = {
    display: "inline-block",
    background: "#f3f4f6",
    color: "#374151",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    marginBottom: "10px", // slightly increased spacing below badge
    fontWeight: 500,
};


export default function PublicItinerary() {
    // Add share handler that copies current page URL and alerts success.
    const handleShare = async () => {
        try {
            const url = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                const ta = document.createElement("textarea");
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            alert("Link copied");
        } catch (err) {
            console.error("Copy failed", err);
            alert("Could not copy link");
        }
    };

    // Compute stats: formatted date range and total days (inclusive)
    const start = new Date(2026, 0, 10); // 10 Jan 2026
    const end = new Date(2026, 0, 15);   // 15 Jan 2026
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round((end - start) / msPerDay) + 1;
    const formatDate = (d) =>
        d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    const dateRangeText = `${formatDate(start)} – ${formatDate(end)}`;

    // Small styles for the horizontal stats row
    const statsRow = {
        display: "flex",
        gap: "12px",
        marginTop: "8px",
        alignItems: "center",
    };
    const statItem = {
        background: "#f9fafb",
        color: "#374151",
        padding: "6px 10px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
    };

    return (
        <>
        {/* Inject subtle hover CSS for day cards */}
        <style>{`
            .day-card {
                transition: box-shadow 160ms ease, transform 160ms ease;
            }
            .day-card:hover {
                box-shadow: 0 6px 18px rgba(15,23,42,0.06);
            }
        `}</style>

        <div style={{ maxWidth: "900px", margin: "56px auto", padding: "28px" }}> {/* increased outer spacing */}
            {/* Header: badge + title on left, buttons on right (horizontal) */}
            <div style={{ marginBottom: "36px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px" }}> {/* increased header spacing */}
                <div>
                    {/* Small subtle badge above the title */}
                    <div style={badge}>Public Itinerary</div>

                    <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>
                        Trip to Manali
                    </h1>
                    <p style={{ color: "#555" }}>Manali, Himachal Pradesh</p>
                    <p style={{ fontSize: "14px", color: "#777" }}>
                        10 Jan 2026 – 15 Jan 2026
                    </p>

                    {/* Horizontal stats row: duration/date-range and total days */}
                    <div style={statsRow}>
                        <div style={statItem}>Duration: {dateRangeText}</div>
                        <div style={statItem}>Total days: {totalDays}</div>
                    </div>
                </div>

                {/* Buttons placed close to title, aligned horizontally */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button style={primaryBtn} onClick={handleShare}>Share</button>
                        <button style={secondaryBtn}>Copy Itinerary</button>
                    </div>
                </div>
            </div>

            <p style={{ marginBottom: "32px" }}> {/* slightly increased description spacing */}
                A relaxed mountain trip with friends.
            </p>

            {/* DAYS */}
            <div style={{ display: "grid", gap: "24px" }}> {/* increased gap between day cards */}
                <div className="day-card" style={card}>
                    <h3>Day 1: Arrival & Local Sightseeing</h3>
                    <ul>
                        <li>Mall Road</li>
                        <li>Hadimba Temple</li>
                        <li>Cafe hopping</li>
                    </ul>
                </div>

                <div className="day-card" style={card}>
                    <h3>Day 2: Solang Valley</h3>
                    <ul>
                        <li>Paragliding</li>
                        <li>Snow activities</li>
                    </ul>
                </div>
            </div>

        </div>
        </>
    );
}
