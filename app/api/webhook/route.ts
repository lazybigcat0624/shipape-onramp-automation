import { NextRequest, NextResponse } from 'next/server';

// OnRamp API configuration
const ONRAMP_API_BASE_URL = process.env.ONRAMP_API_BASE_URL || 'https://api.onrampfunds.com';
const ONRAMP_CLIENT_ID = process.env.ONRAMP_CLIENT_ID;
const ONRAMP_CLIENT_SECRET = process.env.ONRAMP_CLIENT_SECRET;

// Type definitions for Elfsight form data
interface ElfsightFormData {
  [key: string]: string | number | boolean;
}

// Type definitions for OnRamp API request
interface OnRampApplicationData {
  // Add fields based on OnRamp API requirements
  // This is a placeholder structure - adjust based on actual API docs
  [key: string]: any;
}

/**
 * Transform Elfsight form data to OnRamp API format
 * Adjust this mapping based on your form fields and OnRamp API requirements
 */
function transformToOnRampFormat(elfsightData: ElfsightFormData): OnRampApplicationData {
  // Map Elfsight form fields to OnRamp API fields
  // You'll need to adjust this based on:
  // 1. Your Elfsight form field names
  // 2. OnRamp API expected field names
  
  return {
    // Example mapping - adjust based on actual requirements
    ...elfsightData,
    // Add any required transformations here
  };
}

/**
 * Get OAuth token from OnRamp API
 */
async function getOnRampAccessToken(): Promise<string> {
  if (!ONRAMP_CLIENT_ID || !ONRAMP_CLIENT_SECRET) {
    throw new Error('OnRamp API credentials are not configured');
  }

  try {
    const response = await fetch(`${ONRAMP_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: ONRAMP_CLIENT_ID,
        client_secret: ONRAMP_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });

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

/**
 * Submit application to OnRamp API
 */
async function submitToOnRamp(applicationData: OnRampApplicationData): Promise<any> {
  const accessToken = await getOnRampAccessToken();

  // Adjust the endpoint based on OnRamp API documentation
  const endpoint = `${ONRAMP_API_BASE_URL}/api/v1/applications`; // Update this path

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OnRamp API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Webhook handler for Elfsight form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse incoming webhook data from Elfsight
    const elfsightData: ElfsightFormData = await request.json();

    // Log incoming data for debugging (remove in production or use proper logging)
    console.log('Received Elfsight webhook data:', JSON.stringify(elfsightData, null, 2));

    // // Transform data to OnRamp API format
    // const onRampData = transformToOnRampFormat(elfsightData);

    // // Submit to OnRamp API
    // const result = await submitToOnRamp(onRampData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        // data: result,
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

/**
 * Handle OPTIONS request for CORS
 */
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

