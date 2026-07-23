'use client';

import { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Truck, Clock, RefreshCw } from 'lucide-react';

// Major Indian city pincodes that are serviceable
// Format: pincode prefix (first 6 digits) → city info
const SERVICEABLE_ZONES: Record<string, { city: string; state: string; days: number }> = {
  '110': { city: 'New Delhi', state: 'Delhi', days: 1 },
  '120': { city: 'Faridabad / Noida', state: 'Delhi NCR', days: 2 },
  '122': { city: 'Gurugram', state: 'Haryana', days: 2 },
  '201': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', days: 2 },
  '400': { city: 'Mumbai', state: 'Maharashtra', days: 2 },
  '410': { city: 'Navi Mumbai / Thane', state: 'Maharashtra', days: 2 },
  '411': { city: 'Pune', state: 'Maharashtra', days: 2 },
  '380': { city: 'Ahmedabad', state: 'Gujarat', days: 3 },
  '390': { city: 'Vadodara', state: 'Gujarat', days: 3 },
  '560': { city: 'Bengaluru', state: 'Karnataka', days: 2 },
  '500': { city: 'Hyderabad', state: 'Telangana', days: 2 },
  '600': { city: 'Chennai', state: 'Tamil Nadu', days: 3 },
  '700': { city: 'Kolkata', state: 'West Bengal', days: 3 },
  '302': { city: 'Jaipur', state: 'Rajasthan', days: 3 },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', days: 3 },
  '248': { city: 'Dehradun', state: 'Uttarakhand', days: 4 },
  '160': { city: 'Chandigarh', state: 'Punjab', days: 3 },
  '141': { city: 'Ludhiana', state: 'Punjab', days: 3 },
  '452': { city: 'Indore', state: 'Madhya Pradesh', days: 3 },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh', days: 3 },
  '440': { city: 'Nagpur', state: 'Maharashtra', days: 3 },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh', days: 4 },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu', days: 3 },
  '682': { city: 'Kochi', state: 'Kerala', days: 3 },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala', days: 4 },
  '800': { city: 'Patna', state: 'Bihar', days: 4 },
  '751': { city: 'Bhubaneswar', state: 'Odisha', days: 4 },
  '781': { city: 'Guwahati', state: 'Assam', days: 5 },
  '180': { city: 'Jammu', state: 'J&K', days: 5 },
  '190': { city: 'Srinagar', state: 'J&K', days: 6 },
};

type DeliveryResult =
  | { serviceable: true; city: string; state: string; days: number }
  | { serviceable: false };

function getDeliveryInfo(pincode: string): DeliveryResult {
  if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return { serviceable: false };

  const prefix3 = pincode.slice(0, 3);

  const zone = SERVICEABLE_ZONES[prefix3];

  if (!zone) {
    // Check if it's a valid Indian pincode format (starts with 1-9)
    const firstDigit = parseInt(pincode[0]);
    if (firstDigit >= 1 && firstDigit <= 9) {
      return { serviceable: true, city: 'Your Location', state: 'India', days: 7 };
    }
    return { serviceable: false };
  }

  return { serviceable: true, ...zone };
}

function getDeliveryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

interface DeliveryCheckerProps {
  className?: string;
}

export function DeliveryChecker({ className = '' }: DeliveryCheckerProps) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<DeliveryResult | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (pincode.length !== 6) return;
    const info = getDeliveryInfo(pincode);
    setResult(info);
    setChecked(true);
  };

  const handleReset = () => {
    setPincode('');
    setResult(null);
    setChecked(false);
  };

  return (
    <div className={`border border-slate-200 dark:border-slate-700 rounded-2xl p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-violet-500" />
        <span className="font-semibold text-slate-900 dark:text-white text-sm">Check Delivery</span>
      </div>

      {!checked ? (
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={handleCheck}
            disabled={pincode.length !== 6}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Check
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {result !== null && result.serviceable ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Delivery available to {pincode}
                    {result.city !== 'Your Location' && ` (${result.city}, ${result.state})`}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Truck className="h-3 w-3 text-violet-500" />
                      <span>
                        {result.days === 1 ? 'Same Day / Next Day' : `Estimated delivery in ${result.days}–${result.days + 1} days`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Clock className="h-3 w-3 text-violet-500" />
                      <span>Arrives by <strong>{getDeliveryDate(result.days)}</strong></span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">✓ Free delivery above ₹499</span>
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">✓ Easy 30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Sorry, we don't deliver to {pincode} yet
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Try a nearby pincode or check back later</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline"
          >
            <RefreshCw className="h-3 w-3" />
            Check another pincode
          </button>
        </div>
      )}
    </div>
  );
}
