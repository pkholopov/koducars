// --- Логика переключения тёмной темы ---
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    const html = document.documentElement;
    const sunIcon = toggleBtn?.querySelector(".theme-icon-sun");
    const moonIcon = toggleBtn?.querySelector(".theme-icon-moon");

    // Применяем сохранённую тему
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        html.setAttribute("data-theme", "dark");
        if (sunIcon) sunIcon.style.display = "none";
        if (moonIcon) moonIcon.style.display = "block";
    }

    toggleBtn?.addEventListener("click", () => {
        const isDark = html.getAttribute("data-theme") === "dark";
        if (isDark) {
            html.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            if (sunIcon) sunIcon.style.display = "block";
            if (moonIcon) moonIcon.style.display = "none";
        } else {
            html.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            if (sunIcon) sunIcon.style.display = "none";
            if (moonIcon) moonIcon.style.display = "block";
        }
    });
});

// Четвертый вариант слогана с адаптацией под новую концепцию
const words = ["сроков", "качества", "цены"];
let currentWordIndex = 0;
let typingTimer;

function startTypingEffect() {
    let lettersArray = words[currentWordIndex].split("");
    
    const loopTyping = () => {
        if (lettersArray.length > 0) {
            document.querySelector('.dynamic-txt').innerHTML += lettersArray.shift();
        } else {
            setTimeout(startDeletingEffect, 2500); // Чуть увеличили задержку для комфортного чтения
            return false;
        }
        typingTimer = setTimeout(loopTyping, 120); // Сделали печать более размеренной и премиальной
    };
    loopTyping();
}

function startDeletingEffect() {
    let lettersArray = words[currentWordIndex].split("");
    
    const loopDeleting = () => {
        if (lettersArray.length > 0) {
            lettersArray.pop();
            document.querySelector('.dynamic-txt').innerHTML = lettersArray.join("");
        } else {
            if (words.length > (currentWordIndex + 1)) {
                currentWordIndex++;
            } else {
                currentWordIndex = 0;
            }
            setTimeout(startTypingEffect, 600);
            return false;
        }
        typingTimer = setTimeout(loopDeleting, 60);
    };
    loopDeleting();
}

document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.querySelector('.dynamic-txt');
    if (textContainer) {
        textContainer.innerHTML = "";
        startTypingEffect();
    }
});


//calculator

// --- Логика Калькулятора стоимости ---
document.addEventListener("DOMContentLoaded", () => {
    const countryButtons = document.querySelectorAll(".country-btn");
    const engineButtons = document.querySelectorAll(".engine-btn");
    const priceInput = document.getElementById("car-price");
    const priceSlider = document.getElementById("price-slider");
    const priceLabel = document.getElementById("price-label");

    // Словари названий валют и лимитов для красивого UX
    const currencyNames = { cn: "Юани, ¥", jp: "Иены, ¥", kr: "Воны, ₩", ae: "Дирхамы, AED", us: "Доллары, $" };
    const sliderLimits = {
        cn: { min: 50000, max: 800000, step: 5000, val: 200000 },
        jp: { min: 500000, max: 8000000, step: 50000, val: 2500000 },
        kr: { min: 10000000, max: 90000000, step: 500000, val: 35000000 },
        ae: { min: 60000, max: 600000, step: 5000, val: 150000 },
        us: { min: 15000, max: 150000, step: 1000, val: 40000 }
    };

    function updateCalculations() {
        const activeCountry = document.querySelector(".country-btn.active");
        const activeEngine = document.querySelector(".engine-btn.active");
        
        if (!activeCountry || !activeEngine || !priceInput) return;

        const rate = parseFloat(activeCountry.dataset.rate);
        const deliveryCost = parseFloat(activeCountry.dataset.delivery);
        const taxPercent = parseFloat(activeEngine.dataset.tax);
        const foreignPrice = parseFloat(priceInput.value) || 0;

        // Расчет компонентов в рублях
        const priceInRub = foreignPrice * rate;
        const taxCost = priceInRub * taxPercent;
        const companyCommission = 120000;
        const totalCost = priceInRub + taxCost + deliveryCost + companyCommission;

        // Функция форматирования чисел в денежный вид (например: 3 450 000 ₽)
        const formatMoney = (num) => Math.round(num).toLocaleString('ru-RU') + " ₽";

        // Обновление UI результатов
        document.getElementById("res-pure-price").innerText = formatMoney(priceInRub);
        document.getElementById("res-tax").innerText = formatMoney(taxCost);
        document.getElementById("res-delivery").innerText = formatMoney(deliveryCost);
        document.getElementById("res-total").innerText = formatMoney(totalCost);
    }

    // Переключение стран
    countryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            countryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const country = btn.dataset.country;
            priceLabel.innerText = `02 / Стоимость авто в стране отправления (${currencyNames[country]})`;
            
            // Динамически перенастраиваем лимиты ползунка под валюту выбранной страны
            priceSlider.min = sliderLimits[country].min;
            priceSlider.max = sliderLimits[country].max;
            priceSlider.step = sliderLimits[country].step;
            priceSlider.value = sliderLimits[country].val;
            priceInput.value = sliderLimits[country].val;

            updateCalculations();
        });
    });

    // Переключение типа двигателя
    engineButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            engineButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateCalculations();
        });
    });

    // Синхронизация слайдера и текстового инпута
    if (priceSlider && priceInput) {
        priceSlider.addEventListener("input", (e) => {
            priceInput.value = e.target.value;
            updateCalculations();
        });

        priceInput.addEventListener("input", (e) => {
            priceSlider.value = e.target.value;
            updateCalculations();
        });
    }

    // Первичный запуск расчета при загрузке страницы
    updateCalculations();
});


// --- Логика FAQ (Аккордеон) ---
document.addEventListener("DOMContentLoaded", () => {
    const faqTriggers = document.querySelectorAll(".faq-trigger");

    faqTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const currentItem = trigger.parentElement;
            const currentPanel = currentItem.querySelector(".faq-panel");
            const isActive = currentItem.classList.contains("active");

            // Сначала закрываем все остальные открытые вкладки (эффект одиночного фокуса)
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".faq-panel").style.maxHeight = null;
            });

            // Если кликнутая вкладка не была активна, открываем её
            if (!isActive) {
                currentItem.classList.add("active");
                // Динамически рассчитываем scrollHeight для плавности без фиксированной высоты
                currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
            }
        });
    });
});


// --- Логика Бесконечной ленты (Marquee) ---
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".marquee-track");
    if (!track) return;

    // Дублируем карточки для создания бесшовного эффекта зацикливания
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let currentX = 0;
    let isHovered = false;
    const speed = 0.6; // Скорость движения (чем меньше значение, тем благороднее и плавнее ход)

    function animateMarquee() {
        if (!isHovered) {
            currentX -= speed;
            
            // Если первая половина ленты (оригинальные карточки) полностью ушла влево, сбрасываем позицию в 0
            // track.scrollWidth / 2 — точная середина объединенного трека
            if (Math.abs(currentX) >= track.scrollWidth / 2) {
                currentX = 0;
            }
            
            track.style.transform = `translateX(${currentX}px)`;
        }
        requestAnimationFrame(animateMarquee);
    }

    // Обработчики событий мыши для плавной остановки при наведении
    track.addEventListener("mouseenter", () => {
        isHovered = true;
    });

    track.addEventListener("mouseleave", () => {
        isHovered = false;
    });

    // Запуск бесконечного цикла анимации
    animateMarquee();
});


// --- Логика Микро-притяжения мессенджеров (Magnetic Links) ---
document.addEventListener("DOMContentLoaded", () => {
    const magneticLinks = document.querySelectorAll(".magnetic-link");

    magneticLinks.forEach(link => {
        link.addEventListener("mousemove", (e) => {
            const rect = link.getBoundingClientRect();
            // Вычисляем расстояние от центра ссылки до курсора мыши
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Слегка сдвигаем элемент в сторону курсора (коэффициент 0.3 для премиальной мягкости)
            link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        link.addEventListener("mouseleave", () => {
            // Возвращаем элемент в исходное положение при уходе курсора
            link.style.transform = "translate(0px, 0px)";
        });
    });
});


// --- Логика Интерактивного Рентген-Сканера (X-Ray) ---
document.addEventListener("DOMContentLoaded", () => {
    const xrayBox = document.getElementById("xray-box");
    const xrayLens = document.getElementById("xray-lens");
    const xrayDot = document.getElementById("xray-dot");

    if (!xrayBox || !xrayLens || !xrayDot) return;

    xrayBox.addEventListener("mousemove", (e) => {
        // Вычисляем позицию курсора мыши относительно границ самого контейнера радара
        const rect = xrayBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Перемещаем кастомный прицел-круг за мышью
        xrayDot.style.left = `${x}px`;
        xrayDot.style.top = `${y}px`;

        // Сдвигаем маску clip-path (делаем линзу сканера радиусом 55px в точке нахождения курсора)
        xrayLens.style.clipPath = `circle(55px at ${x}px ${y}px)`;
        xrayLens.style.webkitClipPath = `circle(55px at ${x}px ${y}px)`;
    });

    // Когда мышь уходит, плавно сбрасываем стили (сработает CSS переход к дефолтному состоянию)
    xrayBox.addEventListener("mouseleave", () => {
        xrayLens.style.clipPath = "";
        xrayLens.style.webkitClipPath = "";
    });
});
