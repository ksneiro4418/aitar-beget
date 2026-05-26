import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  MapPin, Phone, Mail, Waves, Utensils, Bed, Music, Trophy, Mountain,
  Sunrise, Star, Send, CheckCircle, Palmtree, Shield, Heart, ChevronDown,
  Menu, X, type LucideIcon, Bus, CreditCard, Users, Calendar, Baby,
  Plane
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  MapPin, Phone, Mail, Waves, Utensils, Bed, Music, Trophy, Mountain,
  Sunrise, Star, Send, CheckCircle, Palmtree, Shield, Heart, Menu, X,
  Bus, CreditCard, Users, Calendar, Baby, Plane
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useContent<T>(path: string): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetch(path)
      .then(r => { if (!r.ok) throw new Error('Ошибка загрузки'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [path])
  return { data, loading, error }
}

// Отправка формы через Web3Forms (AJAX, без редиректа на web3forms.com)
async function postToWeb3Forms(formEl: HTMLFormElement): Promise<boolean> {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(formEl),
  })
  const result = await response.json()
  return Boolean(result.success)
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'creative' | 'sport'>('all')
  const [reviewFormOpen, setReviewFormOpen] = useState(false)

  // Состояние формы заявки (Web3Forms, кастомный экран успеха без редиректа)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  // Состояние формы отзыва (Web3Forms, кастомный экран успеха без редиректа)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    setFormSubmitting(true)
    try {
      const ok = await postToWeb3Forms(e.currentTarget)
      if (ok) setFormSubmitted(true)
      else setFormError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.')
    } catch {
      setFormError('Ошибка сети. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReviewError('')
    setReviewSubmitting(true)
    try {
      const ok = await postToWeb3Forms(e.currentTarget)
      if (ok) setReviewSubmitted(true)
      else setReviewError('Не удалось отправить отзыв. Попробуйте ещё раз.')
    } catch {
      setReviewError('Ошибка сети. Попробуйте ещё раз.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const hero = useContent<any>('/content/hero.json')
  const features = useContent<any>('/content/features.json')
  const accommodation = useContent<any>('/content/accommodation.json')
  const activities = useContent<any>('/content/activities.json')
  const gallery = useContent<any>('/content/gallery.json')
  const location = useContent<any>('/content/location.json')
  const contact = useContent<any>('/content/contact.json')
  const reviews = useContent<any>('/content/reviews.json')
  const footer = useContent<any>('/content/footer.json')
  const pricing = useContent<any>('/content/pricing.json')
  const transfer = useContent<any>('/content/transfer.json')
  const dance = useContent<any>('/content/dance.json')
  const sportsCamps = useContent<any>('/content/sports-camps.json')
  const header = useContent<any>('/content/header.json')
  const background = useContent<any>('/content/background.json')

  const loading = [hero, features, accommodation, activities, gallery, location, contact, footer, pricing, transfer, dance, sportsCamps, reviews].some(c => c.loading)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOrderCall = () => {
    const subjectInput = document.querySelector('input[name="subject"]') as HTMLInputElement
    if (subjectInput) subjectInput.value = 'Заказать звонок — Айтар'
    scrollTo('#contact')
    setTimeout(() => {
      const nameInput = document.getElementById('form-name') as HTMLInputElement
      if (nameInput) nameInput.focus()
    }, 800)
  }

  const navLinks = header.data?.nav || footer.data?.links?.items || [
    { href: '#about', label: 'О лагере' },
    { href: '#pricing', label: 'Цены и смены' },
    { href: '#accommodation', label: 'Проживание' },
    { href: '#activities', label: 'Развлечения' },
    { href: '#dance', label: 'Танцы' },
    { href: '#sports-camps', label: 'Сборы' },
    { href: '#gallery', label: 'Галерея' },
    { href: '#location', label: 'Локация' },
    { href: '#contact', label: 'Заявка' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sun-50 to-ocean-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sun-400 to-sun-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sunrise className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sun-400 to-sun-600 flex items-center justify-center">
                <Sunrise className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>{header.data?.logo || 'Айтар'}</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.slice(0, 6).map((link: any) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className={`text-sm font-medium transition-colors hover:text-sun-500 ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>
                  {link.label}
                </button>
              ))}
            </div>
            <div className="hidden md:block">
              <Button onClick={() => scrollTo('#contact')} className="bg-sun-500 hover:bg-sun-600 text-white shadow-glow">
                {header.data?.cta || 'Оставить заявку'}
              </Button>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-xl absolute w-full">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link: any) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className="block w-full text-left text-gray-700 hover:text-sun-500 font-medium py-2">
                  {link.label}
                </button>
              ))}
              <Button onClick={() => scrollTo('#contact')} className="w-full bg-sun-500 hover:bg-sun-600 text-white">
                {header.data?.cta || 'Оставить заявку'}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={background.data?.hero || '/hero-bg.jpg'} alt="Абхазия" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/30">
              {hero.data?.badge || 'Лето 2026 в Абхазии'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {hero.data?.title || 'Центр отдыха'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sun-300 to-sun-500">{hero.data?.highlight || '«Айтар»'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {hero.data?.subtitle || 'Отдых у моря для всей семьи и организованных детских групп'}
          </p>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {hero.data?.description || 'Теплое гостеприимство, уютное размещение и насыщенная программа в Цандрипше, Абхазия'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button onClick={() => scrollTo('#contact')} size="lg" className="bg-sun-500 hover:bg-sun-600 text-white text-lg px-8 py-6 shadow-glow-lg">
              {hero.data?.primaryButton || 'Оставить заявку'}
            </Button>
            <Button onClick={handleOrderCall} variant="outline" size="lg" className="border-2 border-white/60 bg-transparent text-white hover:bg-white/20 hover:border-white text-lg px-8 py-6 backdrop-blur-sm">
              <Phone className="w-5 h-5 mr-2" />
              Заказать звонок
            </Button>
          </div>
        </div>
        <button onClick={() => scrollTo('#about')} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* About / Features */}
      <section id="about" className="py-24 bg-gradient-to-b from-white to-sun-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{features.data?.sectionLabel || 'О нашем центре'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {features.data?.title || 'Почему выбирают'}{' '}
              <span className="text-sun-500">{features.data?.highlight || '«Айтар»'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {features.data?.description || 'Мы создаем незабываемый отдых, наполненный весельем, творчеством и заботой.'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.data?.items?.map((feature: any, i: number) => (
              <FeatureCard key={i} feature={feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Shifts */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{pricing.data?.sectionLabel || 'Цены и смены'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {pricing.data?.title || 'Стоимость и'}{' '}
              <span className="text-sun-500">{pricing.data?.highlight || 'бронирование'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {pricing.data?.description || 'Проживание с трёхразовым питанием, насыщенная программа'}
            </p>
          </div>

          {/* Shifts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {pricing.data?.shifts?.map((shift: any, i: number) => (
              <div key={i} className="bg-gradient-to-br from-sun-50 to-white rounded-2xl p-6 border border-sun-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-sun-500" />
                  <span className="font-bold text-gray-900">{shift.number}</span>
                </div>
                <p className="text-sun-600 font-semibold mb-1">{shift.dates}</p>
                <p className="text-sm text-gray-500">{shift.days}</p>
              </div>
            ))}
          </div>

          {/* Pricing Table */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pricing.data?.pricing?.map((item: any, i: number) => (
              <div key={i} className={`rounded-2xl p-6 border ${item.highlight ? 'bg-sun-500 border-sun-500 text-white' : 'bg-white border-gray-100 shadow-lg'}`}>
                <h4 className={`font-semibold text-sm mb-2 ${item.highlight ? 'text-white/90' : 'text-gray-500'}`}>{item.category}</h4>
                <p className={`text-3xl font-bold mb-1 ${item.highlight ? 'text-white' : 'text-gray-900'}`}>{item.price}</p>
                <p className={`text-sm ${item.highlight ? 'text-white/80' : 'text-gray-500'}`}>{item.note}</p>
              </div>
            ))}
          </div>

          {/* Extras */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Дополнительно оплачивается</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {pricing.data?.extras?.map((extra: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                  <span className="text-gray-700">{extra.title}</span>
                  <span className="font-bold text-sun-600">{extra.price} <span className="text-sm font-normal text-gray-500">{extra.unit}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking & QR */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{pricing.data?.booking?.title || 'Бронирование'}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sun-100 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-sun-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Бронирование смены {pricing.data?.booking?.deposit || '5 000 ₽'}</p>
                    <p className="text-gray-600 text-sm">{pricing.data?.booking?.depositNote || 'с человека, входит в общую стоимость'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-ocean-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-ocean-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Итоговый расчёт</p>
                    <p className="text-gray-600 text-sm">{pricing.data?.booking?.finalPayment || 'Оставшаяся сумма вносится по прибытию в центр отдыха'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sun-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-sun-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Реквизиты для оплаты</p>
                    <p className="text-gray-600 text-sm">Запросите у менеджера после оформления заявки</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-3">{pricing.data?.howToBook?.title || 'Как оформить заявку'}</h4>
                <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                  {pricing.data?.howToBook?.steps?.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">{pricing.data?.booking?.qrTitle || 'Для успешной оплаты отсканируйте QR-код в приложении банка'}</h4>
              {pricing.data?.booking?.qr ? (
                <img src={pricing.data.booking.qr} alt="QR-код для оплаты" className="w-48 h-48 object-contain rounded-xl mx-auto mb-4" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">QR-код для оплаты</p>
                    <p className="text-xs text-gray-400 mt-1">(вставьте изображение)</p>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500">{pricing.data?.booking?.qrSubtitle || 'или воспользуйтесь реквизитами'}</p>
            </div>
          </div>

          {/* Border Docs */}
          <div className="bg-gradient-to-r from-ocean-50 to-sun-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{pricing.data?.borderDocs?.title || 'Документы для прохождения границы'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {pricing.data?.borderDocs?.items?.map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <Shield className="w-5 h-5 text-sun-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{item.audience}</p>
                    <p className="text-gray-600 text-sm">{item.doc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section id="accommodation" className="py-24 bg-gradient-to-b from-sun-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1">
              <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{accommodation.data?.sectionLabel || 'Проживание'}</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                {accommodation.data?.title || 'Уютные комнаты с видом на'}{' '}
                <span className="text-ocean-500">{accommodation.data?.highlight || 'горы'}</span>
              </h2>
              <p className="text-gray-600 mb-8">{accommodation.data?.description || ''}</p>

              {/* Room items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-sun-500" />
                  В номерах:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accommodation.data?.roomItems?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-sun-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Floor items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Waves className="w-5 h-5 text-ocean-500" />
                  На этаже:
                </h4>
                <ul className="flex flex-wrap gap-3">
                  {accommodation.data?.floorItems?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 bg-ocean-50 px-3 py-1.5 rounded-full text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-ocean-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cleaning & laundry */}
              <div className="space-y-3 mb-8">
                {accommodation.data?.cleaning && (
                  <div className="flex items-start gap-3 bg-sun-50 rounded-xl p-4">
                    <Shield className="w-5 h-5 text-sun-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{accommodation.data.cleaning}</p>
                  </div>
                )}
                {accommodation.data?.laundry && (
                  <div className="flex items-start gap-3 bg-sun-50 rounded-xl p-4">
                    <Star className="w-5 h-5 text-sun-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{accommodation.data.laundry}</p>
                  </div>
                )}
              </div>

              {/* Shifts */}
              {accommodation.data?.shifts && (
                <div className="bg-gradient-to-r from-sun-50 to-ocean-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sun-500" />
                    {accommodation.data?.shiftsLabel || 'Четыре смены летом 2026'}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {accommodation.data.shifts.map((shift: string, i: number) => (
                      <div key={i} className="bg-white rounded-lg px-4 py-3 shadow-sm text-sm text-gray-700">
                        {shift}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img src={accommodation.data?.image || '/room.jpg'} alt="Комнаты лагеря" className="rounded-2xl shadow-2xl w-full object-cover h-[400px]" />
                {accommodation.data?.badge && (
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-sun-500 flex items-center justify-center">
                        {iconMap[accommodation.data.badge.icon] && (() => {
                          const Icon = iconMap[accommodation.data.badge.icon]
                          return <Icon className="w-6 h-6 text-white" />
                        })()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{accommodation.data.badge.title}</p>
                        <p className="text-sm text-gray-500">{accommodation.data.badge.subtitle}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer */}
      <section id="transfer" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px]">
              <img src={transfer.data?.image || '/transfer.jpg'} alt="Трансфер" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{transfer.data?.sectionLabel || 'Трансфер'}</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                {transfer.data?.title || 'Доехать до лагеря'}{' '}
                <span className="text-ocean-500">{transfer.data?.highlight || 'просто'}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">{transfer.data?.description || 'Организуем комфортный трансфер'}</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-sun-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">Маршрут</p>
                  <p className="font-bold text-gray-900">{transfer.data?.route || 'Адлер — Цандрипш'}</p>
                </div>
                <div className="bg-sun-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">Расстояние</p>
                  <p className="font-bold text-gray-900">{transfer.data?.distance || '≈ 30 км'}</p>
                </div>
                <div className="bg-sun-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">Время</p>
                  <p className="font-bold text-gray-900">{transfer.data?.time || '≈ 40 мин'}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {transfer.data?.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-sun-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-gradient-to-r from-sun-50 to-ocean-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-gray-500">Стоимость</p>
                  <p className="text-2xl font-bold text-sun-600">{transfer.data?.price || 'от 800 ₽'}</p>
                  <p className="text-sm text-gray-500">{transfer.data?.priceNote || 'в одну сторону'}</p>
                </div>
                <Button onClick={() => scrollTo('#contact')} className="bg-sun-500 hover:bg-sun-600 text-white">
                  Заказать трансфер
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dance Intensive */}
      <section id="dance" className="py-24 bg-gradient-to-b from-white to-sun-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{dance.data?.sectionLabel || 'Танцевальный интенсив'}</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                {dance.data?.title || 'Танцуй у'}{' '}
                <span className="text-ocean-500">{dance.data?.highlight || 'моря'}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">{dance.data?.description || 'Уникальная программа'}</p>
              <div className="space-y-3 mb-6">
                {dance.data?.program?.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sun-100 flex items-center justify-center flex-shrink-0">
                      <Music className="w-4 h-4 text-sun-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Стоимость интенсива</p>
                  <p className="text-2xl font-bold text-sun-600">{dance.data?.price || '3 000 ₽'}</p>
                  <p className="text-sm text-gray-500">{dance.data?.priceNote || 'с человека'}</p>
                </div>
                <Button onClick={() => scrollTo('#contact')} className="bg-sun-500 hover:bg-sun-600 text-white">
                  Подать заявку
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">{dance.data?.howToApply || 'Укажите название коллектива при заполнении заявки'}</p>
            </div>
            <div className="order-1 lg:order-2">
              <img src={dance.data?.image || '/dance.jpg'} alt="Танцевальный интенсив" className="rounded-2xl shadow-2xl w-full object-cover h-[450px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Sports Camps */}
      <section id="sports-camps" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{sportsCamps.data?.sectionLabel || 'Спортивные сборы'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {sportsCamps.data?.title || 'Тренируйся на'}{' '}
              <span className="text-ocean-500">{sportsCamps.data?.highlight || 'побережье'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {sportsCamps.data?.description || 'Полноценные спортивно-тренировочные сборы'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sportsCamps.data?.disciplines?.map((disc: any, i: number) => {
              const Icon = iconMap[disc.icon] || Trophy
              return (
                <div key={i} className="bg-gradient-to-br from-sun-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-lg bg-sun-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-sun-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{disc.name}</h3>
                  <p className="text-gray-600 text-sm">{disc.details}</p>
                </div>
              )
            })}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden group">
              <img src={sportsCamps.data?.image || '/sports-camp.jpg'} alt="Спортивные сборы" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Международные турниры</h3>
                  <p className="text-white/80 text-sm mt-1">{sportsCamps.data?.tournaments || 'В рамках сборов проводятся турниры по дисциплинам'}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-ocean-50 to-sun-50 rounded-2xl p-8 flex flex-col justify-center">
              <p className="text-lg text-gray-700 mb-4">{sportsCamps.data?.bonus || 'Будем рады командам других направлений!'}</p>
              <div className="flex items-center gap-2 text-sun-600 font-semibold">
                <Users className="w-5 h-5" />
                <span>{sportsCamps.data?.system || 'Руководители бесплатно по системе 15+1'}</span>
              </div>
              <Button onClick={() => scrollTo('#contact')} className="mt-6 bg-sun-500 hover:bg-sun-600 text-white w-fit">
                Записать команду
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="py-24 bg-gradient-to-b from-sun-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{activities.data?.sectionLabel || 'Программа'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {activities.data?.title || 'Развлечения для'}{' '}
              <span className="text-ocean-500">{activities.data?.highlight || 'всех'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {activities.data?.description || 'Насыщенная программа'}
            </p>
          </div>
          <div className="flex justify-center gap-2 mb-12">
            {activities.data?.tabs?.map((tab: any) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === tab.key ? 'bg-sun-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-sun-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.data?.cards?.[activeTab]?.map((activity: any, i: number) => (
              <ActivityCard key={i} activity={activity} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sun-400 font-semibold text-sm uppercase tracking-wider">{gallery.data?.sectionLabel || 'Фотогалерея'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
              {gallery.data?.title || 'Ощутите атмосферу'}{' '}
              <span className="text-sun-400">{gallery.data?.highlight || 'Абхазии'}</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {gallery.data?.description || 'Красота Черноморского побережья'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {gallery.data?.images?.map((img: any, i: number) => (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <div className={`relative rounded-xl overflow-hidden cursor-pointer group ${i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-contain rounded-lg" />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{location.data?.sectionLabel || 'Локация'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {location.data?.title || 'Как нас'}{' '}
              <span className="text-ocean-500">{location.data?.highlight || 'найти'}</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=40.079226%2C43.379740&z=14&l=map&pt=40.079226,43.379740,pm2ywl1"
                  width="100%" height="100%" frameBorder="0" allowFullScreen
                  style={{ border: 0, borderRadius: '1rem' }}
                  title="Центр отдыха Айтар на Яндекс.Картах"
                />
              </div>
              <div className="mt-3 text-center">
                <a href="https://yandex.ru/maps/?whatshere[point]=40.079226,43.379740&whatshere[zoom]=14" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium transition-colors">
                  <MapPin className="w-4 h-4" />
                  Открыть на Яндекс.Картах
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
            <div className="space-y-6">
              {location.data?.cards?.map((card: any, i: number) => {
                const Icon = iconMap[card.icon] || MapPin
                return (
                  <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-sun-50 to-white">
                    <CardContent className="p-6">
                      <Icon className="w-8 h-8 text-sun-500 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                      {card.lines?.map((line: string, j: number) => (
                        <p key={j} className="text-gray-600">{line}</p>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 bg-gradient-to-b from-ocean-50 via-white to-sun-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{reviews.data?.sectionLabel || 'Отзывы'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {reviews.data?.title || 'Что говорят о нас'}{' '}
              <span className="text-ocean-500">{reviews.data?.highlight || 'родители'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {reviews.data?.description || 'Истории семей, которые уже отдыхали в центре'}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {reviews.data?.items?.map((review: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < (review.rating || 5) ? 'text-sun-400 fill-sun-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">"{review.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.role}</p>
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review Button */}
          <div className="text-center mb-8">
            <Button onClick={() => setReviewFormOpen(!reviewFormOpen)} variant="outline" size="lg" className="border-sun-500 text-sun-600 hover:bg-sun-50">
              <Star className="w-5 h-5 mr-2" />
              {reviews.data?.submitButton || 'Оставить отзыв'}
            </Button>
          </div>

          {/* Review Form */}
          {reviewFormOpen && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{reviews.data?.formTitle || 'Ваш отзыв'}</h3>
                  <p className="text-gray-600 mb-6">{reviews.data?.formDescription || 'Поделитесь впечатлениями'}</p>
                  {reviewSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Спасибо за отзыв!</h4>
                      <p className="text-gray-600">{reviews.data?.formNote || 'Отзывы проходят модерацию перед публикацией'}</p>
                    </div>
                  ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Web3Forms: тот же ключ, что и у формы заявки; ответ обрабатывается через fetch без редиректа */}
                    <input type="hidden" name="access_key" value={contact.data?.accessKey || '34cc4cbd-e6bf-400b-a219-18403ed035f9'} />
                    <input type="hidden" name="subject" value="Новый отзыв на модерацию — Айтар" />
                    <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{reviews.data?.formNameLabel || 'Ваше имя'}</label>
                      <Input name="name" placeholder={reviews.data?.formNamePlaceholder || 'Анна Петрова'} required className="h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{reviews.data?.formTextLabel || 'Текст отзыва'}</label>
                      <Textarea name="message" placeholder={reviews.data?.formTextPlaceholder || 'Расскажите о вашем опыте...'} rows={4} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <label key={j} className="cursor-pointer">
                            <input type="radio" name="rating" value={j + 1} className="sr-only peer" defaultChecked={j === 4} />
                            <Star className="w-8 h-8 text-gray-300 peer-checked:text-sun-400 peer-checked:fill-sun-400 transition-colors hover:text-sun-300" />
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" disabled={reviewSubmitting} className="w-full h-12 bg-sun-500 hover:bg-sun-600 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      {reviewSubmitting ? 'Отправка...' : (reviews.data?.formSubmit || 'Отправить на модерацию')}
                    </Button>
                    {reviewError && <p className="text-sm text-red-500 text-center">{reviewError}</p>}
                    <p className="text-xs text-gray-500 text-center">{reviews.data?.formNote || 'Отзывы проходят модерацию перед публикацией'}</p>
                  </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Contact / Form */}
      <section id="contact" className="py-24 bg-gradient-to-b from-sun-50 via-white to-ocean-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sun-600 font-semibold text-sm uppercase tracking-wider">{contact.data?.sectionLabel || 'Бронирование'}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              {contact.data?.title || 'Оставьте'}{' '}
              <span className="text-sun-500">{contact.data?.highlight || 'заявку'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              {contact.data?.description || 'Заполните форму, и мы свяжемся с вами'}
            </p>
          </div>
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{contact.data?.form?.successTitle || 'Заявка отправлена!'}</h3>
                  <p className="text-lg text-gray-600">{contact.data?.form?.successMessage || 'Мы свяжемся с вами в ближайшее время.'}</p>
                </div>
              ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {/* Web3Forms: ключ и тема письма берутся из contact.json, ответ обрабатывается через fetch без редиректа */}
                <input type="hidden" name="access_key" value={contact.data?.accessKey || '34cc4cbd-e6bf-400b-a219-18403ed035f9'} />
                <input type="hidden" name="subject" value={contact.data?.subject || 'Новая заявка с сайта Айтар!'} />
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{contact.data?.form?.nameLabel || 'Ваше имя'}</label>
                    <Input id="form-name" name="name" placeholder={contact.data?.form?.namePlaceholder || 'Иван Иванов'} required className="h-12" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{contact.data?.form?.phoneLabel || 'Телефон'}</label>
                    <Input id="form-phone" name="phone" type="tel" placeholder={contact.data?.form?.phonePlaceholder || '+7 (___) ___-__-__'} required className="h-12" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{contact.data?.form?.emailLabel || 'Email'}</label>
                  <Input id="form-email" name="email" type="email" placeholder={contact.data?.form?.emailPlaceholder || 'example@mail.ru'} className="h-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{contact.data?.form?.messageLabel || 'Комментарий'}</label>
                  <Textarea id="form-message" name="message" placeholder={contact.data?.form?.messagePlaceholder || 'Количество человек, даты, пожелания...'} rows={4} />
                </div>
                <Button type="submit" size="lg" disabled={formSubmitting} className="w-full h-14 bg-sun-500 hover:bg-sun-600 text-white text-lg shadow-glow">
                  <Send className="w-5 h-5 mr-2" />
                  {formSubmitting ? 'Отправка...' : (contact.data?.form?.submitButton || 'Отправить заявку')}
                </Button>
                {formError && <p className="text-sm text-red-500 text-center">{formError}</p>}
              </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sun-400 to-sun-600 flex items-center justify-center">
                  <Sunrise className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{footer.data?.brand?.title || 'Центр отдыха «Айтар»'}</h3>
                  <p className="text-gray-400 text-sm">{footer.data?.brand?.subtitle || 'Цандрипш, Абхазия'}</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {footer.data?.brand?.description || 'Отдых у моря для всей семьи и организованных детских групп.'}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">{footer.data?.contacts?.title || 'Контакты'}</h4>
              <div className="space-y-4">
                {footer.data?.contacts?.items?.map((item: any, i: number) => {
                  const Icon = iconMap[item.icon] || Phone
                  return (
                    <a key={i} href={item.href} className="flex items-center gap-3 text-gray-300 hover:text-sun-400 transition-colors">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">{footer.data?.links?.title || 'Быстрые ссылки'}</h4>
              <div className="space-y-3">
                {footer.data?.links?.items?.map((link: any, i: number) => (
                  <button key={i} onClick={() => scrollTo(link.href)} className="block text-gray-300 hover:text-sun-400 transition-colors">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {footer.data?.copyright || '© 2025 Центр отдыха «Айтар». Все права защищены.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ feature, delay }: { feature: any; delay: number }) {
  const { ref, inView } = useInView()
  const Icon = iconMap[feature.icon] || Star
  return (
    <div
      ref={ref}
      className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sun-100 to-sun-200 flex items-center justify-center mb-4 group-hover:from-sun-400 group-hover:to-sun-500 transition-all duration-300">
        <Icon className="w-7 h-7 text-sun-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  )
}

function ActivityCard({ activity, delay }: { activity: any; delay: number }) {
  const { ref, inView } = useInView()
  const Icon = iconMap[activity.icon] || Star
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-ocean-100 to-ocean-200 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ocean-600" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{activity.title}</h3>
      <p className="text-gray-600 text-sm">{activity.description}</p>
    </div>
  )
}