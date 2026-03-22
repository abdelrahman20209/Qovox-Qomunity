const firebaseConfig = {
  apiKey: "AIzaSyBBjma50O8jUjoff_RiU50OCIFxxVcMF74",
  authDomain: "qovoxcom.firebaseapp.com",
  projectId: "qovoxcom",
  storageBucket: "qovoxcom.firebasestorage.app",
  messagingSenderId: "162160813947",
  appId: "1:162160813947:web:496858e67401e94b1d3fde",
  measurementId: "G-4ZD8LYLZ3R",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.onclick = () => {
  loginForm.style.display = "flex";
  signupForm.style.display = "none";
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
};

signupTab.onclick = () => {
  loginForm.style.display = "none";
  signupForm.style.display = "flex";
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
};

function showMessage(msg, type) {
  const el = document.getElementById("authMessage");
  el.textContent = msg;
  el.style.color = type === "success" ? "#4cff8f" : "#ff4c4c";
  el.style.fontWeight = "bold";
  el.style.marginTop = "10px";
  el.style.opacity = "1";
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => {
      el.textContent = "";
    }, 500);
  }, 4000);
}

const textElement = document.getElementById("changingText");

const texts = [
  "أبدء الانضمام الي QOVOX",
  "انت جزء منا لا تقلق",
  "فقط قم بتسجيل الدخول و انضم لنا",
  "نحن نصنع المستقبل",
  "لا حاجه للحيره فقط اطلب المساعده",
  "هذه المنصه خاصه لفريق QOVOX",
  "اهلا بك",
  "و اخيرا عدت مره اخري لقد اشتقت اليك",
  "لا تقلق نحن بجانبك",
  "تريد التعلم ايضا انضم لنا",
  "هذا الموقع خاص",
  "تمتع بتجربه فريده من نوعها",
  "مرحبًا بك في QOVOX",
  "ابدأ رحلتك معنا الآن",
  "كل شيء يبدأ بخطوة واحدة",
  "انضم إلى مجتمع يصنع الفرق",
  "نحن نبني شيئًا مختلفًا",
  "المستقبل يبدأ من هنا",
  "وجودك معنا مهم",
  "أنت الآن في المكان الصحيح",
  "الخطوة التالية بين يديك",
  "لا تتردد في الاستكشاف",
  "هنا تبدأ الأفكار الكبيرة",
  "فريق QOVOX يرحب بك",
  "كل إنجاز يبدأ بمحاولة",
  "نحن نعمل معًا لنصنع الأفضل",
  "المعرفة تبدأ بالسؤال",
  "ابدأ الآن ولا تؤجل",
  "الفرص تصنعها أنت",
  "كل شيء ممكن هنا",
  "طريقك نحو الأفضل يبدأ الآن",
  "انضم وكن جزءًا من التغيير",
  "نحن هنا لنساعدك",
  "خطوة صغيرة اليوم تصنع فرقًا غدًا",
  "أنت أقرب مما تتخيل",
  "استكشف الإمكانيات",
  "اجعل فضولك يقودك",
  "لا تتوقف عن التقدم",
  "النجاح يبدأ بمحاولة",
  "كل فكرة لها مكان هنا",
  "ابنِ مستقبلك معنا",
  "ابدأ التجربة الآن",
  "كل شيء جاهز لك",
  "نحن نؤمن بقدراتك",
  "ابدأ واصنع قصتك",
  "معًا نصنع شيئًا أعظم",
  "كل لحظة هنا لها قيمة",
];

const effects = ["type", "hack", "glitch"];
let textIndex = 0;

function colorText(text) {
  const half = Math.floor(text.length / 2);
  const first = text.substring(0, half);
  const second = text.substring(half);
  return (
    "<span class='redPart'>" +
    first +
    "</span><span class='whitePart'>" +
    second +
    "</span>"
  );
}

function typeWriter(text) {
  textElement.innerHTML = "";
  let i = 0;
  const interval = setInterval(function () {
    textElement.innerHTML = colorText(text.substring(0, i));
    i++;
    if (i > text.length) clearInterval(interval);
  }, 40);
}

function hackerEffect(text) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%&";
  let iteration = 0;
  const interval = setInterval(function () {
    const result = text
      .split("")
      .map(function (letter, idx) {
        if (idx < iteration) return letter;
        return letters[Math.floor(Math.random() * letters.length)];
      })
      .join("");
    textElement.innerHTML = colorText(result);
    iteration += 0.5;
    if (iteration >= text.length) clearInterval(interval);
  }, 30);
}

function glitchEffect(text) {
  textElement.innerHTML = colorText(text);
  textElement.classList.add("glitch");
  setTimeout(function () {
    textElement.classList.remove("glitch");
  }, 1200);
}

function nextText() {
  textElement.classList.add("textFadeOut");
  setTimeout(function () {
    textIndex = (textIndex + 1) % texts.length;
    const effect = effects[Math.floor(Math.random() * effects.length)];
    const text = texts[textIndex];
    textElement.classList.remove("textFadeOut");
    if (effect === "type") typeWriter(text);
    if (effect === "hack") hackerEffect(text);
    if (effect === "glitch") glitchEffect(text);
  }, 500);
}

typeWriter(texts[0]);
setInterval(nextText, 5000);

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("loginname").value.trim();
    const password = document.getElementById("loginPassword").value;
    const btn = document.getElementById("loginButton");

    if (!name || !password) {
      showMessage("من فضلك ادخل الاسم و كلمه المرور");
      return;
    }

    btn.disabled = true;
    btn.textContent = "جاري التحقق...";

    try {
      const snap = await db.collection("users").where("name", "==", name).get();

      if (snap.empty) {
        showMessage("الاسم أو كلمه المرور غير صحيحة");
        btn.disabled = false;
        btn.textContent = "Login";
        return;
      }

      let matched = false;
      let userData = null;
      let userDocId = null;

      snap.forEach(function (d) {
        if (d.data().password === password) {
          matched = true;
          userData = d.data();
          userDocId = d.id;
        }
      });

      if (matched) {
        showMessage("تم تسجيل الدخول", "success");
        sessionStorage.setItem("userAuth", "true");
        sessionStorage.setItem("userName", name);
        sessionStorage.setItem("userDocId", userDocId);

        const hasPhotos =
          userData.profileImage && userData.idFront && userData.idBack;

        setTimeout(function () {
          if (hasPhotos) {
            window.location.href = "main/main.html";
          } else {
            window.location.href = "ver/ver.html";
          }
        }, 1200);
      } else {
        showMessage("الاسم أو كلمه المرور غير صحيحة");
        btn.disabled = false;
        btn.textContent = "Login";
      }
    } catch (err) {
      console.error("Login Error:", err);
      showMessage("حدث خطأ أثناء تسجيل الدخول، حاول تاني");
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });

document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("signupname").value.trim();
    const age = document.getElementById("age").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById(
      "signupConfirmPassword",
    ).value;
    const code = document.getElementById("code").value.trim();

    ["nameError", "ageError", "passwordError", "confirmPasswordError"].forEach(
      function (id) {
        document.getElementById(id).textContent = "";
      },
    );

    let valid = true;

    if (name.length < 2) {
      document.getElementById("nameError").textContent = "اقل حاجه حرفين";
      valid = false;
    }
    if (parseInt(age) < 13) {
      document.getElementById("ageError").textContent = "أقل عمر 13 سنة";
      valid = false;
    }
    if (password.length < 6) {
      document.getElementById("passwordError").textContent =
        "اقل عدد لكلمه المرور 6 عناصر";
      valid = false;
    }
    if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").textContent =
        "غير مطابقه";
      valid = false;
    }
    if (!code) {
      showMessage("من فضلك ادخل كود القبول");
      valid = false;
    }

    if (!valid) return;

    const btn = document.getElementById("signupButton");
    btn.disabled = true;
    btn.textContent = "جاري الانشاء...";

    try {
      const nameSnap = await db
        .collection("users")
        .where("name", "==", name)
        .get();
      if (!nameSnap.empty) {
        showMessage("الاسم ده موجود، اختار اسم تاني");
        btn.disabled = false;
        btn.textContent = "Create Account";
        return;
      }

      const codeSnap = await db
        .collection("code_user")
        .where("code", "==", code)
        .where("used", "==", false)
        .get();

      if (codeSnap.empty) {
        showMessage("الكود غلط أو اتستخدم قبل كده");
        btn.disabled = false;
        btn.textContent = "Create Account";
        return;
      }

      let codeDocId = null;
      codeSnap.forEach(function (d) {
        codeDocId = d.id;
      });

      await db.collection("users").add({
        name: name,
        age: parseInt(age),
        password: password,
        code: code,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await db.collection("code_user").doc(codeDocId).update({ used: true });

      showMessage("تم انشاء الحساب بنجاح .. سجل دخولك الآن", "success");
      document.getElementById("signupForm").reset();

      setTimeout(function () {
        loginForm.style.display = "flex";
        signupForm.style.display = "none";
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
      }, 2000);
    } catch (err) {
      console.error("Signup Error:", err);
      showMessage("حدث خطأ أثناء انشاء الحساب، حاول تاني");
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  });
