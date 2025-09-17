document.addEventListener('DOMContentLoaded', () => {
    // Handle Raw API View
    const params = new URLSearchParams(window.location.search);
    if (params.get('raw') === 'true') {
        const content = document.querySelector('.character-content');
        if (content) {
            const rawText = content.innerText;
            document.body.innerHTML = ''; // Clear the body
            const pre = document.createElement('pre');
            pre.textContent = rawText;
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.wordWrap = 'break-word';
            pre.style.padding = '1rem';
            pre.style.fontFamily = "'Cairo', sans-serif";
            pre.style.fontSize = '16px';
            document.body.appendChild(pre);
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        }
        return; // Stop further script execution
    }

    // Handle search bar on main page
    const searchBar = document.getElementById('search-bar');
    const characterList = document.getElementById('character-list');

    if (searchBar && characterList) {
        const characters = Array.from(characterList.getElementsByTagName('li'));

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            characters.forEach(character => {
                const characterName = character.querySelector('h3 a').textContent.toLowerCase();
                const characterDesc = character.querySelector('p').textContent.toLowerCase();
                const characterTags = character.querySelector('.character-tags').textContent.toLowerCase();

                if (characterName.includes(searchTerm) || characterDesc.includes(searchTerm) || characterTags.includes(searchTerm)) {
                    character.style.display = 'flex';
                } else {
                    character.style.display = 'none';
                }
            });
        });
    }
});
