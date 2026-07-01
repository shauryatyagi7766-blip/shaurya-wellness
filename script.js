document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  body.setAttribute('data-theme', theme);
  updateThemeIcon(theme);

  if (loader) {
    window.setTimeout(() => loader.classList.add('is-hidden'), 500);
  }

  function updateThemeIcon(currentTheme) {
    const icon = themeToggle?.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
  }

  themeToggle?.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon(currentTheme);
  });

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav?.classList.toggle('is-open');
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));

  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute('data-counter'));
    const duration = 1200;
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = progress * target;
      counter.textContent = target % 1 === 0 ? Math.round(value) : value.toFixed(1);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });

  const bmiForm = document.getElementById('bmi-form');
  const bmiValue = document.getElementById('bmi-value');
  const bmiCategory = document.getElementById('bmi-category');
  const bmiAdvice = document.getElementById('bmi-advice');
  const idealWeight = document.getElementById('ideal-weight');

  function getBMIResult(height, weight) {
    const bmi = weight / ((height / 100) ** 2);
    let category = 'Normal';
    let advice = 'Keep up the healthy habits and stay consistent.';

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'A balanced meal plan and strength-focused habits can support healthy development.';
    } else if (bmi < 25) {
      category = 'Healthy Weight';
      advice = 'You are in a healthy range. Maintain balanced nutrition and regular movement.';
    } else if (bmi < 30) {
      category = 'Overweight';
      advice = 'A steady routine with portion awareness and activity can help you progress safely.';
    } else {
      category = 'Obesity';
      advice = 'Consider a structured, realistic wellness plan and professional support.';
    }

    return { bmi, category, advice };
  }

  bmiForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const height = Number(document.getElementById('height').value);
    const weight = Number(document.getElementById('weight').value);
    const result = getBMIResult(height, weight);

    bmiValue.textContent = result.bmi.toFixed(1);
    bmiCategory.textContent = result.category;
    bmiAdvice.textContent = result.advice;

    const healthyMin = 18.5 * ((height / 100) ** 2);
    const healthyMax = 24.9 * ((height / 100) ** 2);
    idealWeight.textContent = `${healthyMin.toFixed(1)} - ${healthyMax.toFixed(1)} kg`;
  });

  const heightRange = document.getElementById('height-range');
  const heightRangeValue = document.getElementById('height-range-value');
  const chart = document.getElementById('weight-chart');

  function renderWeightChart(height) {
    const idealMin = 18.5 * ((height / 100) ** 2);
    const idealMax = 24.9 * ((height / 100) ** 2);
    const points = [
      [40, 170 - (idealMin / 2.2)],
      [120, 170 - (idealMin / 2.4)],
      [200, 170 - (idealMax / 2.4)],
      [320, 170 - (idealMax / 2.2)]
    ];

    const path = `M ${points[0][0]} ${points[0][1]} C 90 150, 150 120, 200 120 S 300 130, 360 90`;
    const fillPath = `M 40 180 L ${path.split(' ')[4]} ${path.split(' ')[5]} ...`;

    chart.innerHTML = `
      <rect x="24" y="20" width="352" height="180" rx="20" fill="rgba(255,255,255,0.35)"></rect>
      <line x1="40" y1="180" x2="360" y2="180" stroke="var(--primary)" stroke-opacity="0.35" stroke-width="2"></line>
      <path d="M 40 180 L 40 60" stroke="var(--primary)" stroke-opacity="0.35" stroke-width="2"></path>
      <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"></path>
      <circle cx="200" cy="120" r="8" fill="var(--accent)"></circle>
      <text x="40" y="205" fill="currentColor">140 cm</text>
      <text x="325" y="205" fill="currentColor">210 cm</text>
      <text x="40" y="40" fill="currentColor">Ideal weight range</text>
      <text x="40" y="60" fill="currentColor">${idealMin.toFixed(1)} - ${idealMax.toFixed(1)} kg</text>
    `;
  }

  heightRange?.addEventListener('input', () => {
    const value = heightRange.value;
    heightRangeValue.textContent = value;
    renderWeightChart(Number(value));
  });

  renderWeightChart(Number(heightRange?.value || 170));

  const progressForm = document.getElementById('progress-form');
  const progressPercent = document.getElementById('progress-percent');
  const weeklyTrend = document.getElementById('weekly-trend');
  const measurementOutput = document.getElementById('measurement-output');
  const progressChart = document.getElementById('progress-chart');

  function renderProgressChart(start, current, target) {
    const width = 320;
    const height = 180;
    const padding = 24;
    const min = Math.min(start, current, target) - 3;
    const max = Math.max(start, current, target) + 3;
    const xPositions = [padding, width / 2, width - padding];
    const y = (value) => height - padding - ((value - min) / (max - min)) * (height - padding * 2);
    const points = xPositions.map((x, index) => {
      const values = [start, current, target];
      return `${x},${y(values[index])}`;
    }).join(' ');

    progressChart.innerHTML = `
      <line x1="24" y1="156" x2="296" y2="156" stroke="var(--primary)" stroke-opacity="0.3" stroke-width="2"></line>
      <polyline points="${points}" fill="none" stroke="var(--primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      <circle cx="24" cy="${y(start)}" r="6" fill="var(--accent)"></circle>
      <circle cx="160" cy="${y(current)}" r="6" fill="var(--primary)"></circle>
      <circle cx="296" cy="${y(target)}" r="6" fill="var(--accent)"></circle>
      <text x="24" y="174" fill="currentColor">Start</text>
      <text x="140" y="174" fill="currentColor">Current</text>
      <text x="260" y="174" fill="currentColor">Target</text>
    `;
  }

  progressForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const start = Number(document.getElementById('start-weight').value);
    const current = Number(document.getElementById('current-weight').value);
    const target = Number(document.getElementById('target-weight').value);
    const measurement = document.getElementById('measurements').value;

    const progress = Math.max(0, Math.min(100, ((start - current) / (start - target)) * 100));
    progressPercent.textContent = `${progress.toFixed(0)}%`;
    weeklyTrend.textContent = current < start ? 'Improving' : 'Stable';
    measurementOutput.textContent = measurement;
    renderProgressChart(start, current, target);
  });

  renderProgressChart(78, 72, 68);

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete all required fields.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    formStatus.textContent = 'Thank you! Your message has been prepared for follow-up.';
    contactForm.reset();
  });
});
