# Huzur Atölyem · El Emeği Ürün Kataloğu

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Rattan aksesuarlar, duvar süsleri ve el emeği dekorasyon ürünleri için ürün kataloğu ve tanıtım sitesi. HTML/CSS/JavaScript arayüzü Firebase Cloud Firestore ürün verileri ve yerel ürün yedeğiyle çalışır.

## Özellikler

- Ürün listeleme, kategori süzme ve ürün detay sayfaları.
- Ürün bazlı WhatsApp iletişimi ve sipariş talebi bağlantıları.
- Firestore `products` koleksiyonunu dinleme; varsayılan ürünler ve localStorage fallback.
- Ürün ekleme/düzenleme/silme arayüzü ve başlangıç ürünlerini içe aktarma yardımcısı.

## Yerel önizleme

Build adımı veya npm bağımlılığı yoktur. Python 3 ile proje klasöründen:

```sh
git clone https://github.com/Erkan54/huzurAtolyem.git
cd huzurAtolyem
python -m http.server 8000
```

Tarayıcıda `http://localhost:8000` adresini açın. Bu komut yalnızca statik dosyaları sunar; veritabanı veya özel backend başlatmaz.

## Dosya haritası

| Dosya / klasör | İşlev |
| --- | --- |
| `index.html` | Ana sayfa |
| `urunler.html / urun.html` | Katalog ve dinamik ürün detayı |
| `urun-*.html` | Statik ürün sayfaları |
| `biz-kimiz.html` | Atölye tanıtımı |
| `js/main.js` | Ürün verileri ve arayüz etkileşimleri |
| `import_products.html` | Ürünleri Firestore'a yazabilen kurulum aracı |
| `css/` | Stiller |

## Yapılandırma ve yayın

Firebase istemci ayarları `js/main.js` ve `import_products.html` içinde bulunur. Kopya kurulumda kendi Firebase projenizi ve Firestore kurallarınızı kullanın. İçe aktarma aracı kayıt yazabildiği için yalnızca amaçlanan test projesinde çalıştırılmalıdır. WhatsApp numarası, ürün metinleri, `robots.txt` ve `sitemap.xml` alan adlarını kendi kurulumunuza göre düzenleyin. Yönetim arayüzünün görünürlüğü tek başına veri yazma yetkisini güvenceye almaz; erişim Firestore kurallarında belirlenmelidir. Site ödeme veya kargo hizmeti sunmaz.

Dosyalar statik barındırmaya uygundur. Yayından önce mobil menü, göreli dosya yolları, iletişim bağlantıları ve kullanılan dış kaynakları tarayıcıda kontrol edin. Otomatik uygulama test paketi bu depoda tanımlı değildir.
