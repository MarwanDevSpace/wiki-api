// قراءة باراميتر الموديل من URL
const params = new URLSearchParams(window.location.search);
const moduleId = params.get("module");

const editorSection = document.getElementById("editor-section");
const moduleTitle = document.getElementById("module-title");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");

if (moduleId) {
  fetch(`modules/${moduleId}.json`)
    .then(res => res.json())
    .then(data => {
      editorSection.classList.remove("hidden");
      moduleTitle.textContent = data.id;
      editor.value = data.content || "";

      downloadBtn.onclick = () => {
        const updated = {
          id: data.id,
          content: editor.value
        };
        const blob = new Blob([JSON.stringify(updated, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${data.id}.json`;
        link.click();
      };
    })
    .catch(() => {
      alert("Module not found!");
    });
}
