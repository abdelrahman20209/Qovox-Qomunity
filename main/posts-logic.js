import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBBjma50O8jUjoff_RiU50OCIFxxVcMF74",
  authDomain: "qovoxcom.firebaseapp.com",
  projectId: "qovoxcom",
  storageBucket: "qovoxcom.firebasestorage.app",
  messagingSenderId: "162160813947",
  appId: "1:162160813947:web:496858e67401e94b1d3fde",
  measurementId: "G-4ZD8LYLZ3R",
});
const db = getFirestore(app);

const IMGBB_POSTS = "a62c5e69d1076866dd180e6934994328";
let allPosts = [];
let currentSort = "newest";
let postsListener = null;
let cachedUserImg = "";
let cachedUserStatus = "";

async function fetchCuImg() {
  if (cachedUserImg) return cachedUserImg;
  const id = sessionStorage.getItem("userDocId");
  if (!id) return "img/hamer.png";
  try {
    const s = await getDoc(doc(db, "users", id));
    cachedUserImg = s.data()?.profileImage || "img/hamer.png";
    cachedUserStatus = s.data()?.status || "pending";
  } catch {
    cachedUserImg = "img/hamer.png";
    cachedUserStatus = "pending";
  }
  return cachedUserImg;
}
function renderBadges(status) {
  const base = `<img src="img/gro.png" class="status-badge" alt="">`;
  if (status === "own")
    return `<img src="img/own.png"   class="status-badge" alt=""><img src="img/ser.png" class="status-badge" alt="">${base}`;
  if (status === "coown")
    return `<img src="img/coown.png" class="status-badge" alt=""><img src="img/ser.png" class="status-badge" alt="">${base}`;
  return base;
}

function getLiked() {
  return JSON.parse(localStorage.getItem("likedPosts") || "[]");
}
function isLiked(id) {
  return getLiked().includes(id);
}

window.toggleLike = async function (postId) {
  const liked = isLiked(postId);
  const arr = getLiked();
  if (liked) {
    arr.splice(arr.indexOf(postId), 1);
    localStorage.setItem("likedPosts", JSON.stringify(arr));
    await updateDoc(doc(db, "Posts", postId), { likes: increment(-1) });
  } else {
    arr.push(postId);
    localStorage.setItem("likedPosts", JSON.stringify(arr));
    await updateDoc(doc(db, "Posts", postId), { likes: increment(1) });
  }
  const btn = document.querySelector(`[data-like="${postId}"]`);
  const img = btn?.querySelector("img");
  const now = isLiked(postId);
  if (btn) btn.classList.toggle("liked", now);
  if (img) img.src = now ? "img/liked.png" : "img/like.png";
};

window.toggleComments = function (postId) {
  document.getElementById("cs-" + postId)?.classList.toggle("open");
};

window.toggleReadMore = function (postId, btn) {
  const el = document.getElementById("pb-" + postId);
  const post = allPosts.find((p) => p.id === postId);
  if (!post) return;
  const raw = (post.dit || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  if (btn.textContent === "اقرأ المزيد") {
    el.innerHTML = raw.replace(/\n/g, "<br>");
    btn.textContent = "أقل";
  } else {
    el.innerHTML = raw.substring(0, 150).replace(/\n/g, "<br>") + "...";
    btn.textContent = "اقرأ المزيد";
  }
};

window.addComment = async function (postId) {
  const inp = document.getElementById("ci-" + postId);
  const text = inp.value.trim();
  if (!text) return;
  const uname = sessionStorage.getItem("userName") || "مجهول";
  const uimg = await fetchCuImg();
  inp.value = "";
  inp.disabled = true;
  try {
    await updateDoc(doc(db, "Posts", postId), {
      comments: arrayUnion({
        username: uname,
        userImg: uimg,
        userStatus: cachedUserStatus,
        dit: text,
        date: new Date().toISOString(),
      }),
    });
  } catch {}
  inp.disabled = false;
};

window.commentKey = function (e, postId) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    window.addComment(postId);
  }
};

function fmtDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function postCard(post) {
  const liked = isLiked(post.id);
  const truncate = post.dit && post.dit.length > 150;
  const raw = (post.dit || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const rawFull = raw.replace(/\n/g, "<br>");
  const rawShort = truncate
    ? raw.substring(0, 150).replace(/\n/g, "<br>") + "..."
    : rawFull;
  const shown = rawShort;
  const comments = post.comments || [];
  const uimg = post.userImg || "img/hamer.png";

  return `
    <div class="post-card">
      <div class="post-header">
        <img src="${uimg}" class="post-uimg" alt="" onerror="this.src='img/hamer.png'">
        <div>
          <div class="post-uname">${post.username || "؟"}<span class="badges-wrap">${renderBadges(post.username === sessionStorage.getItem("userName") ? cachedUserStatus : post.userStatus || "pending")}</span></div>
          <div class="post-date-lbl">${fmtDate(post.date)}</div>
        </div>
      </div>
      <div class="post-title">${post.title || ""}</div>
      <div class="post-body">
        <span id="pb-${post.id}">${shown}</span>
        ${truncate ? `<button class="post-readmore-btn" onclick="toggleReadMore('${post.id}',this)">اقرأ المزيد</button>` : ""}
      </div>
      ${post.photourl ? `<div class="post-img-wrap"><img src="${post.photourl}" alt="" onerror="this.parentElement.remove()"></div>` : ""}
      <div class="post-stats">
        ${(post.likes || 0) > 0 ? `<span>❤ ${post.likes} إعجاب</span>` : ""}
        ${comments.length > 0 ? `<span style="margin-right:auto">${comments.length} تعليق</span>` : ""}
      </div>
      <div class="post-divider"></div>
      <div class="post-actions">
        <button class="post-action-btn ${liked ? "liked" : ""}" data-like="${post.id}" onclick="toggleLike('${post.id}')">
          <img src="${liked ? "img/liked.png" : "img/like.png"}" alt="">اعجبني
        </button>
        <button class="post-action-btn" onclick="toggleComments('${post.id}')">
          <img src="img/cont.png" alt="">تعليقات
        </button>
      </div>
      <div class="post-comments-section" id="cs-${post.id}">
        ${comments
          .map(
            (c) => `
          <div class="comment-item">
            <img src="${c.userImg || "img/hamer.png"}" class="comment-uimg" alt="" onerror="this.src='img/hamer.png'">
            <div class="comment-bubble">
              <div class="comment-uname">${c.username}<span class="badges-wrap">${renderBadges(c.username === sessionStorage.getItem("userName") ? cachedUserStatus : c.userStatus || "pending")}</span></div>
              <div class="comment-txt">${c.dit}</div>
            </div>
          </div>
        `,
          )
          .join("")}
        <div class="comment-input-row">
          <img src="${cachedUserImg || "img/hamer.png"}" alt="" onerror="this.src='img/hamer.png'">
          <input type="text" class="comment-inp" id="ci-${post.id}"
            placeholder="اكتب تعليقاً..." onkeydown="commentKey(event,'${post.id}')">
          <button class="comment-send-btn" onclick="addComment('${post.id}')">↑</button>
        </div>
      </div>
    </div>
  `;
}

function getSorted() {
  const arr = [...allPosts];
  const ms = (p) => (p.date?.toMillis ? p.date.toMillis() : 0);
  if (currentSort === "newest") return arr.sort((a, b) => ms(b) - ms(a));
  if (currentSort === "oldest") return arr.sort((a, b) => ms(a) - ms(b));
  if (currentSort === "likes")
    return arr.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  return arr;
}

function renderPosts() {
  const feed = document.getElementById("postsFeed");
  if (!feed) return;
  const sorted = getSorted();
  feed.innerHTML = sorted.length
    ? sorted.map(postCard).join("")
    : '<div class="posts-empty">لا توجد منشورات بعد — كن أول من ينشر!</div>';
}

window.setSort = function (type) {
  currentSort = type;
  document
    .querySelectorAll(".sort-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("sort-" + type)?.classList.add("active");
  renderPosts();
};

window.openPosts = async function (e) {
  e.preventDefault();
  const sec = document.getElementById("postsSection");
  const isOpen = sec.style.display === "block";
  document
    .querySelectorAll("main > div")
    .forEach((d) => (d.style.display = "none"));
  if (isOpen) return;
  sec.style.display = "block";
  await fetchCuImg();
  if (!postsListener) {
    document.getElementById("postsFeed").innerHTML =
      '<div class="posts-loading">جاري التحميل...</div>';
    postsListener = onSnapshot(
      query(collection(db, "Posts"), orderBy("date", "desc")),
      (snap) => {
        allPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        renderPosts();
      },
    );
  }
};

window.openCreatePost = function () {
  document.getElementById("createPostModal").style.display = "flex";
  document.getElementById("postTitleInp").focus();
};

window.closeCreatePost = function () {
  document.getElementById("createPostModal").style.display = "none";
  document.getElementById("postTitleInp").value = "";
  document.getElementById("postDitInp").value = "";
  document.getElementById("postImgInp").value = "";
  document.getElementById("cpmImgPrev").style.display = "none";
  document.getElementById("cpmImgLabel").style.display = "";
  document.getElementById("postCreateErr").textContent = "";
};

window.cpmOut = function (e) {
  if (e.target.id === "createPostModal") window.closeCreatePost();
};

window.previewPostImg = function (input) {
  const file = input.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = (e) => {
    document.getElementById("cpmImgPrev").src = e.target.result;
    document.getElementById("cpmImgPrev").style.display = "block";
    document.getElementById("cpmImgLabel").style.display = "none";
  };
  r.readAsDataURL(file);
};

async function uploadPostImg(file) {
  const r = new FileReader();
  const b64 = await new Promise((res) => {
    r.onload = (e) => res(e.target.result.split(",")[1]);
    r.readAsDataURL(file);
  });
  const fd = new FormData();
  fd.append("image", b64);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_POSTS}`, {
    method: "POST",
    body: fd,
  });
  const j = await res.json();
  return j.success ? j.data.url : "";
}

window.submitPost = async function () {
  const title = document.getElementById("postTitleInp").value.trim();
  const dit = document.getElementById("postDitInp").value.trim();
  const errEl = document.getElementById("postCreateErr");
  const btn = document.getElementById("submitPostBtn");

  if (!title) {
    errEl.textContent = "أدخل عنوان المنشور";
    return;
  }
  if (!dit) {
    errEl.textContent = "أدخل تفاصيل المنشور";
    return;
  }

  btn.disabled = true;
  btn.textContent = "جاري النشر...";
  errEl.textContent = "";

  try {
    const uname = sessionStorage.getItem("userName") || "مجهول";
    const uimg = await fetchCuImg();
    const imgFile = document.getElementById("postImgInp").files[0];
    const photourl = imgFile ? await uploadPostImg(imgFile) : "";

    await addDoc(collection(db, "Posts"), {
      username: uname,
      userImg: uimg,
      userStatus: cachedUserStatus,
      date: serverTimestamp(),
      title,
      dit,
      photourl,
      likes: 0,
      comments: [],
    });

    window.closeCreatePost();
  } catch {
    errEl.textContent = "حدث خطأ أثناء النشر — حاول مرة أخرى";
  }

  btn.disabled = false;
  btn.textContent = "نشر الآن";
};
