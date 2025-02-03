document.getElementById("dersEkle").addEventListener("click", () => dersEkle(""));

document.getElementById("hesapla").addEventListener("click", karneHesapla);

veridenYukle();

function dersEkle(ad = "", donem1 = ["","","",""], donem2 = ["","","",""], saat = "") {
    
    let dersKapsayici = document.createElement("div");
    dersKapsayici.classList.add("ders");

    dersKapsayici.innerHTML = `
    <input type="text" placeholder="Ders Adı" class="dersAdi" value="${ad}">
    <input type="number" class="haftalikSaat" placeholder="HDS" value="${saat}">
    <p>HDS = Haftalık ders saati</p>
    <h3>1. Dönem</h3>
    <input type="number" class="puan donem1" placeholder="Not 1" value="${donem1[0]}">
    <input type="number" class="puan donem1" placeholder="Not 2" value="${donem1[1]}">
    <br>
    <input type="number" class="puan donem1" placeholder="Not 3" value="${donem1[2]}">
    <input type="number" class="puan donem1" placeholder="Not 4" value="${donem1[3]}">
    
    <h3>2. Dönem</h3>
    <input type="number" class="puan donem2" placeholder="Not 1" value="${donem2[0]}">
    <input type="number" class="puan donem2" placeholder="Not 2" value="${donem2[1]}">
    <br>
    <input type="number" class="puan donem2" placeholder="Not 3" value="${donem2[2]}">
    <input type="number" class="puan donem2" placeholder="Not 4" value="${donem2[3]}">
    <br>
    <span class="ortalama">Ortalama: 0</span>
    <br>
    <button class="dersKaldir">Kaldır</button>
    `;

    document.getElementById("dersler").appendChild(dersKapsayici);

    dersKapsayici.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            dersOrtalamaGuncelle(dersKapsayici);
            veriyiKaydet();
        });
    });

    dersKapsayici.querySelector(".dersKaldir").addEventListener("click", () => {
        dersKapsayici.remove();
        veriyiKaydet();
    });

    dersOrtalamaGuncelle(dersKapsayici);
    veriyiKaydet();
}

function dersOrtalamaGuncelle(dersKapsayici) {
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
        toplamOrtalama = "Not Girilmedi"; // Eğer hiç not girilmediyse
    }

    dersKapsayici.querySelector(".ortalama").innerText = `Ortalama: ${toplamOrtalama}`;
}


function karneHesapla() {
    let toplamPuan = 0;
    let toplamSaat = 0;
    let ortDonem1;
    let ortDonem2;

    const dersler = document.querySelectorAll(".ders");

    dersler.forEach(ders => {
        const puanlarDonem1 = [...ders.querySelectorAll(".donem1")]
            .map(input => input.value !== "" ? Number(input.value) : null)
            .filter(puan => puan !== null);

        const puanlarDonem2 = [...ders.querySelectorAll(".donem2")]
            .map(input => input.value !== "" ? Number(input.value) : null)
            .filter(puan => puan !== null);

        const haftalikSaat = Number(ders.querySelector(".haftalikSaat").value);

        ortDonem1 = puanlarDonem1.length > 0 ? (puanlarDonem1.reduce((a, b) => a + b, 0) / puanlarDonem1.length) : null;
        ortDonem2 = puanlarDonem2.length > 0 ? (puanlarDonem2.reduce((a, b) => a + b, 0) / puanlarDonem2.length) : null;

        let finalOrtalama;
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
            toplamPuan += finalOrtalama * haftalikSaat;
            toplamSaat += haftalikSaat;
        }
    });

    const genelOrtalama = toplamSaat > 0 ? (toplamPuan / toplamSaat).toFixed(2) : "Not Girilmedi";
    document.getElementById("donem1").innerHTML = `1.Dönem: ${ortDonem1}`;
    document.getElementById("donem2").innerHTML = `2.dönem: ${ortDonem2 == null ? 0 : ortDonem2}`;
    document.getElementById("sonuc").innerHTML = `Karne Ortalaması: ${genelOrtalama}`;
}


function veriyiKaydet() {
    const dersler = [];
    
    document.querySelectorAll(".ders").forEach(ders => {
        let ad = ders.querySelector(".dersAdi").value || ""; // Ders adı boş olabilir
        let haftalikSaat = ders.querySelector(".haftalikSaat").value !== "" ? Number(ders.querySelector(".haftalikSaat").value) : null;
        
        let puanlarDonem1 = [...ders.querySelectorAll(".donem1")].map(input => input.value !== "" ? Number(input.value) : null);
        let puanlarDonem2 = [...ders.querySelectorAll(".donem2")].map(input => input.value !== "" ? Number(input.value) : null);
        
        dersler.push({ ad, puanlarDonem1, puanlarDonem2, haftalikSaat });
    });

    localStorage.setItem("dersler", JSON.stringify(dersler));
}



function veridenYukle() {
    const kayitliDersler = JSON.parse(localStorage.getItem("dersler")) || [];

    kayitliDersler.forEach(ders => {
        dersEkle(ders.ad, ders.puanlarDonem1, ders.puanlarDonem2, ders.haftalikSaat);
    });
}
