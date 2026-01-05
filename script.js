gsap.registerPlugin(ScrollTrigger);

// =========================================
// 1. INTRO SEQUENCE (AUTO FADE)
// =========================================

window.addEventListener('load', () => {

    // A. Attempt to Play Music
    const audio = document.getElementById('intro-audio');
    if (audio) {
        audio.volume = 1.0;
        // Auto-play might be blocked by browser until user interaction elsewhere
        audio.play().catch(() => console.log("Autoplay waiting for interaction..."));
    }

    // B. Reveal "Jagadguru Shri Kripalu Ji Maharaj"
    setTimeout(() => {
        const line1 = document.querySelector('.line-1');
        if (line1) line1.classList.add('visible');
    }, 500);

    // C. Reveal "Radha Govind Dham"
    setTimeout(() => {
        const line2 = document.querySelector('.line-2');
        if (line2) line2.classList.add('visible');
    }, 1500);

    // D. Auto Fade Out (No Button)
    setTimeout(() => {
        const introScreen = document.getElementById('intro-sequence');

        if (introScreen) {
            // 1. Fade Visuals
            introScreen.style.opacity = '0';

            // 2. Fade Audio Smoothly
            if (audio) {
                let fadeAudio = setInterval(() => {
                    if (audio.volume > 0.1) {
                        audio.volume -= 0.1;
                    } else {
                        clearInterval(fadeAudio);
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }, 100);
            }

            // 3. Remove from DOM
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 1000);
        }
    }, 3500); // Waits 3.5 seconds then fades
});

// =========================================
// 2. MENU INTERACTION
// =========================================
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close-menu');
const menuOverlay = document.getElementById('menu-overlay');
const navLinks = document.querySelectorAll('.nav-item');

if (menuBtn && menuOverlay) {
    // Open Menu
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        gsap.fromTo(".nav-item",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 }
        );
    });

    // Close Menu
    closeBtn.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });

    // Close on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    });
}

// =========================================
// 3. ANIMATIONS (ScrollTrigger)
// =========================================

// Fade In Panels
gsap.utils.toArray('.panel').forEach(section => {
    try {
        const content = section.querySelector('.panel-content');
        if (content) {
            gsap.from(content, {
                scrollTrigger: { trigger: section, start: "top 70%" },
                y: 50, opacity: 0, duration: 1
            });
        }
    } catch (e) { console.log("Section animation skipped", e); }
});

// Timeline Animation
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        x: i % 2 === 0 ? -50 : 50,
        duration: 1
    });
});

// =========================================
// 4. GALLERY LIGHTBOX
// =========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');
const closeLightbox = document.querySelector('.close-lightbox');

if (lightbox) {
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            captionText.innerHTML = img.alt;
        });
    });

    closeLightbox.addEventListener('click', () => lightbox.style.display = "none");
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) lightbox.style.display = "none";
    });
}

// =========================================
// 5. SHIVIR PAYMENT LOGIC
// =========================================

// Update Total Display
function updateTotal() {
    const fixedFee = 3000;
    const extraSeva = parseInt(document.getElementById('reg-seva').value) || 0;
    const total = fixedFee + extraSeva;
    const totalEl = document.getElementById('total-amount');
    if (totalEl) totalEl.innerText = "₹" + total.toLocaleString('en-IN');
}

const shivirForm = document.getElementById('shivir-payment-form');

if (shivirForm) {
    shivirForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get Values
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;

        if (!name || !phone || !email) {
            alert("Please fill in all details.");
            return;
        }

        // Calculate Amount
        const fixedFee = 3000;
        const extraSeva = parseInt(document.getElementById('reg-seva').value) || 0;
        const totalAmountINR = fixedFee + extraSeva;
        const totalAmountPaise = totalAmountINR * 100;

        // Razorpay Options
        var options = {
            "key": "YOUR_RAZORPAY_KEY_ID", // 🔴 REPLACE WITH REAL KEY
            "amount": totalAmountPaise,
            "currency": "INR",
            "name": "Radha Govind Dham",
            "description": "Shivir Registration (Winter 2025)",
            "image": "images/logo.png",
            "prefill": {
                "name": name,
                "email": email,
                "contact": phone
            },
            "theme": { "color": "#FFD700" },

            "handler": function (response) {
                alert("Payment Successful! Downloading Receipt...");

                // Generate Receipt
                generatePDFReceipt(name, totalAmountINR, response.razorpay_payment_id, email);

                // Send WhatsApp to Admin
                const adminPhone = "919780881008";
                const msg =
                    `*New Shivir Registration* 🎉\n` +
                    `-------------------\n` +
                    `👤 Name: ${name}\n` +
                    `📧 Email: ${email}\n` +
                    `📞 Phone: ${phone}\n` +
                    `💰 Paid: ₹${totalAmountINR}\n` +
                    `🆔 Txn ID: ${response.razorpay_payment_id}`;

                setTimeout(() => {
                    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                }, 1000);
            }
        };

        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
    });
}

// =========================================
// 6. DONATION LOGIC + PAN CHECK
// =========================================

const donateForm = document.getElementById('donation-form');

// Helper to set amount
function setAmount(val) {
    const amtInput = document.getElementById('donate-amount');
    if (amtInput) amtInput.value = val;
}

if (donateForm) {
    // Real-time Auto Capitalize
    const panInput = document.getElementById('donate-pan');
    if (panInput) {
        panInput.addEventListener('input', function () {
            this.value = this.value.toUpperCase();
            document.getElementById('pan-error').style.display = 'none';
            this.style.borderColor = "rgba(255, 255, 255, 0.2)";
        });
    }

    donateForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('donate-name').value;
        const email = document.getElementById('donate-email').value;
        const phone = document.getElementById('donate-phone').value;
        const amount = document.getElementById('donate-amount').value;

        const panInput = document.getElementById('donate-pan');
        const panValue = panInput ? panInput.value.trim().toUpperCase() : "";
        const panError = document.getElementById('pan-error');

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        // STRICT Regex (4th letter P)
        const panRegex = /^[A-Z]{3}P[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

        if (panValue !== "") {
            if (!panRegex.test(panValue)) {
                panInput.style.borderColor = "#ff6b6b";
                panError.style.display = "block";
                panError.innerText = "Invalid Personal PAN (4th letter must be P).";
                return;
            } else {
                panInput.style.borderColor = "rgba(255, 255, 255, 0.2)";
                panError.style.display = "none";
            }
        }

        // Razorpay Options
        var options = {
            "key": "YOUR_RAZORPAY_KEY_ID", // 🔴 REPLACE WITH REAL KEY
            "amount": amount * 100,
            "currency": "INR",
            "name": "Kripalu Padma Trust",
            "description": "Donation - Gift of Seva",
            "image": "images/logo.png",
            "notes": {
                "donor_pan": panValue // Sends PAN to Dashboard
            },
            "handler": function (response) {
                alert("Payment Successful! ID: " + response.razorpay_payment_id);
                generatePDFReceipt(name, amount, response.razorpay_payment_id, email, panValue);
            },
            "prefill": {
                "name": name,
                "email": email,
                "contact": phone
            },
            "theme": { "color": "#FFD700" }
        };

        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert("Payment Failed");
        });
        rzp1.open();
    });
}

// =========================================
// 7. PDF RECEIPT GENERATOR
// =========================================
function generatePDFReceipt(name, amount, payId, email, pan) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(200, 150, 0);
    doc.text("Radha Govind Dham", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Managed by Kripalu Padma Trust", 105, 30, null, null, "center");
    doc.text("Village Chail, Distt. Solan, HP", 105, 36, null, null, "center");

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(16);
    doc.text("DONATION RECEIPT", 105, 60, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 75);
    doc.text(`Receipt No: ${payId}`, 20, 75);

    doc.text("Received with gratitude from:", 20, 95);
    doc.setFont("helvetica", "bold");
    doc.text(name, 20, 105);

    if (pan) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`PAN No: ${pan}`, 20, 112);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
    }

    doc.setFont("helvetica", "normal");
    doc.text("The sum of:", 20, 125);
    doc.setFont("helvetica", "bold");
    doc.text(`INR ${amount}/-`, 20, 135);

    doc.setFont("helvetica", "normal");
    doc.text(" towards 'The Gift of Seva' (Charitable Contribution).", 20, 150);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Thank you for your generous support.", 105, 180, null, null, "center");
    doc.text("This is a computer-generated receipt.", 105, 186, null, null, "center");

    doc.save(`Donation_Receipt_${name}.pdf`);
}

// =========================================
// 8. CAROUSEL LOGIC
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');

    if (!track) return; // Exit if no carousel

    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoPlayInterval;

    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(currentIndex + 1);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(currentIndex - 1);
    });

    startAutoPlay();
});

// =========================================
// 9. DARSHAN / MEET MODAL
// =========================================
const darshanModal = document.getElementById('darshan-modal');
const closeDarshanBtn = document.querySelector('#darshan-modal .close-modal');

function openMeetForm() {
    if (darshanModal) {
        darshanModal.style.display = "flex";
        gsap.fromTo(".modal-content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 }
        );
    }
}

if (closeDarshanBtn) {
    closeDarshanBtn.addEventListener('click', () => {
        darshanModal.style.display = "none";
    });
}

window.addEventListener('click', (e) => {
    if (e.target === darshanModal) {
        darshanModal.style.display = "none";
    }
});

// =========================================
// 10. WHATSAPP SEND LOGIC
// =========================================
function sendDarshanRequest(event) {
    event.preventDefault();

    const name = document.getElementById('d-name').value;
    const phone = document.getElementById('d-phone').value;
    const occupation = document.getElementById('d-occupation').value;
    const city = document.getElementById('d-city').value;
    const msg = document.getElementById('d-msg').value;

    const adminPhone = "919780881008";

    const rawText =
        `*Radhe Radhe! New Spritual Meet and Greet Request* 🌸\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `💼 *Occupation:* ${occupation}\n` +
        `📍 *City:* ${city}\n` +
        `📝 *Message:* ${msg}\n` +
        `--------------------------------`;

    const encodedText = encodeURIComponent(rawText);
    const url = `https://wa.me/${adminPhone}?text=${encodedText}`;
    window.open(url, '_blank');

    if (darshanModal) darshanModal.style.display = "none";
}

// =========================================
// 11. MENU HOVER PREVIEW
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuImg = document.getElementById('menu-preview-img');
    const menuCaption = document.getElementById('menu-caption');
    const navLinks = document.querySelectorAll('.nav-item');

    if (menuImg && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const newImg = link.getAttribute('data-img');
                const newText = link.getAttribute('data-text');

                if (newImg) {
                    menuImg.style.opacity = 0;
                    if (menuCaption) menuCaption.style.opacity = 0;

                    setTimeout(() => {
                        menuImg.src = newImg;
                        if (menuCaption && newText) menuCaption.innerText = newText;
                        menuImg.style.opacity = 1;
                        if (menuCaption) menuCaption.style.opacity = 1;
                    }, 200);
                }
            });
        });
    }
});

function closeMenu() {
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay) {
        menuOverlay.classList.remove('active');
    }
}

// =========================================
// 12. SMOOTH SCROLL (LENIS)
// =========================================
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}