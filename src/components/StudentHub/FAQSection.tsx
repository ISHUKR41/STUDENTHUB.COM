import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>(['1']); // First item open by default

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Is STUDENTHUB.COM really free to use?',
      answer: 'Yes! We offer free access to over 5,000 question papers with basic features. You can download up to 10 papers per day without any subscription. Our premium plans unlock additional features and unlimited access to our complete database of 25,000+ papers.',
      category: 'General'
    },
    {
      id: '2',
      question: 'How do I know the question papers are authentic and original?',
      answer: 'All our question papers are sourced directly from official examination boards, universities, and authorized institutions. We have a dedicated team that verifies each paper for authenticity. Additionally, we provide source information and verification details for every paper in our database.',
      category: 'Quality'
    },
    {
      id: '3',
      question: 'Which exams and boards are covered on your platform?',
      answer: 'We cover all major Indian examinations including CBSE, ICSE, all state boards (Classes 9-12), JEE Main/Advanced, NEET, UPSC, SSC, Banking exams, CAT, CLAT, GATE, UGC NET, and many more. Our database includes papers from over 500 different examinations and 50+ educational boards.',
      category: 'Coverage'
    },
    {
      id: '4',
      question: 'Are the question papers available in regional languages?',
      answer: 'Yes! We support 22+ Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and others. You can filter papers by language during your search to find papers in your preferred language.',
      category: 'Languages'
    },
    {
      id: '5',
      question: 'How often do you update your question paper database?',
      answer: 'We update our database weekly with new question papers. During examination seasons, we update daily to ensure you have access to the latest papers as soon as they\'re officially released. Premium subscribers get early access to newly added papers.',
      category: 'Updates'
    },
    {
      id: '6',
      question: 'Can I access the platform on my mobile device?',
      answer: 'Absolutely! Our platform is fully responsive and works seamlessly on all devices - smartphones, tablets, and desktops. Premium subscribers also get access to our dedicated mobile app with offline download capabilities.',
      category: 'Technical'
    },
    {
      id: '7',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, digital wallets like Paytm, PhonePe, and Google Pay. All payments are secured with 256-bit SSL encryption.',
      category: 'Payments'
    },
    {
      id: '8',
      question: 'Do you offer refunds if I\'m not satisfied?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not completely satisfied with your premium subscription, contact our support team within 30 days for a full refund, no questions asked.',
      category: 'Refunds'
    },
    {
      id: '9',
      question: 'How can I contact customer support?',
      answer: 'Our customer support team is available 24/7 through live chat, email (support@studenthub.com), and phone. Premium subscribers get priority support with guaranteed response times under 2 hours.',
      category: 'Support'
    },
    {
      id: '10',
      question: 'Can institutions get bulk access for multiple students?',
      answer: 'Yes! We offer institutional plans for schools, colleges, and coaching centers. These plans provide bulk access for up to 500 students, advanced analytics, custom branding, and dedicated account management. Contact our sales team for custom pricing.',
      category: 'Institutional'
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold gradient-text text-center">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            Got questions? We've got answers. Can't find what you're looking for? Our support team is here to help.
          </p>
        </div>

        {/* FAQ Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 px-4">
          <button className="px-3 sm:px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium touch-target">
            All Questions
          </button>
          {categories.slice(0, 5).map(category => (
            <button 
              key={category}
              className="px-3 sm:px-4 py-2 rounded-full bg-muted text-foreground-secondary hover:bg-muted-foreground hover:text-muted text-xs sm:text-sm font-medium transition-colors touch-target"
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(faq.id);
            
            return (
              <Card 
                key={faq.id}
                className={`card-feature transition-all duration-300 ${
                  isOpen ? 'shadow-lg border-primary/30' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left touch-target"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground leading-relaxed flex-1">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 mt-1">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        ) : (
                          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-foreground-secondary" />
                        )}
                      </div>
                    </div>

                    <div className={`transition-all duration-300 ${
                      isOpen ? 'max-h-96 opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="pt-3 sm:pt-4 border-t border-border">
                        <p className="text-foreground-secondary leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                        <div className="mt-3 sm:mt-4">
                          <span className="inline-block px-2 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="glass-intense rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto">
            <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              Still Have Questions?
            </h3>
            <p className="text-foreground-secondary mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Our friendly support team is ready to help you 24/7. Get instant answers through live chat, 
              email, or schedule a call with our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="btn-hero touch-target text-sm sm:text-base px-6 sm:px-8 py-3">
                Start Live Chat
              </button>
              <button className="btn-ghost touch-target text-sm sm:text-base px-6 sm:px-8 py-3">
                Email Support
              </button>
            </div>
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm text-foreground-secondary">
              <div className="space-y-1">
                <div className="font-medium text-foreground">Live Chat</div>
                <div>Available 24/7</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">Email</div>
                <div>support@studenthub.com</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">Response Time</div>
                <div>Under 2 hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-12 sm:mt-16 text-center">
          <h4 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Popular Help Topics</h4>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'Download Issues',
              'Payment Problems', 
              'Paper Quality',
              'Account Settings',
              'Mobile App',
              'Bulk Downloads',
              'Language Support',
              'Refund Process'
            ].map((topic) => (
              <button
                key={topic}
                className="px-3 sm:px-4 py-2 bg-background-secondary border border-border rounded-full text-xs sm:text-sm text-foreground-secondary hover:text-foreground hover:border-primary transition-all hover-scale touch-target"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};