<template>
  <footer class="footer-shell">
    <div class="footer-grid">
      <div>
        <p class="footer-kicker">Peak Seven</p>
        <h3 class="footer-title">Áo thể thao chọn kỹ cho nhịp sống thật.</h3>
        <p class="footer-copy">
          Từ Áo chạy bộ, Áo tập gym đến mẫu mang hằng ngày, Peak Seven tập trung
          vào form vừa chân, phối màu dễ mặc và trải nghiệm mua sắm rõ ràng.
        </p>
      </div>

      <div>
        <h4 class="footer-heading">Mua sắm</h4>
        <div class="footer-links">
          <a href="/shop">Cửa hàng</a>
          <a href="/brands">Thương hiệu</a>
          <a href="/vouchers">Ưu đãi</a>
          <a href="/size-guide">Bảng size</a>
        </div>
      </div>

      <div>
        <h4 class="footer-heading">Chăm sóc khách hàng</h4>
        <div class="footer-links">
          <a href="/about">Về Peak Seven</a>
          <a href="/profile">Tài khoản của tôi</a>
          <a href="/cart">Giỏ hàng</a>
          <a href="mailto:support@peakseven.vn">support@peakseven.vn</a>
        </div>
      </div>

      <div>
        <h4 class="footer-heading">Kết nối</h4>
        <div class="social-links">
          <a
            v-for="item in items"
            :key="item.title"
            class="social-link"
            :href="item.href"
            rel="noopener noreferrer"
            target="_blank"
            :title="item.title"
          >
            <v-icon :icon="item.icon" :size="18" />
          </a>
        </div>
      </div>
    </div>

    <div class="footer-meta">
      <span>&copy; {{ new Date().getFullYear() }} Peak Seven. Mọi quyền được bảo lưu.</span>
      <span>Giao diện đã được Việt hóa và tinh chỉnh theo phong cách retail thực tế.</span>
    </div>
  </footer>
</template>

<script setup>
  const items = [
    {
      title: 'Instagram',
      icon: 'mdi-instagram',
      href: 'https://instagram.com',
    },
    {
      title: 'Facebook',
      icon: 'mdi-facebook',
      href: 'https://facebook.com',
    },
    {
      title: 'TikTok',
      icon: 'mdi-music-note',
      href: 'https://tiktok.com',
    },
    {
      title: 'GitHub',
      icon: `mdi-github`,
      href: 'https://github.com',
    },
  ]
</script>

<style scoped lang="sass">
  .footer-shell
    background: linear-gradient(180deg, rgba(255, 253, 248, 0.92) 0%, rgba(246, 238, 228, 0.98) 100%)
    border-top: 1px solid rgba(198, 98, 49, 0.12)
    padding: 32px 24px 18px

  .footer-grid
    max-width: 1200px
    margin: 0 auto
    display: grid
    grid-template-columns: 1.5fr repeat(3, 1fr)
    gap: 28px

  .footer-kicker
    color: #c66231
    font-size: 11px
    font-weight: 800
    letter-spacing: .22em
    text-transform: uppercase
    margin-bottom: 12px

  .footer-title
    color: #1f1712
    font-size: 32px
    line-height: 1
    font-weight: 800
    margin-bottom: 12px

  .footer-copy
    color: #6f6458
    font-size: 14px
    line-height: 1.7

  .footer-heading
    color: #1f1712
    font-size: 13px
    font-weight: 800
    letter-spacing: .12em
    text-transform: uppercase
    margin-bottom: 14px

  .footer-links
    display: grid
    gap: 10px

    a
      color: #6f6458
      text-decoration: none
      transition: color .2s ease

      &:hover
        color: #c66231

  .social-links
    display: flex
    gap: 10px
    flex-wrap: wrap

  .social-link
    width: 38px
    height: 38px
    display: inline-flex
    align-items: center
    justify-content: center
    border-radius: 999px
    background: rgba(198, 98, 49, 0.08)
    transition: background .2s ease, transform .2s ease

    &:hover
      background: rgba(198, 98, 49, 0.18)
      transform: translateY(-1px)

    :deep(.v-icon)
      color: #1f1712

  .footer-meta
    max-width: 1200px
    margin: 24px auto 0
    padding-top: 16px
    border-top: 1px solid rgba(198, 98, 49, 0.12)
    display: flex
    justify-content: space-between
    gap: 12px
    color: #8f8477
    font-size: 12px

  @media (max-width: 960px)
    .footer-grid
      grid-template-columns: 1fr 1fr

    .footer-title
      font-size: 28px

    .footer-meta
      flex-direction: column

  @media (max-width: 640px)
    .footer-grid
      grid-template-columns: 1fr
</style>
