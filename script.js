let quizAnswers = { q1: "", q2: "", q3: "" };
let customConfig = {
  q1: "1. Kalau lagi ada waktu luang di akhir pekan, kamu tipe yang...",
  q2: "2. Pilihan minuman favorit yang nemenin aktivitas kamu sehari-hari?",
  q3: "3. Pilih genre musik yang paling pas sama selera kamu:",
  targetWa: "",
};

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  checkUrlParams();
});

// Cek apakah halaman dibuka via Link Custom Kuis orang lain
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("q1") && params.has("q2") && params.has("q3")) {
    customConfig.q1 = decodeURIComponent(params.get("q1"));
    customConfig.q2 = decodeURIComponent(params.get("q2"));
    customConfig.q3 = decodeURIComponent(params.get("q3"));
    customConfig.targetWa = params.get("wa") || "";

    // Terapkan pertanyaan custom ke teks kuis
    document.getElementById("questionTitle1").innerText =
      `1. ${customConfig.q1}`;
    document.getElementById("questionTitle2").innerText =
      `2. ${customConfig.q2}`;
    document.getElementById("questionTitle3").innerText =
      `3. ${customConfig.q3}`;

    // Otomatis isi nomor WA tujuan di form akhir jika ada di link
    if (customConfig.targetWa) {
      document.getElementById("targetPhone").value = customConfig.targetWa;
    }
  }
}

function switchSection(sectionId) {
  ["menuSection", "quizSection", "createQuizSection"].forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(sectionId).classList.remove("hidden");
  lucide.createIcons();
}

function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.toggle("hidden");
}

// Navigasi Antar Step Kuis (Mengambil Input Teks Bebas)
function nextStep(step) {
  const inputVal = document.getElementById(`ansInput${step}`).value.trim();
  if (!inputVal) {
    alert("Silakan isi jawabannya terlebih dahulu ya!");
    return;
  }

  quizAnswers[`q${step}`] = inputVal;

  if (step === 1) {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    document.getElementById("quizStepText").innerText = "Pertanyaan 2/3";
  } else if (step === 2) {
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
    document.getElementById("quizStepText").innerText = "Pertanyaan 3/3";
  } else if (step === 3) {
    document.getElementById("step3").classList.add("hidden");
    document.getElementById("quizStepText").innerText = "Selesai";
    document.getElementById("finalFormArea").classList.remove("hidden");
  }
}

// Reset Kuis
function resetQuiz() {
  quizAnswers = { q1: "", q2: "", q3: "" };
  document.getElementById("ansInput1").value = "";
  document.getElementById("ansInput2").value = "";
  document.getElementById("ansInput3").value = "";
  document.getElementById("quizNote").value = "";
  document.getElementById("senderName").value = "";

  if (!customConfig.targetWa) {
    document.getElementById("targetPhone").value = "";
  }

  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("finalFormArea").classList.add("hidden");
  document.getElementById("quizStepText").innerText = "Pertanyaan 1/3";
}

// Kirim Hasil Kuis ke WhatsApp
function sendQuizToWhatsApp() {
  const name = document.getElementById("senderName").value.trim() || "Anonim";
  const phone =
    document.getElementById("targetPhone").value.trim() ||
    customConfig.targetWa;
  const note = document.getElementById("quizNote").value.trim();

  let waMessage =
    `Halo! Ini hasil jawaban kuis dari *${name}*:\n\n` +
    `1. ${customConfig.q1}\n👉 *${quizAnswers.q1}*\n\n` +
    `2. ${customConfig.q2}\n👉 *${quizAnswers.q2}*\n\n` +
    `3. ${customConfig.q3}\n👉 *${quizAnswers.q3}*\n`;

  if (note) {
    waMessage += `\n💬 *Pesan Tambahan:* "${note}"`;
  }

  const encodedMsg = encodeURIComponent(waMessage);

  if (phone) {
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank");
  } else {
    window.open(`https://wa.me/?text=${encodedMsg}`, "_blank");
  }

  resetQuiz();
  switchSection("menuSection");
}

// Generate Link Kuis Custom
function generateCustomQuizLink() {
  const q1 =
    document.getElementById("customQ1").value.trim() ||
    "Tempat favorit kamu buat nongkrong?";
  const q2 =
    document.getElementById("customQ2").value.trim() ||
    "Makanan favorit kamu pas malam hari?";
  const q3 =
    document.getElementById("customQ3").value.trim() ||
    "Satu kata buat menggambarkan suasana hati hari ini?";
  const myWa = document.getElementById("myWaNumber").value.trim();

  let cleanWa = myWa.replace(/[^0-9]/g, "");
  if (cleanWa.startsWith("0")) {
    cleanWa = "62" + cleanWa.slice(1);
  }

  // Buat URL berdasarkan domain saat ini
  const baseUrl = window.location.href.split("?")[0];
  const generatedUrl = `${baseUrl}?q1=${encodeURIComponent(q1)}&q2=${encodeURIComponent(q2)}&q3=${encodeURIComponent(q3)}&wa=${cleanWa}`;

  document.getElementById("generatedLinkOutput").value = generatedUrl;
  document.getElementById("resultLinkBox").classList.remove("hidden");
}

function copyGeneratedLink() {
  const linkInput = document.getElementById("generatedLinkOutput");
  linkInput.select();
  linkInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(linkInput.value);
  alert("Link kuis berhasil disalin ke clipboard!");
}

function shareLinkToWhatsApp() {
  const linkInput = document.getElementById("generatedLinkOutput").value;
  const shareText = `Hai! Coba jawab kuis seru ini dong, penasaran sama jawaban kamu:\n\n${linkInput}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
}
