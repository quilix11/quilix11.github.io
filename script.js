/* ==========================================================================
   CAFE "ВЕЧІРНІЙ ВОКЗАЛ" - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHolidayBanner();
    initMenuTabs();
    initStarRatingSelect();
    initReviewModal();
    initScrollSpy();
});

/* --- Mobile Navigation Toggle --- */
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile nav when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }
}

/* --- Holiday Warning Banner --- */
function initHolidayBanner() {
    const closeBannerBtn = document.getElementById('closeBannerBtn');
    const holidayBanner = document.getElementById('holidayBanner');
    
    if (closeBannerBtn && holidayBanner) {
        closeBannerBtn.addEventListener('click', () => {
            holidayBanner.style.display = 'none';
        });
    }
}

/* --- Menu Tab Filtering --- */
function initMenuTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --- Order Item Toast Action --- */
function orderItem(itemName) {
    showToast(`Замовлення "${itemName}" додано! Затефонуйте нам для швидкого оформлення: +38 (097) 000-00-00`);
}

/* --- Review Submission Modal & Rating Picker --- */
let selectedRating = 5;
let reviewsCount = 29;
let currentScoreSum = 3.3 * 29; // ~95.7

function initStarRatingSelect() {
    const stars = document.querySelectorAll('#starSelect i');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

function initReviewModal() {
    const openBtn = document.getElementById('openReviewModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('reviewModal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

function handleReviewSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('reviewerNameInput');
    const textInput = document.getElementById('reviewTextInput');
    const modal = document.getElementById('reviewModal');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) return;

    // Prepend new review to review grid
    const reviewsGrid = document.getElementById('reviewsGrid');
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card highlight-card';

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= selectedRating) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        } else {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }
    }

    const firstLetter = name.charAt(0).toUpperCase();

    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="avatar-circle avatar-gold">${firstLetter}</div>
            <div>
                <h4 class="reviewer-name">${escapeHtml(name)}</h4>
                <span class="review-date">Щойно</span>
            </div>
            <div class="review-rating">${starsHtml}</div>
        </div>
        <p class="review-text">"${escapeHtml(text)}"</p>
        <div class="review-chip gold-chip">✨ Новий відгук відвідувача</div>
    `;

    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);

    // Recalculate stats
    reviewsCount += 1;
    currentScoreSum += selectedRating;
    const newAvg = (currentScoreSum / reviewsCount).toFixed(1);

    document.getElementById('avgScoreDisplay').innerText = newAvg;
    document.getElementById('totalReviewsDisplay').innerText = `Загалом ${reviewsCount} відгуків`;

    // Reset and close
    nameInput.value = '';
    textInput.value = '';
    modal.classList.remove('active');

    showToast('Дякуємо! Ваш відгук успішно опубліковано.');
}

/* --- Utility Toast Message --- */
function showToast(message) {
    let toast = document.getElementById('customToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'customToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #1E293B, #0F172A);
            color: #F8FAFC;
            border: 1px solid #F59E0B;
            padding: 1rem 1.5rem;
            border-radius: 14px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 3000;
            font-size: 0.95rem;
            max-width: 380px;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 4000);
}

/* --- ScrollSpy active links --- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}
