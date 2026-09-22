// Select the toggle button from the HTML
const themeToggleBtn = document.getElementById('theme-toggle');

// Check localStorage to see if the user previously selected a theme
const savedTheme = localStorage.getItem('theme');

// If the user previously chose light mode, apply it immediately on page load
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

// Listen for clicks on the toggle button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the .light-mode class on the <body> element
    document.body.classList.toggle('light-mode');
    
    // Check if light mode is active after the toggle
    let currentTheme = 'dark';
    if (document.body.classList.contains('light-mode')) {
        currentTheme = 'light';
    }
    
    // Save the current theme preference to localStorage so it stays after a reload
    localStorage.setItem('theme', currentTheme);
});