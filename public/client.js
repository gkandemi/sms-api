let otpField = document.querySelector(".otpField");
let verify = document.querySelector(".verify");
let interval = null;

verify.addEventListener("click", async e => {
  try {
    // phoneForm.classList.remove("visible");
    // otpForm.classList.add("visible");
    // success.classList.remove("visible");
    await smsReceiver();
    interval = setInterval(async () => {
      console.log("Interval..");
      await smsReceiver();
    }, 2000);
  } catch (e) {
    // snackbarAlert(e);
  }
});

const smsReceiver = async () => {
  if (!navigator.sms) return;
  //   progress.determinate = false;
  try {
    const sms = await navigator.sms.receive();
    alert(sms);
    const code = sms.content.match(/^[\s\S]*otp=([0-9]{6})[\s\S]*$/m)[1];
    if (code) {
      clearInterval(interval);
      alert(code);
      otpField.value = code;
      otpField.disabled = true;
      //   cancel.disabled = true;
      //   snackbarAlert("Verifying...");
      //   setTimeout(_continue, 2500);
    } else {
      //   progress.determinate = true;
      throw "Received the SMS, but failed to retrieve the OTP.";
    }
  } catch (e) {
    // progress.determinate = true;
    if (e.name !== "AbortError") {
      throw "Failed to receive SMS";
    }
  }
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
