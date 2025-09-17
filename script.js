document.addEventListener('DOMContentLoaded', () => {
    // Logic for the main page (index.html)
    if (document.getElementById('search-bar')) {
        const searchBar = document.getElementById('search-bar');
        const characterList = document.getElementById('character-list');
        const characterItems = characterList.getElementsByClassName('character-item');

        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            Array.from(characterItems).forEach(item => {
                const characterName = item.querySelector('td[data-label="الشخصية"]').textContent.toLowerCase();
                const characterDesc = item.querySelector('td[data-label="الوصف"]').textContent.toLowerCase();
                if (characterName.includes(searchTerm) || characterDesc.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Logic for the character details page (character.html)
    if (document.body.classList.contains('character-page')) {
        const params = new URLSearchParams(window.location.search);
        const characterName = params.get('name');
        const characterContent = document.querySelector('.character-content');

        if (characterName) {
            const jsonPath = `characters/${characterName}.json`;
            fetch(jsonPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    renderCharacterData(data, jsonPath);
                })
                .catch(error => {
                    console.error('Error fetching character data:', error);
                    characterContent.innerHTML = `<h1>خطأ</h1><p>لم نتمكن من تحميل بيانات الشخصية. يرجى التحقق من اسم الشخصية والمحاولة مرة أخرى.</p><p><em>${error.message}</em></p>`;
                    document.title = "خطأ في التحميل";
                });
        } else {
            characterContent.innerHTML = '<h1>لم يتم تحديد شخصية</h1><p>يرجى العودة إلى الصفحة الرئيسية واختيار شخصية لعرضها.</p>';
            document.title = "لم يتم تحديد شخصية";
        }
    }
});

function renderCharacterData(data, jsonPath) {
    document.title = data.title || "تفاصيل الشخصية";
    
    // Populate infobox
    const infoboxName = document.getElementById('infobox-name');
    const infoboxDetails = document.getElementById('infobox-details');
    const rawApiButton = document.getElementById('raw-api-button');

    if (infoboxName) infoboxName.textContent = data.title;
    if (rawApiButton) rawApiButton.href = jsonPath;
    
    if (infoboxDetails) {
        infoboxDetails.innerHTML = ''; // Clear loading state
        if (data.summary) {
            infoboxDetails.innerHTML += `<li><strong>ملخص:</strong> ${data.summary}</li>`;
        }
        if (data.metadata && data.metadata.version) {
            infoboxDetails.innerHTML += `<li><strong>الإصدار:</strong> ${data.metadata.version}</li>`;
        }
        if (data.metadata && data.metadata.tags) {
            infoboxDetails.innerHTML += `<li><strong>الوسوم:</strong> <code>${data.metadata.tags.join('</code>, <code>')}</code></li>`;
        }
    }

    // Populate main content area
    const characterContent = document.querySelector('.character-content');
    let contentHtml = `<h1>${data.title}</h1>`;
    
    if (data.persona) {
        if(data.persona.description) {
            contentHtml += `<h2>الوصف</h2><p>${data.persona.description}</p>`;
        }
        if(data.persona.core_task) {
            contentHtml += `<h2>المهمة الأساسية</h2><p>${data.persona.core_task}</p>`;
        }
    }

    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach(section => {
            contentHtml += `<h2>${section.title}</h2>`;
            if (section.type === 'list' && Array.isArray(section.content)) {
                contentHtml += '<ul>';
                section.content.forEach(item => {
                    contentHtml += `<li>${item}</li>`;
                });
                contentHtml += '</ul>';
            } else if (section.content) {
                 contentHtml += `<p>${section.content}</p>`;
            }
        });
    }
    
    if (data.persona && data.persona.output_style) {
        contentHtml += `<h2>نبرة وصياغة المخرجات</h2>`;
        const style = data.persona.output_style;
        let styleList = '<ul>';
        if(style.nickname) styleList += `<li><strong>اللقب:</strong> ${style.nickname}</li>`;
        if(style.prefix) styleList += `<li><strong>بداية الرد:</strong> <code>${style.prefix}</code></li>`;
        if(style.tone) styleList += `<li><strong>النبرة:</strong> ${style.tone}</li>`;
        if(style.language) styleList += `<li><strong>اللغة:</strong> ${style.language}</li>`;
        if(style.formatting) styleList += `<li><strong>التنسيق:</strong> ${style.formatting}</li>`;
        styleList += '</ul>';
        contentHtml += styleList;
    }
    
    characterContent.innerHTML = contentHtml;
}
