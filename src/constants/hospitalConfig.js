// src/constants/hospitalConfig.js

// Import real assets
import logoImg from "../assets/hospital_logo_1.png";
import qrImg from "../assets/patient-management-qr.png";
import heroBgImg from "../assets/1.jpg";
import heroBgImgAlt from "../assets/2.jpg";
import contactBgImg from "../assets/hero_background.jpg";
import testimonialsBgImg from "../assets/testimonials.jpg";
import hospImg1 from "../assets/hosp_img1.jpg";
import hospImg2 from "../assets/hosp_img2.jpg";
import hospImg3 from "../assets/hosp_img3.jpg";

// Hero images
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";

// Treatment images
import uttarBastiImg from "../assets/Uttar Basti Treatment.jpg";
import nasyaImg from "../assets/Nasya Therapy.jpg";
import netraImg from "../assets/netra-tarpan.jpg";
import virechanaImg from "../assets/Virechana Therapy.jpg";
import raktaImg from "../assets/Raktamokshana Therapy.jpg";
import greevaImg from "../assets/GREEVA-BASTI.jpg";
import shirodharaImg from "../assets/Shirodhara.jpg";
import katiBasti from "../assets/Kati_Basti.jpg";
import swedanaImg from "../assets/Swedana.jpg";
import hairDiseaseImg from "../assets/Hair Disease.jpg";
import weightLossImg from "../assets/weight-loss.jpg";
import oilMassageImg from "../assets/Ayurvedic oil massage & steam.jpg";
import garbhasanskarImg from "../assets/Garbhasanskar.jpg";
import infertilityImg from "../assets/Infertility-Treatment.jpg";
import pilesImg from "../assets/piles.jpg";

// Doctor photos (real clinical photos)
import docOmprasad from "../assets/Dr Omprasad Jagtap.jpeg";
import docKadambari from "../assets/Dr Kadambari Jagtap.jpeg";

// Testimonial photos
import testShradha from "../assets/shradha patil.jpg";
import testSnehal from "../assets/snehal nale.jpg";
import testVaishnavi from "../assets/vaishnvi karpe.jpg";
import testKanchan from "../assets/kanchan kale.jpg";
import testSamruddhi from "../assets/samruddhi patil.png";

// Product images
import hairSerumImg from "../assets/hair serum.png";
import goldMilkImg from "../assets/gold-n-milk.png";
import ayurPowerImg from "../assets/ayur_power.png";
import shikakaiImg from "../assets/shikakai-shampoo.png";
import antidandruffImg from "../assets/antidandruff-shampoo.png";
import amlaImg from "../assets/amla-shampoo.png";
import milkProteinImg from "../assets/milk-protein-shampoo.png";

export const HOSPITAL_CONFIG = {
  name: "MOOLATVAM AYURVED",
  tagline: "Pure Ayurvedic Healing for Lasting Wellness.",
  subtitle: "Welcome to a sanctuary of authentic Ayurvedic care. From deep tissue detoxification to specialized chronic disease management, our expert lineage of physicians utilizes nature's purest remedies to restore balance, build immunity, and secure your long-term vitality.",
  phone: "9834923909",
  emergencyPhone: "9834923909",
  email: "contact@moolatvam.com",
  address: "Jimis Burger, 1st Floor, Shiv City Center, Near Vijaynagar Circle, Miraj-Sangli Road, Sangli, Maharashtra 416414",
  workingHours: "OPD: Mon – Sat: 10:00 AM – 9:00 PM | Sunday: Closed",

  // Social Media (real)
  socials: {
    facebook: "https://www.facebook.com/moolatvam",
    instagram: "https://www.instagram.com/moolatvam?igsh=MWc3cm0zZXVxMWp5OQ==",
    youtube: "https://www.youtube.com/@omshreeayurved",
    twitter: "#",
    linkedin: "#",
  },

  // Real Image Assets
  logo: logoImg,
  qrCode: qrImg,
  heroBg: heroBgImg,
  heroBgAlt: heroBgImgAlt,
  contactBg: contactBgImg,
  testimonialsBg: testimonialsBgImg,
  hospImg1: hospImg1,
  hospImg2: hospImg2,
  hospImg3: hospImg3,

  // Hero slider images
  heroImages: [hero1, hero2, hero3, hero4],

  // Treatments (Departments section — 6 cards)
  treatments: [
    {
      name: "Uttar Basti Treatment",
      desc: "A specialized Ayurvedic therapy designed to support women's reproductive and urinary health. Involves medicated oils or herbal decoctions to the pelvic region, promoting balance in the Vata dosha and supporting overall reproductive wellness. Addresses PCOD, fibroids, and urinary health issues.",
      image: uttarBastiImg,
      tag: "Reproductive Health",
    },
    {
      name: "Nasya Therapy",
      desc: "An ancient Panchakarma procedure where medicated oils or powders are administered through the nose to cleanse the head region. Highly beneficial for sinusitis, headaches, migraines, hair fall, cervical stiffness, and mental clarity.",
      image: nasyaImg,
      tag: "Panchakarma",
    },
    {
      name: "Netra Tarpan",
      desc: "A traditional Ayurvedic wellness ritual involving warm ghee and herbal infusions to promote calm around the eyes. Chosen by individuals seeking relief from everyday screen fatigue and urban stress in a serene and professional environment.",
      image: netraImg,
      tag: "Eye Wellness",
    },
    {
      name: "Virechana Therapy",
      desc: "Powerful internal cleansing through therapeutic purgation that removes Pitta dosha toxins from the liver, intestines, and gallbladder. Benefits those with skin diseases, acidity, liver disorders, and chronic constipation using authentic Ayurvedic medicines.",
      image: virechanaImg,
      tag: "Detox",
    },
    {
      name: "Raktamokshana Therapy",
      desc: "A unique Ayurvedic detox method for removing impure blood and treating conditions like acne, eczema, psoriasis, varicose veins, and gout. Performed using leech therapy or other safe methods to purify blood and improve skin and joint health.",
      image: raktaImg,
      tag: "Blood Purification",
    },
    {
      name: "Greeva Basti",
      desc: "Experience improved neck mobility and relief from stiffness with warm medicated oil retained on the cervical spine area. Ideal for managing cervical spondylosis and neck discomfort, this gentle treatment promotes pain-free movement and overall neck health.",
      image: greevaImg,
      tag: "Spine Care",
    },
  ],

  // Services section — 4 core therapies
  services: [
    {
      title: "Shirodhara",
      desc: "A calming Ayurvedic therapy where warm medicated oils are gently poured in a steady stream over the forehead. This traditional treatment promotes mental relaxation, enhances focus, supports restful sleep, and helps restore natural hormonal balance. Ideal for managing everyday stress, mental fatigue, and promoting overall well-being.",
      image: shirodharaImg,
      tag: "Stress & Mind",
    },
    {
      title: "Kati Basti",
      desc: "A specialized therapy for chronic lower back pain, sciatica, lumbar spondylosis, and spinal stiffness. Warm medicated Ayurvedic oil is retained in a dough ring over the lumbar region to deeply nourish muscles and joints, strengthening the spine and improving flexibility.",
      image: katiBasti,
      tag: "Back Pain",
    },
    {
      title: "Greeva Basti",
      desc: "Traditional Ayurvedic therapy involving the application and retention of warm medicated oil on the cervical spine area. Supports natural nourishment and reduces inflammation. Ideal for cervical spondylosis and neck discomfort, promoting pain-free movement and neck health.",
      image: greevaImg,
      tag: "Neck & Spine",
    },
    {
      title: "Swedana",
      desc: "Detoxify and revitalize your body with this herbal steam treatment that opens pores, removes toxins, relaxes muscles, and enhances circulation. Often combined with Abhyanga for maximum effect in pain relief, weight loss, and skin glow using authentic Ayurvedic herbs.",
      image: swedanaImg,
      tag: "Detox & Vitality",
    },
  ],

  // Wellness & Chronic Care Programs (Hospital Tour section)
  wellnessPrograms: [
    {
      title: "Hair Disease",
      desc: "Customized Ayurvedic hair care treatment using natural oils, herbal extracts, and internal Rasayanas to nourish the scalp, purify blood, and correct hormonal or digestive imbalances. Therapies like Shirodhara and Nasya for long-term results and healthy, lustrous hair.",
      image: hairDiseaseImg,
      tag: "Hair Health",
    },
    {
      title: "Weight Loss",
      desc: "Personalized, natural, and sustainable solutions through Ayurvedic therapies including Udwarthanam (herbal powder massage), Virechana (cleansing), and authentic Ayurvedic medicine to burn excess fat, improve metabolism, and balance hormones holistically.",
      image: weightLossImg,
      tag: "Wellness",
    },
    {
      title: "Ayurvedic Oil Massage & Steam",
      desc: "Authentic Abhyanga (oil massage) with warm herbal Swedana deeply nourishes the body, relaxes muscles, improves blood circulation, and removes toxins. Expert therapists use Ayurvedic oils tailored to your dosha for managing stress, fatigue, joint pain, and skin issues.",
      image: oilMassageImg,
      tag: "Rejuvenation",
    },
    {
      title: "Garbhasanskar",
      desc: "Supports expecting parents with Ayurvedic rituals and practices that nurture the physical, mental, and emotional development of the unborn child. Involves authentic Ayurvedic medicines, yoga, music therapy, meditation, and personalized diet plans.",
      image: garbhasanskarImg,
      tag: "Maternity",
    },
    {
      title: "Infertility",
      desc: "Natural solutions for male and female fertility issues through detoxification via Panchakarma, hormonal balancing, uterine strengthening, and stress reduction. Uses Ashwagandha, Shatavari, and Guduchi to improve reproductive health and ovulation.",
      image: infertilityImg,
      tag: "Fertility",
    },
    {
      title: "Piles",
      desc: "Authentic Ayurvedic wellness programs designed to support overall balance and natural well-being. Our approach includes gentle therapies, traditional daily routines, and personalized lifestyle guidance rooted in Ayurveda's timeless principles in a calm and nurturing environment.",
      image: pilesImg,
      tag: "Digestive Health",
    },
  ],

  // Doctors
  doctors: [
    {
      id: 1,
      name: "Dr. Omprasad Jagtap",
      specialty: "MD Ayurved",
      experience: "Founder & Chief Physician",
      availability: "Mon - Sat, 10:00 AM - 9:00 PM",
      photo: docOmprasad,
      badge: "Ayurved",
    },
    {
      id: 2,
      name: "Dr. Kadambari Jagtap",
      specialty: "Ayurvedic Physician",
      experience: "MD Ayu. Sch. — Specialist",
      availability: "Mon - Sat, 10:00 AM - 9:00 PM",
      photo: docKadambari,
      badge: "Ayurved",
    },
  ],

  // Products (Proprietary)
  products: [
    {
      name: "Regrowth Hair Serum",
      price: "₹699.00",
      category: "Hair Care",
      desc: "Stimulates the functionality of the dermal papilla cells at the base of the hair follicles, counteracting premature hair loss. Increases anagen hair follicles and decreases telogen hair follicles. Hair density and cumulative hair thickness is increased.",
      composition: "Brahmi ext., Punarnava ext., BAICAPIL, Redesnsyl 3%, Base QS",
      usage: "Apply a generous amount using dropper directly to your scalp. Massage into scalp using fingertips. Use twice a day for improved efficacy.",
      storage: "Store in a cool, dry & dark place. Do not freeze. For external use only.",
      image: hairSerumImg,
    },
    {
      name: "Gold-N-Milk",
      price: "₹199.00",
      category: "Immunity",
      desc: "Boosts immunity, fights with allergies. Also beneficial in running nose, cough, sleeplessness etc.",
      composition: "Natural herbal blend with gold extracts",
      usage: "As directed by physician",
      storage: "Store in a cool, dry place.",
      image: goldMilkImg,
    },
    {
      name: "AyurPower",
      price: "₹199.00",
      category: "Energy",
      desc: "Natural energy drink with no side-effects. Suitable for children, youngsters as well as old age people.",
      composition: "Natural Ayurvedic herbs and minerals",
      usage: "Mix with water or milk as directed",
      storage: "Store in a cool, dry place.",
      image: ayurPowerImg,
    },
    {
      name: "Shikakai Shampoo",
      price: "₹99.00",
      category: "Herbal Cosmetics",
      desc: "Made with real decoction (kadha) of Shikakai. Suitable for all type of hair. Cleanses gently while maintaining natural scalp oils.",
      composition: "Real Shikakai decoction, herbal base",
      usage: "Apply to wet hair, lather and rinse thoroughly",
      storage: "Store in a cool, dry place.",
      image: shikakaiImg,
    },
    {
      name: "Antidandruff Shampoo",
      price: "₹99.00",
      category: "Herbal Cosmetics",
      desc: "Our top-selling product for heavy dandruff and scalp itching. Formulated with potent anti-fungal herbal extracts.",
      composition: "Anti-fungal herbal extracts, natural base",
      usage: "Apply to wet hair, lather and leave for 2 minutes, rinse thoroughly",
      storage: "Store in a cool, dry place.",
      image: antidandruffImg,
    },
    {
      name: "Amla Shampoo",
      price: "₹99.00",
      category: "Herbal Cosmetics",
      desc: "Special research product made with a real decoction of Amla. Useful in conditions like hairfall, dandruff, scalp itching etc.",
      composition: "Real Amla decoction, herbal base",
      usage: "Apply to wet hair, lather and rinse thoroughly",
      storage: "Store in a cool, dry place.",
      image: amlaImg,
    },
    {
      name: "Milk Protein Shampoo",
      price: "₹99.00",
      category: "Herbal Cosmetics",
      desc: "A product rich with protein required for maintenance of healthy hair. Nourishes and strengthens each hair strand from root to tip.",
      composition: "Milk protein, herbal extracts, natural base",
      usage: "Apply to wet hair, lather and rinse thoroughly",
      storage: "Store in a cool, dry place.",
      image: milkProteinImg,
    },
  ],

  // Testimonials (real from treatments.txt)
  testimonials: [
    {
      id: 1,
      name: "Shradha Patil",
      location: "Sangli, Maharashtra",
      rating: 5,
      feedback: "I've been using medicines since pregnancy and gave Swarnprashan to my baby since birth. With Mam's guidance, my baby is very strong and the teething process went smoothly. Baby oil, lotion, and body wash products — all give excellent results. Thank you Mam for your guidance!",
      avatar: testShradha,
    },
    {
      id: 2,
      name: "Snehal Nale",
      location: "Sangli, Maharashtra",
      rating: 5,
      feedback: "I visited for my hypothyroidism which was causing significant tiredness and weight gain. Dr. Kadambari took a holistic approach, carefully considering my prakriti and lifestyle. She prescribed a combination of herbal medicine along with specific diet recommendations. Highly recommend!",
      avatar: testSnehal,
    },
    {
      id: 3,
      name: "Vaishnavi Karpe",
      location: "Miraj, Sangli",
      rating: 5,
      feedback: "I was suffering from ulcerative colitis since 2023 and my condition was very uncomfortable. I had weakness and stress due to my health. Then I started treatment at Moolatvam Ayurveda Miraj — the results have been transformative and I feel much better now.",
      avatar: testVaishnavi,
    },
    {
      id: 4,
      name: "Kanchan Kale",
      location: "Sangli, Maharashtra",
      rating: 5,
      feedback: "I had an online consultation with Dr. Kadambari. The consultation was smooth and informative. The doctor explained the condition clearly and suggested the right treatment. Thank you for the support — highly recommended!",
      avatar: testKanchan,
    },
    {
      id: 5,
      name: "Samruddhi Patil",
      location: "Sangli, Maharashtra",
      rating: 5,
      feedback: "Dr. Jagtap sir is a very well spoken and experienced doctor. Services of Moolatvam Ayurved are really impeccable — a one stop destination for all health concerns. Absolutely the best Ayurvedic hospital in Sangli!",
      avatar: testSamruddhi,
    },
  ],

  // Gallery
  gallery: [
    { id: 1, title: "Shirodhara Therapy", category: "Panchakarma", desc: "Calming medicated oil therapy for mental relaxation and hormonal balance.", image: shirodharaImg },
    { id: 2, title: "Nasya Therapy", category: "Panchakarma", desc: "Ancient nasal administration therapy for sinusitis and mental clarity.", image: nasyaImg },
    { id: 3, title: "Kati Basti", category: "Spine Care", desc: "Warm oil retention therapy for chronic lower back pain and sciatica.", image: katiBasti },
    { id: 4, title: "Greeva Basti", category: "Spine Care", desc: "Cervical spine nourishment therapy for neck stiffness and spondylosis.", image: greevaImg },
    { id: 5, title: "Infertility Treatment", category: "Reproductive Health", desc: "Natural solutions for male and female fertility through Panchakarma.", image: infertilityImg },
    { id: 6, title: "Garbhasanskar", category: "Maternity", desc: "Ayurvedic prenatal care program for mother and child wellness.", image: garbhasanskarImg },
  ],

  faqs: [
    {
      id: "1",
      question: "What is Panchakarma and who is it suitable for?",
      answer: "Panchakarma is a classical Ayurvedic detoxification and rejuvenation program involving five therapeutic procedures. It is suitable for individuals seeking deep cleansing, chronic disease management, stress relief, or preventive wellness. Our Vaidyas customize the protocol based on your prakriti (body constitution).",
    },
    {
      id: "2",
      question: "How do I schedule an appointment at Moolatvam Ayurved?",
      answer: "You can book directly by clicking 'Book Appointment' in the navigation bar or by calling us at 9834923909. You can also visit us at our clinic in Shiv City Center, Sangli during OPD hours (Mon–Sat, 10 AM – 9 PM).",
    },
    {
      id: "3",
      question: "Are your Ayurvedic products safe and certified?",
      answer: "Yes. All Moolatvam proprietary products including our Hair Serum, Gold-N-Milk, and herbal shampoo range are formulated using authentic Ayurvedic recipes, natural ingredients, and undergo quality checks. They contain no harmful hormones or chemical additives.",
    },
    {
      id: "4",
      question: "What conditions do you specialize in treating?",
      answer: "We specialize in skin diseases, hair disorders, infertility, PCOD, thyroid conditions, diabetes, weight loss, kidney stones, cervical spondylosis, chronic digestive issues, and prenatal care through our Garbhasanskar program.",
    },
    {
      id: "5",
      question: "Do you offer online consultations?",
      answer: "Yes, Dr. Kadambari Jagtap offers online consultations for patients who cannot visit in person. You can reach out via our contact section to schedule a teleconsultation at a convenient time.",
    },
  ],
};
