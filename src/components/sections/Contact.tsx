import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Share2, MessageCircle, ScanLine } from 'lucide-react'
import { SectionHeader } from '@ui/SectionHeader'
import { fadeLeftVariants, fadeRightVariants, fadeUpVariants, defaultViewport } from '@lib/animations'

const MAP_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963.5!2d120.9912!3d14.4097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d100207fad3b%3A0x5fba74cbe6b7fcc!2sBlk%2010%20Lot%206!5e0!3m2!1sen!2sph!4v1718000000`

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent('https://www.facebook.com/profile.php?id=61590018405492')}&bgcolor=ffffff&color=000000&margin=12`

export function Contact() {
  return (
    <section id="contact" className="bg-gray-50">

      {/* ── Top: Contact Info + QR ─────────────────────── */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Get In Touch"
            title="We'd Love to Hear From You"
            subtitle="Reach out via phone, email, or social media — our travel experts are ready to help."
          />

          <div className="grid md:grid-cols-2 gap-6">

            {/* Contact Info — dark card */}
            <motion.div
              variants={fadeLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-brand-black rounded-2xl p-8 text-white flex flex-col gap-6"
            >
              <h3 className="font-bold text-xl font-heading">Contact Information</h3>

              <div className="flex flex-col gap-5">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Phone</p>
                    <a href="tel:09159234547" className="block text-sm text-white hover:text-brand-orange transition-colors">
                      09159234547
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Email</p>
                    <a href="mailto:A.travelandtours@gmail.com" className="text-sm text-white hover:text-brand-orange transition-colors break-all">
                      A.travelandtours@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Blk 10 Lot 6, Danarose Residences,<br />Bacoor, Cavite, Philippines
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Social */}
              <div className="flex flex-col gap-3">
                <p className="text-white/45 text-xs uppercase tracking-widest">Connect With Us</p>
                <a
                  href="https://www.facebook.com/profile.php?id=61590018405492"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm text-white font-medium hover:bg-brand-orange transition-colors"
                >
                  <Share2 size={16} />
                  A N D Travel and Tours — Facebook
                </a>
                <a
                  href="https://www.facebook.com/messages/t/61590018405492"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm text-white font-medium hover:bg-brand-orange transition-colors"
                >
                  <MessageCircle size={16} />
                  Chat with us on Messenger
                </a>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-brand-gold italic text-sm font-medium">Your Journey, Our Priority</p>
              </div>
            </motion.div>

            {/* QR Code card */}
            <motion.div
              variants={fadeRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col items-center justify-center p-8 gap-5 text-center"
            >
              {/* SCAN ME header */}
              <div className="flex items-center gap-2 bg-brand-orange rounded-xl px-5 py-2">
                <ScanLine size={14} className="text-white" />
                <span className="text-white text-xs font-black tracking-[0.2em] uppercase">Scan Me</span>
              </div>

              {/* QR image */}
              <div className="bg-white rounded-2xl p-3 shadow-card-lg border-2 border-brand-orange/15">
                <img
                  src={QR_URL}
                  alt="Scan QR to connect on Facebook"
                  width={220}
                  height={220}
                  className="block rounded-xl"
                />
              </div>

              <div>
                <p className="font-semibold text-brand-black text-base mb-1">Scan to Connect</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Scan the QR code to visit our<br />Facebook page and send us a message
                </p>
              </div>

              <a
                href="https://www.facebook.com/profile.php?id=61590018405492"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Visit Facebook Page
              </a>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Bottom: Full-width Map — independent ────────── */}
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="w-full"
        style={{ height: '450px' }}
      >
        <iframe
          title="A N D Travel and Tours — Blk 10 Lot 6, Danarose Residences, Bacoor Cavite"
          src={MAP_EMBED}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>

    </section>
  )
}
