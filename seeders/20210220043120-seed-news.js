'use strict';
const news = [{
    name: 'Fatigue Death, Penyebab Kematian Terbanyak Jemaah Haji',
    image: 'https://akcdn.detik.net.id/community/media/visual/2019/08/17/44b06635-5794-478d-8e4f-318ccc430f88_169.jpeg?w=700&q=90',
    description: `Menurut dr Edi Supriyatna MKK, Kepala Seksi Kesehatan Daerah Kerja Madinah, ada 4 faktor setidaknya yang menyebabkan jemaah haji mengalami gangguan kesehatan dan kematian. Pertama adalah air, kedua suhu, ketiga kelelahan, keempat adaptasi. Adapun jumlah kematian yang tinggi saat ini sebagian besar dipicu oleh kelelahan.

    "Itu yang disebut fatigue death," tegas dr Edi saat dihubungi detikcom.
    
    Ia menjelaskan, pada jamaah lansia atau jemaah haji yang memiliki faktor risiko internal seperti hipertensi, riwayat jantung iskemik, kencing manis, dan penyakit paru obstruktif kronis apabila kelelahan (exhausted) dan diperparah dengan suhu panas serta kurang minum maka bisa terserang fatigue death.
    
    "Jadi konvergensi penyakit metabolik pada risti (risiko tinggi), plus lingkungan panas-kering, plus kelelahan, itulah penyebab kematian," urai dr Edi.`,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jemaah Putar Otak demi Bawa Pulang Air Zamzam',
    image: 'https://akcdn.detik.net.id/community/media/visual/2019/01/02/106b1ed1-d87f-41dc-9314-60fe0b11dc1e_169.jpeg?w=700&q=90',
    description: `Larangan untuk membawa air zamzam di koper membuat jemaah galau. Beberapa di antara mereka bahkan masih penasaran untuk mengakali agar bisa membawa lebih banyak air zamzam ke kampung halaman.

    Seorang anggota jemaah yang ditemui detikcom mengatakan tak terlalu ambil pusing soal oleh-oleh yang mau dibeli dari Mekah atau Madinah. Sebab, ketika sudah sampai di Tanah Suci, 'suvenir' yang paling penting menurutnya adalah air zamzam. Pun demikian, ia sadar bahwa jemaah haji tak diperbolehkan membawa air zamzam sebagai barang bawaannya ketika pulang. Setiap orang bakal mendapat masing-masing 5 liter air zamzam yang telah disediakan Panitia Penyelenggara Haji Indonesia (PPIH).

    "Soalnya kalau di kampung yang ditanya itu pasti air zamzam. Saya nggak terlalu banyak beli oleh-oleh, paling kurma, yang lain lebih murah di Indonesia. Ini makanya lagi cari cara untuk bisa bawa pulang zamzam," ujar jemaah asal Situbondo tersebut.
    
    Ia pun khawatir dengan ketatnya penjagaan petugas yang memeriksa koper jemaah. Hal ini pun dialami sendiri oleh temannya yang terpaksa harus dibongkar kopernya lantaran ketahuan membawa air zamzam.`,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Panas di Madinah Lebih Menyengat dari Mekah',
    image: 'https://akcdn.detik.net.id/community/media/visual/2019/08/24/d783dd18-96cc-41b5-99d6-9c46e34c54dd_169.jpeg?w=700&q=90',
    description: `Usai rangkaian puncak haji, jemaah perlahan mulai meninggalkan kota Mekah. Ada yang pulang ke Tanah Airnya, ada pula yang menuju Madinah.

    Nah, bagi jemaah haji yang bergerak ke kota Madinah, sebaiknya memperhatikan soal satu ini, yakni cuaca!
    
    Ya, sekilas suasana di Mekah dan Madinah mirip. Namun, jika diperhatikan lebih detail hawa panas di Madinah lebih menyengat dibandingkan Mekah. Beberapa jemaah yang baru sampai di Madinah dari Mekah pun sudah merasakan ini. "Menyengat banget panasnya di Madinah," ujar seorang jemaah.

    Kondisi Madinah yang lebih panas pun sejatinya sudah diwanti-wanti oleh jemaah yang masuk dalam gelombang pertama. Di mana ketika sampai di Tanah Suci, mereka lebih dulu mampir ke Madinah sebelum ke Mekah.
    
    Dan 'peringatan' itu terbukti. Suhu udara di Madinah dalam beberapa hari terakhir bisa tembus di angka 44 derajat celcius, termasuk ketika jarum jam sudah bergerak ke sore hari sekitar pukul 16.00, hawa panas masih belum hilang.
    
    Untuk menghindari paparan suhu panas, para jemaah pun harus melindungi dirinya dengan beragam penutup kepala, mulai dari payung, kacamata hitam hingga topi. Ketika berjalan di luar sudah pasti memilih untuk berlindung di bawah-bawah gedung.`,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('News', news)
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('News', null)
  }
};