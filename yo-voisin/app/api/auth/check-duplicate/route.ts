import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email et téléphone requis' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Pour l'instant, on vérifie uniquement le téléphone
    // L'email sera vérifié automatiquement par Supabase Auth lors de l'inscription
    const { data: phoneCheck, error: phoneError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    const phoneExists = phoneCheck !== null && !phoneError;

    console.log('Check duplicate results:', { 
      email, 
      phone, 
      phoneExists,
      phoneError: phoneError?.message
    });

    // Pour l'email, on retourne toujours false ici
    // Si l'email existe, Supabase Auth renverra une erreur lors du signUp
    return NextResponse.json({
      emailExists: false,
      phoneExists,
    });
  } catch (error) {
    console.error('Error in check-duplicate:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
