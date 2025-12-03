import time
import random
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import re # Sayısal verileri ayıklamak için

def get_book_details(book_url, driver):
    """
    Verilen kitap URL'sinden, güncellenmiş HTML yapısına göre tüm detayları çeker.
    """
    try:
        driver.get(book_url)
        time.sleep(random.uniform(2, 4)) # Sayfanın tam yüklenmesi için bekle
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        book_data = {}

        # Kitap Adı
        try:
            book_data['Kitap Adı'] = soup.find('h1', class_='pr_header__heading').get_text(strip=True)
        except:
            book_data['Kitap Adı'] = 'Bilgi Yok'

        # Kitabın Kategorisi
        try:
            category_elements = soup.select('.rel-cats__link span')
            book_data['Kitabın kategorisi'] = ' > '.join([cat.get_text(strip=True) for cat in category_elements])
        except:
            book_data['Kitabın kategorisi'] = 'Bilgi Yok'
            
        # Kitap Yazarı
        try:
            book_data['Kitap Yazarı'] = soup.select_one('.pr_producers__manufacturer .pr_producers__link').get_text(strip=True)
        except:
            book_data['Kitap Yazarı'] = 'Bilgi Yok'
        
        # Yayınevi
        try:
            book_data['Yayınevi'] = soup.select_one('.pr_producers__publisher .pr_producers__link').get_text(strip=True)
        except:
            book_data['Yayınevi'] = 'Bilgi Yok'

        # Puan
        try:
            rating_val = soup.find('meta', itemprop='ratingValue')['content']
            rating_count = soup.find('meta', itemprop='ratingCount')['content']
            book_data['100 Üzerinden Aldığı Puan'] = f"{rating_val} / 5 ({rating_count} oy)"
        except:
            book_data['100 Üzerinden Aldığı Puan'] = 'Puan Yok'

        # Favorilere Ekleyen Kişi Sayısı
        try:
            book_data['Favorilere Ekleyen Kişi Sayısı'] = soup.find('span', id='favorite-count').get_text(strip=True)
        except:
            book_data['Favorilere Ekleyen Kişi Sayısı'] = '0'
        
        # Okuma Listeleri
        try: book_data['Okuyacağım olarak işaretlenmiş sayısı'] = soup.find('span', id='count-1').get_text(strip=True)
        except: book_data['Okuyacağım olarak işaretlenmiş sayısı'] = '0'
        try: book_data['Okuyorum olarak işaretlenmiş sayısı'] = soup.find('span', id='count-2').get_text(strip=True)
        except: book_data['Okuyorum olarak işaretlenmiş sayısı'] = '0'
        try: book_data['Okudum olarak işaretlenmiş sayısı'] = soup.find('span', id='count-3').get_text(strip=True)
        except: book_data['Okudum olarak işaretlenmiş sayısı'] = '0'

        # Toplam Satılma Sayısı
        try:
            purchased_text = soup.find('p', class_='purchased').get_text(strip=True)
            digits = re.findall(r'\d+', purchased_text)
            book_data['Toplam Satılma Sayısı'] = "".join(digits)
        except:
            book_data['Toplam Satılma Sayısı'] = 'Bilgi Yok'

        # Toplam Yorum Sayısı
        try:
            book_data['Toplam Yorum Sayısı'] = soup.select_one('p.pr_view-review-text span:last-child').get_text(strip=True)
        except:
             book_data['Toplam Yorum Sayısı'] = '0'

        # Liste Fiyatı ve diğer tablo verileri
        attribute_map = {
            'Liste Fiyatı:': 'Liste Fiyatı', 'Yayın Tarihi:': 'Yayın Tarihi', 'Dil:': 'Dil',
            'Sayfa Sayısı:': 'Sayfa Sayısı', 'Cilt Tipi:': 'Cilt Tipi', 'Kağıt Cinsi:': 'Kağıt Cinsi',
            'Boyut:': 'Boyut'
        }
        for key in attribute_map.values():
            book_data[key] = 'Bilgi Yok'
        try:
            attributes_table = soup.find('div', class_='attributes').find('table')
            if attributes_table:
                rows = attributes_table.find_all('tr')
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) == 2:
                        label = cells[0].get_text(strip=True)
                        if label in attribute_map:
                            book_data[attribute_map[label]] = cells[1].get_text(strip=True).replace('\n', '').strip()
        except Exception:
            pass
            
        return book_data

    except Exception as e:
        print(f"Detay çekme hatası: {book_url} - {e}")
        return None

# --- ANA KOD ---
if __name__ == "__main__":
    service = Service()
    options = webdriver.ChromeOptions()
    # Tarayıcının arka planda, görünmeden çalışmasını isterseniz aşağıdaki satırı aktifleştirin.
    # options.add_argument('--headless')
    driver = webdriver.Chrome(service=service, options=options)

    # **DEĞİŞİKLİK: URL'ye sayfalama için `&page={}` eklendi.**
    base_url = "https://www.kitapyurdu.com/index.php?route=product/bargain&category=0&discount=60&filter_in_stock=1&filter_in_shelf=0&sort=purchased&order=DESC&limit=100&page={}"
    
    all_books_data = []; book_urls = set()

    print("Kitap linkleri toplanıyor...")
    # **DEĞİŞİKLİK: 1497 kitap için 15 sayfa gezilecek.**
    for page_num in range(1, 16): 
        if len(book_urls) >= 1497: break
        try:
            url = base_url.format(page_num)
            driver.get(url) 
            time.sleep(random.uniform(2, 4)) 
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            # **DEĞİŞİKLİK: [:5] limiti kaldırıldı.**
            book_divs = soup.find_all('div', class_='product-cr')
            
            if not book_divs:
                print(f"UYARI: Sayfa {page_num} üzerinde kitap bulunamadı. Muhtemelen son sayfaya ulaşıldı.")
                break # Kitap bulunamayan sayfada döngüyü sonlandır.
            
            for div in book_divs:
                link_tag = div.find('a', class_='pr-img-link', href=True)
                if link_tag: 
                    book_urls.add(link_tag['href'])
            print(f"Sayfa {page_num} tarandı. Toplam {len(book_urls)} adet eşsiz link bulundu.")
        except Exception as e:
            print(f"Liste sayfası hatası: {e}"); break
    
    print(f"\nToplam {len(book_urls)} adet kitap linki bulundu. Şimdi detaylar çekiliyor...")
    count = 0
    for url in list(book_urls):
        # **DEĞİŞİKLİK: Limit 1000 kitaba çıkarıldı.**
        if count >= 1497: 
            print("Hedeflenen 1497 kitap verisine ulaşıldı. İşlem durduruluyor.")
            break
        
        book_details = get_book_details(url, driver)
        if book_details:
            all_books_data.append(book_details)
            count += 1
            print(f"{count}. Kitap işlendi: {book_details.get('Kitap Adı', 'N/A')}")

    driver.quit()

    print("\nVeriler CSV dosyasına kaydediliyor...")
    if all_books_data:
        df = pd.DataFrame(all_books_data)
        desired_columns = [ 'Kitap Adı', 'Kitabın kategorisi', 'Kitap Yazarı', 'Yayınevi', '100 Üzerinden Aldığı Puan', 'Favorilere Ekleyen Kişi Sayısı', 'Okuyacağım olarak işaretlenmiş sayısı', 'Okuyorum olarak işaretlenmiş sayısı', 'Okudum olarak işaretlenmiş sayısı', 'Liste Fiyatı', 'Yayın Tarihi', 'Dil', 'Sayfa Sayısı', 'Cilt Tipi', 'Boyut', 'Kağıt Cinsi', 'Toplam Satılma Sayısı', 'Toplam Yorum Sayısı' ]
        for col in desired_columns:
            if col not in df.columns: df[col] = 'Bilgi Yok'
        df = df.reindex(columns=desired_columns)
        
        # **DEĞİŞİKLİK: Final dosya adı.**
        df.to_csv('kitapyurdu_dataset.csv', index=False, encoding='utf-8-sig')
        print("\nİşlem tamamlandı! 'kitapyurdu_dataset.csv' dosyası oluşturuldu.")
    else:
        print("Hiç veri çekilemedi. CSV dosyası oluşturulmadı.")
