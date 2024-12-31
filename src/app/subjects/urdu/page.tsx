'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const nameToUrdu: { [key: string]: string } = {
  "ahmed": "احمد",
  "ali": "علی",
  "mohammad": "محمد",
  "ahil": "آہل",
  "hassan": "حسن",
  "hussain": "حسین",
  "abdullah": "عبداللہ",
  "abdul": "عبدال",
  "raheem": "رحیم",
  "khan": "خان",
  "asad": "اسد",
  "bilal": "بلال",
  "farhan": "فرحان",
  "kamran": "کامران",
  "umer": "عمر",
  "osman": "عثمان",
  "sajid": "ساجد",
  "saeed": "سعید",
  "zia": "ضیاء",
  "zain": "زین",
  "shahid": "شاہد",
  "imran": "عمران",
  "yaseen": "یاسین",
  "jawad": "جواد",
  "tariq": "طارق",
  "sami": "سامی",
  "kashif": "کاشف",
  "mahmood": "محمود",
  "fahad": "فہد",
  "noman": "نعمان",
  "adnan": "عدنان",
  "atif": "عاطف",
  "arif": "عارف",
  "salman": "سلمان",
  "rashid": "راشد",
  "raza": "رضا",
  "faheem": "فہیم",
  "yasir": "یاسر",
  "ayesha": "عائشہ",
  "fatima": "فاطمہ",
  "zahra": "زہرا",
  "amina": "آمنہ",
  "hira": "حرا",
  "sana": "ثنا",
  "saima": "صائمہ",
  "rabia": "رابعہ",
  "shazia": "شازیہ",
  "sadia": "سعدیہ",
  "madiha": "مدیحہ",
  "asma": "عاصمہ",
  "afia": "عافیہ",
  "uzma": "عظمہ",
  "mehreen": "مہرین",
  "sabeen": "سبین",
  "samreen": "سمرین",
  "amna": "آمنہ",
  "maria": "ماریا",
  "zara": "زارا",
  "faryal": "فریال",
  "hiba": "حبہ",
  "iqra": "اقرا",
  "khadija": "خدیجہ",
  "humaira": "حمیرا",
  "nazia": "نازیہ",
  "noor": "نور",
  "sahar": "سحر",
  "sumaira": "سمیرا",
  "zainab": "زینب",
  "zubaida": "زبیدہ",
  "kamal": "کمال",
  "sohail": "سہیل",
  "shaista": "شائستہ",
  "ammar": "عمار",
  "murtaza": "مرتضی",
  "naveed": "نوید",
  "jaweria": "جویریہ",
  "shoaib": "شعیب",
  "nadeem": "ندیم",
  "younus": "یونس",
  "basit": "باسط",
  "faizan": "فیضان",
  "aslam": "اسلم",
  "sharif": "شریف",
  "anwar": "انوار",
  "irfan": "عرفان",
  "zubair": "زبیر",
  "naeem": "نعیم",
  "mirza": "مرزا",
  "qasim": "قاسم",
  "azhar": "اظہر",
  "mazhar": "مظہر",
  "imad": "عماد",
  "babar": "بابر",
  "wasim": "وسیم",
  "sarfraz": "سرفراز",
  "khalid": "خالد",
  "hameed": "حمید",
  "wali": "ولی",
  "haider": "حیدر",
  "arshad": "ارشاد",
  "tahir": "طاہر",
  "waseem": "وسیم",
  "afzal": "افضل",
  "waqas": "وقاص",
  "adil": "عادل",
  "tanveer": "تنویر",
  "aqeel": "عقیل",
  "danish": "دانش",
  "mubashir": "مبشر",
  "shahzad": "شہزاد",
  "junaid": "جنید",
  "arshia": "عرشیہ",
  "parveen": "پروین",
  "rubina": "روبیعہ",
  "farzana": "فرزانہ",
  "hina": "حنا",
  "nimra": "نمرہ",
  "sanam": "صنم",
  "laiba": "لائبہ",
  "wajahat": "وجاہت",
  "shayan": "شایان",
  "sania": "ثانیہ",
  "adeel": "عدیل",
  "zafar": "ظفر",
  "waqar": "وقار",
  "shakeel": "شکیل",
  "naheed": "ناہید",
  "sundas": "سندس",
  "fareeha": "فریحہ",
  "usman": "عثمان",
  "ibrahim": "ابراہیم",
  "yasmeen": "یاسمین",
  "asmaa": "اسماء",
  "ramsha": "رمشہ",
  "zaheer": "ظہیر",
  "hammad": "حماد",
  "nashit": "نشیت",
  "fiza": "فضا",
  "kinza": "کنزہ",
  "aisha": "عائشہ",
  "anees": "انیس",
  "obaid": "عبید",
  "bushra": "بشریٰ",
  "maira": "مائرہ",
  "taha": "طہ",
  "mehboob": "محبوب",
  "zeeshan": "ذیشان",
  "haseeb": "حسیب",
  "moazzam": "معظم",
  "saad": "سعد",
  "mohsin": "محسن",
  "fahim": "فہیم",
  "aqsa": "عاقصہ",
  "kiran": "کرن",
  "safdar": "صفدر",
  "aiman": "ایمان",
  "farooq": "فاروق",
  "suhail": "سہیل",
  "anila": "انیلا",
  "nazish": "نازش",
  "ashfaq": "اشفاق",
  "zubeda": "زبیبہ",
};

export default function UrduPage() {
  const [storedUserName, setStoredUserName] = useState<string | null>(null);
  const router = useRouter();

  const getUrduName = (name: string) => {
    const lowerName = name.toLowerCase();
    return nameToUrdu[lowerName] || name;
  };

  useEffect(() => {
    try {
      const nameFromStorage = localStorage.getItem('userName');
      if (nameFromStorage) {
        setStoredUserName(nameFromStorage);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      router.push('/');
    }
  }, [router]);

  const navigateToLevel = (level: string) => {
    router.push(`/subjects/urdu/${level}`);
  };

  const handleBack = () => {
    router.push('/subjects');
  };

  if (!storedUserName) {
    return null;
  }

  const urduName = getUrduName(storedUserName);

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-gradient-to-br from-yellow-400 via-red-300 to-purple-400 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 rtl">
          !خوش آمدید {urduName}
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Learn Urdu language skills! Choose a level to begin.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigateToLevel('alphabets')}
            className="bg-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-pink-600 transition duration-200"
          >
            Alphabets (حروفِ تہجی)
          </button>
          <button
            onClick={() => navigateToLevel('words')}
            className="bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Basic Words (الفاظ)
          </button>
          <button
            onClick={() => navigateToLevel('sentences')}
            className="bg-green-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            Simple Sentences (جملے)
          </button>
          <button
            onClick={() => navigateToLevel('reading')}
            className="bg-orange-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-200"
          >
            Reading Practice (پڑھنا)
          </button>
        </div>

        <button
          onClick={handleBack}
          className="mt-6 text-sm text-red-500 underline hover:text-red-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
