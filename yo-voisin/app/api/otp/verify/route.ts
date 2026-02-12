import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Téléphone et code requis' },
        { status: 400 }
      );
    }

    // Validation format code (6 chiffres)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Code invalide' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Appeler la fonction PostgreSQL pour vérifier le code
    const { data, error } = await supabase.rpc('verify_otp_code', {
      p_phone: phone,
      p_code: code,
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification' },
        { status: 500 }
      );
    }

    // La fonction retourne true si le code est valide, false sinon
    const isValid = data as boolean;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Code incorrect ou expiré' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Téléphone vérifié avec succès',
    });
  } catch (error) {
    console.error('Error in verify OTP:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
