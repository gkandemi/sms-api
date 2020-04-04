let otpInput = document.querySelector(".otpInput");
const startBtn = document.querySelector(".startBtn");
const snackbarContent = document.getElementById("snackbar");
const homeScreen = document.querySelector(".homeScreen");
const appContainer = document.querySelector(".appContainer");
const install = document.querySelector("#install");

startBtn.addEventListener("click", async e => {
  try {
    homeScreen.style.display = "none";
    appContainer.style.display = "flex";
    snackbar("SMS Bekleniyor...");
    await smsReceiver();
  } catch (e) {
    snackbar(e, 3000);
  }
});

const smsReceiver = async () => {
  if (!navigator.sms) return;
  try {
    const sms = await navigator.sms.receive();
    const code = sms.content.match(/^[\s\S]*otp=([0-9]{6})[\s\S]*$/m)[1];
    if (code) {
      otpInput.value = code;
      otpInput.disabled = true;
      snackbar("Kontrol ediliyor...");
      setTimeout(() => {
        if (!otpInput.checkValidity()) {
          snackbar("Doğrulanamadı...");
        } else {
          snackbar("Telefonunuz onaylanmıştır...", 3000);
        }
      }, 1000);
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

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  let installEvent = e;
  install.style.display = "block";
  install.addEventListener("click", async () => {
    installEvent.prompt();
    install.style.display = "none";
  });
});
