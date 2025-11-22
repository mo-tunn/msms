
# Geliştirme ve Git İş Akışı Rehberi

Bu rehber, Notion üzerinden size atanan görevleri tamamlarken izlemeniz gereken standart Git akışını özetlemektedir.

TaskBoard : https://disco-nerve-a2b.notion.site/msms?v=5bb286513c6e4d28b0dfa3792c50d108

## I. Temel Kurallar

1.  **Ana Dal (main):** Sadece bitmiş uygulamanın son halini içerir. **Asla doğrudan push yapmayın.**
2.  **Geliştirme Dalı (develop):** Tüm geliştirmelerin birleştiği ana daldır. Pull Request'ler buraya açılır.
3.  **Her Görev = Yeni Branch:** Başladığınız her görev veya özellik için mutlaka yeni bir branch oluşturun.

## II. İş Akışı: Adım Adım Komutlar

### 1\. Projeyi Klonlama (Sadece İlk Sefer)

```bash
git clone <repo-url>
```

### 2\. Yeni Bir Branch Oluşturma

Yeni göreviniz için mutlaka `develop` dalından dallanarak yeni bir branch oluşturun ve ona geçiş yapın.

```bash
# Yeni branch oluştur ve geçiş yap
git checkout -b <branch-adiniz>
```

> **Önemli: Branch İsimlendirme Standardı**
> Tüm isimler küçük harf olmalı ve kelimeler `-` (tire) ile ayrılmalıdır.
>
>   * **Özellik:** `feature/login-ekle`
>   * **Hata Düzeltme:** `bugfix/navbar-duzelt`
>   * **Dokümantasyon:** `docs/readme-guncelle`

### 3\. Değişiklik Yapma ve Kaydetme (Commit)

Çalışmanızı kaydetmek için düzenli olarak bu adımları uygulayın. Commit mesajınız kısa ve ne yaptığınızı açıkça anlatan nitelikte olmalıdır.

```bash
# Değişiklikleri kayda hazır hale getir
git add .

# Değişiklikleri commit et
git commit -m "<commit-mesajiniz>"
```

### 4\. Değişiklikleri Depoya Kaydetme (Push)

Yerel branch'inizdeki değişiklikleri GitHub'a yükleyin.

```bash
# İlk push (branch'i remote'a bağlar)
git push -u origin <branch-adiniz>

# Sonraki push'lar için
git push
```

### 5\. Pull Request (PR) Oluşturma

Göreviniz bittiğinde, branch'inizdeki değişiklikleri `develop`'a birleştirmek için GitHub üzerinden bir Pull Request (PR) oluşturun.

  * **Hedef:** Her zaman **`develop`** dalını seçin.
  * **Açıklama:** PR başlığı ve açıklaması, ne yaptığınızı açıkça belirtmelidir.

### 6\. Kod İncelemesi ve Merge

Oluşturduğunuz PR, diğer ekip üyeleri tarafından incelenip onaylandıktan sonra, `develop` dalına birleştirilecektir (Merge).

### 7\. Branch'i Güncel Tutma (Conflict Önleme)

Yeni bir görev öncesinde veya uzun süre çalıştığınızda, branch'inizi `develop` ile güncel tutarak çakışmaları (conflict) önleyin.

```bash
# 1. develop'a geç ve en güncel halini çek
git checkout develop
git pull origin develop

# 2. Çalıştığınız branch'e geri dön
git checkout <branch-adiniz>

# 3. develop'taki değişiklikleri merge et
git merge develop
```

> **Çakışma Uyarısı:** Eğer `git merge develop` sırasında çakışma çıkarsa, dosyaları düzenleyerek çakışmaları çözün, ardından `git add .` ve `git commit` ile kaydedin.

### 8\. Branch Silme (Temizlik)

PR merge edildikten sonra temizlik amacıyla branch'inizi silebilirsiniz.

```bash
# Uzak (Remote) branch silme
git push origin --delete <branch-adiniz>

# Yerel (Lokal) branch silme
git branch -d <branch-adiniz>
```
