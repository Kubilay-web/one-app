import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Photos({ token, user }) {
  const [loading, setLoading] = useState(false); // Yükleniyor durumu
  const [error, setError] = useState(''); // Hata mesajı
  const [photos, setPhotos] = useState([]); // Fotoğraflar

  const id = user.id; // Kullanıcı ID'si

  console.log(id);

  useEffect(() => {
    getPhotos(); // Kullanıcı ID'sine göre fotoğrafları çek
  }, [id]);

  // Fotoğrafları API'den çekme fonksiyonu
  const getPhotos = async () => {
    setLoading(true); // Yükleniyor durumuna geç
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/posts/${id}`, // API'den fotoğrafları al
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token'ı ekle
          },
        }
      );

      console.log("data--->", data);
      
      // Fotoğraf URL'lerini çıkart
      setPhotos(data); // `data` zaten fotoğraf URL'lerini içeriyor, doğrudan state'e kaydediyoruz
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred'); // Hata mesajını ayarla
    } finally {
      setLoading(false); // Yükleniyor durumunu kapat
    }
  };

  // Fotoğrafları render et
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Photos
        <div className="profile_header_link">See all photos</div>
      </div>
      <div className="profile_card_count">
        {photos.length === 0
          ? "No photos"
          : photos.length === 1
          ? "1 Photo"
          : `${photos.length} photos`}
      </div>
      <div className="profile_card_grid">
        {loading ? (
          <div>Loading...</div> // Yükleniyor mesajı
        ) : error ? (
          <div>{error}</div> // Hata mesajı
        ) : (
          photos.slice(0, 9).map((img, index) => ( // İlk 9 fotoğrafı gösteriyoruz
            <div className="profile_photo_card" key={index}>
              <img src={img} alt={`photo-${index}`} /> {/* Fotoğrafı göster */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
