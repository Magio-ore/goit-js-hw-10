import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const delay = parseInt(formData.get("delay"), 10);
    const state = formData.get("state");

    // Створюємо проміс
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === "fulfilled") {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });

    // Обробка успішного виконання
    promise
      .then((delay) => {
        iziToast.success({
          message: `✅ Fulfilled promise in ${delay}ms`,
          position: "topRight",
        });
      })
      // Обробка відхилення
      .catch((delay) => {
        iziToast.error({
          message: `❌ Rejected promise in ${delay}ms`,
          position: "topRight",
        });
      });

    // Очистити форму після сабміту
    form.reset();
  });
}

