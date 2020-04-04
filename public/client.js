let otpField = document.querySelector(".otpField");
let verify = document.querySelector(".verify");
const snackbarContent = document.getElementById("snackbar");

verify.addEventListener("click", async e => {
  try {
    await smsReceiver();
  } catch (e) {
    snackbar(e, 3000);
  }
});

const smsReceiver = async () => {
  if (!navigator.sms) return;
  try {
    const sms = await navigator.sms.receive();
    snackbar("Kontrol ediliyor...");
    const code = sms.content.match(/^[\s\S]*otp=([0-9]{6})[\s\S]*$/m)[1];
    if (code) {
      otpField.value = code;
      otpField.disabled = true;
      snackbar("Telefonunuz onaylanmıştır...", 3000);
    } else {
      snackbar("Received the SMS, but failed to retrieve the OTP.", 3000);
    }
  } catch (e) {
    if (e.name !== "AbortError") {
      snackbar("Failed to receive SMS", 3000);
    }
  }
};

function snackbar(content, expire) {
  if (content === false) {
    snackbarContent.classList.remove("show");
    snackbarContent.classList.add("hide");
  } else {
    snackbarContent.classList.remove("hide");
    snackbarContent.classList.add("show");

    if (expire) {
      setTimeout(() => {
        snackbar(false);
      }, 3000);
    }

    snackbarContent.innerHTML = content;
  }
}

snackbar("Kontrol ediliyor...");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
