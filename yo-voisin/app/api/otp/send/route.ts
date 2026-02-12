import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { sendOTP } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Validation format (CI : +225XXXXXXXXXX)
    if (!/^\+225\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Format de téléphone invalide' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Appeler la fonction PostgreSQL pour générer le code
    const { data, error } = await supabase.rpc('generate_otp_code', {
      p_phone: phone,
    });

    if (error) {
      console.error('Error generating OTP:', error);
      return NextResponse.json(
        { error: 'Impossible de générer le code' },
        { status: 500 }
      );
    }

    const code = data as string;

    // Log pour debug
    const enableRealWhatsApp = process.env.NEXT_PUBLIC_ENABLE_REAL_WHATSAPP === 'true';
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 ENABLE_REAL_WHATSAPP:', enableRealWhatsApp);
    console.log('📱 Envoi OTP vers:', phone);

    // Envoyer WhatsApp si activé
    if (enableRealWhatsApp) {
      console.log('✅ Envoi WhatsApp RÉEL activé');
      await sendOTP(phone, code);
    } else {
      console.log('⚠️ Mode DEBUG - Pas d\'envoi WhatsApp');
    }

    // Retourner le code UNIQUEMENT si le mode réel n'est PAS activé (pour debug)
    const shouldReturnCode = !enableRealWhatsApp;
    console.log('🔍 Code retourné dans la réponse?', shouldReturnCode ? 'OUI' : 'NON');

    return NextResponse.json({
      success: true,
      message: 'Code envoyé avec succès',
      ...(shouldReturnCode && { code }), // Code uniquement si pas de WhatsApp réel
    });
  } catch (error) {
    console.error('Error in send OTP:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
