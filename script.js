
document.getElementById("dersEkle").addEventListener("click", () => {
    console.log("➕ Yeni ders ekleniyor...");
    dersEkle("");
    IWInputs = document.querySelectorAll('.IW');
});

document.getElementById("derslerEkle").addEventListener("click", () => {
    console.log("➕ Yeni dersler ekleniyor...");
    derslerEkle(document.getElementById("derslerInput").value);
    // IWInput'u verilerini güncelle
    IWInputs = document.querySelectorAll('.IW');
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
    
    let dersDiv = document.createElement("div");
    dersDiv.classList.add("ders");

    dersDiv.innerHTML = `
    <div class="dersBilgi">
            <input type="text" placeholder="Ders Adı" class="dersAdi IW" value="${ad? ad : ""}">
            <p>(<input type="number" min="0" max="9" class="dersAdi haftalikSaat IW" placeholder="HDS" value="${saat? saat : ""}" oninput="this.value = Math.floor(this.value); if(this.value > 9) this.value = 9; if(this.value < 0) this.value = 0;">Saat)</p>
        </div>
        <h3>1. Dönem</h3>
        <div class="notlar">
                <p></p>
                <p class="isimTable">1.</p>
                <p class="isimTable">2.</p>
                <p class="isimTable">3.</p>

                <p class="isimTable">Sınav</p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="1. Sınav" value="${donem1[0]? donem1[0] : ""}"></p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="2. Sınav" value="${donem1[1]? donem1[1] : ""}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p class="isimTable">Sözlü</p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="1. Sözlü" value="${donem1[2]? donem1[2] : ""}"></p>
                <p class="nots"><input type="number" class="puan donem1" placeholder="2. Sözlü" value="${donem1[3]? donem1[3] : ""}"></p>
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
                <p class="nots"><input type="number" class="puan donem2" placeholder="1. Sınav" value="${donem2[0]? donem2[0] : ""}"></p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="2. Sınav" value="${donem2[1]? donem2[1] : ""}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p class="isimTable">Sözlü</p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="1. Sözlü" value="${donem2[2]? donem2[2] : ""}"></p>
                <p class="nots"><input type="number" class="puan donem2" placeholder="2. Sözlü" value="${donem2[3]? donem2[3] : ""}"></p>
                <p class="nots"><input type="number" class="puan" placeholder="" value=""></p>

                <p></p>
                <p></p>
                <p class="isimTable">Puanı</p>
                <p class="notsOrt ortalama2">100</p>
        </div>
        <br>
        <div class="notlar">
                <p></p>
                <p><button class="dersKaldir">Kaldır</button></p>
                <p class="isimTable">Toplam Puanı</p>
                <p class="notsOrt ortalama">100</p>
        </div>
        <hr>
    `;

    document.getElementById("dersler").appendChild(dersDiv);

    dersDiv.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            console.log("--------------------------------");
            console.log("⌨️ Input değeri değişti, ortalama güncelleniyor ve veri kaydediliyor...");
            dersOrtalamaGuncelle(dersDiv);
            veriyiKaydet();
        });
    });

    dersDiv.querySelector(".dersKaldir").addEventListener("click", () => {
        console.log("🗑️ Ders kaldırılıyor...");
        dersDiv.remove();
        veriyiKaydet();
    });

    dersOrtalamaGuncelle(dersDiv);
    veriyiKaydet();
}

function dersOrtalamaGuncelle(dersDiv) {
    console.log("🔄 Ders ortalaması güncelleniyor...");
    const puanlarDonem1 = [...dersDiv.querySelectorAll(".donem1")]
        .map(input => input.value !== "" ? Number(input.value) : null)
        .filter(puan => puan !== null); // Boş inputları filtrele

    const puanlarDonem2 = [...dersDiv.querySelectorAll(".donem2")]
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

    dersDiv.querySelector(".ortalama1").innerText = ortDonem1 ? `${ortDonem1}` : '-';
    dersDiv.querySelector(".ortalama2").innerText = ortDonem2 ? `${ortDonem2}` : '-';
    
    dersDiv.querySelector(".ortalama").innerText = toplamOrtalama ? `${toplamOrtalama}` : '-';
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

    const donem1Ortalama = toplamSaatDonem1 > 0 ? Number((toplamPuanDonem1 / toplamSaatDonem1).toFixed(2)) : "-";
    const donem2Ortalama = toplamSaatDonem2 > 0 ? Number((toplamPuanDonem2 / toplamSaatDonem2).toFixed(2)) : "-";
    const donem1OrtalamaN = toplamSaatDonem1 > 0 ? Number((toplamPuanDonem1 / toplamSaatDonem1).toFixed(2)) : 0;
    const donem2OrtalamaN = toplamSaatDonem2 > 0 ? Number((toplamPuanDonem2 / toplamSaatDonem2).toFixed(2)) : 0;

    console.log(donem1Ortalama, ' + ', donem2Ortalama, ' = ', (donem1Ortalama + donem2Ortalama),'\n',(donem1Ortalama + donem2Ortalama) / 2);

    const genelOrtalama = (donem1OrtalamaN + donem2OrtalamaN) / 2;

    document.getElementById("sonuc").innerHTML = `
        1. Dönem Ortalaması: ${donem1Ortalama} <br>
        2. Dönem Ortalaması: ${donem2Ortalama} <br>
        Karne Ortalaması: ${genelOrtalama}
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



// Gizli bir ölçücü oluşturma fonksiyonu
function createMeasurer(input) {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre'; // Boşlukları korumak için
    
    // Input'un tüm yazı özelliklerini span'a kopyala
    const style = window.getComputedStyle(input);
    span.style.fontFamily = style.fontFamily;
    span.style.fontSize = style.fontSize;
    span.style.fontWeight = style.fontWeight;
    span.style.letterSpacing = style.letterSpacing;
    span.style.textTransform = style.textTransform;
    
    document.body.appendChild(span);
    return span;
}

let IWInputs = document.querySelectorAll('.IW');
IWInputs.forEach(input => {
    console.log("???????????????????????????????????????");
    const measurer = createMeasurer(input);

    const updateWidth = () => {
        // Eğer değer boşsa placeholder'ı ölç, doluysa değeri
        measurer.textContent = input.value || input.placeholder || "";
        console.log(measurer.textContent);
        
        // Span'ın genişliğini al ve input'a uygula (birkaç piksel pay bırakmak iyidir)
        const width = measurer.offsetWidth;
        console.log(width);
        input.style.width = (width + 2) + "px"; // 12px pay, padding/border için
    };

    // İlk yüklemede ayarla
    updateWidth();

    // Yazı yazıldıkça güncelle
    input.addEventListener('input', () => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        updateWidth();
    });
});
console.log(IWInputs);