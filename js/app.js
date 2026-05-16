// ==========================================
// FILE LOGIKA UTAMA (app.js)
// Mengatur injeksi data, musik, dan countdown
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan dataUndangan dari data.js terbaca
    if (typeof dataUndangan === 'undefined') {
        console.error("Data undangan tidak ditemukan! Pastikan file data.js dimuat sebelum app.js");
        return;
    }

    const data = dataUndangan;

    // ---------------------------------------------------------
    // 1. INJEKSI DATA KE HTML (MENGISI KONTEN DINAMIS)
    // ---------------------------------------------------------
    
    // Title Web
    document.title = data.umum.judulWeb;

    // Cover
    document.getElementById('cover-nama-pasangan').innerText = `${data.mempelai.pria.namaPanggilan} & ${data.mempelai.wanita.namaPanggilan}`;
    document.getElementById('cover-tanggal').innerText = data.acara.akad.hariTanggal;

    // Kutipan
    document.getElementById('teks-kutipan').innerText = `"${data.kutipan.teks}"`;
    document.getElementById('sumber-kutipan').innerText = data.kutipan.sumber;

    // Mempelai Pria
    document.getElementById('foto-pria').src = data.mempelai.pria.foto;
    document.getElementById('nama-pria').innerText = data.mempelai.pria.namaLengkap;
    document.getElementById('ortu-pria').innerText = `Putra dari ${data.mempelai.pria.namaAyah} & ${data.mempelai.pria.namaIbu}`;
    document.getElementById('ig-pria').href = data.mempelai.pria.instagram;

    // Mempelai Wanita
    document.getElementById('foto-wanita').src = data.mempelai.wanita.foto;
    document.getElementById('nama-wanita').innerText = data.mempelai.wanita.namaLengkap;
    document.getElementById('ortu-wanita').innerText = `Putri dari ${data.mempelai.wanita.namaAyah} & ${data.mempelai.wanita.namaIbu}`;
    document.getElementById('ig-wanita').href = data.mempelai.wanita.instagram;

    // Acara Akad
    document.getElementById('nama-akad').innerText = data.acara.akad.namaAcara;
    document.getElementById('tanggal-akad').innerHTML = `<i class="far fa-calendar-alt"></i> ${data.acara.akad.hariTanggal}`;
    document.getElementById('waktu-akad').innerHTML = `<i class="far fa-clock"></i> ${data.acara.akad.waktu}`;
    document.getElementById('tempat-akad').innerText = `${data.acara.akad.tempat}\n${data.acara.akad.alamatLengkap}`;
    document.getElementById('map-akad').href = data.acara.akad.linkGoogleMaps;

    // Acara Resepsi
    document.getElementById('nama-resepsi').innerText = data.acara.resepsi.namaAcara;
    document.getElementById('tanggal-resepsi').innerHTML = `<i class="far fa-calendar-alt"></i> ${data.acara.resepsi.hariTanggal}`;
    document.getElementById('waktu-resepsi').innerHTML = `<i class="far fa-clock"></i> ${data.acara.resepsi.waktu}`;
    document.getElementById('tempat-resepsi').innerText = `${data.acara.resepsi.tempat}\n${data.acara.resepsi.alamatLengkap}`;
    document.getElementById('map-resepsi').href = data.acara.resepsi.linkGoogleMaps;

    // Penutup
    document.getElementById('teks-bawah').innerText = data.penutup.teksBawah;
    document.getElementById('salam-penutup').innerText = data.penutup.salam;
    document.getElementById('ucapan-terimakasih').innerText = data.penutup.terimaKasih;
    document.getElementById('nama-pasangan-penutup').innerText = `${data.mempelai.pria.namaPanggilan} & ${data.mempelai.wanita.namaPanggilan}`;


    // ---------------------------------------------------------
    // 2. RENDER HADIAH DIGITAL (REKENING & KADO)
    // ---------------------------------------------------------
    document.getElementById('teks-pengantar-hadiah').innerText = data.hadiahDigital.teksPengantar;
    
    const wadahRekening = document.getElementById('wadah-rekening');
    data.hadiahDigital.rekening.forEach(rek => {
        // Membuat kartu rekening secara dinamis sesuai jumlah data di data.js
        const divCard = document.createElement('div');
        divCard.className = 'rekening-card';
        divCard.innerHTML = `
            <img src="${rek.qrCode}" alt="QR ${rek.bank}" class="qr-code">
            <h4 class="gold-text">${rek.bank}</h4>
            <p class="no-rek" id="rek-${rek.nomorRekening}">${rek.nomorRekening}</p>
            <p class="atas-nama">a.n. ${rek.atasNama}</p>
            <button onclick="salinTeks('${rek.nomorRekening}')" class="btn-outline btn-sm">
                <i class="far fa-copy"></i> Salin No. Rekening
            </button>
        `;
        wadahRekening.appendChild(divCard);
    });

    // Menampilkan kado jika diaktifkan di data.js
    const kadoBox = document.getElementById('wadah-kado');
    if (data.hadiahDigital.kirimKado.aktif) {
        kadoBox.style.display = 'block';
        document.getElementById('penerima-kado').innerText = `Penerima: ${data.hadiahDigital.kirimKado.namaPenerima}`;
        document.getElementById('alamat-kado').innerText = data.hadiahDigital.kirimKado.alamatLengkap;
    }


    // ---------------------------------------------------------
    // 3. LOGIKA BUKA UNDANGAN & MUSIK
    // ---------------------------------------------------------
    const btnBuka = document.getElementById('btn-buka-undangan');
    const coverSection = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('lagu-background');
    const btnMusik = document.getElementById('btn-musik');
    const iconMusik = btnMusik.querySelector('i');

    let isPlaying = false;

    btnBuka.addEventListener('click', () => {
        // Efek slide ke atas atau memudar untuk cover
        coverSection.style.transform = 'translateY(-100vh)';
        coverSection.style.transition = 'transform 1s ease-in-out';
        
        setTimeout(() => {
            coverSection.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Putar musik jika disetting true
            if (data.umum.putarOtomatis) {
                audio.play().catch(e => console.log("Autoplay diblokir browser, pengguna harus klik manual."));
                isPlaying = true;
                iconMusik.classList.remove('fa-music');
                iconMusik.classList.add('fa-pause');
            }
            
            // Mulai animasi scroll atau hal lainnya di sini
            window.scrollTo(0, 0);
        }, 800); // Tunggu animasi selesai
    });

    // Kontrol Tombol Musik
    btnMusik.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            iconMusik.classList.remove('fa-pause');
            iconMusik.classList.add('fa-play');
        } else {
            audio.play();
            iconMusik.classList.remove('fa-play');
            iconMusik.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    });


    // ---------------------------------------------------------
    // 4. LOGIKA COUNTDOWN (HITUNG MUNDUR)
    // ---------------------------------------------------------
    const targetDate = new Date(data.acara.akad.tanggalCountdown).getTime();

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Perhitungan waktu
        const hari = Math.floor(distance / (1000 * 60 * 60 * 24));
        const jam = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((distance % (1000 * 60)) / 1000);

        // Render ke HTML
        if (distance > 0) {
            document.getElementById('cd-hari').innerText = hari.toString().padStart(2, '0');
            document.getElementById('cd-jam').innerText = jam.toString().padStart(2, '0');
            document.getElementById('cd-menit').innerText = menit.toString().padStart(2, '0');
            document.getElementById('cd-detik').innerText = detik.toString().padStart(2, '0');
        } else {
            // Jika waktu sudah lewat
            clearInterval(updateCountdown);
            document.getElementById('cd-hari').innerText = "00";
            document.getElementById('cd-jam').innerText = "00";
            document.getElementById('cd-menit').innerText = "00";
            document.getElementById('cd-detik').innerText = "00";
        }
    }, 1000);

});

// ---------------------------------------------------------
// 5. FUNGSI GLOBAL (Bisa dipanggil dari tombol HTML)
// ---------------------------------------------------------

// Fungsi untuk menyalin teks (nomor rekening) ke clipboard
window.salinTeks = function(teks) {
    navigator.clipboard.writeText(teks).then(() => {
        alert("Nomor rekening " + teks + " berhasil disalin!");
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
        alert("Gagal menyalin nomor rekening.");
    });
};