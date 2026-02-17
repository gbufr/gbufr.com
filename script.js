const RECAPTCHA_SITE_KEY = '6LcZBG8sAAAAAOFMNSSwyKTJZTiTr1Mnn1PAxxuL';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZHlieWpqeWJ6cmdzdG5ncWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDQ5NDMsImV4cCI6MjA4NjkyMDk0M30.KRlU83jvKOGRjIIRDaDiyGJe6ZN7J0VfSBz34QOTbcI';
const EDGE_FUNCTION_URL = 'https://pudybyjjybzrgstngqix.supabase.co/functions/v1/recaptcha-waitlist';

document.getElementById('waitlist-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    const button = this.querySelector('button');

    button.textContent = 'Joining...';
    button.disabled = true;

    grecaptcha.ready(function () {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' }).then(async function (token) {
            try {
                const response = await fetch(EDGE_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        email: email,
                        recaptchaToken: token
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to join waitlist');
                }

                document.getElementById('waitlist-form').innerHTML = `
                    <div class="success-message" style="padding: 1rem; color: var(--accent-primary); font-weight: 600; text-align: center;">
                        Thanks! We'll keep you updated at ${email}.
                    </div>`;
            } catch (err) {
                console.error('Waitlist error:', err);
                button.textContent = 'Join Waitlist';
                button.disabled = false;
                alert(err.message || 'Something went wrong. Please try again.');
            }
        });
    });
});

// Subtle parallax effect on background
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    const overlay = document.querySelector('.background-overlay');
    if (overlay) overlay.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
