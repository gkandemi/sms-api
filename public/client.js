// import { MDCRipple } from 'https://unpkg.com/@material/ripple@latest/dist/mdc.ripple.min.js?module';
// import { MDCTextField } from 'https://unpkg.com/@material/textfield@latest/dist/mdc.textfield.min.js?module';
// import { MDCTopAppBar } from 'https://unpkg.com/@material/top-app-bar@latest/dist/mdc.topAppBar.min.js?module';
// import { MDCDrawer } from 'https://unpkg.com/@material/drawer@latest/dist/mdc.drawer.min.js?module';

const buttonRipple = new mdc.ripple.MDCRipple(
  document.querySelector(".mdc-button")
);
const iconButtonRipple = new mdc.ripple.MDCRipple(
  document.querySelector(".mdc-icon-button")
);
iconButtonRipple.unbounded = true;
const formField = new mdc.formField.MDCFormField(
  document.querySelector(".mdc-form-field")
);
const snackbar = new mdc.snackbar.MDCSnackbar(
  document.querySelector(".mdc-snackbar")
);
const progress = new mdc.linearProgress.MDCLinearProgress(
  document.querySelector(".mdc-linear-progress")
);

const phoneForm = document.querySelector("#phone-form");
const otpForm = document.querySelector("#otp-form");
const otpField = new mdc.textField.MDCTextField(
  document.querySelector("#otp-field")
);
const select = new mdc.select.MDCSelect(document.querySelector(".mdc-select"));
const message = document.querySelector("#message");
const copy = document.querySelector("#copy");
const verify = document.querySelector("#verify");
const cancel = document.querySelector("#cancel");

const success = document.querySelector("#success");
const back = document.querySelector("#back");
const sb = document.querySelector("#snackbar");
const install = document.querySelector("#install");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

const snackbarAlert = text => {
  sb.innerText = text;
  snackbar.open();
};

const smsReceiver = async () => {
  if (!navigator.sms) return;

  progress.determinate = false;
  try {
    const sms = await navigator.sms.receive();
    const code = sms.content.match(/^[\s\S]*otp=([0-9]{6})[\s\S]*$/m)[1];
    if (code) {
      otpField.value = code;
      otpField.disabled = true;
      cancel.disabled = true;

      snackbarAlert("Verifying...");
      setTimeout(_continue, 2500);
    } else {
      progress.determinate = true;
      throw "Received the SMS, but failed to retrieve the OTP.";
    }
  } catch (e) {
    progress.determinate = true;
    if (e.name !== "AbortError") {
      throw "Failed to receive SMS";
    }
  }
};

const changeMessage = () => {
  message.innerText = `Your OTP is: 123456.

For: https://${window.location.host}/?otp=123456&${select.value}`;
};

select.listen("MDCSelect:change", changeMessage);

copy.addEventListener("click", e => {
  e.preventDefault();
  const range = document.createRange();
  range.selectNode(message);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  snackbarAlert("Message copied.");
});

verify.addEventListener("click", async e => {
  e.preventDefault();
  try {
    phoneForm.classList.remove("visible");
    otpForm.classList.add("visible");
    success.classList.remove("visible");
    await smsReceiver();
  } catch (e) {
    snackbarAlert(e);
  }
});

const _continue = async e => {
  if (!otpForm.checkValidity()) {
    throw "Please enter a valid one time code.";
  }
  progress.determinate = true;
  phoneForm.classList.remove("visible");
  otpForm.classList.remove("visible");
  success.classList.add("visible");
  snackbarAlert("You are successfully verified!");
};

const _back = async e => {
  progress.determinate = true;
  otpField.value = "";
  cancel.disabled = false;
  phoneForm.classList.add("visible");
  otpForm.classList.remove("visible");
  success.classList.remove("visible");
};

cancel.addEventListener("click", _back);
back.addEventListener("click", _back);

phoneForm.addEventListener("submit", async e => {
  e.preventDefault();
});

otpForm.addEventListener("submit", async e => {
  e.preventDefault();
});

if (!navigator.sms) {
  const caution = document.querySelector("#unsupported");
  caution.classList.add("visible");
}

changeMessage();

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  let installEvent = e;
  install.classList.remove("invisible");
  install.addEventListener("click", async () => {
    installEvent.prompt();
    // install.classList.add('invisible');
  });
});
