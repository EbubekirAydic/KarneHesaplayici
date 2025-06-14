document.getElementById("dersEkle").addEventListener("click", () => {
    console.log("➕ Yeni ders ekleniyor...");
    dersEkle("");
});

document.getElementById("derslerEkle").addEventListener("click", () => {
    console.log("➕ Yeni dersler ekleniyor...");
    derslerEkle(document.getElementById("derslerInput").value);
});

document.getElementById("hesapla").addEventListener("click", () => {
    console.log("🧮 Karne hesaplanıyor...");
    karneHesapla();
});

document.getElementById("kopyala").addEventListener("click", () => {
    console.log("📋 Karne bilgileri kopyalanıyor...");
    let dersler = localStorage.getItem("dersler");
    //alert("deneme");

    navigator.clipboard.writeText(dersler).then(() => {
        console.log("✅ Karne bilgileri başarıyla kopyalandı.");
        //alert("Karne bilgileri panoya kopyalandı!");
    }).catch(err => {
        console.error("❌ Kopyalama işlemi başarısız:", err);
        //alert("Kopyalama işlemi başarısız oldu.");
    });
});

console.log("💾 Veriler yükleniyor...");
veridenYukle();

function dersEkle(ad = "", donem1 = ["","","",""], donem2 = ["","","",""], saat = "") {
    console.log("✏️ Ders ekleme fonksiyonu çalıştı:", ad, donem1, donem2, saat);
    
    let dersKapsayici = document.createElement("div");
    dersKapsayici.classList.add("ders");

    dersKapsayici.innerHTML = `
    <div class="dersBilgi">
            <input type="text" placeholder="Ders Adı" class="dersAdi" value="${ad}">
            <p>(<input type="number" class="dersAdi haftalikSaat HDS" placeholder="HDS" value="${saat}">Saat)</p>
        </div>
        <h3>1. Dönem</h3>
        <div class="notlar">
                <p></p>
                <p class="isimTable">1.</p>
                <p class="isimTable">2.</p>
                <p class="isimTable">3.</p>

                <p class="isimTable">Sınav</p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="1. Sınav" value="${donem1[0]}"></p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="2. Sınav" value="${donem1[1]}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p class="isimTable">Sözlü</p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="1. Sözlü" value="${donem1[2]}"></p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="2. Sözlü" value="${donem1[3]}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p></p>
                <p></p>
                <p class="isimTable">Puanı</p>
                <p class="notsOrt ortalama1">100</p>
        </div>
        <h3>2. Dönem</h3>
        <div class="notlar">
                <p></p>
                <p class="isimTable">1.</p>
                <p class="isimTable">2.</p>
                <p class="isimTable">3.</p>

                <p class="isimTable">Sınav</p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="1. Sınav" value="${donem2[0]}"></p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="2. Sınav" value="${donem2[1]}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p class="isimTable">Sözlü</p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="1. Sözlü" value="${donem2[2]}"></p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="2. Sözlü" value="${donem2[3]}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p></p>
                <p></p>
                <p class="isimTable">Puanı</p>
                <p class="notsOrt ortalama2">100</p>
        </div>
        <br>
        <div class="notlar">
                <p></p>
                <p></p>
                <p class="isimTable">Toplam Puanı</p>
                <p class="notsOrt ortalama">100</p>
        </div>

        <button class="dersKaldir">Kaldır</button>
        <hr>
    `;

    document.getElementById("dersler").appendChild(dersKapsayici);

    dersKapsayici.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            console.log("⌨️ Input değeri değişti, ortalama güncelleniyor ve veri kaydediliyor...");
            dersOrtalamaGuncelle(dersKapsayici);
            veriyiKaydet();
        });
    });

    dersKapsayici.querySelector(".dersKaldir").addEventListener("click", () => {
        console.log("🗑️ Ders kaldırılıyor...");
        dersKapsayici.remove();
        veriyiKaydet();
    });

    dersOrtalamaGuncelle(dersKapsayici);
    veriyiKaydet();
}

function dersOrtalamaGuncelle(dersKapsayici) {
    console.log("🔄 Ders ortalaması güncelleniyor...");
    const puanlarDonem1 = [...dersKapsayici.querySelectorAll(".donem1")]
        .map(input => input.value !== "" ? Number(input.value) : null)
        .filter(puan => puan !== null); // Boş inputları filtrele

    const puanlarDonem2 = [...dersKapsayici.querySelectorAll(".donem2")]
        .map(input => input.value !== "" ? Number(input.value) : null)
        .filter(puan => puan !== null); // Boş inputları filtrele

    const ortDonem1 = puanlarDonem1.length > 0 ? (puanlarDonem1.reduce((a, b) => a + b, 0) / puanlarDonem1.length) : null;
    const ortDonem2 = puanlarDonem2.length > 0 ? (puanlarDonem2.reduce((a, b) => a + b, 0) / puanlarDonem2.length) : null;

    let toplamOrtalama;
    if (ortDonem1 !== null && ortDonem2 !== null) {
        toplamOrtalama = ((ortDonem1 + ortDonem2) / 2).toFixed(2);
    } else if (ortDonem1 !== null) {
        toplamOrtalama = ortDonem1.toFixed(2);
    } else if (ortDonem2 !== null) {
        toplamOrtalama = ortDonem2.toFixed(2);
    } else {
        toplamOrtalama = ""; // Eğer hiç not girilmediyse
    }

    dersKapsayici.querySelector(".ortalama1").innerText = ortDonem1 ? `${ortDonem1}` : 'Not Girilmedi';
    dersKapsayici.querySelector(".ortalama2").innerText = ortDonem2 ? `${ortDonem2}` : 'Not Girilmedi';
    
    dersKapsayici.querySelector(".ortalama").innerText = toplamOrtalama ? `${toplamOrtalama}` : 'Not Girilmedi';
    console.log("📊 Ortalama güncellendi:", toplamOrtalama);
}

function karneHesapla() {
    console.log("🏫 Karne hesaplama işlemi başladı...");
    let toplamPuan = 0;
    let toplamSaat = 0;
    let finalOrtalama;
    let toplamPuanDonem1 = 0;
    let toplamSaatDonem1 = 0;
    let toplamPuanDonem2 = 0;
    let toplamSaatDonem2 = 0;

    const dersler = document.querySelectorAll(".ders");

    dersler.forEach(ders => {
        const puanlarDonem1 = [...ders.querySelectorAll(".donem1")]
            .map(input => input.value !== "" ? Number(input.value) : null)
            .filter(puan => puan !== null);

        const puanlarDonem2 = [...ders.querySelectorAll(".donem2")]
            .map(input => input.value !== "" ? Number(input.value) : null)
            .filter(puan => puan !== null);

        const haftalikSaat = Number(ders.querySelector(".haftalikSaat").value);

        const ortDonem1 = puanlarDonem1.length > 0 ? (puanlarDonem1.reduce((a, b) => a + b, 0) / puanlarDonem1.length) : null;
        const ortDonem2 = puanlarDonem2.length > 0 ? (puanlarDonem2.reduce((a, b) => a + b, 0) / puanlarDonem2.length) : null;

        if (ortDonem1 !== null) {
            toplamPuanDonem1 += ortDonem1 * haftalikSaat;
            toplamSaatDonem1 += haftalikSaat;
        }

        if (ortDonem2 !== null) {
            toplamPuanDonem2 += ortDonem2 * haftalikSaat;
            toplamSaatDonem2 += haftalikSaat;
        }

        if (ortDonem1 !== null && ortDonem2 !== null) {
            finalOrtalama = (ortDonem1 + ortDonem2) / 2;
        } else if (ortDonem1 !== null) {
            finalOrtalama = ortDonem1;
        } else if (ortDonem2 !== null) {
            finalOrtalama = ortDonem2;
        } else {
            finalOrtalama = null; // Eğer hiç not girilmediyse
        }

        if (finalOrtalama !== null) {
        }
    });

    const donem1Ortalama = toplamSaatDonem1 > 0 ? Number((toplamPuanDonem1 / toplamSaatDonem1).toFixed(2)) : "Not Girilmedi";
    const donem2Ortalama = toplamSaatDonem2 > 0 ? Number((toplamPuanDonem2 / toplamSaatDonem2).toFixed(2)) : "Not Girilmedi";

    console.log(donem1Ortalama, ' + ', donem2Ortalama, ' = ', (donem1Ortalama + donem2Ortalama),'\n',(donem1Ortalama + donem2Ortalama) / 2);

    const genelOrtalama = (donem1Ortalama + donem2Ortalama) / 2;

    document.getElementById("sonuc").innerHTML = `
        Karne Ortalaması: ${genelOrtalama} <br>
        1. Dönem Ortalaması: ${donem1Ortalama} <br>
        2. Dönem Ortalaması: ${donem2Ortalama}
    `;
    console.log("🎉 Karne ortalaması hesaplandı:", genelOrtalama);
    console.log("🎉 1. Dönem ortalaması hesaplandı:", donem1Ortalama);
    console.log("🎉 2. Dönem ortalaması hesaplandı:", donem2Ortalama);
}


function veriyiKaydet() {
    console.log("💾 Veriler kaydediliyor...");
    const dersler = [];
    
    document.querySelectorAll(".ders").forEach(ders => {
        let ad = ders.querySelector(".dersAdi").value || ""; // Ders adı boş olabilir
        let haftalikSaat = ders.querySelector(".haftalikSaat").value !== "" ? Number(ders.querySelector(".haftalikSaat").value) : null;
        
        let puanlarDonem1 = [...ders.querySelectorAll(".donem1")].map(input => input.value !== "" ? Number(input.value) : null);
        let puanlarDonem2 = [...ders.querySelectorAll(".donem2")].map(input => input.value !== "" ? Number(input.value) : null);
        
        dersler.push({ ad, puanlarDonem1, puanlarDonem2, haftalikSaat });
    });

    localStorage.setItem("dersler", JSON.stringify(dersler));
    console.log("✅ Veriler başarıyla kaydedildi.");
}



function veridenYukle() {
    console.log("📤 Veriler yükleniyor...");
    const kayitliDersler = JSON.parse(localStorage.getItem("dersler")) || [];

    kayitliDersler.forEach(ders => {
        dersEkle(ders.ad, ders.puanlarDonem1, ders.puanlarDonem2, ders.haftalikSaat);
    });
    console.log("✨ Veriler başarıyla yüklendi.");
}


function derslerEkle(dersler) {
    console.log("➕ Birden fazla ders ekleniyor...");

    JSON.parse(dersler).forEach(ders => {
        dersEkle(ders.ad, ders.puanlarDonem1, ders.puanlarDonem2, ders.haftalikSaat);
    });
    
}


document.getElementById('bilgi').innerHTML = localStorage.getItem("dersler");