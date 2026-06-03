const storageKey = "clutchTheoryPosts";
const postGrid = document.querySelector("#postGrid");
const filters = document.querySelectorAll(".filter");
const dialog = document.querySelector("#articleDialog");
const closeDialog = document.querySelector("#closeDialog");
const dialogMeta = document.querySelector("#dialogMeta");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogSummary = document.querySelector("#dialogSummary");
const dialogBody = document.querySelector("#dialogBody");

let activeFilter = "All";

function loadPosts() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  return saved || window.CLUTCH_STARTER_POSTS;
}

function formatBody(body) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderPosts() {
  const posts = loadPosts();
  const visiblePosts = posts.filter((post) => activeFilter === "All" || post.league === activeFilter);

  postGrid.innerHTML = visiblePosts
    .map(
      (post, index) => `
        <article class="post-card ${post.featured && activeFilter === "All" ? "featured" : ""}">
          <div>
            <div class="post-meta">
              <span class="tag">${escapeHtml(post.league)}</span>
              <span>${escapeHtml(post.date)}</span>
              <span>${escapeHtml(post.readTime || "4 min read")}</span>
            </div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.summary)}</p>
          </div>
          <button class="read-button" type="button" data-post-index="${index}">Read article</button>
        </article>
      `
    )
    .join("");

  postGrid.querySelectorAll(".read-button").forEach((button) => {
    button.addEventListener("click", () => openArticle(visiblePosts[Number(button.dataset.postIndex)]));
  });
}

function openArticle(post) {
  dialogMeta.textContent = `${post.league} / ${post.date} / ${post.readTime || "4 min read"}`;
  dialogTitle.textContent = post.title;
  dialogSummary.textContent = post.summary;
  dialogBody.innerHTML = formatBody(post.body);
  dialog.showModal();
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    activeFilter = filter.dataset.filter;
    renderPosts();
  });
});

closeDialog.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    dialog.close();
  }
});

renderPosts();
