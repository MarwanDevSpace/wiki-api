// استعراض الموديولات الموجودة في مجلد modules
const modules = ["Moduleid1"]; // يمكنك لاحقاً إضافة Moduleid2, Moduleid3...

const modulesList = document.getElementById("modules-list");
const codeEditor = document.getElementById("code-editor");
const moduleTitle = document.getElementById("module-title");
const copyBtn = document.getElementById("copy-url");

// بناء القائمة الجانبية
modules.forEach(m => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = `?module=${m}`;
  a.textContent = m;
  if (new URLSearchParams(window.location.search).get("module") === m) {
    a.classList.add("active");
  }
  li.appendChild(a);
  modulesList.appendChild(li);
});

// تحميل الموديول إذا تم تحديده
const params = new URLSearchParams(window.location.search);
const moduleId = params.get("module");

if (moduleId) {
  fetch(`modules/${moduleId}.json`)
    .then(res => res.json())
    .then(data => {
      moduleTitle.textContent = data.name || moduleId;
      codeEditor.textContent = JSON.stringify(data, null, 2);

      // نسخ الرابط عند الضغط
      copyBtn.onclick = () => {
        const url = `https://marwandevspace.github.io/wiki-api/?module=${moduleId}`;
        navigator.clipboard.writeText(url).then(() => {
          copyBtn.innerHTML = "<i class='fas fa-check'></i>";
          setTimeout(() => {
            copyBtn.innerHTML = "<i class='fas fa-link'></i>";
          }, 1500);
        });
      };
    })
    .catch(() => {
      codeEditor.textContent = "// Module not found!";
    });
}
