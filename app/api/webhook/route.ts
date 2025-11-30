import { NextRequest, NextResponse } from 'next/server';

const ONRAMP_API_BASE_URL = process.env.ONRAMP_API_BASE_URL;
const ONRAMP_CLIENT_ID = process.env.ONRAMP_CLIENT_ID;
const ONRAMP_CLIENT_SECRET = process.env.ONRAMP_CLIENT_SECRET;

interface ElfsightFormField {
  id: string;
  name: string;
  value: string | number | boolean | string[] | null;
  type: string;
}

type ElfsightFormData = ElfsightFormField[];

interface OnRampApplicationData {
  [key: string]: any;
}

function getFieldValueByName(fields: ElfsightFormData, name: string): string | number | boolean | string[] | null {
  const field = fields.find(f => f.name === name);
  return field?.value ?? null;
}

// US State name to 2-character code mapping
const STATE_CODE_MAP: { [key: string]: string } = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC'
};

// Helper function to convert state name to 2-character code
function convertStateToCode(stateName: string | number | boolean | string[] | null): string | null {
  if (!stateName) return null;
  if (Array.isArray(stateName)) {
    stateName = stateName[0] || '';
  }
  const normalized = String(stateName).trim();
  return STATE_CODE_MAP[normalized] || normalized.substring(0, 2).toUpperCase();
}

// Helper function to convert Yes/No to boolean
function convertToBoolean(value: string | number | boolean | string[] | null): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (Array.isArray(value)) return value.length > 0;
  if (!value) return false;
  const str = String(value).toLowerCase().trim();
  return str === 'yes' || str === 'true' || str === '1';
}

// Helper function to extract number from currency string
function extractNumber(value: string | number | boolean | string[] | null): number | null {
  if (typeof value === 'number') return value;
  if (!value) return null;
  const str = String(value).replace(/[^0-9.]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

// Helper function to map legal entity to enum
function mapLegalEntity(value: string | number | boolean | string[] | null): string | null {
  if (!value) return null;
  const str = String(value).trim();
  const mapping: { [key: string]: string } = {
    'sole proprietorship': 'sole_proprietorship',
    'partnership': 'partnership',
    'corporation': 'corporation',
    'llc (limited liability)': 'llc',
    'llc': 'llc'
  };
  return mapping[str.toLowerCase()] || null;
}

// Helper function to map use of funds to enum array
function mapUseOfFunds(value: string | number | boolean | string[] | null): string[] {
  if (Array.isArray(value)) {
    return value.map(v => {
      const str = String(v).trim().toLowerCase();
      if (str === 'inventory') return 'inventory';
      if (str === 'marketing') return 'marketing';
      if (str === 'other') return 'other';
      return str;
    }).filter(Boolean) as string[];
  }
  if (!value) return [];
  const str = String(value).trim().toLowerCase();
  if (str === 'inventory') return ['inventory'];
  if (str === 'marketing') return ['marketing'];
  if (str === 'other') return ['other'];
  return [];
}

// Helper function to extract 10-digit phone number
function extractPhoneNumber(value: string | number | boolean | string[] | null): string | null {
  if (!value) return null;
  const str = String(value).replace(/\D/g, ''); // Remove all non-digits
  // Extract last 10 digits (in case of country code)
  if (str.length >= 10) {
    return str.slice(-10);
  }
  return str.length === 10 ? str : null;
}

// Helper function to convert years to months
function convertYearsToMonths(value: string | number | boolean | string[] | null): number | null {
  if (typeof value === 'number') return Math.round(value * 12);
  if (!value) return null;
  const str = String(value).trim();
  const num = parseFloat(str);
  if (isNaN(num)) return null;
  return Math.round(num * 12);
}

function transformToOnRampFormat(elfsightData: ElfsightFormData): OnRampApplicationData {
  const getValue = (name: string) => {
    const val = getFieldValueByName(elfsightData, name);
    if (Array.isArray(val)) {
      return val.join(', ');
    }
    return val;
  };

  return {
    seller_email: getValue("Email *") || '',
    business_name: getValue("Company Name") || '',
    contact_first_name: getValue("First Name") || '',
    contact_last_name: getValue("Last Name") || '',
    contact_phone_number: extractPhoneNumber(getValue("Phone")),
    ecommerce_seller: convertToBoolean(getValue("eCommerce Seller?")),
    desired_amount: extractNumber(getValue("You could get up to!")),
    seller_tenure_months: convertYearsToMonths(getValue("Years in business")),
    legal_entity: mapLegalEntity(getValue("Legal Entity")),
    incorporation_state: convertStateToCode(getValue("Registered State")),
    planned_use_of_funds: mapUseOfFunds(getValue("Use of funds")),
    user_provided_average_monthly_sales: extractNumber(getValue("Average Monthly Sales $")),
    registered_business_name: getValue("Company Name") || '',
    operating_street_address: getValue("Address") || '',
    operating_secondary_address: getValue("Apt, Suite (Optional)") || '',
    operating_city: getValue("City") || '',
    operating_state: convertStateToCode(getValue("State")),
    operating_zip: getValue("Zipcode") || '',
    controller_title: getValue("Title") || '',
    // created_at: getValue("Date"),
    // marketplaces: getValue("Marketplaces"),
    // website: getValue("Website URL"),
    // signature: getValue("Signature"),
    // consent: getValue("<div>I, Agree to the terms of ShipApe′s loan application terms and conditions.*</div><br><div>By checking this box, I acknowledge that I have read, understood, and consent to the language and authorizations outlined in <a target=\"_blank\" href=\"https://shipape.com/pages/esign-disclosure\">ShipApe's ESIGN Act Consent</a>, <a target=\"_blank\" href=\"https://shipape.com/pages/privacy-policy\">Privacy Policy</a>, <a target=\"_blank\" href=\"https://shipape.com/pages/terms-conditions\">Terms of Use</a>, and Arbitration Agreement. We recommend that you retain a copy for your reference.</div>"),
  };
}

async function getOnRampAccessToken(): Promise<string> {
  if (!ONRAMP_CLIENT_ID || !ONRAMP_CLIENT_SECRET) {
    throw new Error('OnRamp API credentials are not configured');
  }

  try {
    const response = await fetch(`${ONRAMP_API_BASE_URL}/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: ONRAMP_CLIENT_ID,
        client_secret: ONRAMP_CLIENT_SECRET,
      }),
    });
    console.log('OnRamp API token:', response.json);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting OnRamp access token:', error);
    throw error;
  }
}

async function submitToOnRamp(applicationData: OnRampApplicationData): Promise<any> {
  const accessToken = await getOnRampAccessToken();
  console.log('OnRamp access token:', accessToken);

  const endpoint = `${ONRAMP_API_BASE_URL}/referrals`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(applicationData),
  });
  console.log('OnRamp API referral:', await response.json());
  if (!response.ok) {
    const errorText = await response.text();
    console.error('OnRamp API error:', errorText);
    throw new Error(`OnRamp API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const elfsightData: ElfsightFormData = await request.json();
    
    console.log('Received Elfsight webhook data:', JSON.stringify(elfsightData, null, 2));

    const onRampData = transformToOnRampFormat(elfsightData);
    console.log('Transformed OnRamp data:', JSON.stringify(onRampData, null, 2));

    const result = await submitToOnRamp(onRampData);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Webhook endpoint is accessible',
      endpoint: '/api/webhook',
      method: 'POST',
    },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

