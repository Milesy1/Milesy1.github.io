// include-header-footer.js

async function loadHTML(id, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML('header-placeholder', 'header.html');
    loadHTML('footer-placeholder', 'footer.html');
});
