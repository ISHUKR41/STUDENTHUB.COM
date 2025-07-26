import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Users, Star } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  cta: string;
}

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        'Access to 5,000+ basic question papers',
        'Download up to 10 papers per day',
        'Basic search and filtering',
        'Community support',
        'Mobile-friendly interface',
        'Standard download speed'
      ],
      icon: <Users className="h-8 w-8" />,
      color: 'text-foreground-secondary',
      cta: 'Get Started Free'
    },
    {
      name: 'Premium',
      price: { monthly: 299, annual: 2390 },
      description: 'Most popular choice for serious students',
      features: [
        'Access to all 25,000+ question papers',
        'Unlimited downloads',
        'Advanced search with AI recommendations',
        'Priority support (24/7)',
        'Ad-free experience',
        'High-speed downloads',
        'Offline mobile app',
        'Early access to new papers',
        'Detailed solution explanations',
        'Progress tracking and analytics'
      ],
      icon: <Crown className="h-8 w-8" />,
      color: 'text-primary',
      popular: true,
      cta: 'Start Premium'
    },
    {
      name: 'Institutional',
      price: { monthly: 999, annual: 8990 },
      description: 'For schools, colleges & coaching centers',
      features: [
        'Everything in Premium',
        'Bulk access for up to 500 students',
        'Dedicated account manager',
        'Custom branding options',
        'Advanced analytics dashboard',
        'API access for integration',
        'Custom paper requests',
        'Priority customer success',
        'Training and onboarding',
        'Volume discounts available'
      ],
      icon: <Zap className="h-8 w-8" />,
      color: 'text-accent',
      cta: 'Contact Sales'
    }
  ];

  const getPrice = (plan: PricingPlan) => {
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getSavings = (plan: PricingPlan) => {
    if (plan.price.monthly === 0) return 0;
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annual;
    return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background-secondary/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 sm:mb-6">
            Choose Your Success Plan
          </h2>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Start free and upgrade when you're ready. All plans include our commitment to authentic, high-quality question papers.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className={`text-xs sm:text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-foreground-secondary'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors touch-target ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
              aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
            >
              <div
                className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  isAnnual ? 'translate-x-6 sm:translate-x-8' : 'translate-x-0.5 sm:translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs sm:text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-foreground-secondary'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-secondary text-secondary-foreground text-xs px-2 py-1">
                Save up to 33%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`card-feature hover-lift relative h-full ${
                plan.popular ? 'ring-2 ring-primary shadow-glow lg:scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3 sm:px-4 py-1 text-xs sm:text-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8">
                <div className={`${plan.color} mb-3 sm:mb-4 flex justify-center`}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                    {React.cloneElement(plan.icon as React.ReactElement, { 
                      className: "h-6 w-6 sm:h-8 sm:w-8" 
                    })}
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <p className="text-foreground-secondary text-xs sm:text-sm px-2">
                  {plan.description}
                </p>
                
                {/* Price */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
                      ₹{getPrice(plan)}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-foreground-secondary ml-1 text-sm">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.price.monthly > 0 && (
                    <p className="text-xs sm:text-sm text-secondary mt-2">
                      Save {getSavings(plan)}% with annual billing
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex flex-col h-full">
                {/* Features */}
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground-secondary text-xs sm:text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full touch-target ${
                    plan.popular 
                      ? 'btn-hero' 
                      : plan.name === 'Free' 
                        ? 'btn-ghost' 
                        : 'bg-gradient-accent hover:scale-105'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                {plan.name === 'Free' && (
                  <p className="text-center text-xs sm:text-sm text-foreground-secondary mt-2 sm:mt-3">
                    No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="glass-intense rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-foreground-secondary mb-6 leading-relaxed">
              Looking for enterprise features, custom integrations, or volume pricing? 
              Our team is here to build the perfect solution for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                Schedule a Demo
              </Button>
              <Button variant="outline" className="btn-ghost">
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold gradient-text">99.9%</div>
            <p className="text-sm text-foreground-secondary">Uptime Guarantee</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold gradient-text-secondary">24/7</div>
            <p className="text-sm text-foreground-secondary">Customer Support</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold gradient-text-accent">30-day</div>
            <p className="text-sm text-foreground-secondary">Money Back Guarantee</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold gradient-text">SSL</div>
            <p className="text-sm text-foreground-secondary">Secure Payments</p>
          </div>
        </div>
      </div>
    </section>
  );
};