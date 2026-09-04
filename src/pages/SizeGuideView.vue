<template>
  <div class="retail-shell min-h-screen">
    <MainTopBar />

    <main class="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-4 py-10 md:px-8 xl:px-10">
      <section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article class="retail-card px-6 py-7 sm:px-8 lg:px-9 lg:py-9">
          <span class="retail-kicker">Hướng dẫn đo size áo</span>
          <h1 class="retail-heading mt-4 text-[54px] leading-[0.92] text-slate-800 sm:text-[72px]">Chọn đúng form dáng ngay từ lần đầu.</h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
            Đo đúng vòng ngực, chiều cao và cân nặng rồi đối chiếu bảng size bên dưới.
            Cách này giúp bạn có chiếc áo thể thao vừa vặn, thoải mái nhất khi vận động.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <article v-for="tip in quickTips":key="tip.title"class="rounded-[24px] border border-slate-200 bg-white/80 p-5">
              <span class="material-symbols-outlined text-[28px] text-primary">{{ tip.icon }}</span>
              <h3 class="mt-3 text-lg font-semibold text-slate-800">{{ tip.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">{{ tip.description }}</p>
            </article>
          </div>
        </article>

        <article class="retail-card overflow-hidden p-0">
          <img
            alt="Áo thể thao nam"
            class="aspect-[4/5] h-full w-full object-cover lg:min-h-[430px]"
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1400&q=80"
          >
        </article>
      </section>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article class="retail-card overflow-hidden">
          <div class="border-b border-slate-200 px-6 py-5">
            <h2 class="text-2xl font-semibold text-slate-800">Bảng size Nam / Unisex</h2>
          </div>
          <div class="overflow-x-auto px-6 py-5">
            <table class="w-full min-w-[320px] text-sm">
              <thead>
                <tr class="text-left text-slate-500">
                  <th class="py-2">Size</th>
                  <th class="py-2">Chiều cao (cm)</th>
                  <th class="py-2">Cân nặng (kg)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#27272a]">
                <tr v-for="row in menRows":key="row.size"class="text-slate-800">
                  <td class="py-3 font-semibold text-primary">{{ row.size }}</td>
                  <td class="py-3">{{ row.height }}</td>
                  <td class="py-3">{{ row.weight }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="retail-card overflow-hidden">
          <div class="border-b border-slate-200 px-6 py-5">
            <h2 class="text-2xl font-semibold text-slate-800">Bảng size Nữ</h2>
          </div>
          <div class="overflow-x-auto px-6 py-5">
            <table class="w-full min-w-[320px] text-sm">
              <thead>
                <tr class="text-left text-slate-500">
                  <th class="py-2">Size</th>
                  <th class="py-2">Chiều cao (cm)</th>
                  <th class="py-2">Cân nặng (kg)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#27272a]">
                <tr v-for="row in womenRows":key="row.size"class="text-slate-800">
                  <td class="py-3 font-semibold text-primary">{{ row.size }}</td>
                  <td class="py-3">{{ row.height }}</td>
                  <td class="py-3">{{ row.weight }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section class="retail-card px-6 py-7 sm:px-8">
        <span class="retail-kicker">Mẹo nhỏ trước khi mua</span>
        <div class="mt-5 grid gap-5 md:grid-cols-3">
          <article v-for="tip in fittingNotes":key="tip.title"class="rounded-[24px] bg-white/60 border border-slate-200 p-5">
            <h3 class="text-lg font-semibold text-slate-800">{{ tip.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ tip.description }}</p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
  import MainTopBar from '@/components/MainTopBar.vue'

  const quickTips = [
    {
      icon: 'straighten',
      title: 'Đo vòng ngực',
      description: 'Dùng thước dây đo vòng qua phần lớn nhất của ngực để chọn size áo chuẩn xác nhất.',
    },
    {
      icon: 'fitness_center',
      title: 'Chú ý form dáng',
      description: 'Áo ôm (slim fit) hay rộng (oversize) sẽ mang lại trải nghiệm và cảm giác khác biệt khi tập luyện.',
    },
    {
      icon: 'dry_cleaning',
      title: 'Chất liệu vải',
      description: 'Chất liệu co giãn nhiều bạn có thể lùi size để mặc ôm, vải cotton ít co giãn nên chọn đúng size.',
    },
  ]

  const fittingNotes = [
    {
      title: 'Nếu nằm giữa hai size',
      description: 'Nên chọn size lớn hơn nếu bạn thích thoải mái khi vận động mạnh, chọn size nhỏ hơn nếu thích ôm sát body.',
    },
    {
      title: 'Sự chênh lệch cân nặng/chiều cao',
      description: 'Nếu cân nặng và chiều cao của bạn thuộc 2 size khác nhau, ưu tiên chọn size theo cân nặng.',
    },
    {
      title: 'Khi còn phân vân',
      description: 'Bạn có thể xem thêm đánh giá tại trang chi tiết hoặc liên hệ hỗ trợ trước khi chốt đơn.',
    },
  ]

  const menRows = [
    { size: 'S', height: '160 - 165', weight: '55 - 60' },
    { size: 'M', height: '165 - 170', weight: '60 - 65' },
    { size: 'L', height: '170 - 175', weight: '65 - 70' },
    { size: 'XL', height: '175 - 180', weight: '70 - 75' },
    { size: '2XL', height: '180 - 185', weight: '75 - 80' },
    { size: '3XL', height: '185 - 190', weight: '80 - 85' },
  ]

  const womenRows = [
    { size: 'S', height: '150 - 155', weight: '40 - 45' },
    { size: 'M', height: '155 - 160', weight: '45 - 50' },
    { size: 'L', height: '160 - 165', weight: '50 - 55' },
    { size: 'XL', height: '165 - 170', weight: '55 - 60' },
    { size: '2XL', height: '170 - 175', weight: '60 - 65' },
    { size: '3XL', height: '175 - 180', weight: '65 - 70' },
  ]
</script>
