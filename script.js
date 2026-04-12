// ===============================
// Detect Platform
// ===============================
function detectPlatform(url) {
    if (url.includes("instagram")) return "Instagram";
    if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube";
    if (url.includes("facebook")) return "Facebook";
    return "Unknown";
}


// ===============================
// Handle Download Button Click
// ===============================
function handleDownload() {

    const url = document.getElementById("url").value.trim();
    const result = document.getElementById("result");

    // ❌ Empty input
    if (!url) {
        result.innerText = "Please enter a link!";
        return;
    }

    // 🔍 Detect platform
    const platform = detectPlatform(url);

    // ❌ Unsupported
    if (platform === "Unknown") {
        result.innerText = "Unsupported link!";
        return;
    }

    // ⏳ Loading state
    result.innerText = "Downloading...";

    // 🚀 Send request to backend
    fetch("http://localhost:3000/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url,
            platform: platform
        })
    })
    .then(response => response.blob())   // 👈 IMPORTANT CHANGE
    .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();

        result.innerText = "Download started!";
    })
    .catch(err => {
        console.error(err);
        result.innerText = "Download failed";
    });
}