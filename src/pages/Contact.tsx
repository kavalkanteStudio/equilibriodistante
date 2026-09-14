import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-display font-bold text-gray-900">Contact Us</h1>
        <div className="w-20 h-1 bg-brand-primary mx-auto" />
        <p className="text-lg text-gray-600">We'd love to hear from you. Whether you have a question about a piece or a custom request.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="flex gap-6 p-6 rounded-2xl bg-gray-50 border hover:bg-white transition-all group">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Email Us</h4>
              <p className="text-gray-600">contact@skoppovic.art</p>
            </div>
          </div>

          <div className="flex gap-6 p-6 rounded-2xl bg-gray-50 border hover:bg-white transition-all group">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Call Us</h4>
              <p className="text-gray-600">+1 (555) 000-0000</p>
            </div>
          </div>

          <div className="flex gap-6 p-6 rounded-2xl bg-gray-50 border hover:bg-white transition-all group">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Visit Us</h4>
              <p className="text-gray-600">Private Studio by Appointment<br />New York, NY</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 border rounded-3xl shadow-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={4} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
