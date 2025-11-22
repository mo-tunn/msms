

# Veritabanı Tasarım Dokümanı

**Proje:** YKS Mentorluk Öğrenci Paneli
**Veritabanı Sistemi:** PostgreSQL

-----

## 1\. Varlık İlişki Modeli ve Normalizasyon (20 Puan)

*Kriter: En az 6 varlık, Normalizasyon içeren uygun model.*

Sistem, veri tekrarını önlemek ve tutarlılığı sağlamak amacıyla **3. Normal Form (3NF)** kurallarına uygun tasarlanmıştır. Özellikle sınav verileri (Exams ve ExamDetails) ayrılarak veri tekrarı önlenmiştir.

### 1.1. Varlıklar (Entities) - Toplam 9 Tablo

Aşağıdaki tablolar sistemin temelini oluşturur:

1.  **Users:** Sisteme giren herkesin (Admin, Mentor, Öğrenci) temel giriş bilgilerini tutar.
2.  **Roles:** Kullanıcı yetkilerini (RBAC) yönetir.
3.  **Students:** `Users` tablosu ile 1:1 ilişkili, öğrenciye özel (Alan, Hedef vb.) verileri tutar.
4.  **Mentors:** `Users` tablosu ile 1:1 ilişkili, mentora özel (Branş, Kapasite) verileri tutar.
5.  **Tasks:** Öğrencilere atanan görevleri tutar.
6.  **Meetings:** Mentor ve öğrenci arasındaki toplantıları tutar.
7.  **Exams:** Sınavın başlık bilgilerini (Adı, Tarihi, Tipi) tutar.
8.  **ExamDetails:** Bir sınavın ders bazındaki detaylarını (Matematik: 30 Doğru, 5 Yanlış) tutar.
9.  **Books:** AI modülü için sorgulanan kitapları ve tahmin sonuçlarını tutar.

### 1.2. İlişkiler (Relationships)

  * **Users - Roles:** Many-to-One (Her kullanıcının bir rolü vardır).
  * **Mentors - Students:** One-to-Many (Bir mentorun çok öğrencisi olabilir).
  * **Students - Tasks:** One-to-Many.
  * **Exams - ExamDetails:** One-to-Many (Bir sınavın birden çok ders detayı vardır).

-----

## 2\. Veri Bütünlüğü ve Kısıtlar (Constraints) (20 Puan)

*Kriter: En az 3 farklı türde, toplam 5 adet constraint.*

Veri kalitesini veritabanı seviyesinde garanti altına almak için aşağıdaki kısıtlar tanımlanmıştır.

### 2.1. Kullanılan Kısıt Türleri

1.  **PRIMARY KEY (PK):** Her satırın benzersizliğini sağlar.
2.  **FOREIGN KEY (FK):** Tablolar arası referans bütünlüğünü sağlar.
3.  **UNIQUE:** Tekrar eden veriyi engeller.
4.  **CHECK:** Verinin mantıksal doğruluğunu kontrol eder.
5.  **NOT NULL:** Boş veri girilmesini engeller.

### 2.2. Uygulanan Kısıtlar (Constraints)

Aşağıdaki SQL tanımları, puanlama kriterindeki "En az 5 adet constraint" şartını fazlasıyla karşılar:

```sql
-- 1. UNIQUE Constraint: Aynı e-posta ile ikinci kayıt oluşturulamaz.
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

-- 2. CHECK Constraint: Sınavdaki doğru/yanlış sayıları negatif olamaz.
ALTER TABLE exam_details ADD CONSTRAINT chk_positive_counts 
CHECK (correct_count >= 0 AND wrong_count >= 0 AND empty_count >= 0);

-- 3. CHECK Constraint: Görev durumu sadece belirli değerleri alabilir (Enum Mantığı).
ALTER TABLE tasks ADD CONSTRAINT chk_task_status 
CHECK (status IN ('Pending', 'Completed', 'Cancelled', 'Overdue'));

-- 4. CHECK Constraint: Kullanıcı TCKN'si 11 hane olmak zorundadır.
ALTER TABLE users ADD CONSTRAINT chk_tckn_length 
CHECK (LENGTH(tckn) = 11);

-- 5. NOT NULL Constraint: Sınav tarihi boş bırakılamaz.
ALTER TABLE exams ALTER COLUMN exam_date SET NOT NULL;

-- 6. DEFAULT Constraint: Kayıt tarihi girilmezse o anın zamanı atanır.
ALTER TABLE tasks ALTER COLUMN created_at SET DEFAULT NOW();
```

-----

## 3\. Performans Stratejileri (10 Puan)

*Kriter: Sorgu performansı için kullanılan stratejiler.*

Yüksek veri trafiğinde (örneğin binlerce sınav kaydı arasında arama yaparken) sistemin yavaşlamaması için **Indexing (İndeksleme)** stratejisi uygulanmıştır.

1.  **Foreign Key İndeksleri:** PostgreSQL FK sütunlarını otomatik indekslemez. `Students`, `Tasks` ve `Exams` tablolarındaki bağlantı sütunlarına (`student_id`, `mentor_id`) indeks atılmıştır.
2.  **Filtreleme İndeksleri:** Sık sorgulanan `email` ve `tckn` alanlarına indeks tanımlanmıştır.
3.  **Tarih Aralığı İndeksleri:** Analiz modülü sürekli "Son 1 Ay", "Son 1 Hafta" sorgusu yapacağı için `exams.exam_date` ve `tasks.deadline` sütunlarına **B-Tree Index** uygulanmıştır.

<!-- end list -->

```sql
CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
```

-----

## 4\. Veritabanı Programlama Nesneleri (30 Puan)

*Kriter: 2 SP, 5 View, 2 UDF kullanımı.*

İş mantığının bir kısmını veritabanına yıkarak backend yükünü hafifleten nesneler aşağıdadır.

### 4.1. Kullanıcı Tanımlı Fonksiyonlar (User Defined Functions - UDF) (2 Adet)

**Fonksiyon 1: Net Hesaplama Fonksiyonu (`fn_calculate_net`)**
Her sınav detayı girildiğinde backend'de hesap yapmak yerine veritabanı bunu otomatik yapar. (4 yanlış 1 doğruyu götürür).

```sql
CREATE OR REPLACE FUNCTION fn_calculate_net(correct INT, wrong INT) 
RETURNS NUMERIC AS $$
BEGIN
    RETURN correct - (wrong::NUMERIC / 4.0);
END;
$$ LANGUAGE plpgsql;
```

**Fonksiyon 2: Görev Başarı Oranı Hesaplama (`fn_get_task_completion_rate`)**
Bir öğrencinin ID'sini verince başarı yüzdesini döner. Analiz modülü için kritiktir.

```sql
CREATE OR REPLACE FUNCTION fn_get_task_completion_rate(p_student_id INT)
RETURNS NUMERIC AS $$
DECLARE
    total_tasks INT;
    completed_tasks INT;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'Completed')
    INTO total_tasks, completed_tasks
    FROM tasks
    WHERE student_id = p_student_id;

    IF total_tasks = 0 THEN RETURN 0; END IF;
    RETURN (completed_tasks::NUMERIC / total_tasks) * 100;
END;
$$ LANGUAGE plpgsql;
```

### 4.2. Stored Procedures (Saklı Yordamlar) (2 Adet)

**Prosedür 1: Sınav Kaydı Oluşturma (`sp_create_exam_entry`)**
Backend'den tek bir istek gelir, bu prosedür hem `Exams` tablosuna başlığı ekler hem de dönen ID'yi kullanarak `ExamDetails` tablosuna dersleri ekler (Transaction Yönetimi).

```sql
CREATE OR REPLACE PROCEDURE sp_create_exam_entry(
    p_student_id INT,
    p_exam_name VARCHAR,
    p_exam_date DATE,
    p_details JSON -- Örn: [{"lesson": "Mat", "correct": 30, "wrong": 5}, ...]
)
LANGUAGE plpgsql AS $$
DECLARE
    new_exam_id INT;
    detail RECORD;
BEGIN
    -- 1. Sınav Başlığını Ekle
    INSERT INTO exams (student_id, exam_name, exam_date)
    VALUES (p_student_id, p_exam_name, p_exam_date)
    RETURNING id INTO new_exam_id;

    -- 2. JSON içindeki detayları döngüyle ekle
    FOR detail IN SELECT * FROM json_populate_recordset(null::exam_details, p_details) LOOP
        INSERT INTO exam_details (exam_id, lesson_name, correct_count, wrong_count, empty_count)
        VALUES (new_exam_id, detail.lesson_name, detail.correct_count, detail.wrong_count, detail.empty_count);
    END LOOP;
END;
$$;
```

**Prosedür 2: Süresi Geçen Görevleri İşaretleme (`sp_mark_overdue_tasks`)**
Her gece çalışacak bir Cron Job tarafından çağrılır. Tarihi geçen ve tamamlanmamış görevleri "Overdue" yapar.

```sql
CREATE OR REPLACE PROCEDURE sp_mark_overdue_tasks()
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE tasks 
    SET status = 'Overdue'
    WHERE deadline < NOW() AND status = 'Pending';
END;
$$;
```

### 4.3. Views (Görünümler) (5 Adet)

1.  **`vw_student_profile_full`**: Users ve Students tablolarını birleştirip tek satırda tam profil verir (Maskeleme yapılabilir).
2.  **`vw_mentor_student_list`**: Hangi mentorun hangi öğrenciye baktığını isim bazlı listeler.
3.  **`vw_dashboard_stats`**: Analiz modülü için öğrencinin tamamladığı görev ve katıldığı toplantı sayılarını hazır tutar.
4.  **`vw_exam_history`**: Sınavların sadece özet (Toplam Net) sonuçlarını listeler (Detay tablosuyla join yapar).
5.  **`vw_pending_notifications`**: Henüz okunmamış duyuruları ve yaklaşan toplantı bildirimlerini listeler.

Örnek View Kodu (`vw_dashboard_stats`):

```sql
CREATE VIEW vw_dashboard_stats AS
SELECT 
    student_id,
    fn_get_task_completion_rate(student_id) as success_rate,
    (SELECT COUNT(*) FROM meetings WHERE student_id = t.student_id AND participation_status = 'Katıldı') as attended_meetings
FROM students t;
```

-----

## 5\. Yetkilendirme ve Maskeleme (10 Puan)

*Kriter: Uygun yetkilendirme ve veri maskeleme.*

### 5.1. Veritabanı Kullanıcı Yetkilendirmesi (Authorization)

Güvenlik için uygulama veritabanına "Superuser" (postgres) ile bağlanmaz. Özel yetkilere sahip bir rol oluşturulur.

```sql
-- Uygulama için kullanıcı oluşturma
CREATE USER app_user WITH PASSWORD 'SecurePass123!';

-- Sadece gerekli tablolara izin verme (Least Privilege Principle)
GRANT CONNECT ON DATABASE yks_mop_db TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
-- DELETE yetkisi sadece 'logs' hariç tablolara verilir veya hiç verilmez (Soft delete için).
```

### 5.2. Veri Maskeleme (Data Masking)

KVKK (veya GDPR) gereği TCKN ve Telefon numaraları raporlama ekranlarında maskelenerek gösterilmelidir. Bunun için bir View oluşturulmuştur.

```sql
CREATE VIEW vw_safe_user_list AS
SELECT 
    first_name, 
    last_name, 
    -- TCKN'nin ilk 2 ve son 2 hanesi hariç yıldızla (*) maskele
    CONCAT(LEFT(tckn, 2), '*******', RIGHT(tckn, 2)) as masked_tckn,
    email
FROM users;
```

-----
