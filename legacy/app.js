// Tab Switcher for Docs
function switchTab(tabId) {
    // Hide all code blocks
    document.querySelectorAll('.code-block').forEach(el => el.style.display = 'none');
    // Remove active class from buttons
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));

    // Show selected
    document.getElementById(`code-${tabId}`).style.display = 'block';

    // Highlight button
    const buttons = document.querySelectorAll('.tab');
    if (tabId === 'curl') buttons[0].classList.add('active');
    if (tabId === 'python') buttons[1].classList.add('active');
    if (tabId === 'js') buttons[2].classList.add('active');
}

// Mobile Menu Toggle (if needed in future)
document.addEventListener('DOMContentLoaded', () => {
    console.log("Docs loaded.");
});
