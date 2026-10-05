import { SimpleHero } from '@/components/ui/SimpleHero';
import { IconInputGroup } from '@/components/ui/IconInputGroup';

import { ContactInfoItemCard } from '@/components/ui/ContactInfoItemCard';

export default function Contact() {
  return (
    <>
      <SimpleHero 
        badgeText="Hubungi Kami"
        title={<>Ada yang Bisa <span className="text-gradient">Kami Bantu?</span></>}
        description="Tim kami siap membantu Anda 7 hari seminggu. Jangan ragu untuk menghubungi kami!"
      />

      <section className="py-5">
        <div className="container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-5">
              <h3 className="mb-4 fw-700">Kirim Pesan</h3>
              <form action="/kontak" method="POST">
                <IconInputGroup 
                  label="Nama Lengkap" 
                  name="name" 
                  icon="fas fa-user" 
                  placeholder="Nama Anda" 
                  required 
                />
                <IconInputGroup 
                  label="Alamat Email" 
                  name="email" 
                  type="email"
                  icon="fas fa-envelope" 
                  placeholder="email@anda.com" 
                  required 
                />
                <IconInputGroup 
                  label="Subjek" 
                  name="subject" 
                  icon="fas fa-tag" 
                  placeholder="Perihal pesan Anda" 
                />
                <IconInputGroup 
                  label="Pesan" 
                  name="message" 
                  as="textarea"
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..." 
                  style={{ paddingLeft: '16px', height: 'auto' }}
                  required 
                />
                <button type="submit" className="btn-submit">
                  <span>Kirim Pesan</span>
                  <i className="fas fa-paper-plane ms-2"></i>
                </button>
              </form>
            </div>
            <div className="col-lg-4">
              <h3 className="mb-4 fw-700">Informasi Kontak</h3>
              <div className="contact-info-list">
                <ContactInfoItemCard 
                  title="Email"
                  value="info@edunusa.id"
                  icon="fa-envelope"
                  bgColor="#EDE9FF"
                  color="#6C47FF"
                />
                <ContactInfoItemCard 
                  title="WhatsApp"
                  value="+62 811-2345-6789"
                  icon="fa-phone"
                  bgColor="#FEF3C7"
                  color="#F59E0B"
                />
                <ContactInfoItemCard 
                  title="Jam Operasional"
                  value={<>Senin–Jumat: 08.00–17.00 WIB<br/>Sabtu: 09.00–13.00 WIB</>}
                  icon="fa-clock"
                  bgColor="#DCFCE7"
                  color="#22C55E"
                />
                <ContactInfoItemCard 
                  title="Alamat"
                  value="Jl. Sudirman No. 88, Jakarta Pusat 10220"
                  icon="fa-map-marker-alt"
                  bgColor="#FEE2E2"
                  color="#EF4444"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
