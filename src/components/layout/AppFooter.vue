<template>
  <footer class="footer-wrap">
    <div class="page-container footer-inner">
      <div class="footer-column footer-brand-section">
        <div class="display-heading footer-brand">Purr & Pour</div>
        <p class="footer-message">
          Every visit helps support our cats, our community, and their forever homes. 🐾
        </p>
      </div>

      <div class="footer-column">
        <h3>Explore</h3>
        <nav class="footer-links" aria-label="Footer navigation">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/visit">Visit</RouterLink>
          <RouterLink to="/cats">Our Cats</RouterLink>
          <RouterLink to="/membership">Membership</RouterLink>
        </nav>
      </div>

      <div class="footer-column">
        <h3>Contact</h3>
        <p>Email: <a href="mailto:hello@purrandpour.com">hello@purrandpour.com</a></p>
        <p>Phone: <a href="tel:+61390001234">(03) 9000 1234</a></p>
        <p>Melbourne, Victoria</p>
      </div>

      <div class="footer-column">
        <h3>Opening Hours</h3>
        <p>Mon–Fri: 9:00 AM – 6:00 PM</p>
        <p>Sat–Sun: 10:00 AM – 5:00 PM</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 Purr & Pour. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrap {
  background: var(--color-cream);
  border-top: 1px solid rgba(179, 156, 142, 0.3);
  padding: 3rem 0 1rem;
  color: var(--color-text);
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 1.2fr;
  gap: 2rem;
  align-items: start;
}

.footer-brand {
  color: var(--color-accent);
  font-size: 1.9rem;
  margin-bottom: 0.75rem;
}

.footer-message {
  max-width: 340px;
  line-height: 1.6;
  color: rgba(70, 50, 40, 0.8);
}

.footer-column h3 {
  margin-bottom: 0.9rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-accent);
}

.footer-column p {
  margin: 0.4rem 0;
  line-height: 1.5;
  color: rgba(70, 50, 40, 0.82);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.footer-links a,
.footer-column a {
  color: rgba(70, 50, 40, 0.82);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover,
.footer-column a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(179, 156, 142, 0.25);
  text-align: center;
  font-size: 0.9rem;
  color: rgba(70, 50, 40, 0.65);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-wrap {
    padding: 2.5rem 0 1rem;
  }

  .footer-inner {
    grid-template-columns: 1fr;
  }

  .footer-brand {
    font-size: 1.7rem;
  }
}
</style>