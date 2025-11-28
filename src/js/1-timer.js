import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Змінна для зберігання обраної дати
let userSelectedDate = null;

// Елементи DOM
const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

// Перевірка наявності всіх необхідних елементів
if (!datetimePicker || !startButton || !daysValue || !hoursValue || !minutesValue || !secondsValue) {

} else {
  // Ініціалізація: кнопка Start неактивна
  startButton.disabled = true;

  // Змінна для інтервалу таймера
  let countdownInterval = null;

  // Функція для форматування часу з leading zero
  function addLeadingZero(value) {
    return String(value).padStart(2, "0");
  }

  // Функція для конвертації мілісекунд
  function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  // Функція для оновлення інтерфейсу таймера
  function updateTimerDisplay(timeLeft) {
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    
    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }

  // Функція для запуску таймера
  function startCountdown() {
    if (!userSelectedDate) {
      return;
    }

    // Вимкнути кнопку та інпут
    startButton.disabled = true;
    datetimePicker.disabled = true;

    // Очистити попередній інтервал, якщо він існує
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    // Функція для оновлення таймера
    function updateTimer() {
      const now = new Date().getTime();
      const targetTime = userSelectedDate.getTime();
      const timeLeft = targetTime - now;

      if (timeLeft <= 0) {
        // Таймер досягнув кінця
        updateTimerDisplay(0);
        clearInterval(countdownInterval);
        countdownInterval = null;
        // Увімкнути інпут після зупинки таймера
        datetimePicker.disabled = false;
        return;
      }

      updateTimerDisplay(timeLeft);
    }

    // Оновити одразу
    updateTimer();

    // Оновлювати кожну секунду
    countdownInterval = setInterval(updateTimer, 1000);
  }

  // Обробник події для кнопки Start
  startButton.addEventListener("click", startCountdown);

  // Налаштування flatpickr
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      if (selectedDates.length === 0) {
        return;
      }

      const selectedDate = selectedDates[0];
      const now = new Date();

      // Перевірка, чи дата в минулому
      if (selectedDate < now) {
        // Дата в минулому
        userSelectedDate = null;
        startButton.disabled = true;
        
        iziToast.error({
          title: "Error",
          message: "Please choose a date in the future",
          position: "topRight",
        });
      } else {
        // Валідна дата в майбутньому
        userSelectedDate = selectedDate;
        startButton.disabled = false;
      }
    },
  };

  const flatpickrInstance = flatpickr("#datetime-picker", options);
}
