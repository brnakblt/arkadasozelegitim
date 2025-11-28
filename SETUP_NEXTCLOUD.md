# Nextcloud Kurulum ve Entegrasyon Rehberi

Nextcloud kaynak kodunu `nextcloud` klasörüne klonladık. Tam entegrasyon için aşağıdaki adımları takip ederek sunucu ortamını hazırlamanız gerekmektedir.

## Hızlı Başlangıç (Geliştirme İçin)

Eğer Nginx ile uğraşmak istemiyorsanız, hazırladığım betiği kullanarak Nextcloud'u hızlıca başlatabilirsiniz:

```bash
./start-nextcloud.sh
```

Bu komut PHP'nin dahili sunucusunu kullanarak Nextcloud'u `http://localhost:8080` adresinde başlatır.

## 1. Gerekli Paketlerin Kurulumu (Arch Linux)

Nextcloud'un çalışması için bazı PHP eklentilerine ve veritabanı sürücüsüne ihtiyacı vardır.

```bash
sudo pacman -S php-gd php-intl php-sqlite php-fpm
# Eğer MySQL/MariaDB kullanacaksanız: sudo pacman -S php-mysql
# Eğer PostgreSQL kullanacaksanız: sudo pacman -S php-pgsql
```

## 2. PHP Konfigürasyonu

`/etc/php/php.ini` dosyasını düzenleyerek aşağıdaki eklentilerin başındaki `;` işaretini kaldırıp aktif hale getirin:

```ini
extension=gd
extension=intl
extension=pdo_sqlite
extension=zip
extension=xml
extension=mbstring
extension=curl
; extension=pdo_mysql ; MySQL kullanacaksanız
```

Ayrıca `open_basedir` ayarını Nextcloud dizinini kapsayacak şekilde düzenlemeniz veya devre dışı bırakmanız gerekebilir.

## 3. PHP-FPM Başlatma

```bash
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
```

## 4. Nginx Konfigürasyonu

Sizin için `arkadasweb/config/nginx-nextcloud.conf` dosyasını hazırladım. Bu dosyayı Nginx konfigürasyonunuza dahil etmelisiniz.

Örnek olarak `/etc/nginx/nginx.conf` dosyanızın `http` bloğu içine ekleyebilirsiniz:

```nginx
http {
    # ... diğer ayarlar ...
    include /home/baran/Proje/arkadasozelegitim/arkadasweb/config/nginx-nextcloud.conf;
}
```

**Not:** `nginx-nextcloud.conf` dosyasındaki `root` yolunun doğru olduğundan emin olun (`/home/baran/Proje/arkadasozelegitim/nextcloud`).

Nginx'i yeniden başlatın:
```bash
sudo systemctl restart nginx
```

## 5. Nextcloud Kurulumu

Tarayıcınızdan `http://localhost:8080` adresine gidin.
1. Yönetici hesabı oluşturun (örn: `admin` / `sifre`).
2. Veritabanı olarak SQLite (basit kurulum için) veya kurulu veritabanınızı seçin.
3. Kurulumu tamamlayın.

## 6. Uygulama Entegrasyonu

Kurulum tamamlandıktan sonra `arkadasweb/.env.local` dosyasını güncelleyin:

```env
NEXT_PUBLIC_NEXTCLOUD_URL=http://localhost:8080
NEXTCLOUD_USER=admin
NEXTCLOUD_PASSWORD=sifreniz
```

Artık uygulamanız yerel Nextcloud sunucusuyla tam entegre çalışacaktır.
