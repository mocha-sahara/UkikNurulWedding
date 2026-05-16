// ==========================================
// FILE LOGIKA UTAMA (app.js)
// Mengatur injeksi data, musik, video intro, countdown, dan animasi
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan dataUndangan dari data.js terbaca
    if (typeof dataUndangan === 'undefined') {
        console.error("Data undangan tidak ditemukan! Pastikan file data.js dimuat sebelum app.js");
        return;
    }

    const data = dataUndangan;

    // ---------------------------------------------------------
    // 1. FITUR NAMA TAMU DINAMIS DARI URL (?to=Nama+Tamu)
    // ---------------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const tamuDariUrl = urlParams.get('to');
    const elemenNamaTamu = document.getElementById('nama-tamu');

    if (elemenNamaTamu) {
        if (tamuDariUrl) {
            // Jika ada parameter ?to= di link, tampilkan namanya
            elemenNamaTamu.innerText = tamuDariUrl;
        } else {
            // Jika link dibuka biasa tanpa ?to=, tampilkan default
            elemenNamaTamu.innerText = "Tamu Undangan"; 
        }
    }

    // ---------------------------------------------------------
    // 2. INJEKSI DATA KE HTML (MENGISI KONTEN DINAMIS)
    // ---------------------------------------------------------
    
    // Title Web
    document.title = data.umum.judulWeb;

    // Cover
    document.getElementById('cover-nama-pasangan').innerText = `${data.mempelai.pria.namaPanggilan} & ${data.mempelai.wanita.namaPanggilan}`;
    document.getElementById('cover-tanggal').innerText = data.acara.akad.hariTanggal;

    // Video Intro Overlay (Menuliskan nama secara dinamis)
    const introNamaEl = document.getElementById('intro-nama-pasangan');
    if(introNamaEl) {
        introNamaEl.innerText = `${data.mempelai.pria.namaPanggilan} & ${data.mempelai.wanita.namaPanggilan}`;
    }

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
    // 3. RENDER HADIAH DIGITAL (REKENING & KADO)
    // ---------------------------------------------------------
    document.getElementById('teks-pengantar-hadiah').innerText = data.hadiahDigital.teksPengantar;
    
    const wadahRekening = document.getElementById('wadah-rekening');
    data.hadiahDigital.rekening.forEach(rek => {
        const divCard = document.createElement('div');
        divCard.className = 'rekening-card reveal'; // Ditambah class reveal untuk animasi scroll
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

    const kadoBox = document.getElementById('wadah-kado');
    if (data.hadiahDigital.kirimKado.aktif) {
        kadoBox.style.display = 'block';
        kadoBox.classList.add('reveal'); // Ditambah class reveal
        document.getElementById('penerima-kado').innerText = `Penerima: ${data.hadiahDigital.kirimKado.namaPenerima}`;
        document.getElementById('alamat-kado').innerText = data.hadiahDigital.kirimKado.alamatLengkap;
    }


    // ---------------------------------------------------------
    // 4. LOGIKA BUKA UNDANGAN, MUSIK & VIDEO MOTION
    // ---------------------------------------------------------
    const btnBuka = document.getElementById('btn-buka-undangan');
    const coverSection = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('lagu-background');
    const btnMusik = document.getElementById('btn-musik');
    const iconMusik = btnMusik.querySelector('i');
    
    const motionVideo = document.getElementById('motion-video');
    const videoOverlay = document.getElementById('video-overlay');

    let isPlaying = false;

    btnBuka.addEventListener('click', () => {
        // LANGSUNG PUTAR MUSIK SAAT DIKLIK (Tanpa Jeda)
        if (data.umum.putarOtomatis) {
            audio.play().catch(e => console.log("Gagal memutar audio: ", e));
            isPlaying = true;
            iconMusik.classList.remove('fa-music');
            iconMusik.classList.add('fa-pause');
        }

        // EFEK COVER BERGESER
        coverSection.style.transform = 'translateY(-100vh)';
        coverSection.style.transition = 'transform 1s ease-in-out';
        
        setTimeout(() => {
            coverSection.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Putar video motion
            if (motionVideo) {
                motionVideo.currentTime = 0; 
                motionVideo.play().catch(e => console.log("Gagal memutar video: ", e));
            }

            // Pastikan scroll berada di paling atas melihat video
            window.scrollTo(0, 0);
        }, 800); 
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
    // 5. LOGIKA OVERLAY VIDEO (Muncul 2 Detik Sebelum Selesai)
    // ---------------------------------------------------------
    if (motionVideo && videoOverlay) {
        let overlayShown = false; 

        motionVideo.addEventListener('timeupdate', () => {
            // Jika sisa waktu video kurang dari atau sama dengan 2 detik
            if (motionVideo.duration > 0 && !overlayShown) {
                if (motionVideo.duration - motionVideo.currentTime <= 2) {
                    videoOverlay.classList.add('show-overlay');
                    overlayShown = true; 
                }
            }
        });

        // Reset overlay jika video di-play ulang (opsional)
        motionVideo.addEventListener('play', () => {
            if (motionVideo.currentTime === 0) {
                videoOverlay.classList.remove('show-overlay');
                overlayShown = false;
            }
        });
    }


    // ---------------------------------------------------------
    // 6. LOGIKA COUNTDOWN (HITUNG MUNDUR)
    // ---------------------------------------------------------
    const targetDate = new Date(data.acara.akad.tanggalCountdown).getTime();

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const hari = Math.floor(distance / (1000 * 60 * 60 * 24));
        const jam = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance > 0) {
            document.getElementById('cd-hari').innerText = hari.toString().padStart(2, '0');
            document.getElementById('cd-jam').innerText = jam.toString().padStart(2, '0');
            document.getElementById('cd-menit').innerText = menit.toString().padStart(2, '0');
            document.getElementById('cd-detik').innerText = detik.toString().padStart(2, '0');
        } else {
            clearInterval(updateCountdown);
            document.getElementById('cd-hari').innerText = "00";
            document.getElementById('cd-jam').innerText = "00";
            document.getElementById('cd-menit').innerText = "00";
            document.getElementById('cd-detik').innerText = "00";
        }
    }, 1000);


    // ---------------------------------------------------------
    // 7. SCROLL REVEAL ANIMATION (Muncul perlahan saat di-scroll)
    // ---------------------------------------------------------
    const elementsToReveal = document.querySelectorAll('.section-title, .mempelai-card, .acara-card, .quote-text, .divider, .box-mewah');
    // Pastikan box-mewah juga kena efek animasi
    elementsToReveal.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));

    // Observe elemen yang digenerate dinamis (seperti rekening)
    setTimeout(() => {
        const dynamicElements = document.querySelectorAll('.rekening-card, .kado-box');
        dynamicElements.forEach(el => revealObserver.observe(el));
    }, 500);


    // ---------------------------------------------------------
    // 8. EFEK PARTIKEL EMAS JATUH
    // ---------------------------------------------------------
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles-container';
    document.body.appendChild(particleContainer);

    function createParticle() {
        // Jangan jalankan jika masih di layar cover
        if (coverSection.style.display !== 'none') return;

        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Ukuran partikel acak (2px sampai 5px)
        const size = Math.random() * 3 + 2; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posisi mendatar acak
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Durasi jatuh acak
        const duration = Math.random() * 7 + 5; 
        particle.style.animationDuration = `${duration}s`;
        
        particleContainer.appendChild(particle);
        
        // Hapus partikel setelah selesai jatuh
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Buat 1 partikel baru setiap 400 milidetik
    setInterval(createParticle, 400);

});

// ---------------------------------------------------------
// 9. FUNGSI GLOBAL (Bisa dipanggil langsung dari HTML)
// ---------------------------------------------------------

// Fungsi untuk menyalin nomor rekening ke clipboard
window.salinTeks = function(teks) {
    navigator.clipboard.writeText(teks).then(() => {
        alert("Nomor rekening " + teks + " berhasil disalin!");
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
        alert("Gagal menyalin nomor rekening.");
    });
// ---------------------------------------------------------
    // ANTI JEDA LOOPING AUDIO
    // ---------------------------------------------------------
    audio.addEventListener('timeupdate', function() {
        // Angka 0.4 berarti lagu akan dipaksa mengulang 0.4 detik sebelum benar-benar habis.
        // Jika jedanya masih terasa, perbesar angkanya (misal: 0.6 atau 0.8)
        const potongAkhir = 0.4; 
        
        if (this.duration > 0 && this.currentTime > this.duration - potongAkhir) {
            // Angka 0.2 berarti lagu mulai memutar dari detik ke-0.2 (melewati hening di awal)
            this.currentTime = 0.2; 
            this.play();
        }
    });
};
