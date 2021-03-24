const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function getFormData(form) {
  const entries = new FormData(form);
  const data = Object.fromEntries(entries);

  const file1 = data["file[0]"];
  const file2 = data["file[1]"];

  return [file1, file2];
}

function setDrawImage(...args) {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  ctx.drawImage(...args);
}

function updateCanvasDimension() {
  const canvas = document.querySelector("canvas");
  const image1 = document.querySelector(".image1") || { width: 0, height: 0 };
  const image2 = document.querySelector(".image2") || { width: 0, height: 0 };

  const largeWidthBetweenImages =
    image1.width > image2.width ? image1.width : image2.width;

  canvas.width = largeWidthBetweenImages;
  canvas.height = image1.height + image2.height;
}

function finishProcess() {
  const canvas = document.querySelector("canvas");

  const image = canvas.toDataURL("image/jpg");

  const imgElement = document.createElement("img");

  imgElement.src = image;

  document.querySelector("span").appendChild(imgElement);

  document.querySelector("a").setAttribute("href", image);
}

function onLoadImg(imageElement) {
  document.querySelector("div").appendChild(imageElement);
}

async function onChangeInput(inputNumber) {
  const formData = getFormData(document.querySelector("form"));

  const fileBase64 = await fileToBase64(formData[inputNumber - 1]);
  const imageElement = document.createElement("img");

  imageElement.src = fileBase64;
  imageElement.classList.add(`image${inputNumber}`);
  imageElement.onload = () => onLoadImg(imageElement);
}

function setImagesOnCanvas() {
  const imgElement1 = document.querySelector(".image1");
  const imgElement2 = document.querySelector(".image2");

  setDrawImage(imgElement1, 0, 0, imgElement1.width, imgElement1.height);
  setDrawImage(
    imgElement2,
    0,
    imgElement1.height,
    imgElement2.width,
    imgElement2.height
  );
}

function onSubmit(event) {
  event.preventDefault();

  // Not change order there functions to avoid a bug
  updateCanvasDimension();
  setImagesOnCanvas();
  finishProcess();
}

function onToggleDisabledFirstInput(event) {
  document.querySelectorAll("input")[1].disabled = !event.target.value;
}

function onToggleAllowSetSecondFile(event) {
  const inputs = document.querySelectorAll("input");

  if (!inputs[0].value) event.preventDefault();
}

function loaded() {
  const inputs = document.querySelectorAll("input");

  document.querySelector("form").addEventListener("submit", onSubmit);

  inputs[0].addEventListener("change", () => onChangeInput(1));
  inputs[1].addEventListener("change", () => onChangeInput(2));

  inputs[0].addEventListener("change", onToggleDisabledFirstInput);
  inputs[1].addEventListener("click", onToggleAllowSetSecondFile);
}

window.addEventListener("load", loaded);
