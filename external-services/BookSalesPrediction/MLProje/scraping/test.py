import requests

# Sunucudan sıkıştırılmamış, saf HTML istiyoruz.
headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
}

# Sadece 1. sayfanın URL'i
url = "https://www.kitapyurdu.com/index.php?route=product/best_sellers&list_id=15&page=1"

print("Sayfa indiriliyor...")

try:
    response = requests.get(url, headers=headers)
    
    # Bu sefer karakter kodlamasını requests'in kendisinin bulmasına izin verelim
    response.raise_for_status() # Hata varsa (4xx veya 5xx) programı durdurur.
    
    # Gelen içeriği bir dosyaya yazdır
    with open('sayfa_icerigi.html', 'w', encoding='utf-8') as f:
        f.write(response.text)
        
    print("\nİşlem tamamlandı!")
    print("Lütfen 'sayfa_icerigi.html' dosyasının içeriğini kopyalayıp bana gönderin.")

except requests.exceptions.RequestException as e:
    print(f"Sayfa indirilirken bir hata oluştu: {e}")