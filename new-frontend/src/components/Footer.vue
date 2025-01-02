<template>
  <footer class="site-footer">
    <div class="footer-links">
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms-of-service">Terms of Service</a>
      <a href="/feedback">Feedback Form</a>
    </div>
    <div class="social-media">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.site-footer {
  background-color: #000;
  color: #fff;
  padding: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.footer-links {
  margin-bottom: 10px;
}

.footer-links a,
.social-media a {
  color: #d8b4e2;
  margin: 0 10px;
  text-decoration: none;
}

.footer-links a:hover,
.social-media a:hover {
  text-decoration: underline;
}
</style>
