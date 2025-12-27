gsap.registerPlugin(ScrollTrigger);

// 1. INTRO ANIMATION
// --- INTRO SEQUENCE ANIMATION ---

window.addEventListener('load', () => {
    
    // 1. Reveal "Jagadguru Shri Kripalu Ji Maharaj"
    setTimeout(() => {
        const line1 = document.querySelector('.line-1');
        if(line1) line1.classList.add('visible');
    }, 500); // Starts after 0.5s

    // 2. Reveal "Radha Govind Dham"
    setTimeout(() => {
        const line2 = document.querySelector('.line-2');
        if(line2) line2.classList.add('visible');
    }, 1500); // Starts after 1.5s

    // 3. Fade Out the Black Screen & Remove it
    setTimeout(() => {
        const introScreen = document.getElementById('intro-sequence');
        if(introScreen) {
            introScreen.style.opacity = '0'; // Fade out
            
            // Wait for fade to finish, then remove from DOM
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 1000);
        }
    }, 3500); // Screen stays for 3.5s total
});

// 2. MENU INTERACTION LOGIC (The fix)
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close-menu');
const menuOverlay = document.getElementById('menu-overlay');
const navLinks = document.querySelectorAll('.nav-item');

if (menuBtn && menuOverlay) {
    // Open Menu
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        // Animate links
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

// 3. FADE IN SECTIONS
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

// 4. SADHNA SHIVIR LOGIC


// 5. TIMELINE ANIMATION
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

// 6. GALLERY LIGHTBOX
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

// 7. DARSHAN MODAL
const darshanModal = document.getElementById('darshan-modal');
const closeDarshanBtn = document.querySelector('.close-modal');
if (darshanModal && closeDarshanBtn) {
    document.querySelectorAll('.open-darshan-btn, .gold-btn').forEach(btn => {
        if (btn.innerText.includes("Darshan") || btn.innerText.includes("Meet")) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                darshanModal.style.display = "flex";
            });
        }
    });
    closeDarshanBtn.addEventListener('click', () => darshanModal.style.display = "none");
    window.addEventListener('click', (e) => {
        if (e.target == darshanModal) darshanModal.style.display = "none";
    });
}
// --- SHIVIR PAYMENT LOGIC ---

function updateTotal() {
    const fee = parseInt(document.getElementById('reg-type').value) || 0;
    const seva = parseInt(document.getElementById('reg-seva').value) || 0;
    const total = fee + seva;

    // Update the display text
    document.getElementById('total-amount').innerText = "₹" + total.toLocaleString('en-IN');
}

// Handle Form Submission
document.getElementById('shivir-payment-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Stop page reload

    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const fee = parseInt(document.getElementById('reg-type').value) || 0;
    const seva = parseInt(document.getElementById('reg-seva').value) || 0;
    const totalAmount = (fee + seva) * 100; // Razorpay takes amount in paise

    if (totalAmount <= 0) {
        alert("Please select a paid accommodation or add a Seva amount.");
        return;
    }

    // Open Razorpay
    var options = {
        "key": "YOUR_RAZORPAY_KEY_ID", // Replace with your Test Key ID
        "amount": totalAmount,
        "currency": "INR",
        "name": "Radha Govind Dham",
        "description": "Shivir Registration + Seva",
        "image": "https://via.placeholder.com/150", // Your Logo URL here
        "handler": function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            // Here you would typically send data to your backend/Google Sheet
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "theme": {
            "color": "#FFD700" // Gold Theme
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
});
// --- DONATION & PDF RECEIPT LOGIC ---

// Helper to set amount from buttons
function setAmount(val) {
    document.getElementById('donate-amount').value = val;
}

// Handle Donation Submission
const donateForm = document.getElementById('donation-form');
if (donateForm) {
    donateForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('donate-name').value;
        const email = document.getElementById('donate-email').value;
        const phone = document.getElementById('donate-phone').value;
        const amount = document.getElementById('donate-amount').value;

        if (!amount || amount <= 0) { alert("Please enter a valid amount"); return; }

        var options = {
            "key": "YOUR_RAZORPAY_KEY_ID", // REPLACE THIS!
            "amount": amount * 100, // Amount in paise
            "currency": "INR",
            "name": "Kripalu Padma Trust",
            "description": "Donation - Gift of Seva",
            "image": "https://via.placeholder.com/150", // Your Logo URL
            "handler": function (response) {
                // 1. Payment Successful Alert
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

                // 2. Generate PDF Receipt
                generatePDFReceipt(name, amount, response.razorpay_payment_id, email);
            },
            "prefill": {
                "name": name,
                "email": email, // Important for Razorpay's auto-email
                "contact": phone
            },
            "theme": { "color": "#FFD700" }
        };

        var rzp1 = new Razorpay(options);
        rzp1.open();
    });
}

// Function to Generate PDF Receipt
function generatePDFReceipt(name, amount, payId, email) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // -- PDF DESIGN --

    // Header
    doc.setFontSize(22);
    doc.setTextColor(200, 150, 0); // Gold Color
    doc.text("Radha Govind Dham", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text("Managed by Kripalu Padma Trust", 105, 30, null, null, "center");
    doc.text("Village Chail, Distt. Solan, HP", 105, 36, null, null, "center");

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45); // Line separator

    // Receipt Title
    doc.setFontSize(16);
    doc.text("DONATION RECEIPT", 105, 60, null, null, "center");

    // Details
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 75);
    doc.text(`Receipt No: ${payId}`, 20, 75);

    doc.text("Received with gratitude from:", 20, 95);
    doc.setFont("helvetica", "bold");
    doc.text(name, 20, 105);

    doc.setFont("helvetica", "normal");
    doc.text("The sum of:", 20, 120);
    doc.setFont("helvetica", "bold");
    doc.text(`INR ${amount}/-`, 20, 130);

    doc.setFont("helvetica", "normal");
    doc.text(" towards 'The Gift of Seva' (Charitable Contribution).", 20, 145);

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Thank you for your generous support.", 105, 180, null, null, "center");
    doc.text("This is a computer-generated receipt.", 105, 186, null, null, "center");

    // Save the PDF
    doc.save(`Donation_Receipt_${name}.pdf`);
}
// --- RANDOM GRACE GENERATOR (AUTO) ---

const graceLines = [
    "True peace is the presence of God.",
    "Chant the name of Hari, for it is the only truth.",
    "Serve the world, but keep your mind attached to God.",
    "Humility is the foundation of devotion.",
    "See Radha in everyone, see Krishna in everything.",
    "The tears of love are the most precious offering.",
    "Do not count the beads, count the moments of remembrance.",
    "Surrender is not an act, it is a state of being.",
    "Grace flows to the humble heart like water flows to the low ground.",
    "Every step towards the Dham is a step towards your soul."
    // PASTE YOUR FULL LIST HERE
];

document.addEventListener('DOMContentLoaded', function () {
    const displayElement = document.getElementById('daily-grace');

    if (displayElement && graceLines.length > 0) {
        // Pick a random number
        const randomIndex = Math.floor(Math.random() * graceLines.length);

        // Change the text immediately
        displayElement.innerText = graceLines[randomIndex];
    }
});