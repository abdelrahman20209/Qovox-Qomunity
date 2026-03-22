import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp as rtServerTimestamp,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

document.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--x", e.clientX + "px");
  document.documentElement.style.setProperty("--y", e.clientY + "px");
});

const greetings = [
  "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا ۚ",
  "﴿ وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ﴾",
  "﴿ فَتَوَكَّلْ عَلَى اللَّهِ ۖ إِنَّكَ عَلَى الْحَقِّ الْمُبِينِ﴾",
  "فَمَنْ تَرَكَهَا فَقَدْ كَفَرَ",
  "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
  "وَآخِرُ دَعْوَاهُمْ أَنِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَكُن مِّنَ السَّاجِدِينَ",
  "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
  "إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا",
  "فَاسْتَجَابَ لَهُمْ رَبُّهُمْ أَنِّي لَا أُضِيعُ عَمَلَ عَامِلٍ مِّنكُم مِّن ذَكَرٍ أَوْ أُنثَىٰ",
  "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
  "فَخَلَفَ مِن بَعْدِهِمْ خَلْفٌ أَضَاعُوا الصَّلَاةَ وَاتَّبَعُوا الشَّهَوَاتِ",
  "فَأَنذَرْتُكُمْ نَارًا تَلَظَّىٰ",
  "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
  "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
  "لا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
  "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
  "وَمَا رَبُّكَ بِظَلَّامٍ لِّلْعَبِيدِ",
  "وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ",
  "لَا تَدْرِي لَعَلَّ اللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا",
  "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
  "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
  "أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
  "لَا تَخَافَا ۖ إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَىٰ",
  "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
  " لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
  " سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا",
];

document
  .querySelector(".tagline")
  .insertAdjacentHTML(
    "afterend",
    `<p class="sub-tagline">${greetings[Math.floor(Math.random() * greetings.length)]}</p>`,
  );

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
const rtdb = getDatabase(app);
let profileLoaded = false;

function renderBadgesMain(status) {
  const base = `<img src="img/gro.png"   class="mbadge" title="داخل المجموعة" alt="">`;
  if (status === "own")
    return `<img src="img/own.png"   class="mbadge" title="Owner"          alt=""><img src="img/ser.png" class="mbadge" title="خدمة الأعضاء" alt="">${base}`;
  if (status === "coown")
    return `<img src="img/coown.png" class="mbadge" title="Team leader"    alt=""><img src="img/ser.png" class="mbadge" title="خدمة الأعضاء" alt="">${base}`;
  return base;
}

window.openProfile = async function (e) {
  e.preventDefault();
  const sec = document.getElementById("profileSection");
  const isOpen = sec.style.display === "block";
  document
    .querySelectorAll("main > div")
    .forEach((d) => (d.style.display = "none"));
  if (isOpen) return;
  sec.style.display = "block";
  if (profileLoaded) return;
  const docId = sessionStorage.getItem("userDocId");
  if (!docId) return;
  try {
    const snap = await getDoc(doc(db, "users", docId));
    if (!snap.exists()) return;
    const d = snap.data();
    document.getElementById("profileImg").src =
      d.profileImage || "img/hamer.png";
    document.getElementById("profileName").innerHTML =
      `${d.name || "—"}<span class="badges-wrap">${renderBadgesMain(d.status || "pending")}</span>`;
    document.getElementById("profileAge").textContent = d.age
      ? d.age + " سنة"
      : "—";
    document.getElementById("profilePass").textContent = d.password || "—";
    const ts = d.createdAt?.toDate();
    document.getElementById("profileDate").textContent = ts
      ? ts.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";
    profileLoaded = true;
  } catch {}
};
function renderProject() {
  const el = document.getElementById("projectDetailsSection");
  el.innerHTML = `
    <div class="pd-hero">
      <div class="pd-project-name">${PROJECT.name}</div>
      <img src="${PROJECT.image}" alt="project" class="pd-hero-img">
    </div>

    <div class="pd-block">
      <div class="pd-block-title">تفاصيل أكثر عن المشروع</div>
      <div class="pd-scroll-box">${PROJECT.details}</div>
    </div>

    <div class="pd-block">
      <div class="pd-block-title">آلية العمل</div>
      <div class="pd-steps">
        ${PROJECT.steps
          .map(
            (s, i) => `
          <div class="pd-step">
            <div class="pd-step-num">${i + 1}</div>
            <div class="pd-step-txt">${s}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="pd-split">
      <div class="pd-block" style="margin-bottom:0">
        <div class="pd-block-title">العقل — اللوجيك</div>
        <div class="pd-scroll-box">${PROJECT.logic}</div>
      </div>
      <div class="pd-block" style="margin-bottom:0">
        <div class="pd-block-title">التصميم</div>
        <div class="pd-scroll-box">${PROJECT.design}</div>
      </div>
    </div>

    <div class="pd-block">
      <div class="pd-block-title">طاقم العمل على المشروع</div>
      <div class="pd-team">
        ${PROJECT.team
          .map(
            (m) => `
          <div class="pd-member">
            <img src="${m.img}" alt="${m.name}" class="pd-member-img">
            <div>
              <div class="pd-member-name">${m.name}</div>
              <div class="pd-member-role">${m.role}</div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

window.openProjectDetails = function (e) {
  e.preventDefault();
  const sec = document.getElementById("projectDetailsSection");
  const isOpen = sec.style.display === "block";
  document
    .querySelectorAll("main > div")
    .forEach((d) => (d.style.display = "none"));
  if (isOpen) return;
  renderProject();
  sec.style.display = "block";
};

//-------------------El Ma4ro3 al7ale

const PROJECT = {
  name: "سيظهر هنا اسم المشروع",
  image: "img/def.png",

  details: `لا تفاصيل`,

  steps: ["الخطوة الأولى", "الخطوة الثانية"],

  logic: `ما من مشروع بعد`,

  design: `ما من مشروع بعد`,

  team: [{ name: "انت", role: "تحت المراجعة", img: "img/hamer.png" }],
};

//-------------------El Ma4ro3 al7ale
let membersOpen = false;
let membersLoaded = false;

function initPresence() {
  const docId = sessionStorage.getItem("userDocId");
  if (!docId) return;
  const presRef = ref(rtdb, "presence/" + docId);
  set(presRef, { online: true, lastSeen: rtServerTimestamp() });
  onDisconnect(presRef).set({ online: false, lastSeen: rtServerTimestamp() });
}

window.toggleMembersList = async function () {
  membersOpen = !membersOpen;
  const panel = document.getElementById("membersPanel");
  const backdrop = document.getElementById("mpBackdrop");
  const fab = document.getElementById("membersFab");
  if (membersOpen) {
    panel.classList.add("on");
    backdrop.classList.add("on");
    fab.style.opacity = "0";
    fab.style.pointerEvents = "none";
    fab.style.transform = "scale(0.85)";
    if (!membersLoaded) {
      membersLoaded = true;
      loadMembers();
    }
  } else {
    panel.classList.remove("on");
    backdrop.classList.remove("on");
    fab.style.opacity = "1";
    fab.style.pointerEvents = "auto";
    fab.style.transform = "scale(1)";
  }
};

async function loadMembers() {
  const list = document.getElementById("mpList");
  list.innerHTML =
    '<div style="text-align:center;padding:40px;color:#555;font-size:14px">جاري التحميل...</div>';
  try {
    const snap = await getDocs(collection(db, "users"));
    const members = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (!members.length) {
      list.innerHTML =
        '<div style="text-align:center;padding:40px;color:#333">لا يوجد أعضاء</div>';
      return;
    }
    onValue(ref(rtdb, "presence"), (presSnap) => {
      const presence = presSnap.val() || {};
      let onlineCount = 0;
      const sorted = [...members].sort((a, b) => {
        const ao = presence[a.id]?.online === true;
        const bo = presence[b.id]?.online === true;
        return bo - ao;
      });
      list.innerHTML = sorted
        .map((m) => {
          const isOnline = presence[m.id]?.online === true;
          if (isOnline) onlineCount++;
          return `
          <div class="mp-member">
            <div class="mp-member-img-wrap">
              <img src="${m.profileImage || "img/hamer.png"}" class="mp-member-img" alt="" onerror="this.src='img/hamer.png'">
              <div class="${isOnline ? "mp-online-dot" : "mp-offline-dot"}"></div>
            </div>
            <div class="mp-member-info">
              <div class="mp-member-name">
                ${m.name || "؟"}
                <span class="badges-wrap">${renderBadgesMain(m.status || "pending")}</span>
              </div>
              <div class="mp-member-status-txt ${isOnline ? "online" : ""}">
                ${isOnline ? "● متصل الآن" : "غير متصل"}
              </div>
            </div>
          </div>
        `;
        })
        .join("");
      document.getElementById("mpOnlineCount").textContent = onlineCount;
    });
  } catch (err) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:#e63946;font-size:13px">خطأ في التحميل<br>${err.message}</div>`;
  }
}

document.getElementById("game").addEventListener("click", function (e) {
  e.preventDefault();
  sessionStorage.clear();
  window.location.href = "game/game.html";
});

initPresence();
